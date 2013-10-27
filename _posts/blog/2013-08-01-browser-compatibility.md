---
layout: post
title: 浏览器兼容性问题(持续更新)
description: 记录一些浏览器兼容性问题，特别是IE下与标准浏览器的不同，以便日后查找。
category: blog
---

## 1.target和srcElement

W3C把事件目标对象称为target，而微软称之为srcElement。如果需要识别事件的目标对象，就要尝试两个属性并找到其中包含有用的那个值。

## 2.preventDefault()和returnValue

W3C取消事件默认操作需调用事件对象的preventDefault()方法，而在IE中需要设置事件对象的returnValue属性的值为false。

## 3.addEventListener()和attachEvent()

addEventListener()是W3C事件处理程序注册模型，该方法接受三个参数事件类型(没有on，如'click')、事件注册函数、一个标示事件冒泡还是捕获的布尔值。而IE下事件处理程序注册则使用attachEvent()方法，该方法接受两个参数，事件类型(需加上on，如'onclick')，事件注册函数。移除事件处理程序则有对应的removeEventListener()和detachEvent()方法，接受的参数和addEventListener()和attachEvent()相同。而且addEventListener()和attachEvent()中事件绑定函数的this指向也是不同的，addEventListener()指向当前绑定事件的元素，而attachEvent()指向window。[了解跟多](http://www.quirksmode.org/js/events_advanced.html)

## 4.stopPropagation()和cancelBubble

当需要取消事件冒泡时，W3C模型使用stopPropagation()方法，而IE使用cancelBubble属性设置为true取消冒泡。

## 5.event对象

在W3C模型中，事件对象作为第一个参数被传递到当前事件处理程序中，而在IE中，事件对象总是window.event。

## 6.鼠标位置

除IE浏览器可以使用pageX，pageY获取鼠标相对于document的位置，那IE怎么办呢，IE支持clientX和clientY，它们给出相对于window对象的坐标，再加上相对于window对象的页面滚动的偏移量，就可以得到我们需要的坐标了。

	if (e.pageX || e.pageY) {
        	posx = e.pageX;
        	posy = e.pageY;
    	} else if (e.clientX || e.clientY) {
        	posx = e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        	posy = e.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    	}
	
## 7.relatedTarget和fromElement/toElement

W3C模型定义了事件对象的relatedTarget属性，表示鼠标到哪里去(onmouseout)或者从哪里来(onmouseover)的对象。而IE中用fromElement指向onmouseover事件中鼠标“从哪里来”的对象的引用，toElement指向”到哪里去“的对象的引用。

## 8.getComputedStyle()和currentStyle属性

getComputedStyle是一个可以获取当前元素所有最终使用的CSS属性值。而getComputedStyle()方法不支持IE6-8，IE下的有一个currentStyle属性返回元素当前应用的最终CSS属性值(包括外链CSS文件，页面中嵌入的`<style>`属性等)。

	function getRealStyle(id, styleName) {
		var element = document.getElementById(id),
			realStyle = null;
		if (window.getComputedStyle {
			realStyle = window.getComputedStyle(element, null)[styleName];
		} else if (element.currentStyle) {
			realStyle = element.currentStyle[styleName];
		}
		return realStyle;
	}
	
## 9.cssRules[]和rules[]

W3C使用cssRules[]访问样式表中的所有规则，而IE使用rules[]，这两个函数除了名字不一样之外几乎是一样的。

## 10.IE6 fixed bug

[修正IE6不支持position:fixed的bug](http://www.qianduan.net/fix-ie6-dont-support-position-fixed-bug.html)
[完美解决IE6不支持position:fixed的bug](http://www.cnblogs.com/hooray/archive/2011/05/20/2052269.html)

## 11.IE6 select bug

[IE6 select Bug](http://www.putaoshu.com/blog/?p=312)

## 12.窗口大小

Firefox、Safari、Opera和Chrome都提供了4个属性：outerWidth、outerHeight、innerWidth和innerHeight。innerWidth表示获取window窗体的内部宽度，不包括用户界面元素。而outerWidth/outerHeight表示整个浏览器窗体的大小，包括任务栏等。对于不支持的浏览器则返回undefined。IE下没有提供取得当前浏览器窗口尺寸的属性，不过可以通过`document.documentElement.clientWidth`和`document.documentElement.clientHeight`，而在IE的混杂模式，则必须通过`document.body.clientWidth`和`document.body.clientHeight`。这种方法也被Firefox、Safari、Opera和Chrome所支持。

	// 获取窗口大小
	var pageWidth = window.innerWidth,
		pageHeight = window.innerHeight;

	if (typeof pageWidth != 'number') {		// 对于不支持的浏览器返回undefined
		if (document.compageMode == 'CSS1Compat') {
			pageWidth = document.documentElement.clientWidth;
			pageHeight = document.documentElement.clientHeight;
		} else {
			pageWidth = document.body.clientWidth;
			pageHeight = document.body.clientHeight;
		}
<<<<<<< HEAD
	}
=======
	}
>>>>>>> bd16b1cdccebe2afb971122535abb9452af0dd39
