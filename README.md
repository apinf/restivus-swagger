# Restivus Swagger (OpenAPI Specification) plugin

Generate swagger.json for your Restivus API

## How to use

Step 1: Define and attach swagger object to Restivus

```
APIV1 = new Restivus({
  ...
})

// Attach Restivus Swagger configuration
// - meta, definitions, params, tags
APIV1.swagger = {
  meta: {
    swagger: "2.0",
    info: {
      version: "1.0.0",
      title: "My API",
      description: "My REST API",
      termsOfService: "https://example.com/terms/",
      contact: {
        name: "Example team"
      },
      license: {
        name: "MIT"
      }
    }
  },
  definitions: {
    // Schema definitions for $refs, check spec http://swagger.io/specification/
    // Required for body parameters
  },
  params: {
    // Parameter object definitions to be used in endpoint configurations
    // Path and body parameter types supported in v0.2.0
    petId: {
      name: "id",
      in: "path",
      description: "Pet ID",
      required: true,
      type: "string"
    }
  },
  tags: {
    // Swagger UI tag variables to be used in endpoint grouping
    pet: "Pets"
    ...
  }
}
```

Step 2: For each endpoint define swagger metadata in swagger attribute, check spec http://swagger.io/specification/

```
endpoints: {
    get: {
      swagger: {
        tags: [
          APIV1.swagger.tags.pet
        ],
        description: "Returns a pet with ID",
        parameters: [
          APIV1.swagger.params.petId
        ],
        responses: {
          "200": {
            description: "Successful pets list"
          }
        }
      }
    }
```

Step 3: Define route for Swagger

```
// Generates swagger.json to /api/v1/swagger.json
APIV1.addSwagger('swagger.json');
```


## Define paths outside of routes

You can define swagger paths outside of routes. This means you can now do two additional things:
 - Write swagger login and logout routes when default authentication is used.
 - Have swagger route information written separately from Restivus routes.

In the main swagger object you would do the following:

```
APIV1.swagger.meta = {
    swagger: "2.0",
    info: {
    ....
    },
    paths:{
        '/route-goes-here/': {
            "post": {
                "description": "My New Route",
                "parameters": [{
                    "name": "test route",
                    "in": "body",
                    "description": "This is a post route to post things.",
                    "required": true,
                    "schema": {
                        "$ref": "#/definitions/yourSchemaDefinition"
                    }
                }],
                "responses": {
                    "200": {
                        "description": "Returns what this route should return."
                    }
                }
            },
            "get":{
            ...
            }
        }
    }
}
```

## Hidden routes
You can hide routes by adding the option "hidden". See example:

```
APIV1.addRoute('internalHiddenFromSwagger',
    {hidden:true},
    {
        post: {
            swagger: {
            // not required
            },
            action: function(){
            //do stuff for this route here
            }
        }    
    }

```  

## Security definitions

A brief example of how to generate security definitions for your swagger file:

```
APIV1.swagger = {
  meta: {
    swagger: "2.0",
    info: {
      version: "1.0.0",
      title: "My API",
      description: "My REST API",
      termsOfService: "https://example.com/terms/",
      contact: {
        name: "Example team"
      },
      license: {
        name: "MIT"
      }
    }
  securityDefinitions: {
    userSecurityToken : {
      type: "apiKey",
      in: "header",
      name: "auth-token"
    },
    userId : {
      type: "apiKey",
      in: "header",
      name: "user-id"
    },
  },
  security : [
    {
     userSecurityToken: [],
     userId: []
    }
  ]
```

With this example you will require both tokens to use any routes defined in your swagger generated file for APIV1. To require one or the other you modify the security properties as such:


```
  security : [
    {userSecurityToken: []},
    {userId: []}
  ]

```
