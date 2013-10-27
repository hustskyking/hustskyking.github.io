(function(win, undefined) {
	var doc = win.document,
		docElem = doc.documentElement,
		body = doc.body,

	helpers = {
		addEvent: function(elem, type, handler) {
			if (elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			} else if (elem.attachEvent) {
				elem.attachEvent('on' + type, handler);
			}
		},
		removeEvent: function(elem, type, handler) {
			if (elem.removeListener) {
				elem.removeListener(type, handler, false);
			} else if (elem.detachEvent) {
				elem.detachEvent('on' + type, handler);
			}
		},
		bind: function(object, handler) {
			return function() {
				handler.apply(object, arguments);
			};
		},
		preventDefault: function(e) {
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation: function(e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
		},
		getElemPosition: function(e) {
			var left = 0,
				top = 0;
			while (e.offsetParent) {
				left += e.offsetLeft;
				top += e.offsetTop;
				e = e.offsetParent;
			}
			left += e.offsetLeft;
			top += e.offsetTop;
			return {x: left, y: top};
		},
		each: function(arr, fn, context) {
			if (arr) {
				var i = 0,
					val,
					len = arr.length,
					context = context || null;

				for (; i < len; i++) {
					fn.call(context, arr[i], i, arr);
				}
				return arr;
			}
		}
	},

	ImageLazyLoad = {
		init: function(obj) {
			this.lazy = typeof obj == 'string' ? document.getElementById('obj') :
					body;
			// 获取页面所有图片
			this.images = doc.getElementsByTagName('img', this.lazy);
			this.fnload = helpers.bind(this, this.load);
			helpers.addEvent(win, 'scroll', this.fnload);
			helpers.addEvent(win, 'resize', this.fnload);
		},

		load: function() {
			helpers.each(this.images, this.loadImage);
		},

		// 加载图片
		loadImage: function(img) {
			var pos = helpers.getElemPosition(img),
				iClientHeight = docElem.clientHeight,
				iScrollTop = docElem.srcollTop || body.scrollTop,
				dataSrc = img.getAttribute('data-src'),
				src = img.getAttribute('src');
			// 当src != dataSrc说明图片未加载
			if (src != dataSrc && pos.y - iScrollTop <= iClientHeight) {
				img.setAttribute('src', dataSrc);
			}
			return img;
		}
	};

	window.ImageLazyLoad = ImageLazyLoad;
})(window);