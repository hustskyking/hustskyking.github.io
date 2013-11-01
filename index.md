---
layout: home
---

<div class="index-content blog">
    <div class="section">
        <ul class="artical-cate">
            <li class="on"><a href="/"><span>技术积淀</span></a></li>
            <li><a href="/opinion"><span>交互分析</span></a></li>
            <li><a href="/life"><span>生活杂记</span></a></li>
            <li><a href="/trash"><span>回收站</span></a></li>
        </ul>

        <div class="cate-bar"><span id="cateBar"></span></div>

        <!--<ul class="artical-list">
        {% for post in site.categories.blog %}
            <li itemscope itemtype="http://schema.org/Article">
                <h2><a href="{{ post.url }}" itemprop="url">{{ post.title }}</a></h2>
                <div class="title-desc" itemprop="description">{{ post.description }}</div>
            </li>
        {% endfor %}
        </ul>-->

        <!-- This loops through the paginated posts -->
        {% for post in paginator.posts %}
        <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
        <p class="author">
            <span class="date">{{ post.date }}</span>
        </p>
        <div class="content">
            {{ post.content }}
        </div>
        {% endfor %}

        <!-- Pagination links -->
        {% if paginator.total_pages > 1 %}
        <div class="pagination">
            {% if paginator.previous_page %}
            <a href="{{ paginator.previous_page_path | prepend: site.baseurl | replace: '//', '/' }}">&laquo; Prev</a>
            {% else %}
            <span>&laquo; Prev</span>
            {% endif %}

            {% for page in (1..paginator.total_pages) %}
            {% if page == paginator.page %}
            <em>{{ page }}</em>
            {% elsif page == 1 %}
            <a href="{{ '/index.html' | prepend: site.baseurl | replace: '//', '/' }}">{{ page }}</a>
            {% else %}
            <a href="{{ site.paginate_path | prepend: site.baseurl | replace: '//', '/' | replace: ':num', page }}">{{ page }}</a>
            {% endif %}
            {% endfor %}

            {% if paginator.next_page %}
            <a href="{{ paginator.next_page_path | prepend: site.baseurl | replace: '//', '/' }}">Next &raquo;</a>
            {% else %}
            <span>Next &raquo;</span>
            {% endif %}
        </div>
        {% endif %}
    </div>

    <div class="aside"></div>
</div>
