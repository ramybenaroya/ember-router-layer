import Ember from 'ember';
import Router from './router';
import CustomDSL from 'ember-router-layer/utils/custom-dsl';
import App from './app';

var generateRouteAMDCallback = function (path, options, RouteMixin, router) {
		return function (Ember, __exports__) {
			var Em = Ember['default'],
				callback = options.callbacks[path];
			__exports__['default'] = Em.Route.extend(RouteMixin, {
				afterModel: function (resolvedModel, transition) {
					debugger;
					var param,
						params = {};
					for (param in transition.params){
						Em.merge(params, transition.params[param]);
					}
					if (path.replace(/\//g, '.') === transition.targetName){
						callback.call(router, params, transition.queryParams);	
					}
				}
			});
		};
	},
	generateQueryParamsRouteMixin = function(options){
		var queryParams = options.queryParams || [],
			mixinContent = {
				queryParams : {}
			};
		queryParams.forEach(function(param){
			mixinContent.queryParams[param] = {refreshModel: true};
		});
		return Ember.Mixin.create(mixinContent);
	},
	generateControllerAMDCallback = function(ControllerMixin){
		return function (Ember, __exports__) {
			var Em = Ember['default'];
			__exports__['default'] = Em.Controller.extend(ControllerMixin);
		};
	},
	generateQueryParamsControllerMixin = function(options){
		var queryParams = options.queryParams || [],
			mixinContent = {
				queryParams : Ember.copy(queryParams)
			};
		queryParams.forEach(function(param){
			mixinContent[param] = null;
		});
		return Ember.Mixin.create(mixinContent);
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
	models, RouteMixin, ControllerMixin;

/*
```javascript	
options = {
	location: 'history',
	map: function(){
	
	},
	callbacks : {
		"some/path1" : function(){...},
		"some/path2" : function(){...}
	},
	queryParams : ['q1', 'q2']
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
	RouteMixin = generateQueryParamsRouteMixin(options);
	ControllerMixin = generateQueryParamsControllerMixin(options);
	models.forEach(function(modelPath){
		define('ember-router-layer/adapters/' + modelPath, ['ember-data', 'exports'], generateModelAdpaterAMDCallback());
		define('ember-router-layer/models/' + modelPath, ['ember-data', 'exports'], generateModelAMDCallback());
	});
	for (var path in options.callbacks) {
		/* global define*/
		define('ember-router-layer/routes/' + path, ['ember', 'exports'], generateRouteAMDCallback(path, options, RouteMixin, this));
		define('ember-router-layer/controllers/' + path, ['ember', 'exports'], generateControllerAMDCallback(ControllerMixin));
	}
	return App.create();
}