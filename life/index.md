---
layout: home
---

<div class="index-content life">
    <div class="section">
        <ul class="artical-cate">
            <li><a href="/"><span>技术积淀</span></a></li>
            <li><a href="/opinion"><span>交互分析</span></a></li>
            <li class="on"><a href="/life"><span>生活杂记</span></a></li>
            <li><a href="/trash"><span>回收站</span></a></li>
        </ul>

        <div class="cate-bar"><span id="cateBar"></span></div>

        <ul class="artical-list">
        {% for post in site.categories.life %}
            <li>
                <h2>
                    <a href="{{ post.url }}">{{ post.title }}</a>
                </h2>
                <div class="title-desc">{{ post.description }}</div>
            </li>
        {% endfor %}
        </ul>
    </div>

    <div class="aside"></div>
</div>
