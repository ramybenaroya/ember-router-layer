(function (globals) {
	"use strict";
	globals.emberRouterLayer.init({
		routerOptions: {
			//Here you can define your app root URL
			rootURL: '/ember-router-layer/',
			//location can be 'auto', 'hash', 'history', 'none' 
			location: 'history' //default
		},
		map: function () {

			//actual path: 'ember-router-layer/posts'
			this.resource('posts', {
				path: 'posts'
			}, function () {

				//actual path: 'ember-router-layer/posts/new'
				this.route('new', {
					path: 'new'
				});

				//actual path: 'ember-router-layer/posts/{post_id}'
				this.resource('post', {
					path: ':post_id'
				}, function () {

					//actual path: 'ember-router-layer/posts/{post_id}/edit'
					this.route('edit', {
						path: 'edit'
					});

					//actual path: 'ember-router-layer/posts/{post_id}/comments'
					this.resource('comments', {
						path: 'comments'
					}, function () {

						//actual path: 'ember-router-layer/posts/{post_id}/comments/{comment_id}'
						this.resource('comment', {
							path: ':comment_id'
						}, function () {

							//actual path: 'ember-router-layer/posts/{post_id}/comments/{comment_id}/edit'
							this.route('edit', {
								path: 'edit'
							});
						});

						//actual path: 'ember-router-layer/posts/{post_id}/comments/new'
						this.route('new', {
							path: 'new'
						});
					});
				});
			});
		},
		callbacks: {
			'posts/index': function (pathParams, queryParams) {
				//Here should be the legacy app function which is responsible handling 'posts' path
				globals.alert('Show all posts.\nqueryParams : ' + JSON.stringify(queryParams));
			},
			'posts/new': function (pathParams, queryParams) {
				//Here should be the legacy app function which is responsible handling 'posts/new' path
				globals.alert('Add new post.\nqueryParams : ' + JSON.stringify(queryParams));
			},
			'post/index': function (pathParams, queryParams) {
				var postId = pathParams.post_id;
				//Here should be the legacy app function which is responsible handling 'posts/{post_id}' path
				globals.alert('Show post with id ' + postId + '.\nqueryParams : ' + JSON.stringify(queryParams));
			},
			'post/edit': function (pathParams, queryParams) {
				var postId = pathParams.post_id;
				//Here should be the legacy app function which is responsible handling 'posts/{post_id}/edit' path
				globals.alert('Edit post with id ' + postId + '.\nqueryParams : ' + JSON.stringify(queryParams));
			},
			'comments/index': function (pathParams, queryParams) {
				var postId = pathParams.post_id;
				//Here should be the legacy app function which is responsible handling 'posts/{post_id}/comments' path
				globals.alert('Show comments for post with id ' + postId + '.\nqueryParams : ' + JSON.stringify(queryParams));
			},
			'comment/index': function (pathParams, queryParams) {
				var postId = pathParams.post_id,
					commentId = pathParams.comment_id;
				//Here should be the legacy app function which is responsible handling 'posts/{post_id}/{comment_id}' path
				globals.alert('Show comment with id ' + commentId + ' for post with id ' + postId + '.\nqueryParams : ' + JSON.stringify(queryParams));
			},
			'comment/edit': function (pathParams, queryParams) {
				var postId = pathParams.post_id,
					commentId = pathParams.comment_id;
				//Here should be the legacy app function which is responsible handling 'posts/{post_id}/{comment_id}/edit' path
				globals.alert('Edit comment with id ' + commentId + ' for post with id ' + postId + '.\nqueryParams : ' + JSON.stringify(queryParams));
			},
			'comments/new': function (pathParams, queryParams) {
				var postId = pathParams.post_id;
				//Here should be the legacy app function which is responsible handling 'posts/{post_id}/comments/new' path
				globals.alert('Add new comment for post with id ' + postId + '.\nqueryParams : ' + JSON.stringify(queryParams));
			}
		},
		queryParams: ['q1', 'q2']
	});
})(this);