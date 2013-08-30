--- 
layout: post
title: "Maven下用mvn assembly:assembly打包class文件重复"
wordpress_id: 958
wordpress_url: http://www.wsria.com/?p=958
date: 2010-04-22 12:51:07 +08:00
tags: 
 - maven
---
最近学习Maven遇到一个问题，使用<code>mvn assembly:assembly</code>打包项目里面有重复的class文件，如图：
<a href="http://www.kafeitu.me/files/2010/04/文件重复.png"><img class="alignnone size-full wp-image-959" title="文件重复" src="http://www.kafeitu.me/files/2010/04/文件重复.png" alt="" width="164" height="194" /></a><br/>
后来Google了一下也没有找到解决办法，在Maven群里面有人说版本问题，然后就指定了<strong>maven-assembly-plugin</strong>插件的版本号，虽然是Beta版的，解决问题就可以了，配置如下：
<pre class="brush: xml">
<plugin>
  <artifactId>maven-assembly-plugin</artifactId>
  <version>2.2-beta-5</version>
  <configuration>
    <descriptorRefs>
      <descriptorRef>jar-with-dependencies</descriptorRef>
    </descriptorRefs>
  </configuration>
</plugin>
</pre>
