--- 
layout: post
title: "Linux(Ubuntu)环境安装配置Nginx+Dokuwiki"
wordpress_id: 1613
wordpress_url: http://www.wsria.com/?p=1613
date: 2012-02-04 02:53:27 +08:00
tags: 
 - ubuntu
 - nginx
 - dokuwiki
---
<h3>前言</h3>
<p>这几天一直忙着公司项目的整合，添加了一些配置文件可以结合Maven灵活控制项目（编译、打包），最终能达到项目结构的拆合自如；连续的修改产生了很多配置项，也没有很清楚的描述这样对以后势必造成不好理解，所以还是为公搭建一个WIKI服务（个人已有）。</p>
<p>我的博客和WIKI是放在一起的，使用的apache作为web服务器，公司的服务器上安装的是nginx和apache，但是apache仅仅只开放了svn服务端口，而且以后的项目都是用nginx作为静态代理和负载均衡，不废话了，action。

<h3>一、准备工作</h3>
<p>已Ubuntu 10.04 LTS为例：</p>
<p>安装nginx和php-cgi就不说了，<a href="#refers">参考本博客的配置</a></p>

<h3>二、配置nginx</h3>
<p>下载Dokuwiki：<a href="http://www.splitbrain.org/projects/dokuwiki" target="_blank">http://www.splitbrain.org/projects/dokuwiki</a>，然后解压到/usr/share/dokuwiki目录中
</p>
<p>创建文件：/etc/nginx/conf.d/dokuwiki.conf</p>
<pre>sudo vi /etc/nginx/conf.d/dokuwiki.conf</pre>
<p>复制以下内容到/etc/nginx/conf.d/dokuwiki.conf</p>
<pre>
server{
	 #listen 80;
	 index index.html index.php doku.php;
	 #make sure a global root is defined here
	 #(...)

	access_log /var/log/dokuwiki.access_log;
	error_log /var/log/dokuwiki.error_log;

	 location ~ ^/dokuwiki/.*\.php {
	 	 root           /usr/share;
		 include        fastcgi_params;
		 fastcgi_pass   127.0.0.1:9000;
		 fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
	 }

	 # serve static files
	 location ~ ^/dokuwiki/lib/  {
		 root	 /usr/share;
		 expires 30d;
	 }

	 location ~ ^/dokuwiki/conf/ { deny all; }
	 location ~ ^/dokuwiki/data/ { deny all; }
	 location ~ /\.ht            { deny all; }
 }
</pre>

<pre>
这里要明确第11行的root是dokuwiki目录的上一级，也就是/usr/share，参考：<a href="http://sudone.com/nginx/nginx_alias.html" target="_blank">Nginx虚拟目录</a>
</pre>

启动php-fastcgi：
<pre>sudo service php-fastcgi start</pre>
现在访问：http://localhost/dokuwiki/install.php，按照提示安装就可以了。

<h3 id="refers">参考资料：</h3>
<ul>
	<li><a href="http://www.wsria.com/archives/1540" target="_blank">Ubuntu配置ngnix+phpmyadmin</a></li>
	<li><a href="http://www.dokuwiki.org/install:nginx" target="_blank">http://www.dokuwiki.org/install:nginx</a></li>
</ul>




