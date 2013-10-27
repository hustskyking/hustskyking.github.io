---
layout: post
title: Kissy anim动画使用笔记
description: Kissy的Anim模块的阅读和使用笔记。
category: blog
---

Kissy的Anim模块支持CSS3的Transition(anim/sub-modules/transition/src/transition.js)和js Animation(anim/sub-modules/transition/src/timer.js)，分别继承自src/base.js，如配置了S.config('anim/useTransition')，则使用TransitionAnim，否则使用TimerAnim。

## 语法：

1.Anim (elem, props[, duration, easing, completeFn])

elem,props都为必须的参数，中括号内的为可选参数。
<ul>
  <li>elem (String|HTMLElement|KISSY.Node|window) – 作用动画的元素节点或窗口（窗口时仅支持 scrollTop/Left）</li>
	<li>props动画结束的 dom 样式值。如{'width': '200px', 'height': '200px'}，表示动画平滑过渡到宽200px，高200px，props还支持这种css语法的写法："width:200px; height:200px"</li>
	<li>duration (Number) – 默认为 1 , 动画持续时间, 以秒为单元</li>
	<li>easing (String) – 默认为 ‘easeNone’ , 动画平滑函数, 可取值 “easeNone”,”easeIn”,”easeOut”,”easeBoth”,”easeInStrong”, “easeOutStrong”,”easeBothStrong”,”elasticIn”,”elasticOut”, “elasticBoth”,”backIn”,”backOut”,”backBoth”, “bounceIn”,”bounceOut”,”bounceBoth”.</li>
	<li>completeFn (function) – 动画到最后一帧后的回调函数</li>
</ul>

例如可以这样配置：
	
	var anim = new Anim('.demo', {'width': '200px', 'height': '200px'}, 1, S.Easing.easeNone);
	var anim = new Anim('.demo', "width:200px; height:200px", 1, S.Easing.easeNone);

2.Anim (elem, props[, config])

其中elem，props和上面一样的配置，中括号内config为配置参数，包括以下配置项：

<ul>
	<li>duration：单位秒。默认 1 秒.动画持续时间</li>
	<li>easing：string|function。默认 ‘easeNone’. 动画平滑函数</li>
	<li>queue：String|false|undefined。所属队列名称. 默认undefined. 属于系统内置队列, 设置 false 则表示该动画不排队立即执行</li>
	<li>complete：function。 动画到最后一帧后的回调函数</li>
</ul>

例如可以这样配置：

	var anim = new S.Anim('.demo', "width:200px; height:200px", {
		duration: 1,
		easing: S.Easing.easeNone
	});
	
使用实例请点这里：[猛点这里](http://cookfront.github.io/demo/kissy-anim.html)

## 成员方法：

1. isRunning()：判断当前动画对象是否在执行动画过程
2. isPaused()：判断当前动画对象是否被暂停
3. run()：在动画实例上调用, 开始当前动画实例的动画
4. stop()：在动画实例上调用, 结束当前动画实例的动画

> Parameters:	finish (Boolean) – false 时, 动画会在当前帧直接停止（不触发 complete 回调）. 为 true 时, 动画停止时会立刻跳到最后一帧（触发 complete 回调）

5. pause()：在动画实例上调用, 暂停当前动画实例的动画
6. resume(): 在动画实例上调用, 继续当前动画实例的动画
7. static Anim.isRunning (elem)：Anim 的静态方法, 用于判断 elem 上是否有动画对象在执行
8. static Anim.isPaused (elem)： Anim 的静态方法, 用于判断 elem 上是否有动画对象在暂停
9. static Anim.stop (elem, end, clearQueue, queueName)：Anim 的静态方法, 停止某元素上的动画（集合）
10. static Anim.pause (elem, queueName)：Anim 的静态方法, 暂停某元素上的动画（集合）
11. static Anim.resume (elem, queueName)：Anim 的静态方法, 继续某元素上的动画（集合）

使用方法请看这里：[猛点这里](http://cookfront.github.io/demo/kissy-anim.html)
