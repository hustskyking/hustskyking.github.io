---
layout: post
title: JavaScript Drag and Drop(拖放)
description: JavaScript实现的一个简单的拖放效果
category: project
---

拖放效果应该是网页中常用的效果了，今天也自己实现了一个。拖放主要是要监听mousedown,mousemove,mouseup事件，主要实现思路：

1.获取拖放元素的位置
2.获取mousedown时鼠标的位置
3.当mousemove时，获取鼠标的当前位置减去鼠标开始的位置得到dx,dy
4.拖放元素的位置加上dx,dy即为元素拖放到的位置

[demo请点这里](http://barretlee.github.io/demo/drag.html)

> 注：拖放的元素必须是绝对定位的position: absolute

## 获取拖放元素的位置

offsetLeft和offsetTop是相对于最近的祖先定位元素的左右偏移值，通过不段获取父元素的offsetLeft和offsetTop就可以获得元素的当前位置。

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
	}
	
## 获取鼠标的位置

除了IE之外的浏览器都支持pageX和pageY,该属性是相对于document，那IE咋办呢？IE支持clientX，clientY，该属性是相对于浏览器窗口的，也就是说当滑动滚轮窗口向下滚动时，鼠标的位置是不变的，所以IE下还需要加上滚动偏移量。

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
	}
	
## 监听mousedown, mousemove, mouseup

最后就是要监听mousedown, mousemove, mouseup，当可拖放元素mousedown时，获取此时的鼠标位置，当mousemove时获取时时的鼠标位置，通过对拖放元素加上dx,dy，就可以实现目标元素的拖放了。

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