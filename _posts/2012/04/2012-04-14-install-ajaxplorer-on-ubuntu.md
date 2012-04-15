---
layout: post
title: "在Linux(Ubuntu)+Nginx安装配置AjaXplorer"
category: tools
tags: 
 - ajaxplorer
 - linux
 - ubuntu
---

**AjaXplorer**一款牛X到不行的功能强大的PHP文件管理器。

之前看到过AjaXplorer的介绍一直没有安装使用，这几天有看到有更新了决定安装试用一下。

安装前在网络没有找到安装教程，参考官网以及安装过程中遇到问题Google后记录，整理一下分享。

## 1.AjaXplorer介绍

**官网：**[http://ajaxplorer.info](http://ajaxplorer.info)

**下载：**[http://sourceforge.net/projects/ajaxplorer/](http://sourceforge.net/projects/ajaxplorer/)

### 特点

* 基于Web技术，有着Ajax、漂亮的UI

* 类似本地资源管理器的操作习惯

* 支持多种访问方式，随处管理文件：网页、移动设备（IOS、Android），还支持PHP Command

* 支持本地文件管理以及第三方服务

截图欣赏一下：

![预览AjaXplorer界面](/files/2012/04/ajaxplorer/ajaxplorer-preview.png)

## 2.准备PHP环境

	已经安装好php-fastcgi的可以跳过。

### 2.1安装、配置fastcgi
<pre class="brush: shell">
sudo apt-get install php5-cgi
sudo vi /etc/init.d/php-fastcgi
</pre>

	fastcgi的php配置文件位于：/etc/php5/cgi/php.ini

复制以下代码到**/etc/init.d/php-fastcgi**：
<pre class="brush: shell">
#!/bin/bash
BIND=127.0.0.1:9000
USER=www-data
PHP_FCGI_CHILDREN=15
PHP_FCGI_MAX_REQUESTS=1000
 
PHP_CGI=/usr/bin/php-cgi
PHP_CGI_NAME=`basename $PHP_CGI`
PHP_CGI_ARGS="- USER=$USER PATH=/usr/bin PHP_FCGI_CHILDREN=$PHP_FCGI_CHILDREN PHP_FCGI_MAX_REQUESTS=$PHP_FCGI_MAX_REQUESTS $PHP_CGI -b $BIND"
RETVAL=0
 
start() {
      echo -n "Starting PHP FastCGI: "
      start-stop-daemon --quiet --start --background --chuid "$USER" --exec /usr/bin/env -- $PHP_CGI_ARGS
      RETVAL=$?
      echo "$PHP_CGI_NAME."
}
stop() {
      echo -n "Stopping PHP FastCGI: "
      killall -q -w -u $USER $PHP_CGI
      RETVAL=$?
      echo "$PHP_CGI_NAME."
}
 
case "$1" in
    start)
      start
  ;;
    stop)
      stop
  ;;
    restart)
      stop
      start
  ;;
    *)
      echo "Usage: php-fastcgi {start|stop|restart}"
      exit 1
  ;;
esac
exit $RETVAL
</pre>

#### 2.1.1启动fastcgi
<pre class="brush: shell">
sudo chmod +x /etc/init.d/php-fastcgi
sudo service php-fastcgi start
</pre>

#### 2.1.2随系统自动启动
<pre class="brush: shell">
sudo update-rc.d php-fastcgi defaults
</pre>

### 2.2 安装AjaXplorer的依赖组件

#### 支持缩略图
在文件列表中选中一个图片后可以看到缩略图！
<pre class="brush: shell">
sudo apt-get install php5-gd
</pre>

#### 支持公共链接
生成一个用于分享(Share)的链接，例如团队内部分享单个文件。
<pre class="brush: shell">
sudo apt-get install php5-mcrypt
</pre>

##### 配置mcrypt
<pre class="brush: shell">
sudo vi /etc/php5/cgi/php.ini
</pre>

删除**mcrypt.modes_dir**前面的分号(;);

更改如下配置：
<pre>
mcrypt.modes_dir=/usr/lib/php5/20090626
</pre>

##### 设置上传文件的大小限制
设置**/etc/php5/cgi/php.ini**的**upload_max_filesize**和**post_max_size**为所要设置的大小（100M、1G等）

## 3.安装AjaXplorer

### 3.1 建立专用帐号
<pre class="brush: shell">
➜ henryyan@hy-hp  ~  sudo adduser ajaxplorer
Adding user `ajaxplorer' ...
Adding new group `ajaxplorer' (1003) ...
Adding new user `ajaxplorer' (1002) with group `ajaxplorer' ...
Creating home directory `/home/ajaxplorer' ...
Copying files from `/etc/skel' ...
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
Changing the user information for ajaxplorer
Enter the new value, or press ENTER for the default
	Full Name []: AjaXplorer
	Room Number []: 
	Work Phone []: 
	Home Phone []: 
	Other []: 
Is the information correct? [Y/n] y
</pre>

