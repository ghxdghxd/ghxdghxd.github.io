---
Title: scrapy下载数据
Date: 2010-12-03 10:20
Modified: 2010-12-05 19:30
Category: Python
Tags: python, scrapy
Slug: scrapy
Authors: JT Guo
Summary: 使用scrapy下载数据
---

# 使用scrapy下载数据

## 新建项目

```shell
cd TCGATumorFusions_scrapy
scrapy startproject TumorFusions .  #当前目录新建项目
```

## 定义Item

> ./TumorFusions/items.py
> 要抓取的内容

```python
import scrapy


class TumorfusionsItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    Cancer = scrapy.Field()
    TCGA_sampleID = scrapy.Field()
    FusionPair = scrapy.Field()
    E-value = scrapy.Field()
    Frame = scrapy.Field()
    phosphorylation = scrapy.Field()
    ubiquitination = scrapy.Field()
    WGS = scrapy.Field()
```

## 建立spider

```shell
cd TumorFusions/spiders
scrapy genspider qtlbase_spider mulinlab.tmu.edu.cn     #建立spider
```

```python
import scrapy

class TumorfusionsSpiderSpider(scrapy.Spider):
    name = 'TumorFusions_spider'    #爬虫的名字
    allowed_domains = ['tumorfusions.org']  #允许的域名

    cancer_list = ['BRCA', 'COAD', 'ESCA', "GBM", "KIRC", "LIHC", "LUAD", "OV", "PRAD", "STAD", "THCA", "UCEC",
        'ACC', "BLCA", "CESC", "CHOL", "DLBC", "HNSC", "KICH", "KIRP", "LAML", "LGG","LUSC", "MESO", "PAAD",
        "PCPG", "READ", "SARC", "SKCM","TGCT","THYM","UCS","UVM"]

    start_urls = ["https://tumorfusions.org/Fusions!cancerType?cancerType=" + str(x) for x in cancer_list]   #入口url

    def parse(self, response):
        pass
```

```shell
scrapy crawl TumorFusions_spider -o output.csv
```
