---
layout: default
---

<div class="index-content ES6">
    <ul class="artical-list">
    <li itemscope itemtype="http://schema.org/Article">
        <h1 class="title">{{ post.title }}</h1>
    </li>
    {% for post in site.categories.ES6 %}
        <li itemscope itemtype="http://schema.org/Article">
            <h2><a href="{{ post.url }}" itemprop="url">{{ post.title }}</a></h2>
        </li>
    {% endfor %}
    </ul>
</div>
