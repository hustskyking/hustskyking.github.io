---
layout: post
title: jekyll语法练手
description: 算是第二次接触jekyll了，刚开始没弄太明白，觉得挺麻烦的，后来吧md的语法学了一遍，发现配合这用还挺好的！
category: blog
---

#### 代码高亮 
```
{% highlight ruby %}
def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end
{% endhighlight %}
```
{% highlight ruby %}
def show
  @widget = Widget(params[:id])
  respond_to do |format|
    format.html # show.html.erb
    format.json { render json: @widget }
  end
end
{% endhighlight %}



#### for循环的使用
```
{% for post in site.post %}
- {{ post.title }}
{% endfor %}
```

{% for post in site.post %}
- {{ post.title }}
{% endfor %}