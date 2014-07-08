angular.module('imgLazyLoad', []).

factory('findRollingParent', function(){
	return function(obj){
		var parent = obj.parentNode;
		var overflow = tools.getStyle(parent, 'overflow');

		while(parent && parent.tagName!=='BODY' && overflow !== 'auto' && overflow !== 'scroll' ) {
			parent = parent.parentNode;
			overflow = tools.getStyle(parent, 'overflow');
		}

		return parent;
	}
}).

directive('lazyLoad', function(findRollingParent){
	return {
		link: function($scope, elements, attrs, configCtrl) {
			var parentScollWindow = findRollingParent(elements[0]);
			    parentScollWindow = parentScollWindow.tagName === 'BODY'? window : parentScollWindow;

			var src = attrs.lazyLoad;

			var $window = angular.element(window);
			
			angular.element(parentScollWindow).on('scroll', function(){
				scroll(false);
			});

			$window.on('resize', function(){
				scroll(false);
			});

			if($scope.LoadingTheRest){
				$window.on('load', function(){
					scroll(true);
				});
			}

			function scroll(suppose){
				if(elements.data('loaded')){
					return false;
				}
				var visible = suppose||tools.isVisible(elements[0], parentScollWindow);

				if(visible){
					var image = new Image();

					image.onload = function(){
						if(typeof $scope.imgOnload === 'function'){
							$scope.imgOnload(this, elements);
						}
						elements.attr('src', this.src);
					}

					image.src = src;

					elements.data('loaded', true);
				}
			}
			
			scroll(false);
		}
	};
});
// angular.bootstrap(document.body, ['imgLazyLoad']);
