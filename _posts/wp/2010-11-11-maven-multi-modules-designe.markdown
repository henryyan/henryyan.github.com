--- 
layout: post
title: "Maven多模块布局实例详解"
wordpress_id: 1405
wordpress_url: http://www.wsria.com/?p=1405
date: 2010-11-11 14:14:47 +08:00
tags: 
 - maven
 - 多模块
---
<h3>一、开场白</h3>
使用Maven有段时间了，只能感慨真是个好东西，让我从传统模式体会到了严谨、规范、敏捷、方便的特性。
如果你懂Maven或许看过Juven翻译的《<a href="http://www.juvenxu.com/mvn-def-guide/" target="_blank">Maven权威指南</a>》；
发个牢骚：由于Maven的出身问题导致学习曲线陡峭，所有有些人就开始说Maven不好用；原因有二：一是排斥Maven，二是没有耐心和精下心来学习，引用老毛的话来提醒我说的那些人：
<pre>没有调查就没有发言权</pre>
到了Maven这里就是(适用于技术方面)：
<pre>没有深入学习也没有发言权</pre>
如果Maven不好那么Spring、Hibernate这些大家经常使用的框架为什么还是从ant转移到Maven？
如果Maven不好那么为什么国外大多数项目都在使用Maven呢？
原因自己考虑，我不废话！我的这些话就是告诫那些<strong>信口雌黄</strong>的人。
<h3>二、多模块布局概述</h3>
详细属性Maven的童鞋们都看过《Maven权威指南》，里面也讲解如何搭建多模块的Maven项目，但是那个毕竟是比较简单的，在实际应用中就有点水土不服了；
后来又参考了Juven的一篇《<a href="http://juvenshun.javaeye.com/blog/305865" target="_blank">Maven最佳实践：划分模块</a>》博文，相对权威指南来说介绍的比较详细了，但是这还是不能满足我真正在企业应用的需求，等你看完Juven的博文后再看看下面这个实际应用中的项目布局有什么异同：

<a href="http://www.kafeitu.me/files/2010/11/maven-multi-module-constructor2.jpg"><img class="size-full wp-image-1409" title="maven-multi-module-constructor2" src="http://www.kafeitu.me/files/2010/11/maven-multi-module-constructor2.jpg" alt="Maven多模块布局概图" width="471" height="420" /></a>

OK，现在应该看出来有什么不同了，我的项目结构比权威指南里面的介绍复杂、比Juven的那篇文章说的也复杂，接下来再看看这张图片：

<a href="http://www.kafeitu.me/files/2010/11/juven-maven-multi-construction.png"><img class="size-full wp-image-1411" title="juven-maven-multi-construction" src="http://www.kafeitu.me/files/2010/11/juven-maven-multi-construction.png" alt="plexus-security项目结构" width="319" height="338" /></a>
<!--more-->
上面这张图片是我在写这篇文章的时候刚刚找到的：《<a href="http://juvenshun.javaeye.com/blog/565240" target="_blank">按需构建多模块，玩转Maven反应堆</a>》，和上面的<strong>Maven多模块布局概图</strong>对比一下是不是基本一样？真是后悔当初怎么没有看到Juven的这篇文章，后来把hibernate的项目checkout下来分析他的maven多模块结构布局然后再结合实际应用得出的<strong>Maven多模块布局概图</strong>。
OK，现在你对多模块布局有了初步的印象了，接下来才是重点，逐个击破、逐个分析。
<h3>三、多模块布局详解</h3>
无图无真相，有图才给力：(如果想真正了解多模块那么请先看着图片和说明揣摩一下含义……)

<a href="http://www.kafeitu.me/files/2010/11/maven-multi-module-construction.jpg"><img class="size-full wp-image-1417" title="maven-multi-module-construction" src="http://www.kafeitu.me/files/2010/11/maven-multi-module-construction.jpg" alt="Maven多模块布局概述图" width="593" height="281" /></a>

<strong>声明</strong>：由于是本例是根据实际应用的项目来分析的，所以会比之前说的教程和Juven的文章实例复杂一些。
<ol>
	<li><strong>denong-pb</strong>：先看实例pom.xml：
<pre class="brush: xml">
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.wsria</groupId>
	<artifactId>dn-pb</artifactId>
	<version>1.0.5-SNAPSHOT</version>
	<name>Denong Point Bank</name>
	<packaging>pom</packaging>
	
	<!-- 设定团队持续集成发布包服务器  -->
	<distributionManagement>
		<repository>
			<id>nexus</id>
			<name>Team Nexus Release Repository</name>
			<url>http://192.168.1.111:8081/nexus/content/repositories/releases</url>
		</repository>
		<snapshotRepository>
			<id>nexus</id>
			<name>Team Nexus Snapshot Repository</name>
			<url>http://192.168.1.111:8081/nexus/content/repositories/snapshots</url>
			<uniqueVersion>false</uniqueVersion>
		</snapshotRepository>
	</distributionManagement>
	
	<scm>
		<connection>scm:svn:https://192.168.1.111:8443/svn/denong/pb/trunk</connection>
		<url>https://192.168.1.111:8443/svn/denong/pb/trunk</url>
	</scm>
	
	<modules>
		<module>parent</module>
		<module>common</module>
		<module>entity</module>
		<module>data</module>
		<module>dao</module>
		<module>service</module>
		<module>web-parent</module>
		<module>web-admin</module>
		<module>web-site</module>
	</modules>
	
	<build>
        <defaultGoal>install</defaultGoal>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-release-plugin</artifactId>
                <version>2.0-beta-9</version>
                <configuration>
                    <autoVersionSubmodules>true</autoVersionSubmodules>
                </configuration>
            </plugin>
        </plugins>
  </build>
  
