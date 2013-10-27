---
layout: post
title: JavaScript 一个简单的ImageLazyLoad
description: JavaScript实现的一个简单的图片的懒加载
category: project
---

页面加载时，先把首屏加载，当用户滚动滚动条时，当图片接近可视区域时，才将图片加载出来，这也称之为图片的懒加载，可以加快页面的加载速度。

我实现的一个简单的懒加载的思路就是：获取图片的位置，然后获取滚动条的高度和获取页面的高度，当图片的位置减掉滚动条的高度小于页面的高度时说明已经接近图片的可视区域，然后将图片的data-src属性中的图片真实地址替换img的src属性。

[Demo请点这里哟](http://cookfront.github.io/demo/imageLazyLoad.html)

## 获取元素的位置：

	function getElemPosition(e) {
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

## 加载图片

	// 加载图片
	loadImage: function(img) {
		var pos = helpers.getElemPosition(img),
			// 获取浏览器页面的高度
			iClientHeight = docElem.clientHeight,
			// 获取滚动条的高度
			iScrollTop = docElem.srcollTop || body.scrollTop,
			dataSrc = img.getAttribute('data-src'),
			src = img.getAttribute('src');
		// 当src != dataSrc说明图片未加载
		if (src != dataSrc && pos.y - iScrollTop <= iClientHeight) {
			img.setAttribute('src', dataSrc);
		}
		return img;
	}