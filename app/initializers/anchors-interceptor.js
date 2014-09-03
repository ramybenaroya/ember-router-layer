import Ember from 'ember';
var $ = Ember.$;
export default {
	name: 'anchors-interceptor',
	initialize: function(container, application){
		var router = application.Router.router;
		$(function(){
			$(document).on('click', 'a', function(){
				var $a = $(this),
					href = $a.attr('href');
				debugger;
				if (href && href[0] === '/'){
					router.updateURL(href);
					router.handleURL(href);
					return false;
				} else {
					return true;
				}
			});
		});
	}
}