</project>
</pre>
</li>
	<li><strong>bin</strong>：<em>可有可无</em>，存放一些maven的命令批处理文件或者快捷bat文件，比如本地install项目或者打包根据产品profile（在模块中配置id为product的profile）打包war；</li>
	<li><strong>common</strong>：估计有一些经验的人都会把一些常用的工具类封装起来，由经验丰富的人来维护到common模块中作为技术沉淀和公司的公共类库，方便大家快速开发使用。当然实际应用中可能会使用公司已经存在的common模块，然后单个项目中可能会再加入一个common模块，一般公司的common包都是这么积累下来的；</li>
	<li><strong>dao</strong>：每个模块的数据存取类，因为本项目是根据springside基础上构建的，所以都是继承HibernateDao，如果涉及到大数据量或者存储过程的调用会再加入相应的*JdbcDao；</li>
	<li><strong>data</strong>：

<a href="http://www.kafeitu.me/files/2010/11/maven-multi-module-data.jpg"><img class="size-full wp-image-1435" title="maven-multi-module-data" src="http://www.kafeitu.me/files/2010/11/maven-multi-module-data.jpg" alt="data模块结构" width="276" height="286" /></a>

，根据上图介绍一下：除了data目录外其他的配置文件都是在测试期间使用的，根据不同需求使用不同配置文件，例如一些不需要spring启动时初始化的数据使用applicationContext-test-no-init-sql.xml，这个没有什么规定，根据项目来设置；<strong>data</strong>目录是存放一些使用dbunit导出的xml数据文件，作用是在单元测试时的数据初始化或者利用数据文件初始化指定的数据库，一般这些数据文件的类型包括：数据字典、系统配置参数等</li>
	<li><strong>entity</strong>：这里说一下JPA注解的实体工具，开始我使用的是eclipse3.6的JPA工具，但是发现有些属性加不上@Column注解很是郁闷，只能手动加入；当然你也可以使用springside中提供的hibernatetools模板生成，但是我还是希望在生成期间能完全受控，所以最好想到了MyEclipse，配置好数据源然后从数据库中逆向生成JPA，所有字段都正确配置；</li>
	<li><strong><em>parent</em></strong>：这里<strong>着重介绍</strong>一下，此模块是所有子模块需要继承的超级POM，举个例子容易理解：把本项目(denong-pb)当做是Java语言，那么parent模块就是Object类，此模块只负责定影其他子模块需要使用的一些公共设置，谨记：
<pre>parent不负责管理子模块，只是被子模块集成，千万不要和denong-pb目录的pom.xml混淆</pre>
</li>
	<li><strong>service</strong>：就是业务处理类，供web模块调用；</li>
	<li><strong>web-parent</strong>：供web*模块继承，例如前后台都需要调用的Action接口，像数据字典、地区信息、系统属性等</li>
	<li><strong>web-admin</strong>：系统的后台管理程序，使用了struts2的convention插件；</li>
	<li><strong>web-site</strong>：系统网站部分，同样使用了struts2的convention插件，集成<a href="http://www.wsria.com/archives/1349" target="_blank">单点登录</a>功能</li>
</ol>
<h3>四、模块之间依赖关系</h3>
直观教程图片最给力：
<a href="http://www.kafeitu.me/files/2010/11/maven-multi-module-relation.png"><img src="http://www.kafeitu.me/files/2010/11/maven-multi-module-relation.png" alt="Maven多模块关系依赖图" title="maven-multi-module-relation" width="410" height="324" class="size-full wp-image-1444" /></a>
<h3>五、和SVN的整合——maven-release-plugin</h3>
<a href="http://maven.apache.org/plugins/maven-release-plugin/" target="_blank">maven-release-plugin</a>是经常使用的插件，这里简单介绍一下，要点：
<ol>
	<li><strong>每个模块的scm配置</strong>：
<pre class="brush: xml">
<scm>
	<connection>scm:svn:https://192.168.1.111:8443/svn/denong/pb/trunk/模块名称</connection>
	<url>https://192.168.1.111:8443/svn/denong/pb/trunk/模块名称</url>
</scm>
</pre>
<pre>上面的scm配置在每一个模块中存在，因为每一个模块再svn目录中有单独的目录；</pre>

但是parent模块有点不同，因为除了parent模块其他子模块需要继承parent，如下代码：
<pre class="brush: xml">
<parent>
	<groupId>com.wsria</groupId>
	<artifactId>parent</artifactId>
	<version>1.0.5-SNAPSHOT</version>
	<relativePath>../parent/pom.xml</relativePath>
