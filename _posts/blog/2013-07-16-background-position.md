---
layout: post
title: CSS background-position 属性学习
description: 今天接到淘宝面试电话，问了个background-position的50%问题，这个都不知道，惭愧呀！
category: blog
---
前几天看到淘宝招聘实习生的消息，怀着试一试的态度投了个简历，今天晚上就有淘宝的人打电话过来面试，其中就问了一个background-position被设置为50%的问题，这都不知道，真是太惭愧了。所以赶紧谷歌了下，写下这个作为笔记以备日后复习呢。

好了，闲话不说进入正题。

首先看看background-position的语法：

> background-position : length || length
> background-position : position || position

length和position各有哪些取值呢，请看虾米那

> length: 百分数 | 由浮点数字和单位标识符组成的长度值。
> position: top | center | bottom | left | center | right

设置background-position属性时，必须先指定background-image属性，且该属性定位对对象设置的padding不受影响，啥意思呢？请看下面的例子，一看你就明白了。
background-position的默认值为：0% 0%。此时背景图片将被定位于内容区域的左上角。如果指定了一个值，该值将用于横坐标，纵坐标将默认为50%。如果指定了两个值，第二个值将用于纵坐标。

### 1.首先看看该属性定位对对象设置的padding不受影响，是个啥意思呢，先看例子，此处设置两个div，一个class为demo1，一个为demo2，

	.demo {
		width: 500px;
		height: 300px;
		border: 1px solid #ccc;
	}
	.demo1 {
		padding: 50px;
		background: transparent url(bg.jpg) no-repeat 0 0;
	}
	.demo2 {
		background: transparent url(bg.jpg) no-repeat 0 0;
	}
	以下是设置padding的效果
	<div class="demo1 demo"></div>
	以下不设置padding的效果
	<div class="demo2 demo"></div>
	
效果请看这里：http://cookfront.github.io/demo/background-position.html

相信看完就应该明白了，不管是否设置padding，position都是在左上角，所以padding对对象的background-position不受影响

### 2.看看设置一个值和两个值的区别：设置一个值，该值作用于横坐标，纵坐标将设为50%，如果设置两个值，第二个值为纵坐标的值。看效果请点这里哟：http://cookfront.github.io/demo/background-position.html

	.demo3 {
		background: transparent url(bg.jpg) no-repeat top;
	}
	.demo4 {
		background: transparent url(bg.jpg) no-repeat top right;
	}
	
### 3.设置具体的单位，单位包括负值和正值，如果是正值第一个值为横坐标，即向左移动指定的值，第二个值为纵坐标，即向下移动指定的值，如果为负值，就为相反，即向右和向上移动

	.demo5 {
		background: transparent url(bg.jpg) no-repeat 20px 20px;
	}
	.demo6 {
		background: transparent url(bg.jpg) no-repeat -40px -40px;
	}
	
效果在这里：http://cookfront.github.io/demo/background-position.html
### 4.设置百分比的情况，设置百分比的情况比较特殊，如果设置background-position: x% y%:
> 等同于x：{容器(container)的宽度—背景图片的宽度}*x百分比，即相对移动前面计算出来的宽度，超出的部分隐藏。
> 等同于y：{容器(container)的高度—背景图片的高度}*y百分比，超出的部分隐藏。
	
	.demo7 {
		background: transparent url(bg.jpg) no-repeat 50% 50%;
	}
	.demo8 {
		background: transparent url(bg.jpg) no-repeat 20% 20%;
	}

效果在这里：http://cookfront.github.io/demo/background-position.html
background-position差不多就是这些了，如果更好的想法请给我留言哟，嘿嘿，洗澡去了，洗完继续奋斗！
