---
layout: post
title: "Zsh(oh-my-zsh)的Maven自动提示插件(zsh-maven-complection)"
category: shell 
tags: 
 - shell
 - zsh
 - bash
 - maven
 - 自动提示
---

## 1.有关插件的小故事(story)

我一直使用Zsh作为日常Shell工具，确切来说是oh-my-zsh，关于zsh我专门写过一篇博客[我最喜爱的工具-oh-my-zsh](/shell/2012/03/25/oh-my-zsh.html)。

从一年前我开始放弃Windows专用Linux（Ubuntu）作为开发环境，其中强大的Shell最吸引我的最主要因素；关于Linux之前也写过一篇博文[我是如何在Linux(Ubuntu)上工作的？](/linux/2012/05/19/how-do-i-work-on-linux.html)。

这个插件的主页：[https://github.com/juven/maven-bash-completion](https://github.com/juven/maven-bash-completion)

说起这个插件得从认识[Juven](http://www.juvenxu.com/)开始，认识Juven是因为学习使用Maven，我记得是在我认识他的初期开始提到过bash的maven自动提示插件，当时好像还没用转移到Linux所以没在意。后来转移到Linux之后使用过一段时间的**maven-bash-completion**，但是后来因为转移到了zsh而且这个插件不能兼容zsh所以后来就放弃了。

到了zsh环境下发现oh-my-zsh中有一个maven自动提示的插件，插件的名称为：**mvn.plugin.zsh**。虽然功能很少但是勉强可以使用，因为忙所以就没用折腾（给自己找理由……）。

但是今天在和Juven聊天的时候又提到了这个话题，贴个图吧，不打字了。

![](/files/2012/07/talk-with-juven-and-garin.png)

就是这段简单的聊天我决定自己动手实现zsh的自动提示，当即动手开工……

感谢Garin、Juven怂恿了我……

## 2.插件功能(features)

因为oh-my-zsh中原本就有一个mvn的插件，但是已经一年多没有更新了，我就直接拿过来修改，把bash的自动提示功能移植到zsh中，使用的工具就是几个vim的操作。

### 2.1 支持的插件(Support p
lugins)

deploy failsafe install site surefire checkstyle javadoc jxr pmd ant antrun archetype assembly dependency enforcer gpg help release repository source eclipse idea jetty cargo jboss tomcat tomcat6 tomcat7 exec versions war ear ejb android scm buildnumber nexus repository sonar license hibernate3 liquibase flyway gwt

### 2.2 生命周期(lifecycle)

clean process-resources compile process-test-resources test-compile test package verify install deploy site

### 2.3 参数(options)

-am -amd -B -C -c -cpu -D -e -emp -ep -f -fae -ff -fn -gs -h -l -N -npr -npu -nsu -o -P -pl -q -rf -s -T -t -U -up -V -v -X

## 3.截图欣赏(screenshots)

![](/files/2012/07/zsh-maven-complection-1.png)

![](/files/2012/07/zsh-maven-complection-2.png)

### 3.1 特色功能（自动补全测试类）

除了基本的提示之外我还在原有的mvn.plugin.zsh的基础上进行了优化，当输入mvn -Dtest时按下TAB键会自动把**src/test/java**目录下面所有的**.java**类列出来作为-Dtest的参数，如图：

![](/files/2012/07/zsh-maven-complection-3.png)

## 4.如何安装(install)

请先安装oh-my-zsh，具体参考：[我最喜爱的工具-oh-my-zsh](/shell/2012/03/25/oh-my-zsh.html)。

oh-my-zsh的官方github地址：[https://github.com/robbyrussell/oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

**插件源码**：[https://github.com/henryyan/oh-my-zsh/blob/master/plugins/mvn/mvn.plugin.zsh](https://github.com/henryyan/oh-my-zsh/blob/master/plugins/mvn/mvn.plugin.zsh)

安装完成之后记得在~/.zshrc中启用maven插件：

<pre class="brush:shell">
plugins=(ant mvn svn git git-flow)
</pre>

	我已经给oh-my-zsh提交了合并请求，如果顺利接下来可能会合并到master分支。

	暂时先从我的项目里面克隆，或者直接下载mvn.plugin.zsh覆盖到本地。