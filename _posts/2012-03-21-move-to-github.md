---
layout: post
title: "从Wordpress迁移到Github"
category: blog
tags:
 - github
 - wordpress
 - 迁移
---

## 迁移原因
**Git**：自从使用了Git作为版本控制工具之后就爱上它了，相对SVN来说优势的确不少（虽然也有人批评，但凡事都有两面性，这里不予评价）；www.wsria.com 是从2009年初用[Wordpress](http://wordpress.com/)创建的，一直是以WEB开发为主要方向，但是最近因为工作和学习时间导致更新缓慢；正好wsria的主机马上就到期所以决定使用Github+Markdown+Jekyll方式搭建博客，这样既能保证博客不会出现异常（断网等情况）又可以使用Git做版本控制，而且还可以像Geek一样写博客。

**域名**：因为**wsria**的含义为what's the RIA？，这也是因为当时学习jQuery时所产生的想法；所以再撰写一些和前台不相关的文章已不太合适，最后考虑一直用**咖啡兔**作为昵称，所以就注册了[www.kafeitu.me](www.kafeitu.me) 作为自己的个人博客（技术占大比例）

**云**：Git+Github+Markdown+jekyll，这就是和Wordpress不一样的地方，代码、服务、结果（网页）一切尽在云端，不用再担心数据的丢失，不用再担心因为机房的某个站违规导致被拔线，把域名再放到国外就可以翘着二郎腿喝着咖啡写博客了。

因为Jekyll发布的结果都是html页面所以只能使用静态引入方式支持评论，Disqus正是一个很好的选择，所有的评论都保存在Disqus服务器，不会再丢失还有垃圾拦截功能！

**Markdown**：“所见即所得”，和Wiki的语法类似，对于经常写Wiki的我来说容易上手，Markdown的理念是，能让文档更容易读、写和随意改。HTML 是一种发布的格式，Markdown是一种书写的格式。
你可以不再关注html的各种标签、格式，只要一些简单的标记就可以生成整洁漂亮的网页。

Markdown的语法可以参考riku翻译：[http://wowubuntu.com/markdown/](http://wowubuntu.com/markdown/)

## 迁移过程
### 开通Github Pages
Github默认会开通yourname.github.com这个域名，所以只要创建一个yourname.github.com版本库用就可以生成站点，具体请参考官方文档：[Github Pages](http://pages.github.com/)

### 安装Jekyll
[Jekyll](https://github.com/mojombo/jekyll)是Github的其中一个作者用Ruby语言开发，服务依赖于Github，安装方法请参考Jekyll的[文档](https://github.com/mojombo/jekyll)

如果你第一次使用Ruby，在使用gem安装插件的时候你会非常痛苦，因为某些原因gem网站被墙导致传输的数据一直丢包，解决办法是删除原来的源改用淘宝国内镜像，具体方法请参考：[http://ruby.taobao.org](http://ruby.taobao.org/)

### 导出Wordpress数据到Jekyll
#### wordpress中文转换
如果你的博客访问方式是用http://www.xx.com/archvie/323这样的形式访问那么在数据库保存的post_name就是中文的，所以需要更改一下。
在导出wordpress数据之后在本地创建一个utf8编码的数据库，然后用mysql的可视化工具编辑**wp_posts**表的**post_name**列，你可以看到这一列的数据都是编码过的，你要把文档转换为一个英文的名称，各个单词之间可以是用**-**链接，例如：how-to-xxx

如若不然运行导出命令后在**_posts**目录生成的文件名会很长！！！

#### gem and mysql
我使用从数据库导出的方式，具体参考：[https://github.com/mojombo/jekyll/wiki/Blog-Migrations](https://github.com/mojombo/jekyll/wiki/Blog-Migrations)，在运行<pre>gem install mysql</pre>之前请先安装**libmysqlclient15-dev**，
<pre>sudo apt-get install libmysqlclient15-dev</pre>
否则会导致安装mysql失败，具体请参考[这里](http://stackoverflow.com/questions/9816745/convert-wordpress-to-jekyll-has-a-error-of-ruby-mysql/9821988#9821988)

## Jekyll使用提示
运行Jekyll生成静态网页只需要使用<pre>jekyll --server</pre>即可，访问[http://localhost:4000](http://localhost:4000)即可，但是如果你在撰写的时候可能要写一部分看看效果，这个时候要在Shell中Ctrl+C然后再运行jekyll --server，能不能在文件被改动的时候自动生成呢？当然可以：<pre>jekyll --server --auto</pre>即可，控制台会输出如下内容：<pre>[2012-03-23 22:54:50] regeneration: 1 files changed</pre>，现在刷新网页就是最新编写的内容了。

其他的选项参考[这里](https://github.com/mojombo/jekyll/wiki/configuration)

## Markdown编辑工具
我使用的[Ubuntu](http://www.ubuntu.com, "Ubuntu Desktop x64")系统，有一个专门编写Markdown的可视化工具[ReText](http://sourceforge.net/p/retext/home/ReText/)，可以编写边预览，特定的语法可以直接显示效果，真正的“所见即所得”。

## 博客主题
博客的主题来自[群英会|http://www.worldhello.net/](http://www.worldhello.net/)，我稍加了一些改动，如果你不想搞上面那么多步骤的话可以直接点击右上角的**Fork Me On Github**，使用git clone之后把_posts下面的文章删除，再把一些配置信息设置为自己的就可以了。

来吧，Github已经为我们准备好了，你还等什么？
