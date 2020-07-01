#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'JT Guo'
# SITENAME = 'iKnowledgeBase'
SITENAME = 'iGase'
SITEURL = 'https://ghxdghxd.github.io'
GITHUB_URL = 'https://github.com/ghxdghxd'
PATH = 'content'
PLACEHOLDER = "好记性不如烂键盘···"
TIMEZONE = 'Asia/Shanghai'
DEFAULT_LANG = 'en'

STATIC_PATHS = ["pages", "pdfs", 'images']

EXTRA_PATH_METADATA = {
    # about.md生成到output下, 表示about.html的路径
    'pages/about.md': {'path': 'about.html'},
    'images/logo/favicon.ico': {'path': 'favicon.ico'},
    'images/logo/user_picture.jpg': {'path': 'user_picture.jpg'},
}

PLUGIN_PATHS = ['plugins']
PLUGINS = ['tipue-search', "sitemap", "i18n_subsites", "pelican-algolia-search",
           "neighbors", "pelican-show-pdf", "better_codeblock_line_numbering"]

THEME = "themes/webnote"
DIRECT_TEMPLATES = ['index', "solar_system"]
# title, link, font-awesome-id(http://fontawesome.io)
# MENUITEMS = [('主页', '.', 'fa-home'),
#              ('归档', 'archives.html', 'fa-archive'),
#              ("关于", "pages/about.html", "fa-user")]

JINJA_ENVIRONMENT = {
    'extensions': ['jinja2.ext.i18n'],
}

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.7,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}

DISPLAY_CATEGORIES_ON_MENU = True  # 显示分类

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

# PAGINATED_DIRECT_TEMPLATES = ['index']  # 分页
# DEFAULT_PAGINATION = 5

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight','linenums': 'False'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
    },
    'output_format': 'html5',
}

# algolia search config
import os
if os.path.exists(os.path.join(os.environ['HOME'], ".env")):
    print('Importing environment from ',
          os.path.join(os.environ['HOME'], ".env"))
for line in open(os.path.join(os.environ['HOME'], ".env")):
    var = line.strip().split('=')
    if len(var) == 2:
        key, value = var[0].strip(), var[1].strip()
        os.environ[key] = value
ALGOLIA_APP_ID = os.getenv('ALGOLIA_APP_ID', None)
ALGOLIA_SEARCH_API_KEY = os.getenv('ALGOLIA_SEARCH_API_KEY', None)
ALGOLIA_ADMIN_API_KEY = os.getenv('ALGOLIA_ADMIN_API_KEY', None)
ALGOLIA_INDEX_NAME = os.getenv('ALGOLIA_INDEX_NAME', None)
