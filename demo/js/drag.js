(function(win, undefined) {

	var doc = win.document,
		docElem = doc.documentElement,
		body = doc.body,
		cacheData = [],

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
		getMousePosition: function(e) {
			e = e || window.event;
			if (e.pageX || e.pageY) {
				return {x: e.pageX, y: e.pageY};
			} else if (e.clientX || e.clientY) {
				return {
					x: e.clientX + docElem.scrollLeft + body.scrollLeft,
					y: e.clientY + docElem.scrollTop + body.scrollTop
				};
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
		data: function(key, val) {
			if (val !== undefined) {
				cacheData[key] = val;
			}
			return cacheData[key];
		},
		removeData: function(key) {
			delete cacheData[key];
		}
	},
	Drag = function(target, moveElem) {
		// 清除文本选择
		var	clearSelect = 'getSelection' in win ? function(){
			win.getSelection().removeAllRanges();
			} : function(){
				try{
					doc.selection.empty();
				}
				catch( e ){};
			},
			isDrag = false,
			count = 0,
			target = document.getElementById(target),
			moveElem = document.getElementById(moveElem);

		var down = function(e) {
			e = e || window.event;
			isDrag = true;
			helpers.data('dragData', {
				el: 0,
				et: 0,
				er: docElem.clientWidth - moveElem.offsetWidth,
				eb: docElem.clientHeight - moveElem.offsetHeight,
				elemPosition: helpers.getElemPosition(moveElem),
				mousePosition: helpers.getMousePosition(e)
			});
			helpers.addEvent(doc, 'mousemove', move);
			helpers.addEvent(doc, 'mouseup', up);
			helpers.stopPropagation(e);
			helpers.preventDefault(e);
		};

		helpers.addEvent(target, 'mousedown', down);

		var move = function(e) {
			// 减少一半的mousemove,提升性能----雨夜带刀
			count++;
			if (count%2 == 0) {
				return;
			}
			e = e || window.event;
			if (!isDrag) return;
			clearSelect();
			var dragData = helpers.data('dragData'),
				mousePosition = helpers.getMousePosition(e),
				dx = mousePosition.x - dragData.mousePosition.x,
				dy = mousePosition.y - dragData.mousePosition.y,
				style = moveElem.style;

			// 设置上下左右的临界点以防止元素溢出当前屏
			style.marginLeft = style.marginTop = '0px';
			style.left = (dragData.elemPosition.x + dx >= dragData.er) ? dragData.er :
				(dragData.elemPosition.x + dx <= dragData.el) ? dragData.el : dragData.elemPosition.x + dx + 'px';
			style.top = (dragData.elemPosition.y + dy >= dragData.eb) ? dragData.eb :
				(dragData.elemPosition.y + dy <= dragData.et) ? dragData.et : dragData.elemPosition.y + dy + 'px';
			helpers.stopPropagation(e);
		};
		var up = function(e) {
			e = e || window.event;
			isDrag = false;
			helpers.removeEvent(doc, 'mousemove', move);
			helpers.removeEvent(doc, 'mouseup', arguments.callee);
			helpers.stopPropagation(e);
		};
	};
	win.Drag = Drag;
})(window);