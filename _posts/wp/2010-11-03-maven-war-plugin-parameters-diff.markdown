--- 
layout: post
title: "maven-war-plugin插件的warSourceExcludes和packagingExcludes参数的区别"
wordpress_id: 1335
wordpress_url: http://www.wsria.com/?p=1335
date: 2010-11-03 10:25:13 +08:00
tags: 
 - maven
---
项目中在打包的时候时常要忽略一些只在本地使用的文件，比如一些test文件夹或者本地配置，刚刚开始使用maven-war-plugin的warSourceExcludes和packagingExcludes这两个参数还真是搞得有点晕，多试验了几次明白了，现在分享一下我的理解。

引用官网的说明：
<pre>
<table>
<tbody>
<tr>
<td><strong><a href="http://maven.apache.org/plugins/maven-war-plugin/war-mojo.html#warSourceExcludes">warSourceExcludes</a></strong></td>
<td><code>String</code></td>
<td><code>-</code></td>
<td>The comma separated list of tokens to exclude when?copying the content?of the warSourceDirectory.</td>
</tr>
</tbody>
</table>
<table>
<tbody>
<tr>
<td><strong><a href="http://maven.apache.org/plugins/maven-war-plugin/war-mojo.html#packagingExcludes">packagingExcludes</a></strong></td>
<td><code>String</code></td>
<td><code>2.1-alpha-2</code></td>
<td>The comma separated list of tokens to?exclude from the WAR before packaging. This option may be used to implement?the skinny?WAR use case.</td>
</tr>
</tbody>
</table>
</pre>
<div>引用我负责的一个项目对maven-war-plugin的配置：</div>
<pre>
<div>&lt;packagingExcludes&gt;**/application*.properties,**/spy.properties&lt;/packagingExcludes&gt;
&lt;warSourceExcludes&gt;test/*,venue/**&lt;/warSourceExcludes&gt;</div></pre>
<pre>
<div>声明：packagingExcludes中的*.properties文件均位于src/main/resources目录中
warSourceExcludes中的?test/*,venue/**位于src/main/webapp目录中</div></pre>
<div>运行mvn package命令后结果是：</div>
<div>
<ol>
	<li>target/mywebapp-1.0.4 (文件夹)下面原码中存在的test和venue目录没有复制过来（warSourceExcludes忽略成功），其他的文件和目录没有变化</li>
	<li>对于packagingExcludes的配置意思是从mywebapp-1.0.4文件夹中复制文件时忽略的文件列表，所以最后打包的war里面不包含test、venue文件夹和packagingExcludes中指定的文件</li>
</ol>
<h3>简单一句话说明：</h3>
<pre>
<div>warSourceExcludes是在编译周期进行完成后从src/main/webapp目录复制文件时忽略，而packagingExcludes是在复制webapp目录完成后打包时忽略target/mywebapp-1.0.4 文件夹的文件</div></pre>
</div>
<h3>说明：</h3>
这里使用了warSourceExcludes和packagingExcludes两个参数为的就是演示一下含义，比如在打包产品的时候完全可以使用warSourceExcludes这一个参数来忽略文件，这样就可以省略packagingExcludes这个参数了
