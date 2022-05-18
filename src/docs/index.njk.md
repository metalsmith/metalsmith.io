---
title: Documentation
description: 'Home of the metalsmith.js documentation: Getting started, Usage guide, Writing plugins'
slug: docs
layout: default.njk
config:
  anchors: true
sitemap:
  priority: 1.0
---

<section class="Highlight-wrapper">
  {% for item in collections.docs %}
  {% if item.draft != true %}
    <div class="Highlight-item Highlight">
      <div class="Highlight-content">
        <h2 class="Highlight-title"><a href='/{{ item.path | replace("index.njk.md","") }}'>{{ item.title }}</a></h2>
        <p class="Highlight-desc">{{ item.description }}</p>
      </div>
    </div>
  {% endif %}
  {% endfor %}
</section>