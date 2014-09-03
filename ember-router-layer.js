(function (globals) {
	"use strict";
	var Ember = globals.Ember,
		DS = globals.DS,
		$ = globals.jQuery,
		CustomDSL = (function () {
			var modelsToGenerate = [];

			function CustomDSL(name) {
				this.parent = name;
				this.matches = [];
			}

			CustomDSL.prototype = {
				resource: function (name, options, callback) {
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
						route(dsl, 'error', {
							path: "/_unused_dummy_error_path_route_" + name + "/:error"
						});
						callback.call(dsl);
						this.push(options.path, name, dsl.generate());
					} else {
						this.push(options.path, name, null);
					}


				},

				push: function (url, name, callback) {
					var parts = name.split('.'),
						regMatches,
						model;
					if (url === "" || url === "/" || parts[parts.length - 1] === "index") {
						this.explicitIndex = true;
					}
					regMatches = /:(.*)_id/.exec(url);
					if (regMatches !== null && regMatches.length === 2) {
						model = regMatches[1];
						if (!modelsToGenerate.contains(model)) {
							modelsToGenerate.push(model);
						}
					}
					this.matches.push([url, name, callback]);
				},

				route: function (name, options) {
					Ember.assert("'basic' cannot be used as a route name.", name !== 'basic');

					route(this, name, options);
				},

				generate: function () {
					var dslMatches = this.matches;

					if (!this.explicitIndex) {
						this.route("index", {
							path: "/"
						});
					}

					return function (match) {
						for (var i = 0, l = dslMatches.length; i < l; i++) {
							var dslMatch = dslMatches[i];
							var matchObj = match(dslMatch[0]).to(dslMatch[1], dslMatch[2]);
						}
					};
				},
				getModelsToGenerate: function () {
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

			CustomDSL.map = function (callback) {
				var dsl = new CustomDSL();
				callback.call(dsl);
				return dsl;
			};
			return CustomDSL;
		})(),
		generateRoute = function (path, options, RouteMixin, router) {
			var callback = options.callbacks[path];
			return Ember.Route.extend(RouteMixin, {
				afterModel: function (resolvedModel, transition) {
					var param,
						params = {};
					for (param in transition.params) {
						Ember.merge(params, transition.params[param]);
					}
					if (path.replace(/\//g, '.') === transition.targetName) {
						callback.call(router, params, transition.queryParams);
					}
				}
			});
		},
		generateQueryParamsRouteMixin = function (options) {
			var queryParams = options.queryParams || [],
				mixinContent = {
					queryParams: {}
				};
			queryParams.forEach(function (param) {
				mixinContent.queryParams[param] = {
					refreshModel: true
				};
			});
			return Ember.Mixin.create(mixinContent);
		},
		generateController = function (ControllerMixin) {
			return Ember.Controller.extend(ControllerMixin);
		},
		generateQueryParamsControllerMixin = function (options) {
			var queryParams = options.queryParams || [],
				mixinContent = {
					queryParams: Ember.copy(queryParams)
				};
			queryParams.forEach(function (param) {
				mixinContent[param] = null;
			});
			return Ember.Mixin.create(mixinContent);
		},
		generateModelAdpater = function () {
			return DS.Adapter.extend({
				find: function (store, type, id) {
					return {
						id: id
					};
				}
			});
		},
		generateModel = function () {
			return DS.Model.extend();
		},
		router,
		initialized = false,
		emberRouterLayerObject = {
			navigateTo: function (url) {
				if (!initialized) {
					throw 'Ember Router Layer was not initialized. use emberRouterLayer.init function';
				}
				if (!router) {
					throw 'Something wend wrong. Cannot find Ember-Router-Layer router instance';
				}
				router.updateURL(url);
				router.handleURL(url);
			},
			init: function (options) {
				var path, App, models, RouteMixin, ControllerMixin;
				if (initialized) {
					throw 'Ember Router Layout was already initialized';
				}
				initialized = true;
				App = globals[options.applicationNamespace || 'EmberRouterLayer'] = Ember.Application.create(options.applicationOptions);
				App.initializer({
					name: 'anchors-interceptor',
					initialize: function (container, application) {
						router = application.Router.router;
						$(function () {
							$(document).on('click', options.anchorsSelector || 'a', function () {
								var $a = $(this),
									href = $a.attr('href');
								if (href && href[0] === '/') {
									emberRouterLayerObject.navigateTo(href);
									return false;
								} else {
									return true;
								}
							});
						});
					}
				});

				App.Router = Ember.Router.extend(Ember.merge({
					location: 'history'
				}, options.routerOptions));

				App.Router.map(options.map);

				models = CustomDSL.map(options.map).getModelsToGenerate();
				RouteMixin = generateQueryParamsRouteMixin(options);
				ControllerMixin = generateQueryParamsControllerMixin(options);

				models.forEach(function (modelPath) {
					App[(modelPath + 'Adapter').classify()] = generateModelAdpater();
					App[(modelPath + 'Model').classify()] = generateModel();
				});
				for (path in options.callbacks) {
					App[(path.replace(/\//g, '_') + '_route').classify()] = generateRoute(path, options, RouteMixin, this);
					App[(path.replace(/\//g, '_') + '_controller').classify()] = generateController(ControllerMixin);
				}

				return App;
			}
		},
		create = function () {
			return emberRouterLayerObject;
		};
	if (!globals.emberRouterLayer) {
		if (!globals.Ember) {
			throw 'Ember Router Layer is missing Ember dependency';
		}
		if (!globals.DS) {
			throw 'Ember Router Layer is missing Ember-Data dependency';
		}
		if (!globals.jQuery) {
			throw 'Ember Router Layer is missing jQuery dependency';
		}
		if (typeof globals.define === 'function') {
			globals.define('ember-router-layer', [], create);
		}
		globals.emberRouterLayer = emberRouterLayerObject;
	}
})(this);