</parent>
<artifactId>dn-pb-entity</artifactId>
</pre>

parent模块设定了一些被子模块集成的插件，maven-release-plugin当然也在列，除了GAV之外最重要的就是tagBase标签：
<pre class="brush: xml">
<!-- release插件 -->
<plugin>
	<groupId>org.apache.maven.plugins</groupId>
	<artifactId>maven-release-plugin</artifactId>
	<version>2.0-beta-9</version>
	<configuration>
		<tagBase>https://192.168.1.111:8443/svn/denong/pb/tags/</tagBase>
		<username>${svn.name}</username>
		<password>${svn.pwd}</password>
	</configuration>
</plugin>
</pre>
本地的settings.xml中配置(替换${svn.name}和${svn.pwd}，也就是svn提交时的用户名和密码)：
<pre class="brush: xml">
<settings>
...
<profiles>
	<profile>
		<id>denong-product</id>
		<properties>
			<svn.name>kafeitu</svn.name>
			<svn.pwd>123456</svn.pwd>
		</properties>
	</profile>
</profiles>
...
</settings>
</pre>
在denong-pb目录中执行命令：

<pre>D:\wsria\projects\denong\denong-pb>mvn release:prepare -Pdenong-product</pre>
在svn中自动打的tag结构为：
<a href="http://www.kafeitu.me/files/2010/11/svn-tag-construction.jpg"><img src="http://www.kafeitu.me/files/2010/11/svn-tag-construction.jpg" alt="maven-release-plugin执行release:prepare后的svn结构" title="svn-tag-construction" width="164" height="294" class="size-full wp-image-1448" /></a>
接下来就可以执行命令：
<pre>D:\wsria\projects\denong\denong-pb>mvn release:perform</pre></li>
</ol>

<h3>六、多模块布局问题</h3>
如果你够细心可能发现了上面出现了relativePath属性，这个再多模块的配置中经常遇到的问题，根据目前的案例来说子模块和parent是同级的目录，但是每个子模块又都需要继承parent模块的一些配置，比如上面介绍的到common模块会使用如下配置：
<pre class="brush: xml">
<parent>
	<groupId>com.wsria</groupId>
	<artifactId>parent</artifactId>
	<version>1.0.5-SNAPSHOT</version>
</parent>
<artifactId>common</artifactId>
</pre>
现在问题来了，在common模块下执行命令：mvn compile，得到的结果中包含了警告信息：


<pre>[WARNING] 'parent.relativePath' points at com.wsria:dn-pb instead of com.wsria:dn-pb-parent, please verify your project structure @ line 4, column 10</pre>
意思是找不到dn-pb-parent这个模块……因为maven不知道dn-pb-parent模块存在的位置才会导致警告信息的出现，解决办法是手动指定dn-pb-parent模块的位置，所以最终的解决办法是在parent标签中加入：
<pre class="brush: xml">
<relativePath>../parent/pom.xml</relativePath>
</pre>
这样maven就知道继承的parent的具体位置了，

<pre>relativePath默认值为../pom.xml，参考：<a href="http://maven.apache.org/ref/3.0/maven-model/maven.html" target="_blank">http://maven.apache.org/ref/3.0/maven-model/maven.html</a></pre>

完整的parent继承配置：
<pre class="brush: xml">
<parent>
	<groupId>com.wsria</groupId>
	<artifactId>dn-pb-parent</artifactId>
	<version>1.0.5-SNAPSHOT</version>
	<relativePath>../parent/pom.xml</relativePath>
</parent>
<artifactId>dn-pb-common</artifactId>
</pre>
现在运行mvn命令一切正常了;

<pre>记得每一个继承parent模块的子模块都需要添加relativePath设置</pre>
<h3>七、多模块开发期间Debug</h3>
一般我们在开发web模块的时候会启用tomcat或者jboss的debug模式来断点调试应用，但是你会发现如果web模块依赖了service模块想进入service模块debug但是eclipse却告诉你找不到class的源码，解决办法：
<pre>把service模块加入到Build Path的Project列表中</pre>

<h3>八、其他方案</h3>
如何布局是根据每一个项目组的安排定义的，比如
<ol>
	<li>一个项目组分模块开发的话或许不像本例一样分模块而是把每一层都集中在一个项目中</li>
	<li>或许web模块单独一个子模块，其他的entyty、dao、service集中在一个子模块model中</li>
</ol>

<pre><strong>怎么布局需要根据项目实际情况来定义</strong>，当然要考虑到单个子模块的重复利用，例如service模块在本例中被web-admin和web-site模块使用，如果以后再加入webservice模块那么webservice也要依赖，或许还有命令行(command)模块也要依赖</pre>

<h3>九、结束语</h3>
这是一篇难产的文章，有些原因影响经过了3个晚上才出世，呵呵
有不对的地方请留言以改正；
分享这篇文章的目的就是给刚刚接触或者正需要maven多模块布局的童鞋们参考，希望能对你有帮助，谢谢关注！
