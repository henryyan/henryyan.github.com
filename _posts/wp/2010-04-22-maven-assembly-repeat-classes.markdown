--- 
layout: post
title: "Maven\xE4\xB8\x8B\xE7\x94\xA8mvn assembly:assembly\xE6\x89\x93\xE5\x8C\x85class\xE6\x96\x87\xE4\xBB\xB6\xE9\x87\x8D\xE5\xA4\x8D"
wordpress_id: 958
wordpress_url: http://www.wsria.com/?p=958
date: 2010-04-22 12:51:07 +08:00
---
最近学习Maven遇到一个问题，使用<code>mvn assembly:assembly</code>打包项目里面有重复的class文件，如图：
<a href="http://www.wsria.com/wp-content/uploads/2010/04/文件重复.png"><img class="alignnone size-full wp-image-959" title="文件重复" src="http://www.wsria.com/wp-content/uploads/2010/04/文件重复.png" alt="" width="164" height="194" /></a><br/>
后来Google了一下也没有找到解决办法，在Maven群里面有人说版本问题，然后就指定了<strong>maven-assembly-plugin</strong>插件的版本号，虽然是Beta版的，解决问题就可以了，配置如下：
<pre lang="xml">
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