### 3.2 下载、解压
通过网页下载：[http://sourceforge.net/projects/ajaxplorer/files/latest/download](http://sourceforge.net/projects/ajaxplorer/files/latest/download)

<pre class="brush: shell">
sudo cp ajaxplorer-core-4.0.1.zip /home/ajaxplorer
su ajaxplorer
sudo unzip ajaxplorer-core-4.0.1.zip
mv ajaxplorer-core-4.0.1 ajaxplorer
exit
</pre>

为ajaxplorer文件夹设置组**www-data**的**读写权限**
<pre class="brush: shell">
cd /home/ajaxplorer
sudo chown ajaxplorer:www-data -R ./ajaxplorer-core-4.0.1 
sudo chmod -R g+rwx ./ajaxplorer-core-4.0.1
ls -lh
total 6.3M
drwxrwxr-x 6 ajaxplorer www-data   4.0K 2012-01-02 17:20 ajaxplorer-core-4.0.1
-rw-r--r-- 1 root       root       6.3M 2012-04-14 23:14 ajaxplorer-core-4.0.1.zip
-rw-r--r-- 1 ajaxplorer ajaxplorer  179 2012-04-14 23:06 examples.desktop
</pre>

为了以后方便用当前的用户配置ajaxplorer可以把当前用户加入到**www-data**组中：
<pre class="brush: shell">
sudo usermod -a henryyan -G www-data
</pre>

### 3.3 配置Nginx
<pre class="brush: shell">
➜ henryyan@hy-hp  ~  sudo vi /etc/nginx/sites-enabled/default
</pre>

把下面的配置信息添加到**server**块中：
<pre class="brush: shell">
location ~ ^/ajaxplorer/.*\.php {
    root        /home/ajaxplorer;
    include        fastcgi_params;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
    access_log  /var/log/ajaxplorer_access.log;
    error_log   /var/log/ajaxplorer_error.log;
}

location ~ ^/ajaxplorer/plugins {
    root    /home/ajaxplorer;
}

location ~ ^/ajaxplorer/data {
    root    /home/ajaxplorer;
}
</pre>

最终配置：
<pre class="brush: text">
server {
    #listen   80; ## listen for ipv4; this line is default and implied
    #listen   [::]:80 default ipv6only=on; ## listen for ipv6

    root /usr/share/nginx/www;
    index index.html index.htm;
    client_max_body_size    1G;

    # Make site accessible from http://localhost/
    server_name localhost;

    location / { 
        # First attempt to serve request as file, then
        # as directory, then fall back to index.html
        try_files $uri $uri/ /index.html;
        # Uncomment to enable naxsi on this location
        # include /etc/nginx/naxsi.rules
    }   

    location ~ ^/ajaxplorer/.*\.php {
        root        /home/ajaxplorer;
        include        fastcgi_params;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        access_log  /var/log/ajaxplorer_access.log;
        error_log   /var/log/ajaxplorer_error.log;
    }

    location ~ ^/ajaxplorer/plugins {
        root    /home/ajaxplorer;
    }

    location ~ ^/ajaxplorer/data {
        root    /home/ajaxplorer;
    }

}
</pre>

现在可以启动Nginx访问AjaXplorer：
<pre class="brush: shell">sudo service nginx restart</pre>
使用浏览器访问：[http://localhost/ajaxplorer/index.php](http://localhost/ajaxplorer/index.php)

看到**AjaXplorer Diagnostic Tool**界面就算配置成功了，接下来再进行内部配置。

### 3.4 检查AjaXplorer运行环境

现在打开：[http://localhost/ajaxplorer/index.php](http://localhost/ajaxplorer/index.php) 看到的页面如下图：

![系统环境状态](/files/2012/04/ajaxplorer/ajaxplorer-infos.png)

因为在准备工作中我们已经安装过：**php5-gd**、**php5-mcrypt**，而且也设置过对于**/home/ajaxplorer/ajaxplorer**的写权限，所以只有两个无关紧要的警告信息;

但是如果没有做之前的准备工作就会遇到下图的提示：

![系统环境配置不正确](/files/2012/04/ajaxplorer/ajaxlorer-env-errors.png)

### 3.5 进入主界面

点击**AjaXplorer Diagnostic Tool**的**click here to continue to AjaXplorer.**忽略下面的警告信息进入主界面。

系统提示自动创建了一个管理员帐号：admin/admin；现在可以用admin登录。

## 4.AjaXplorer进阶设置

### 4.1 删除文件不经过回收站

AjaXplorer默认删除的文件放到回收站，可以把回收站配置清空实现不经过回收站的功能。

![删除文件不经过回收站](/files/2012/04/ajaxplorer/ajaxplorer-unuse-recyle.png)

### 4.2 解除上传文件大小限制

前面设置了PHP和Nginx的上传文件大小配置，所以在AjaxPlorer的上传界面看到的大小就是之前设置的1G。

![AjaXplorer上传文件限制1G](/files/2012/04/ajaxplorer/ajaxplorer-upload.png)

这里特别说明一下关于AjaXplorer的上传文件大小的配置：文件的大小不是AjaXplorer限制的，而是读取的PHP的配置，所以解决的办法就是前面提到的配置**php.ini**文件的两个属性，当然还有Nginx的配置。

如果前面的配置没有设置过，可以在设置PHP和Nginx的文件上传大小限制后在AjaXplorer的管理界面更改：
![设置AjaXplorer上传文件限制1G](/files/2012/04/ajaxplorer/ajaxplorer-set-upload-size.png)

	可以直接输入：100M、1G。