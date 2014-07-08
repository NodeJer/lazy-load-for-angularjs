var tools = {
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

// var res = tools.isVisible(document.images[1], window);

// alert(res)