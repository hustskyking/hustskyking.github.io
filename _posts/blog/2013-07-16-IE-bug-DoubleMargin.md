---
layout: post
title: IE bug系列 双边距bug
description: IE6 中浮动元素情况下的双倍外边距bug
category: blog
---

IE6 中，当为一个块级元素同时设置了向左浮动（float:left）及左边距或右边距（'margin-left' | 'margin-right'）后，则该元素的左边距或右边距在某些情况下会是设定值的两倍。同样地，向右浮动（float:right）及右边距（'margin-right'）也存在此现象。这个就是著名的IE6双边距bug.

## 受影响的浏览器

IE6、IE5.5、IE5.0

## 触发双边距bug的条件

> 若一个元素向左浮动（float:left），且其设置的左边距（'margin-left'）大于其至容器的左侧内边界的距离
> 若一个元素向右浮动（float:right），且其设置的右边距 （'margin-right'）大于其至容器的右侧内边界的距离

## 例子

请在标准浏览器和IE6下比较。效果请看这里： - 网址 http://cookfront.github.io/demo/IE-double-margin.html

  <!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8">
	<title>IE bug--double margin</title>
	<style type="text/css">
	.outer {
		border: 1px solid #ccc;
		width: 200px;
		overflow: hidden;
	}
	.inner {
		width: 100px;
		height: 50px;
		background: red;
	}
	.inner1 {
		float: left;
		margin-left: 20px;
	}
	.inner2 {
		float: right;
		margin-right: 20px;
	}
	</style>
	</head>
	<body>
	<h3>1.触发bug的第一种情况，一个元素向左浮动（float:left），且其设置的左边距（'margin-left'）大于其至容器的左侧内边界的距离</h3>
	<div class="outer">
		<div class="inner1 inner"></div>
	</div>
	<h3>2.触发bug的第二种情况，若一个元素向右浮动（float:right），且其设置的右边距 （'margin-right'）大于其至容器的右侧内边界的距离</h3>
	<div class="outer">
		<div class="inner2 inner"></div>
	</div>
	</body>
	</html>

	
## 解决方案：

由于这个 Bug 对于 'display' 特性为 'inline' 的元素不会触发，所以可以通过设置 display:inline 消除此 Bug。
	
	.inner3 {
		float: left;
		margin-left: 20px;
		display: inline;
	}

	<h3>消除bug的情况</h3>
	<div class="outer">
		<div class="inner3 inner"></div>
	</div>
	
以上就是IE的双边距bug，如有不对请拍砖哟
