---
layout: default
---

<div class="index-content ES6">
    <ul class="artical-list">
    {% for post in site.categories.ESsix %}
        <li itemscope itemtype="http://schema.org/Article">
            <h2><a href="{{ post.url }}" itemprop="url">{{ post.title }}</a></h2>
        </li>
    {% endfor %}
    </ul>
</div>
