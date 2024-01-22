---
title: News
description: Latest news & updates about Metalsmith.js
slug: news
layout: default.njk
sitemap:
  priority: 1.0
---
{% if collections.news.length %}
{% for news in collections.news -%}
<div class="News">
  <time class="News-pubdate" datetime='{{ news.pubdate | formatDate("iso") }}'>{{ news.pubdate | formatDate }}</time>
  <h2 class="News-title">
    <a href='/{{ news.path | replace("njk.md", "html") | replace("index.html", "")}}' class="News-permalink">
    {{ news.title }}
    </a>
  </h2>
  {% if news.description %}
  <p class="News-excerpt">{{ news.description }}</p>
  {% endif %}
</div>
{% endfor %}
{% else %}
*No news is good news! Stay tuned for updates*
{% endif %}