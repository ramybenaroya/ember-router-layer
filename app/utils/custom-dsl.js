import Ember from 'ember';
var modelsToGenerate = [];
function CustomDSL(name) {
      this.parent = name;
      this.matches = [];
}

    CustomDSL.prototype = {
      resource: function(name, options, callback) {
        Ember.assert("'basic' cannot be used as a resource name.", name !== 'basic');

        if (arguments.length === 2 && typeof options === 'function') {
          callback = options;
          options = {};
        }

        if (arguments.length === 1) {
          options = {};
        }

        if (typeof options.path !== 'string') {
          options.path = "/" + name;
        }

        if (callback) {
          var dsl = new CustomDSL(name);
          route(dsl, 'loading');
          route(dsl, 'error', { path: "/_unused_dummy_error_path_route_" + name + "/:error" });
          callback.call(dsl);
          this.push(options.path, name, dsl.generate());
        } else {
          this.push(options.path, name, null);
        }


              },

      push: function(url, name, callback) {
        var parts = name.split('.'),
            regMatches,
            model;
        if (url === "" || url === "/" || parts[parts.length-1] === "index") { this.explicitIndex = true; }
        regMatches = /:(.*)_id/.exec(url);
        if (regMatches !== null && regMatches.length === 2){
          model = regMatches[1].decamelize().replace(/_/g, '/');
          if (!modelsToGenerate.contains(model)){
            modelsToGenerate.push(model); 
          }
        }
        this.matches.push([url, name, callback]);
      },

      route: function(name, options) {
        Ember.assert("'basic' cannot be used as a route name.", name !== 'basic');

        route(this, name, options);
              },

      generate: function() {
        var dslMatches = this.matches;

        if (!this.explicitIndex) {
          this.route("index", { path: "/" });
        }

        return function(match) {
          for (var i=0, l=dslMatches.length; i<l; i++) {
            var dslMatch = dslMatches[i];
            var matchObj = match(dslMatch[0]).to(dslMatch[1], dslMatch[2]);
          }
        };
      },
      getModelsToGenerate: function(){
        return Ember.copy(modelsToGenerate);
      }
    };

    function route(dsl, name, options) {
      Ember.assert("You must use `this.resource` to nest", typeof options !== 'function');

      options = options || {};

      if (typeof options.path !== 'string') {
        options.path = "/" + name;
      }

      if (dsl.parent && dsl.parent !== 'application') {
        name = dsl.parent + "." + name;
      }

      dsl.push(options.path, name, null);
    }

    CustomDSL.map = function(callback) {
      var dsl = new CustomDSL();
      callback.call(dsl);
      return dsl;
    };
    export default CustomDSL;