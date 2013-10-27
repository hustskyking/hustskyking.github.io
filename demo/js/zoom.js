var ImageZoom = (function(win, undefined) {

	var doc = win.document
		docElem = doc.documentElement,
		body = doc.body;

	function addEvent(elem, type, handler) {
		if (elem.addEventListener) {
			elem.addEventListener(type, handler, false);
		} else if (elem.attachEvent) {
			elem.attachEvent('on' + type, handler);
		}
	}

	function removeEvent(elem, type, handler) {
		if (elem.addEventListener) {
			elem.addEventListener(type, handler, false);
		} else if (elem.attachEvent) {
			elem.attachEvent('on' + type, handler);
		}
	}

	function getElemPosition(elem) {
		var left = 0,
			top = 0;
		while (elem.offsetParent) {
			left += elem.offsetLeft;
			top += elem.offsetTop;
			elem = elem.offsetParent;
		}
		left += elem.offsetLeft;
		top += elem.offsetTop;
		return {x: left, y: top};
	}

	function getMousePosition(e) {
		e = e || window.event;
		if (e.pageX || e.pageY) {
			return {x: e.pageX, y: e.pageY};
		} else if (e.clientX || e.clientY) {
			return {
				x: e.clientX + docElem.scrollLeft + body.scrollLeft,
				y: e.clientY + docElem.scrollTop + body.scrollTop
			};
		}
	}

	function $(id) {
		return doc.getElementById(id);
	}

	function bind(oThis, fn) {
		var args = Array.prototype.slice.call(arguments, 2),
			fNOP = function() {},
			fBound = function() {
				return fn.apply(oThis, args.concat(Array.prototype.slice.call(arguments)));
			};
		fNOP.prototype = fn;
		fBound.prototype = new fNOP();

		return fBound;
	}

	function camelCase(string) {
		var camelCase = /-([a-z])/ig;
		return string.replace(camelCase, function(match, letter) {
			return (letter + '').toUpperCase();
		});
	}

	function getElemWidthAndHeight(target) {
			return  {width: target.clientWidth, height: target.clientHeight};
	}
	function css(elem, key, val) {
		if (typeof key == 'string') {
			key = this.camelCase(key);
			if (val !== undefined) {
				if (key === 'opacity') {
					elem.style[key] = val;
					elem.style['filter'] = 'alpha(opacity=' + val*100 + ')';
					return elem.style[key];
				}
				elem.style[key] = val;
			}
			return elem.style[key];
		} else if (typeof key == 'object') {
			var p;
			for (p in key) {
				p = camelCase(p);
				elem.style[p] = key[p];
			}
			return;
		}
	}

	return {
		init: function(options) {

			// 放大区域的宽度和高度
			this.zoomWidth = options.zoomWidth || 300;
			this.zoomHeight = options.zoomHeight || 200;

			// 需要放大的图片
			this.target = $(options.target);
			this.holder = $(options.holder);

			// 放大区域
			this.zoom = $(options.zoom);

			// 显示区域图片id
			this.viewImage = $(options.viewImage);

			this.viewContainer = $(options.viewContainer);

			this.bindMoveAndOunt();
		},

		bindMoveAndOunt: function() {
			this.setZoom();

			addEvent(this.holder, 'mousemove', bind(this, this.move));
			addEvent(this.holder, 'mouseout', bind(this, this.out));
		},

		setZoom: function() {
			var zoomStyle = this.zoom.style;

			zoomStyle.left = 0;
			zoomStyle.top = 0;
			zoomStyle.width = this.zoomWidth;
			zoomStyle.height = this.zoomHeight;
		},

		move: function(e) {
			this.show();
			e = e || window.event;
			var zoom = this.zoom,
				target = this.holder,
				zoomW = zoom.offsetWidth,
				zoomH = zoom.offsetHeight,
				mousePos = getMousePosition(e),
				targetPos = getElemPosition(target),
				targetW = target.offsetWidth,
				targetH = target.offsetHeight;

			zoom.style.left = (mousePos.x - targetPos.x - zoomW / 2) + 'px';
			zoom.style.top = (mousePos.y - targetPos.y - zoomH / 2) + 'px';

			if (mousePos.x -targetPos.x < zoomW / 2) {
				zoom.style.left = '0px';
			} else if ((mousePos.x - targetPos.x) > (targetW - zoomW / 2)) {
				zoom.style.left = (targetW - zoomW)+ 'px';
			}

			if (mousePos.y -targetPos.y < zoomH / 2) {
				zoom.style.top = '0px';
			} else if ((mousePos.y - targetPos.y) > (targetH - zoomH / 2)) {
				zoom.style.top = (targetH - zoomH)+ 'px';
			}

			var zLeft = this.zoom.style.left.slice(0, -2),
				zTop = this.zoom.style.top.slice(0, -2);
			this.showView(zLeft, zTop);
		},

		out: function(e) {
			this.hide();
		},

		show: function() {
			this.zoom.style.display = 'block';
			this.viewContainer.style.display = 'block';
		},

		hide: function() {
			this.zoom.style.display = 'none';
			this.viewContainer.style.display = 'none';
		},

		showView: function(zLeft, zTop) {
			var viewContainer = getElemWidthAndHeight(this.viewContainer),
				widthAndHeight = getElemWidthAndHeight(this.target),
				// 图片缩放比例， 显示页面的大小/切割图片的大小
				scale = viewContainer.width / this.zoomWidth;

			// 图片按照缩放比例缩放，并设置缩放比例的负margin-left,负margin-top
			css(this.viewImage, {
				width: scale * widthAndHeight.width + 'px',
				height: scale * widthAndHeight.height + 'px',
				marginTop: '-' + scale * zTop + 'px',
				marginLeft: '-' + scale * zLeft + 'px',
				display: 'block'
			});
		}
	};
})(this);