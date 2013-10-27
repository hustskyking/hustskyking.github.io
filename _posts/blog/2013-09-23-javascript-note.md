---
layout: post
title: JavaScript 性能优化 笔记
description: 记录一些JavaScript性能优化方面的笔记
category: blog
---

## 将JavaScript标签尽量放在<body>标签底部的位置

由于大多数浏览器使用单进程处理UI更新和JavaScript运行等多个任务，而同一时间只能有一个任务被执行，当JavaScript运行时间过长就会导致浏览器阻塞，而无法进行UI更新。所以 将`<script>`标签放在底部，减少对整个页面下载的影响。

## 将少引用外部脚本文件的数量

Web性能优化最佳实践中最重要的一条就是减少HTTP请求，减少HTTP请求的方案主要有合并JavaScript文件和CSS文件，通过Combo Handler(Combo Handler是Yahoo!开发的一个Apache模块，它实现了开发人员简单方便地通过URL来合并JavaScript和CSS文件，从而大大减少文件请求数)在服务器端对多个JavaScript文件压缩和合并JavaScript，大大减少了HTTP请求。

## 管理作用域

函数中局部变量访问速度总是最快的，而全局变量通常是最慢的，这是因为全局变量处于作用域链的最后一个位置，所以也是最远才能触及的。

## 合理使用闭包

通常，一个函数的激活对象与运行期上下文一同销毁，当涉及闭包时，激活对象就无法销毁，因为引用任然存在于闭包的[[scope]]属性中，这意味着闭包需要更多的内存开销，而且可能会导致内存泄漏。

## 减少对原型链的访问

深入原型链越深，搜索的速度也就越慢

## 缓存对象成员的值

如果在同一个函数中要多次读取同一个对象的属性，最好将它存入一个局部变量，以局部变量替代属性，避免多余的属性查找带来的性能开销。

	// 此处对对象elem的属性key进行了两次属性访问
	function test(elem, key) {
		if (typeof elem.key == 'string') {
			// do something
		} else if (typeof elem.key == 'obj') {
			// do other
		}
	}

	// 而此处缓存了elem的属性key，从而减少了一次对属性的访问
	function test(elem, key) {
		var val = elem.key
		if (typeof val == 'string') {
			// do something
		} else if (typeof val == 'obj') {
			// do other
		}
	}
	
## DOM访问和修改

对DOM的操作代价是昂贵的，所以要尽量减少DOM的访问和修改，还有减少repaint和reflow。

### 1.改变页面元素的style属性

	// 下面代码将造成repaint或reflow三次，效率十分低下
	var element = document.getElementById('elem');
	element.style.backgroundColor = "blue";
	element.style.color = "red";
	element.style.padding = "1em";

	// 下面只会造成一次repaint或reflow，效率更高
	var element = document.getElementById('elem');
	element.cssText = 'background-color:blue; color:red; padding:1em;';

	// 通过修改元素的类名，只会造成一次repaint或reflow，而且带来更好的维护性
	.active {
		background-color: blue;
		color: red;
		padding: 1em;
	}

	var element = document.getElementById('elem');
	element.addClass('active');
	
### 2.批量修改DOM

