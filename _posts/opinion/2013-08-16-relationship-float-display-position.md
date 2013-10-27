---
layout: post
title: 说说W3C中float、display、position的关系
description: 英文水平有限，翻译W3C中的Relationships between 'display', 'position', and 'float'以备日后查询
category: opinion
---

`display`、`float`、`position`会影响盒子的生成和布局，他们之间互相影响：

## display: none

> If 'display' has the value 'none', then 'position' and 'float' do not apply. In this case, the element generates no box.

当`display:none`时，`position`和`float`都不适用，在这种情况下，元素没有生成盒子(box)

## position: absolute|fixed

> Otherwise, if 'position' has the value 'absolute' or 'fixed', the box is absolutely positioned, the computed value of 'float' is 'none', and display is set according to the table below. The position of the box will be determined by the 'top', 'right', 'bottom' and 'left' properties and the box's containing block

当`position: absolute|fixed`时，盒子是绝对定位的，computed value中`float`为none，而`display`是根据下面的表格而决定，box的位置由`top`、`right`、`bottom`、`left`和box的containing block(包含块)决定。

	.rela {
		position: relative;
		width: 200px;
		height: 200px;
		background: #ccc;
	}
	.abso {
		position: absolute;
		width: 100px;
		height: 100px;
		background: red;
		display: inline-block;
		float: left;
		opacity: 0.5;
	}

	<div class="rela">
		<div class="abso"></div>
		<div class="notAbso">In the float model, a box is first laid out according to the normal flow, then taken out of the flow and shifted</div>
	</div>
	
![position-absolute-fixed](/images/blog-article-images/position-absolute-fixed.jpg)

可以看到当`position: absolute`时，就算`float`为left时，计算后的值确是`none`，也验证了上面那句话。

## float: left|right

> Otherwise, if 'float' has a value other than 'none', the box is floated and 'display' is set according to the table below.

当`float`设置了出`none`以外的值时，box是浮动的，`display`还是由下面的表格决定。

还是上面的代码，将.abso的css设置为以下：

	.abso {
		width: 100px;
		height: 100px;
		background: red;
		display: inline-block;
		opacity: 0.5;
		float: left;
	}

![float-not-none](/images/blog-article-images/float-not-none.jpg)

可以看到当`float: left|right`时，`display`此时设置为`inline-block`，计算后的值确是`block`，这都和下面的表格有关，嘿嘿~

## element is the root element

> Otherwise, if the element is the root element, 'display' is set according to the table below, except that it is undefined in CSS 2.1 whether a specified value of 'list-item' becomes a computed value of 'block' or 'list-item'.

当元素为根元素时，`display`还是根据下面的表格计算，除了`display: list-item`的情况，在CSS2.1中没有定义计算后的值是`block`还是`list-item`。

## Otherwise

> Otherwise, the remaining 'display' property values apply as specified.

其他情况下，`display`就根据定义的值计算了。

下面就是`display`的表格了，嘿嘿：

![table](/images/blog-article-images/table.jpg)

