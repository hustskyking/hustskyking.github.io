---
layout: post
title: chrome浏览器渲染白屏问题剖析
description: 打开一个比较大的页面，加载完毕之前快速滚屏会产生白屏现象，这个不能算浏览器的bug，那它是怎么造成的呢？
category: blog
tags: 速度 github
---

刚截图十几次，终于捕捉到了这个白屏现象，hiahia~~
[![svn]({{ site.repo }}/images/blog-article-images/blog/white-screen.jpg)]({{ site.repo }}/images/blog-article-images/blog/white-screen.jpg)

大家可以很清晰地看到下边还木有渲染完毕的透明层，这是一个十分普遍的问题，经常遇到。我的浏览器版本是
[![svn]({{ site.repo }}/images/blog-article-images/blog/chrome-version.jpg)]({{ site.repo }}/images/blog-article-images/blog/chrome-version.jpg)
到目前为止应该是最新版(release版本)，之前的版本应该也存在类似的问题。只要处理好代码，这种体验相当不好的白屏问题是可以避免的，Qzone的页面貌似就没有这个现象。首先我们来聊一聊这个问题是怎么产生的，这涉及到chrome浏览器对网页的解析和渲染。

（未完待续）