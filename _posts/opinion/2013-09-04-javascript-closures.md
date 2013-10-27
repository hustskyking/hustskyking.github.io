---
layout: post
title: 对JavaScript闭包(Closures)的理解
description: 找了很多资料，结合自己的理解总结的对闭包的理解
category: opinion
---

什么是闭包呢？简单的说闭包就是内部函数能访问外部函数的作用域，当外部函数返回后内部函数仍然可以访问到外部函数中的变量。要理解闭包我觉得首先要理解这几个概念：一、函数是JavaScript中的“第一等公民”；二、执行上下文；三、变量对象；四、作用域以及作用域链；。下面就一一介绍：

## 第一等公民

在JavaScript语言中，函数与其他数据类型处于同等地位，可以被赋值给变量和对象的属性，也可以当作参数传入其他函数，或者作为函数的结果返回。

## 执行上下文

执行上下文是一个抽象的概念，所有的JavaScript代码都是在执行上下文中执行的。一系列活动的执行上下文从逻辑上形成一个栈。栈底总是全局上下文，栈顶是当前（活动的）执行上下文。当在不同的执行上下文间切换（退出的而进入新的执行上下文）的时候，栈会被修改（通过压栈或者退栈的形式）。

当进入函数执行上下文时，活跃对象(activation object)会在进入函数上下文的时候创建出来，初始化的时候会创建一个arguments属性，它是一个类数组的对象(array-like)，其值就是Arguments对象：

	AO = {
	  arguments: 
	};
	
Arguments对象是活跃对象上的属性，它包含了如下属性：

<ul>
<li>callee —— 对当前函数的引用</li>
<li>length —— 实参的个数</li>
<li>properties-indexes(数字，转换成字符串)其值是函数参数的值（参数列表中，从左到右）。properties-indexes的个数 == arguments.length;
arguments对象的properties-indexes的值和当前（实际传递的）形参是共享的。</li>
</ul>

## 变量对象

