---
layout: post
title: JavaScript 基于事件委托和延时加载的选项卡
description: 通过事件冒泡机制将子节点的事件委托到父节点，还有只有点击该子节点的时候图片才加载
category: project
---

如果你还不了解事件委托可以看看这里[JavaScript事件代理和委托](http://www.cnblogs.com/owenChen/archive/2013/02/18/2915521.html)和[Event delegation in JavaScript](http://www.nczonline.net/blog/2009/06/30/event-delegation-in-javascript/)，事件委托的好处就在于1.需要管理的函数变少了；2.更少的内存占用；3.JavaScript和DOM节点之间的关联变少了，这样也就减少了因循环引用而带来的内存泄漏发生的概率。

那延时加载又是什么呢，在选项卡中，一般用户访问时只需要看到第一个标签的内容，当用户点击其他标签时再把其他标签中的内容加载进来，这样可以减少网络带宽和加快加载速度，我的这个选项卡是每个标签的内容是一张图片<img>，当网页加载后，显示第一个标签的内容，其他标签的img的src都是一个1*1px的小图，真正的图片地址存放在data-src属性中，当用户点击的时候将src替换成data-src的内容。

下面是主要代码：具体点这里查看源文件咯[demo](http://cookfront.github.io/demo/javascript-tabs.html)

	<ul id="tabs">
		<li><a href="#" name="tab1">One</a></li>
		<li><a href="#" name="tab2">Two</a></li>
		<li><a href="#" name="tab3">Three</a></li>
		<li><a href="#" name="tab4">Four</a></li>    
	</ul>

	<div id="content"> 
		<div id="tab1">
			<img src="http://www.meridian-manchester.com/img/collection/mc200.jpg" alt="a" width="640" height="300" />  
		</div>
		<div id="tab2">
			<img data-src="http://pic.buynow.com.cn/mobile01/201307/22/7221/mobile01-64bd64db650f0c94535595ec374e334b.jpg" src="http://ac.atpanel.com/1.gif?com=02&apply=fixed&cod=1.1.3&cache=1376279132915" alt="b" width="640" height="300" />  
		</div>
		<div id="tab3">
			<img data-src="http://www.bukop.com/wp-content/uploads/2013/07/sellbox.png" alt="c" src="http://ac.atpanel.com/1.gif?com=02&apply=fixed&cod=1.1.3&cache=1376279132915" width="640" height="300" />  
		</div>
		<div id="tab4">
			<img data-src="http://upload.review33.com/images/201112/201112211857034346.jpg" src="http://ac.atpanel.com/1.gif?com=02&apply=fixed&cod=1.1.3&cache=1376279132915" alt="d" width="640" height="300" />     
		</div>
	</div>

	<script type="text/javascript">
	helpFun = helpers,
	ulNode = helpFun.$('tabs'),
	liNodes = helpFun.tag('li', ulNode),
	contentNode = helpFun.$('content'),
	contentDivs = Array.prototype.slice.call(helpFun.tag('div', contentNode), 1);
	helpFun.addClass(liNodes[0], 'current');
	helpFun.map(contentDivs.slice(1), helpFun.css, 'display', 'none');
	helpFun.addEvent(ulNode, 'click', function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;
		if (target.parentNode.nodeName.toLowerCase() == 'li') {
			for (var i = 0, len = liNodes.length; i < len; i++) {
				// 找到未点击之前的活动的标签
				if (helpers.hasClass(liNodes[i], 'current')) {
					break;
				}
			}
			// 移除未点击之前的活动的标签的class值为current的class
			helpers.removeClass(liNodes[i], 'current');
			// 为当前点击的标签添加class值current
			helpers.addClass(target.parentNode, 'current');
			// 将未点击之前的活动标签设置display为none
			helpers.css(contentDivs[i], 'display', 'none');
			// 找到当前点击标签的序号
			for (i = 0; i < len; i++) {
				if (helpers.hasClass(liNodes[i], 'current')) {
					break;
				}
			}
			// 当前点击标签的内容设置为display为block
			helpers.css(contentDivs[i], 'display', 'block');
			// 将当前点击内的图片的src替换为data-src
			if (i != 0) {
				var currentDiv = helpers.$('tab' + 1),
					img = helpers.tag('img', currentDiv)[i],
					dataSrc = helpers.attr(img, 'data-src'),
					src = helpers.attr(img, 'src');
				if (src != dataSrc) {
					helpers.attr(img, 'src', dataSrc);
				}
			}
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	});
	</script>