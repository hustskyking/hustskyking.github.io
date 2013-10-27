---
layout: post
title: jQuery插件 Cooktip
description: 一个jQuery工具提示插件
category: project
---

这是第一次做jQuery插件，jQuery也是刚刚开始学，这个插件是看到[明河之家](http://www.36ria.com/2827)的一个yitip的插件做的，是参照yitip做的，但又有些改动，yitip是获取元素的title属性，我这改成了获取元素的data-original-title，data-content属性，这里面保存了工具提示插件的title和content。mouseover就会show插件，mouseout就会hide插件。

那如何使用这个插件呢？效果请看这里：[猛点这里](http://cookfront.github.io/demo/cooktip/index.html)

## 一、引入jQuery库，jquery.cooktip.js，cooktip.css

  <link rel="stylesheet" type="text/css" href="./css/cooktip.css">
	<script type="text/javascript" src="./js/jquery-2.0.1.js"></script>
	<script type="text/javascript" src="./js/jquery.cooktip.js"></script>
	
## 二、创建以下HTML结构：

	<a href="#" class="cooktipBefore" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." data-original-title="Popover on right">Popover on right</a>

## 三、初始化插件：

	$(".cooktipBefore").cooktip();
	
## 四、插件中可传入的参数：

	$.fn.cooktip.defaults = {
 		// 插件显示位置top|right|bottom|left
 		position: 'right',
 		// 提示框标题
 		title: '',
 		// 提示框内容
 		content: '',
 		// 提示框隐藏时的延迟
 		hideDelay: 500,
 		// 提示框显示时的延迟
 		showDelay: 500,
 		// 显示提示框的激活事件
 		showEvent: 'mouseover',
 		// 隐藏提示框的激活时间
 		hideEvent: 'mouseout',
 		// 提示框绑定的元素
 		tipBefore: null,
 		// 提示框的class
 		tipContainer: '.cooktip',
 		// 提示框模板
 		template: '<div class="cooktip"><div class="arrow"></div><h3 class="cooktip-title"></h3><div class="cooktip-content"></div>'
 	};
	
传入实例：

	$(".cooktipBefore").cooktip({
		showDelay: "1000",
		hideDelay: "1000",
		tipBefore: "cooktipBefore"
	});