关于变量对象的介绍还是请看这里：[变量对象（Variable object）](http://blog.goddyzhao.me/post/11141710441/variable-object)，英文版的在这里：[Variable object](http://dmitrysoshnikov.com/ecmascript/chapter-2-variable-object/)

## 作用域与作用域链

作用域和变量的提升在JavaScript中是很重要的概念，是必须要理解的。

### 变量的作用域

变量的作用域包含local scope(局部作用域)和global scope(全局作用域)。

#### Local Scope

JavaScript不像许多其他的编程语言，它没有块级作用域，JavaScript有一个叫做function-level scope的作用域，就是定义在函数中的变量称之为局部变量，只有函数内部或者函数中的函数能访问它。

function-level scope的例子：

	function showName() {
		var name = 'Cookfront';
		console.log(name);
	}
	showName();			// Cookfront
	console.log(name);	// undefined
	
没有块级作用域的例子：

	for (var i = 0; i < 10; i++) {
		console.log(i);
	}
	console.log(i);		// 10
	
使用变量之前必须先声明变量，否则变量将成为全局变量：

	var name = 'Cookfront';
	function showName() {
		name = 'ZhangMin';
		console.log(name);
	}
	showName();			// ZhangMin
	console.log(name);	// ZhangMin
	
当你定义了同名的局部变量和全局变量时，局部变量比全局变量的优先级更高：

	var name = 'Cookfront';
	function showName() {
		var name = 'ZhangMin';
		console.log(name);
	}
	showName();			// ZhangMin
	console.log(name);	// ZhangMin
	
#### Global Scope

所有定义在函数外部的变量都是在Global Scope中。

setTimeout和setInterval中的变量是在Global Scope中执行的：

	var highValue = 200;
	var constantVal = 2;
	var myObj = {
		highValue: 20,
		constantVal: 5,
		calculateIt: function () {
			setTimeout (function  () {
				console.log(this.constantVal * this.highValue);
			}, 2000);
		}
	};
	myObj.calculateIt(); // 400
	
对于全局作用域还有一点很重要，就是要减少污染全局作用域，因为在团队合作中可能会造成命名冲突等问题。

#### 变量名和函数名的提升

JavaScript引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部，这就叫做变量提升。

	console.log(a);		// undefined
	var a = 1;
	
上面的代码在声明变量a之前就使用它，是一种错误的做法，但是实际上不会报错。因为存在变量提升，真正运行的是下面的代码：

	var a;
	console.log(a);
	a = 1;

最后的结果是显示undefined，表示变量a已声明，但还未赋值。	
	
JavaScript引擎将函数名视同变量名，所以采用function命令声明函数时，整个函数会被提升到代码头部。所以，下面的代码不会报错。

### 作用域链

变量的作用域可以看这篇文章：[作用域链（Scope Chain）](http://blog.goddyzhao.me/post/11259644092/scope-chain)，英文版的在这里：[Scope chain](http://dmitrysoshnikov.com/ecmascript/chapter-4-scope-chain/)。

## 闭包

从理论角度来说，ECMAScript中所有函数都是闭包，因为他们在创建的时候保存了上层上下文的作用域链，在作用域链的那篇文章中有讲到，不管函数是否会调用，[[Scope]]在函数创建的时候就有了。

	var x = 20;
	function printX() {
		console.log(x);
	}

可以知道printX()的[[Scope]]属性是只有全局上下文(Global context)。还有一点需要知道的是，同一个上下文中创建的闭包共用一个[[Scope]]属性，可以看下面例子：

	function testClosures() {
		var x = 20;

		return {
			incrementX: function() {
				x = x + 1;
			},
			printX: function() {
				console.log(x);
			}
		};
	}
	var obj = testClosures();
	obj.printX();
	obj.incrementX();
	obj.printX();

这个对于一个闭包的经典例子可以解释了，就是在循环中创建函数：

	var arr = [];

	for (var i = 0; i < 5; i++) {
		arr[i] = function() {
			console.log(i);
		};
	}
	arr[0]();
	arr[1]();
	arr[2]();
	arr[3]();
	arr[4]();
	
有些人可能会认为上面arr[0]()、arr[1]()、arr[2]()、arr[3]()、arr[4]()会分别打印出0、1、2、3、4，但是事与愿违呀，却是打印出了5个5呢，为什么呢？这就是同一个上下文中创建的闭包是共用一个[[Scope]]属性的，这5个用循环创建的函数的[[Scope]]属性都是只有全局上下文（Global context），当循环结束时，全局上下文中的i变量为5，所以5个函数都会打印出5了。那怎么解决这个问题呢？创建一个额外的闭包就行了：

	var arr = [];

	for (var i = 0; i < 5; i++) {
		arr[i] = (function (i) {
			return function() {
				console.log(i);
			}
		})(i);
	}
	arr[0]();
	arr[1]();
	arr[2]();
	arr[3]();
	arr[4]();
	
从实践的角度来说：闭包就是在一个父函数上下文中返回一个函数对象，当父函数返回后，尽管它的上下文已经被销毁，但是返回的内部函数仍然能访问到父函数的变量。内部函数保存着对外部函数变量的引用，所以这些变量不会被垃圾回收。

	function parent() {
		var num = 100;
		return {
			printNum: function() {
				console.log(num);
			},
			setNum: function(n) {
				num = n;
			}
		};
	}
	var myNum = parent();
	myNum.printNum();
	myNum.setNum(111);
	myNum.printNum();

## 闭包的用途

### 模仿私有变量和函数

JavaScript中没有私有变量和函数的概念，但是可以用闭包模仿私有变量和函数：

	var Counter = (function() {
	  var privateCounter = 0;
	  function changeBy(val) {
		privateCounter += val;
	  }
	  return {
		increment: function() {
		  changeBy(1);
		},
		decrement: function() {
		  changeBy(-1);
		},
		value: function() {
		  return privateCounter;
		}
	  }   
	})();

	alert(Counter.value()); /* Alerts 0 */
	Counter.increment();
	Counter.increment();
	alert(Counter.value()); /* Alerts 2 */
	Counter.decrement();
	alert(Counter.value()); /* Alerts 1 */
	
### 柯里化

柯里化是把接受多个参数的函数变换成接受一个单一参数的函数，并且返回一个新函数，这个新函数能够接受原函数的参数。

	function curry(num) {
		return function(x) {
			return num + x;
		}
	}
	var add5 = curry(5);
	var add6 = curry(6);
	console.log(add5(1));
	console.log(add6(1));
	
### 函数绑定

函数绑定是要创建一个函数，可以在特定的环境中以指定的参数调用另一个函数。该技巧常常和回调函数或者事件处理程序一起使用，以便在将函数作为变量传递的同时保留代码的执行环境。

	function bind(fn, context) {
		return function() {
			return fn.apply(context, arguments);
		};
	}
	
## 闭包的性能问题

由于闭包的[[Scope]]属性包含与运行期上下文作用域链相同的对象引用，会产生副作用。通常，一个函数的激活对象与运行期上下文一同销毁。当涉及闭包时，激活对象就无法销毁了，因为引用仍然存在于闭包的[[Scope]]属性中。这意味着脚本中的闭包与非闭包函数相比，需要更多内存开销。在大型网页应用中，这可能是个问题，尤其在Internet Explorer中更被关注。IE使用非本地JavaScript对象实现DOM对象，闭包可能导致内存泄露。


## 参考资料

[Javascript Closures](http://jibbering.com/faq/notes/closures/#clClose)
