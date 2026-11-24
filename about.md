---
layout: default
title: 关于
permalink: /about/
body_class: prose
background_image: /assets/about.jpg
background_position: center 32%
description: 关于这个博客与作者。
---

# 关于

你好，我是 **{{ site.author }}**。这里是我的个人博客，用来记录技术实践、阅读笔记和一些日常思考。

## 关于这个博客

这个博客使用 [Jekyll](https://jekyllrb.com/) 构建，托管在静态页面上。它没有数据库，也不需要后台——所有文章都是版本库里的文本文件。

- 文章写在 `_posts` 目录，草稿放在 `_drafts`
- 使用 Markdown 和 Textile 写作
- 通过[分类页]({{ '/categories/' | relative_url }})整理内容

## 我在关注什么

- Web 开发与前端工程化
- 静态站点、自动化与工具链
- 开源协作与写作

## 联系我

如果你对文章有疑问，或者想交流，欢迎发邮件：

**邮箱：** [{{ site.email }}](mailto:{{ site.email }})

{% if site.github_username and site.github_username != "" %}
**GitHub：** [@{{ site.github_username }}](https://github.com/{{ site.github_username }})
{% endif %}

> 保持好奇，持续记录。
