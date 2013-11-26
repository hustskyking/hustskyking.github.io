---
layout: default
---

<div class="index-content ES6">
    <ul class="artical-list">
    <li itemscope itemtype="http://schema.org/Article">
        <h1 class="title">ECMAScript 6系列</h1>
    </li>
    {% for post in site.categories.ecmascript %}
        <li itemscope itemtype="http://schema.org/Article">
            <h2><a href="{{ post.url }}" itemprop="url">{{ post.title }}</a></h2>
        </li>
    {% endfor %}
    </ul>
</div>

<script type="text/javascript">
	$(function(){
		var a = $(".artical-list li:gt(0)");
		a.remove();
		$(a.get().reverse()).appendTo($(".artical-list"));
	});
</script>