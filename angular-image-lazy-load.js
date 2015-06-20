angular.module('ng.image.lazyload', []).

factory('$tools', function(){
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

directive('lazyLoad',['$tools', function($tools){
	return {
		link: function($scope, $element, attrs, configCtrl) {
			var parentScollWindow = window, src, newImage;

			//找到父节点（overflow：auto）
			parentScollWindow = $tools.findRollingParent($element[0]);
			parentScollWindow = parentScollWindow.tagName === 'BODY'? window : parentScollWindow;

			src = attrs.lazyLoad;
			
			angular.element(parentScollWindow).on('scroll', function(){
				scroll();
			});

			angular.element(parentScollWindow).on('resize', function(){
				scroll();
			});

			scroll();

			function scroll(suppose){
				if( $element.data('loaded') )return;

				var visible = $tools.isVisible($element[0], parentScollWindow);

				if(visible){
					var newImage = new Image();

					newImage.onload = function(){
						$scope.$emit('lazyLoadDone', {
							newImage: this,
							oldImage: $element[0]
						});

						$element.attr('src', this.src);
					}

					newImage.src = src;

					$element.data('loaded', true);
				}
			}
		}
	};
}]);
