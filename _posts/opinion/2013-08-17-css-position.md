---
layout: post
title: CSS Position的理解
description: 每个前端工程师都应该知道的position
category: opinion
---

`position`应该是CSS中最重要的属性之一，今天上午研究了一上午，把它记下来。

## 语法

	position: static|relative|absolute|fixed
	
当`position`属性没有设置时，默认值为static。

## position: static

`position: static`是`position`的默认属性，它是遵循常规流(Normal flow)布局定位的，而且`top`、`right`、`bottom`、`left`对`position: static`是不适用的。下面看看下面的例子：

	.box {
		width: 200px;
		height: 200px;
	}
	#box1 {
		background: #ccc;
		position: static;
	}
	#box2 {
		background: #454545;
		position: static;
	}

	<div class="box" id="box1"></div>
	<div class="box" id="box2"></div>
	
![position-static](/images/blog-article-images/position-static.jpg)	

## position: relative

`position: relative`也是遵循常规流定位的，但它可以设置`top`、`right`、`bottom`、`left`属性，当没有设置`top`等属性时，它其实和`position: static`是一样的，而当设置这些属性时，它是相对于自己没有设置偏移的时候而定位的，而且不会影响常规流中的其他元素，`top`为正值时就是往下，负数时就是往上，其他值也以此类推了！什么意思呢？就是有点灵魂出鞘的感觉吧，它是相对于没有设置`top`等属性时的位置而定位的，但他原来的布局还在，不会影响其他常规流元素，只是相对于自己没有设置`top`等属性时的位置偏移了，也就是灵魂出鞘了。下面看看例子更容易理解：

首先设置元素为`position: relative`不对其设置偏移，看看有什么效果。还是上面的两个盒子：

	.box {
		width: 200px;
		height: 200px;
	}
	#box1 {
		background: #ccc;
		position: relative;
	}
	#box2 {
		background: #454545;
		position: relative;
	}
	
![position-relative](/images/blog-article-images/position-relative.jpg)	
	
当设置box1为相对定位时，还是和开始设置`position: static`时一样，现在将box1设置`left: 200px`看看效果：

	#box1 {
		background: #ccc;
		position: relative;
		left: 200px;
	}
	
![position-relative-left](/images/blog-article-images/position-relative-left.jpg)		
	
可以看到box1相对于包含块的左边向右偏移了200px,但是后面的box2确没有受到它的影响，还是在它原来的位置。

## position: absolute

当元素设置为`position: absolute`时，它已经脱离了常规流，叫做‘Absolute positioning’，它是相对于它的包含块(包含块的定义还请看这里：[http://www.w3.org/TR/CSS2/visudet.html#containing-block-details](http://www.w3.org/TR/CSS2/visudet.html#containing-block-details))定位，当没有设置`top`等属性时，它的位置就在包含块的左上角，当设置`top`等属性时，就相对于包含块的左上角偏移，设置了`top`的正值向下偏移，负值向上偏移，其他以此类推。

	#container {
		position: relative;
		width: 900px;
		height: 500px;
		border: 1px solid #ccc;
	}
	.box {
		width: 200px;
		height: 200px;
	}
	#box1 {
		background: red;
		position: absolute;
		opacity: 0.5;
	}
	#box2 {
		background: blue;
		width: 300px;
	}

	<div id="container">
		<div class="box" id="box1"></div>
		<div class="box" id="box2"></div>
	</div>
	
![position-absolute](/images/blog-article-images/position-absolute.jpg)

可以看到box1脱离了常规流，在box2上面了，所以造成了左边200px的紫色，红+蓝=紫，嘿嘿，而box2设置了300px的宽度，加上紫色的200px和右边蓝色的100px正好等于300了，也说明了`position: absolute`定位的元素是相对于它的包含块的左上角定位，当没有设置`top`等属性时，它就在包含块的左上角了，而且会对其他常规流元素造成影响。当为它设置偏移又是个什么情况呢：

还是和上面一样的代码，改动box1的CSS：

	#box1 {
		background: red;
		position: absolute;
		top: 200px;
		opacity: 0.5;
	}
	
![position-absolute-offset](/images/blog-article-images/position-absolute-offset.jpg)

可以看到box1相对于包含块向下偏移了200px，这时box2的真容也出来了。

当元素设置`position: absolute`时，还会触发BFC，具有BFC的性质，而且设置`position: absolute`的元素会影响`float`和`display`计算后的值[说说W3C中float、display、position的关系](http://cookfront.github.io/relationship-float-display-position/)，`float`计算后值为`none`，而`display`和一个表格有关，大部分是计算后的值是`block`。

## position: fixed

`position: fixed`具有`position: absolute`定位的一切特性，只是它的包含块不同，是当前的Viewpoint(视口)，当滚动滚动条时，设置为`position: fixed`的元素不会改变，不会随着滚动条的滚动而改变。设置`position: fixed`的元素也会触发BFC，也会影响`float`和`display`，影响和`position: absolute`是一样的，就不多说了。下面看看一个例子：

	#scroll {
		width: 100%;
		height: 1800px;
		border: 1px solid #ccc;
	}
	#box {
		width: 200px;
		height: 200px;
		position: fixed;
		top: 50%;
		left: 50%;
		margin: -100px 0 0 -100px;
		background: red;
		opacity: 0.5;
	}

	<div id="scroll">我是为了出现滚动条，嘿嘿！</div>
	<div id="box"></div>
	
可以看到虽然滚动条滚动，box的位置不会改变，而是在当前窗口的中间。

`position： fixed`有一个小问题就是IE6及以下不支持此参数，那怎么办呢？还是看这篇文章吧，[完美解决IE6不支持position:fixed的bug](http://www.cnblogs.com/hooray/archive/2011/05/20/2052269.html)