当需要对DOM元素进行多次修改时，可以通过以下步骤减少重绘和重排版的次数：①：隐藏元素，对其进行修改，然后再显示它；②使用一个文档片段在已存DOM之外创建一个子树，然后将它拷贝到文档中；③将原始元素拷贝到一个脱离文档的节点中，修改副本，然后覆盖原始元素。

	// 隐藏元素，对其进行修改，然后再显示它
	list.style.display = "none";
	for (var i=0; i < items.length; i++){
		var item = document.createElement("li");
		item.appendChild(document.createTextNode("Option " + i);
		list.appendChild(item);
	}
	list.style.display = "block";

	// 使用一个文档片段创建好之后再拷贝到文档中
	var fragment = document.createDocumentFragment();
	for (var i=0; i < items.length; i++){
		var item = document.createElement("li");
		item.appendChild(document.createTextNode("Option " + i);
		fragment.appendChild(item);
	}
	list.appendChild(fragment);

	// 将节点克隆一个副本后，对其进行修改后再替换原始节点
	var old = document.getElementById('mylist'),
		clone = old.cloneNode(true);
	appendDataToElement(clone, data);
	old.parentNode.replaceChild(clone, old);
	
### 3.缓冲布局信息、

当你查询布局信息如偏移量、滚动条位置、或风格属性时，浏览器刷队列并执行所有修改操作，以返回最新的数值。最好是尽量减少对布局信息的查询次数，查询时将它赋给局部变量，并用局部变量参与计算。

	// 每次移动都要计算一次偏移量，导致浏览器刷新渲染队列
	var elem = document.getElementById('element');
	elem.style.left = 1 + elem.offsetLeft + 'px';
	elem.style.top = 1 + elem.offsetTop + 'px';
	if (elem.offsetLeft >= 500) {
		stopAnimation();
	}

	// 通过缓存偏移量，不用每次查询偏移量
	var elem = document.getElementById('element'),
		currentLeft = elem.offsetLeft,
		currentTop = elem.offsetTop;
	elem.style.left = 1 + currentLeft + 'px';
	elem.style.top = 1 + currentTop + 'px';
	if (currentLeft >= 500) {
		stopAnimation();
	}
	
### 4.事件委托

事件委托的好处就在于1.需要管理的函数变少了；2.更少的内存占用；3.JavaScript和DOM节点之间的关联变少了，这样也就减少了因循环引用而带来的内存泄漏发生的概率。

了解跟多还请点这里[JavaScript事件代理和委托](http://www.cnblogs.com/owenChen/archive/2013/02/18/2915521.html)和[Event delegation in JavaScript](http://www.nczonline.net/blog/2009/06/30/event-delegation-in-javascript/)。


## 循环的性能

JavaScript有四种循环，for、while、do-while、for-in，其中for-in是其中最慢的一种循环，因为for-in循环每次操作要搜索实例或原形的属性，可以使用一下模式(适用于遍历一个有限的、已知的属性列表)：

	var prop = ['prop1', 'prop2', 'prop3'],
		i = 0,
		len = prop.length;
	while (i < len) {
		callback(obj[prop[i]]);
	}
	
### 1.倒序循环

当数组元素的处理顺序与任务无关时，使用倒序循环能略微提高性能

	for (var i = arr.length; i--; ) {
		callback(arr[i]);
	}
	
### 2.if-else与switch

使用if-else和switch的是基于测试条件的数量，当条件数量较大，倾向于使用switch而不是if-else，一是因为代码具有更好的可读性；二是当条件体数量很大时使用switch性能更好。

优化if-else：将最常见的条件体放在首位。

### 3.递归

尽量少的使用递归，使用迭代替代递归可以提高性能，因为一个循环比反复调用一个函数的开销要低。

### 4.减少循环占用的执行时间(不知道是这样翻译不，具体还是看链接哈)[Speed up your JavaScript, Part 1](http://www.nczonline.net/blog/2009/01/13/speed-up-your-javascript-part-1/)

// 改进前
for(var i=0; i < items.length; i++){
    process(items[i]);
}

// 改进后
function chunk(array, process, context){
    setTimeout(function(){
        var item = array.shift();
        process.call(context, item);

        if (array.length > 0){
            setTimeout(arguments.callee, 100);
        }
    }, 100);
}
chunk(items, process);

## 字符串连接

字符串连接有三种连接方法：1.’+'运算符和'+='运算符；2.Array.prototype.join；3.String.prototype.concat。

首先看看'+'和'+='运算符，先看看一个字符串连接的例子：str += 'one' + 'two'; 此代码执行时，发生四个步骤：1.内存中创建一个临时字符串；2.临时字符串的值被赋予'onetwo'；3.临时字符串与str的值进行连接；4.结果赋予str。可以使用: str = str + 'one' + 'two'; 代替上面代码，这就避免了临时字符串，因为赋值表达式以str开头，一次追加一个字符串(不适用于IE，在IE8中，连接字符串只是记录下构成新字符串的各部分字符串的引用，在最后时刻，各部分字符串才被逐个拷贝到一个新的真正的字符串中，然后用它取代先前的字符串引用，所以并非每次使用字符串时都发生合并操作)。

数组连接的方法是使用Array.prototype.join将数组的所有元素合并成一个字符串，并在每个元素之间插入一个分隔符字符串。如果传递一个空字符串作为分隔符，就可以把数组的所有元素连接起来。

[JavaScript字符串连接性能](http://www.swordair.com/blog/2010/10/496/)

## 函数惰性载入

因为各浏览器之间的行为差异，编写代码的时候经常会在函数中包含大量的if语句以检查浏览器的特性，解决不同的浏览器兼容问题。最常见的就是添加事件的函数：

	function addEvent (type, element, fun) {
		if (element.addEventListener) {
			element.addEventListener(type, fun, false);
		}
		else if(element.attachEvent){
			element.attachEvent('on' + type, fun);
		}
		else{
			element['on' + type] = fun;
		}
	}

实际上如果浏览器支持其中的一种方法就会一直支持，就没有必要对其他分支进行检测了。也就是说if语句不用每次都执行，代码可以运行得更快一些：

	function addEvent (type, element, fun) {
		if (element.addEventListener) {
			addEvent = function (type, element, fun) {
				element.addEventListener(type, fun, false);
			}
		}
		else if(element.attachEvent){
			addEvent = function (type, element, fun) {
				element.attachEvent('on' + type, fun);
			}
		}
		else{
			addEvent = function (type, element, fun) {
				element['on' + type] = fun;
			}
		}
		return addEvent(type, element, fun);
	}

