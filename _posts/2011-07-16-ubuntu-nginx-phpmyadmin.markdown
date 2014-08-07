--- 
layout: post
title: "Ubuntu配置ngnix+phpmyadmin"
wordpress_id: 1540
wordpress_url: http://www.wsria.com/?p=1540
date: 2011-07-16 12:17:42 +08:00
tags: 
 - nginx
 - phpmadmin
 - ubnutu
---
<h3>一、背景</h3>
操作系统：Ubuntu11.04-X86
nginx: 1.04 目录位于：/usr/local/nginx
之前我是使用apache作为phpmyadmin的web服务器，后来因为一个项目的环境是nginx配置下来感觉很简单而且业界对nginx评价又比较高所以才转移到nginx;
<h3>二、安装配置过程</h3>
如果还枚安装过nginx、php、phpmyadmin环境的话，请使用下面的命令安装：
<pre>
sudo apt-get install nginx mysql-server php5-cgi php5-mysql phpmyadmin
</pre>
如果和我的环境一样的话，那么安装 
<pre>
sudo apt-get install php5-cgi
</pre>
创建php-fastcgi脚本：
<pre>
sudo vi /etc/init.d/php-fastcgi
</pre>
插入如下脚本：
<!--more-->
<pre>
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
然后设置php-fastcgi随系统启动：
<pre>
sudo chmod +x /etc/init.d/php-fastcgi
sudo service php-fastcgi start
sudo update-rc.d php-fastcgi defaults
</pre>
配置nginx的phpmyadmin：
<pre>
sudo mkdir -p /usr/local/nginx/conf/server/localhost
sudo vi /usr/local/nginx/conf/server/localhost/phpmyadmin.conf
</pre>
插入如下片段：
<pre>
server{
	listen 80;
	server_name phpmyadmin;
	access_log /var/log/phpmyadmin.access_log;
	error_log /var/log/phpmyadmin.error_log;

	location / {
	  root /usr/share/phpmyadmin;
	  index index.php;
	}

	location ~ \.php$ {
	    fastcgi_pass    127.0.0.1:9000;
	    fastcgi_index   index.php;
	    fastcgi_param   SCRIPT_FILENAME /usr/share/phpmyadmin$fastcgi_script_name;
	    include         fastcgi_params;
	}
}
</pre>

<pre>其中的日志文件位置和fastcgi_pass中的端口根据自己的环境修改</pre>
在nginx.conf中include phpmyadmin配置：
<pre>
sudo vi /usr/local/nginx/conf/nginx.conf
</pre>
在最后一个大括号之前插入：
<pre>
include /usr/local/nginx/conf/server/localhost/phpmyadmin.conf;
</pre>
启动nginx:
<pre>
kafeitu@kafeitu-nb:~$ sudo /usr/local/nginx/sbin/nginx -t
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
kafeitu@kafeitu-nb:~$ sudo /usr/local/nginx/sbin/nginx
</pre>
打开/etc/hosts，找到127.0.0.1   localhost然后再最后面加入phpmyadmin保存退出
<pre>
127.0.0.1   localhost phpmyadmin
</pre>
现在访问：http://phpmyadmin/ ，开始享受吧……

参考资料：<a href="http://joneslee85.wordpress.com/2010/02/28/howto-nginx-php5-mysql-phpmyadmin-ubuntu-shortest-setup/" target="_blank">Howto nginx + php5 + mysql + phpmyadmin + ubuntu shortest setup</a>
