Package.describe({
  name: 'apinf:restivus-swagger',
  version: '0.3.0',
  summary: 'Generate Swagger doc for API',
  git: 'https://github.com/apinf/restivus-swagger',
  documentation: 'README.md'
});

Npm.depends({
  "url-parse": "1.0.5"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript','underscore','nimble:restivus@0.8.7']);
  api.addFiles('server/restivus-swagger.js', ['server']);
});

Package.onTest(function(api) {
  api.use(['ecmascript','underscore','nimble:restivus@0.8.7']);
  api.use('apinf:restivus-swagger');
  api.use('tinytest');
  api.addFiles('test.js');
});
