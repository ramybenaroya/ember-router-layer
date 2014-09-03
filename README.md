# Ember Router Layer #

In many legacy single page web application, the URL mapping was not properly designed to express the current state of the application.
Refactoring the URL mapping can be very hard on large scale applications.
Fortunately, Ember Router offers a comperhensive routing mechanism (resources & routes) which is a standard in the web.

This small library enables defining the resources and routes while exposing hook callbacks whenever a path is navigated to.
Thus, there is no need in refactoring any logic code. All you need to do is implement the callback so it would execute the code that will show the right content. Needless to say that all URL management that is done by the lagacy app has to be canceled.

In addition all anchors clicks will be intercepted, so you can use the same paths which you choose to define.

## Dependencies ##
- Ember
- Ember-Data
- jQuery

## Usage ##
download & include `ember-router-layer.js` in your application.

you can also use the following:
```html
<script src="//rawgit.com/ramybenaroya/ember-router-layer/master/ember-router-layer.js
"></script>
```
Here's a classic example of posts with comments paths:
```javascript
window.emberRouterLayer.init({
	map: function(){
		this.resource('posts', {path: 'posts'}, function(){
			this.route('new', {path: 'new'});
			this.resource('post', {path: ':post_id'}, function(){
				this.route('edit', {path: 'edit'});
				this.resource('comments', {path: 'comment'}, function(){
					this.resource('comment', {path: ':comment_id'})
					this.route('new', {path: 'new'});
				})
			})
		});
	},
	callbacks: {
		'posts': function(params, queryParams){
			//The legacy app function which is responsible handling 'posts' path
			legacyHandlePosts(queryParams); 
		},
		'posts/new': function(params, queryParams){
			//The legacy app function which is responsible handling 'posts/new' path
			legacyHandleNewPost(queryParams); 
		},
		'post': function(params, queryParams){
			var postId = params.post_id;
			//The legacy app function which is responsible handling 'posts/{post_id}' path
			legacyHandlePost(postId, queryParams); 
		},
		'comments': function(params, queryParams) {
			var postId = params.post_id;
			//The legacy app function which is responsible handling 'posts/{post_id}/comments' path
			legacyHandleComments(postId, commentId, queryParams);
		}
		'comment': function(params, queryParams) {
			var postId = params.post_id;
			//The legacy app function which is responsible handling 'posts/{post_id}/{comment_id}' path
			legacyHandleComment(postId, commentId, queryParams); id}
		}
		'comments/new': function(params, queryParams) {
			var postId = params.post_id;
			//The legacy app function which is responsible handling 'posts/{post_id}/comments/new' path
			legacyHandleNewComment(postId, queryParams); 
		}
	};
});
```

