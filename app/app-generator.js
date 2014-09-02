import Router from './router';
import CustomDSL from 'ember-router-layer/utils/custom-dsl';
import App from './app';

var generateRouteAMDCallback = function (path, callback, router) {
		return function (Ember, __exports__) {
			var Em = Ember['default'];
			__exports__['default'] = Em.Route.extend({
				afterModel: function (resolvedModel, transition) {
					var id = resolvedModel ? Em.get(resolvedModel, 'id') : undefined;
					if (typeof id !== 'undefined') {
						callback.call(router, id, transition.queryParams);
					} else {
						callback.call(router, transition.queryParams);
					}
				}
			});
		};
	},
	generateModelAdpaterAMDCallback = function(){
		return function(DS, __exports__) {
			DS = DS['default'];
			var Adapter = DS.Adapter.extend({
				find : function(store, type, id) {
					return {id : id};
				}
			});
			__exports__['default'] = Adapter;
		};
	},
	generateModelAMDCallback = function(){
		return function(DS, __exports__) {
			DS = DS['default'];
			__exports__['default'] = DS.Model.extend();
		};
	},
	models;

/*
```javascript	
options = {
	location: 'history',
	map: function(){
	
	},
	callbacks : {
		"some/path1" : function(){...},
		"some/path2" : function(){...}
	}
}
```
*/
export
default

function (options) {
	Router.reopen({
		location: options.location || 'history'
	});
	Router.map(options.map);
	models = CustomDSL.map(options.map).getModelsToGenerate();
	models.forEach(function(modelPath){
		define('ember-router-layer/adapters/' + modelPath, ['ember-data', 'exports'], generateModelAdpaterAMDCallback());
		define('ember-router-layer/models/' + modelPath, ['ember-data', 'exports'], generateModelAMDCallback());
	});
	for (var path in options.callbacks) {
		/* global define*/
		define('ember-router-layer/routes/' + path, ['ember', 'exports'], generateRouteAMDCallback(path, options.callbacks[path], this));
	}
	return App.create();
}