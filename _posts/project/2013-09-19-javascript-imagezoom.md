---
layout: post
title: JavaScript 仿淘宝的ImageZoom图片放大效果
description: 类似浏览淘宝商品时，当鼠标移上去时会显示图片的细节
category: project
---

第一次实现的ImageZoom的时候，功能没有完全实现，代码写的有点乱，今天早上起来就决定把代码重构一下，并且实现整个的效果。遇到了一些问题，最终实现了效果，具体请看[demo请点这里](http://cookfront.github.io/demo/javascript-imagezoom.html)

## 具体思路

* 1.开始有一个初始化的过程，会将遮罩层设置为position: absolute;display:none，父元素是position: relative的，并且设置遮罩层的宽度和高度。

* 2.当mousemove发生时，首先将遮罩层和放大显示区域的display设置为block，并且获取鼠标的位置、遮罩层的位置和宽高、放大处理图片的位置和宽高，mouemove的时候去改变遮罩层的left和top属性，并且需要是否出了边界。Left = (mousePos.x - targetPos.x - zoomW / 2) + 'px'，top = (mousePos.y - targetPos.y - zoomH / 2) + 'px'，设置left和top还要注意一个边界的问题，不能跑出了父元素。设置left和top的同时，改变放大显示区域图片的偏移位置。

* 3.当mouseout的时候就将遮罩层和放大显示区域display: none。

## 遇到的问题

1.addEventListener和attachEvent中this的指向问题

开始解决就是直接用ImageZoom.func这样的方式去调用，后来改用了函数绑定的方式去调用，看着也更舒服了。

2.遮罩层和放大显示区域闪动的问题

开始错误的将mousemove事件绑定到了放大的图片上，当mousemove发生时，产生了遮罩层，当鼠标mousemove的时候实际上是在遮罩层上mousemove，这就导致放大的图片mouseout事件发生，也导致了遮罩层和放大显示区域的display: none，而mousemove时因为遮罩层和放大显示区域已经display: none，实际上触发了放大的图片上的mousemove事件，这又使遮罩层和放大显示区域display: block，如此循环往复导致了遮罩层和放大显示区域的闪动问题。解决方案是：将mousemove和mouseout事件绑定到放大图片的父元素，因为遮罩层和放大图片是兄弟元素，当mousemove事件发生时，产生遮罩层后，因为事件的冒泡机制导致mousemove被冒泡到父元素，从而不会使mousemove事件失效，也就解决了闪动的问题。

## 源代码

HTML：

	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8">
	<title>Image Crop</title>
	<link rel="stylesheet" type="text/css" href="./css/main.css">
	<style type="text/css">
	#imageBox {
		width: 98%;
		margin: 1% auto;
	}
	#holder {
		border: 1px solid #ccc;
		float: left;
		position: relative;
		width: auto;
	}
	#zoom {
		display: none;
		background: url("./images/circle.png") repeat scroll 0 0 transparent;
		position: absolute;
		width: 300px;
		height: 200px;
		cursor: move;
	}
	/* view layout */
	#view {
		float: left;
		margin-left: 20px;
	}
	#view-container {
		height: 400px;
		overflow: hidden;
		width: 600px;
	}
	#viewImage {
		display: none;
	}
	.clear {
		clear: both;
	}
	</style>
	</head>
	<body>
		<div id="imageBox">
			<div id="holder">
				<img src="./images/sago.jpg" alt="sago" id="target" />
				<div id="zoom">
				</div>
			</div>	
			<div id="view">
				<div id="view-container">
					<img src="./images/sago.jpg" alt="sogo" id="viewImage" />
				</div>
			</div>
		</div>
		<div class="clear"></div>
	<script type="text/javascript" src="./js/zoom.js"></script>
	<script type="text/javascript">
	ImageZoom.init({
		target: 'target',
		zoom: 'zoom',
		viewImage: 'viewImage',
		viewContainer: 'view-container',
		holder: 'holder'
	});
	</script>
	</body>
	</html>
	
JS：

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

				// 绑定放大图片父元素的mousemove和mouseout事件
				addEvent(this.holder, 'mousemove', bind(this, this.move));
				addEvent(this.holder, 'mouseout', bind(this, this.out));
			},

			// 初始化遮罩层
			setZoom: function() {
				var zoomStyle = this.zoom.style;

				zoomStyle.left = 0;
				zoomStyle.top = 0;
				zoomStyle.width = this.zoomWidth;
				zoomStyle.height = this.zoomHeight;
			},

			// mouvemove事件时的处理函数
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

				// 边界问题
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
				// 设置放大显示区域的图片偏移
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




