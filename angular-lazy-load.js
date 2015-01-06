angular.module('imgLazyLoad', []).

factory('tools', function(){
	var tools = {
		findRollingParent: function(obj){
			var parent = obj.parentNode;
			var overflow = tools.getStyle(parent, 'overflow');

			while(parent && parent.tagName!=='BODY' && overflow !== 'auto' && overflow !== 'scroll' ) {
				parent = parent.parentNode;
				overflow = tools.getStyle(parent, 'overflow');
			}

			return parent;
		},
		offset: function(element, parentWin){
			if(parentWin === window || parentWin === document){
				parentWin = document.body;
			}
			parentWin.style.position = 'relative';

			var offsetTop = element.offsetTop;
			var offsetLeft = element.offsetLeft;

			var offset = {
				top: offsetTop,
				left: offsetLeft
			};
			while(element.offsetParent && element.offsetParent !== parentWin){
				offset.top+=element.offsetParent.offsetTop;
				offset.left+=element.offsetParent.offsetLeft;
			}

			return offset;
			
		},
		isVisible: function(element, parentWin){

			var windowHeight;
			var scrollTop;

			if(parentWin.tagName === 'BODY'|| parentWin === window||parentWin === document){
				windowHeight = document.documentElement.clientHeight||document.body.clientHeight;
				scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
			}
			else{
				windowHeight = parentWin.clientHeight;
				scrollTop = parentWin.scrollTop;
			}
			

			var offset = this.offset(element, parentWin);
			
			var offsetHeight = element.offsetHeight;

			var ws = windowHeight+scrollTop;

			if(offset.top < ws && offsetHeight+offset.top > scrollTop){
				return true;
			}
			return false;
		},
		getStyle: function(obj, attr){
			var res;

			if(obj.currentStyle){
				res = obj.currentStyle[attr];
			}
			else{
				res = getComputedStyle(obj, false)[attr];
			}
			return res;
		}
	};

	return tools;
}).

directive('lazyLoad', function(tools, $rootScope){
	return {
		link: function($scope, elements, attrs, configCtrl) {
			var parentScollWindow = tools.findRollingParent(elements[0]);
			    parentScollWindow = parentScollWindow.tagName === 'BODY'? window : parentScollWindow;

			var src = attrs.lazyLoad;

			var $window = angular.element(window);
			
			angular.element(parentScollWindow).on('scroll', function(){
				scroll(false);
			});

			$window.on('resize', function(){
				scroll(false);
			});

			if($rootScope.LoadingTheRest){
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
						$rootScope.$emit('imgOnload', {
							newImage: this,
							$image: elements
						});
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
