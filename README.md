# Ember Router Layer #

In many legacy single page web application, the URL mapping was not properly designed to express the current state of the application.
Refactoring the URL mapping can be very hard on large scale applications.
Fortunately, [Ember Router](http://emberjs.com/guides/routing/defining-your-routes/ "Ember - Defining your routes") offers a comperhensive routing mechanism (resources & routes) which is a standard in the web.

This small library enables defining the resources and routes while exposing hook callbacks whenever a path is navigated to.
Thus, there is no need in refactoring any logic code. All you need to do is implement the callback so it would execute the code that will show the right content. Needless to say that all URL management that is done by the lagacy app has to be disabled.

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
Here's a classic example of posts & comments application paths:
```javascript
window.emberRouterLayer.init({
    routerOptions: {
        rootURL: '/ember-router-layer/',
        //location can be 'auto', 'hash', 'history', 'none' 
        location: 'history' //default
    },
    map: function () {

        //actual path: 'app-root/posts'
        this.resource('posts', {
            path: 'posts'
        }, function () {

            //actual path: 'app-root/posts/new'
            this.route('new', {
                path: 'new'
            });

            //actual path: 'app-root/posts/{post_id}'
            this.resource('post', {
                path: ':post_id'
            }, function () {

                //actual path: 'app-root/posts/{post_id}/edit'
                this.route('edit', {
                    path: 'edit'
                });

                //actual path: 'app-root/posts/{post_id}/comments'
                this.resource('comments', {
                    path: 'comments'
                }, function () {

                    //actual path: 'app-root/posts/{post_id}/comments/{comment_id}'
                    this.resource('comment', {
                        path: ':comment_id'
                    }, function () {

                        //actual path: 'app-root/posts/{post_id}/comments/{comment_id}/edit'
                        this.route('edit', {
                            path: 'edit'
                        });
                    });

                    //actual path: 'app-root/posts/{post_id}/comments/new'
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
            alert('Show all posts. queryParams : ' + JSON.stringify(queryParams));
        },
        'posts/new': function (pathParams, queryParams) {
            //Here should be the legacy app function which is responsible handling 'posts/new' path
            alert('Add new post. queryParams : ' + JSON.stringify(queryParams));
        },
        'post/index': function (pathParams, queryParams) {
            var postId = pathParams.post_id;
            //Here should be the legacy app function which is responsible handling 'posts/{post_id}' path
            alert('Show post with id ' + postId + '. queryParams : ' + JSON.stringify(queryParams));
        },
        'post/edit': function (pathParams, queryParams) {
            var postId = pathParams.post_id;
            //Here should be the legacy app function which is responsible handling 'posts/{post_id}/edit' path
            alert('Edit post with id ' + postId + '. queryParams : ' + JSON.stringify(queryParams));
        },
        'comments/index': function (pathParams, queryParams) {
            var postId = pathParams.post_id;
            //Here should be the legacy app function which is responsible handling 'posts/{post_id}/comments' path
            alert('Show comments for post with id ' + postId + '. queryParams : ' + JSON.stringify(queryParams));
        },
        'comment/index': function (pathParams, queryParams) {
            var postId = pathParams.post_id,
                commentId = pathParams.comment_id;
            //Here should be the legacy app function which is responsible handling 'posts/{post_id}/{comment_id}' path
            alert('Show comment with id ' + commentId + ' for post with id ' + postId + '. queryParams : ' + JSON.stringify(queryParams));
        },
        'comment/edit': function (pathParams, queryParams) {
            var postId = pathParams.post_id,
                commentId = pathParams.comment_id;
            //Here should be the legacy app function which is responsible handling 'posts/{post_id}/{comment_id}/edit' path
            alert('Edit comment with id ' + commentId + ' for post with id ' + postId + '. queryParams : ' + JSON.stringify(queryParams));
        },
        'comments/new': function (pathParams, queryParams) {
            var postId = pathParams.post_id;
            //Here should be the legacy app function which is responsible handling 'posts/{post_id}/comments/new' path
            alert('Add new comment for post with id ' + postId + '. queryParams : ' + JSON.stringify(queryParams));
        }
    }
});
```

## Methods ##
### init ###
`emberRouterLayer.init(options)`

Available options are :
+ `applicationNamespace` **String** (default: `'EmberRouterLayer'`) - Generated stub Ember application namespace. The stub app will be available in `window[options.applicationNamespace]` 
+ `applicationOptions` **Object** (default : `undefined`) - Generated stub Ember application options
+ `routerOptions` **Object** (default: `{location: 'history', rootURL: '/'}`) - Generated Ember router options. For further reading go to [Ember Router Properties Documentation](http://emberjs.com/api/classes/Ember.Router.html, "Ember Router")
+ `map` **Function** (default: [`Ember.K`](https://github.com/emberjs/ember.js/blob/3b60016c2b6b38646d954014d10f74fcfe1a3d54/packages/ember-metal/lib/core.js#L101)) - [Ember router map function](http://emberjs.com/guides/routing/defining-your-routes/ "Ember - Defining your routes") 
+ `callbacks` **Object** (default: `{'*' : Ember.K}`) - The callbacks to trigger on each path. Each callback takes 2 arguments:
	1. `pathParams` **Object** - Contains resolved path params from the current URL
	2. `queryParams` **Object** - Contains resolved query params from the currrent URL
+ `queryParams` **Array** (default : `[]`) - List of expected valid query params (strings)
+ `anchorsSelector` **String** (default: `'a'`) - Anchors to intercept their click events

Note: The callback `options.callbacks['*']` will be triggered on any path

### navigateTo ###
`emberRouterLayer.navigateTo(path)`
Navigates to a path by using the Ember Router Layer. You can use this method to redirect to an inner app path, or even redirect from path to another by invoking the method within a path callback

The MIT License
===============

Copyright (c) 2014 Ramy Ben Aroya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.