// Extension to Restivus
// Parse URL
const ParsedURL = Npm.require('url-parse');
const URL = new ParsedURL(Meteor.absoluteUrl());

// Add swagger route and generate valid swagger.json
Restivus.prototype.addSwagger = function(swaggerPath) {
  // Set constants
  const restivus = this;
  const config = restivus._config;
  const swagger = restivus.swagger;

  // Call add Route
  restivus.addRoute(swaggerPath, {authRequired: false}, {
    get: function () {
      // Check if swagger configuration exists
      if(swagger === undefined ||
        swagger.meta === undefined) {
          return {"error": "Swagger configuration not given for Restivus."};
        }
      else {

        // Initialize swagger.json documentation object
        let doc = {};

        // Add main meta from config
        _.extend(doc, swagger.meta);

        // If host, basePath and schemes are not given in meta, autodetect
        if( !('host' in swagger.meta) &&
        !('basePath' in swagger.meta) &&
        !('schemes' in swagger.meta)) {
          // Get host info
          const url = {
            "host": URL.host,
            "basePath": ('/'+config.apiPath).slice(0,-1),
            "schemes": [URL.protocol.slice(0, -1)]
          }
          _.extend(doc, url);
        }

        // Loop through all routes
        let paths = {};
        _.each(restivus._routes, function(route) {
          // Exclude swagger, login, logout, users paths, and routes with option hidden set to any truthy value
          if(route.path !== swaggerPath &&
            route.path !== 'login' &&
            route.path !== 'logout' &&
            !route.options.hidden &&
            !route.path.includes('users') )
          {
            // Modify path parameter to swagger spec style
            // Replaces :param with {param}
            const newPath = route.path.replace(/:(\w+)/g, '{$1}');
            // Use path as key
            const key = '/'.concat(newPath);

            // Array of endpoint keys
            const routeEndpoints = _.keys(route.endpoints);

            // Exclude options from routeEndpoints array
            const endpoints = _.without(routeEndpoints, 'options');

            // Init currentPath
            paths[key] = {};
            let currentPath = paths[key];

            // Loop through endpoints
            _.each(endpoints, function(endpoint) {
              let currentEndpoint = route.endpoints[endpoint];

              // Add swagger metadata if it exists in endpoint config
              if(currentEndpoint.swagger !== undefined) {
                currentPath[endpoint] = currentEndpoint.swagger;
              }
            });
          }
        });

        // Add security definitions
        if(swagger.securityDefinitions !== undefined) {
          doc.securityDefinitions = swagger.securityDefinitions;
        }

        // Add paths to Swagger doc
        doc.paths = paths;

        // Add definitions
        if(swagger.definitions !== undefined) {
          doc.definitions = swagger.definitions;
        }

        // Check swagger meta for additional paths
        if(swagger.meta.paths !== undefined){
          for (let path in swagger.meta.paths){
            // Skip paths if already defined within route
            for (let routePath in doc.paths){
              if (routePath === path){
                continue;
              } else {
                doc.paths[path] = swagger.meta.paths[path];
              }
            }
          }
        }

        // Return swagger.json
        return doc;
      }
    }
  });
};
