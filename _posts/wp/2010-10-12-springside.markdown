--- 
layout: post
title: "工欲善其事必先利其器--Java Web快速开发框架--Springside"
wordpress_id: 1188
wordpress_url: http://www.wsria.com/?p=1188
date: 2010-10-12 00:45:38 +08:00
tags: 
 - springside
---
今天开始“工欲善其事必先利其器”系列第一篇，介绍目前可以快速开发并且有规范可维护性的开源框架——<span style="background-color: #00ff00;">Springside</span>。
<h3>一、老板，来二两点废话：</h3>
如果你从事Java Web编程你会发现怎么那么多的技术或者框架，还有那么多关于的Java规范、协议；框架比如最著名的MVC框架Struts，持久化框架Hibernate，和解耦合Struts和Hibernate的Spring（虽然它现在不再是单一功能）；这些框架的学习不是很困难，但是对于初学者或者需要快速构建项目的团队或者个人来说就需要花费成本构建新的项目，这无疑是项目初期的拦路虎。

关于这一点我是有过深的体会，去年给一个小公司开发一个小系统使用的架构就是我之前发布过的《<a href="http://www.wsria.com/archives/136" target="_blank">个人账务管理系统</a>》的架构，由于当时写这个架构的时候工作经验比较少，遇到的问题也不多，所以很多地方功能欠缺，而且不够灵活还有BUG……惭愧
<h3>二、推荐Springside</h3>
去年年底的一次偶然机会让我发现了<a href="http://www.springside.org.cn" target="_blank">Springside</a>，以下简称为SS；关于SS的详细资料大家请到SS的官网查看，有这非常详细的WIKI文档而且在最新的3.3.4版本中<a href="http://www.wsria.com/msg#comment-1553" target="_blank">白衣</a>重新检查、调整了代码注释，使使用者可以很容易理解代码的意图。
<pre>SpringSide是以<a href="http://springside.org.cn/www.springframework.org" target="_blank">Spring Framework</a>为核心，提供Pragmatic之中又适合工业化大规模开发的企业应用Kickstart。
如果说Sun的代码规范规定了大家在代码中如何命名变量，怎么编写注释的话，SpringSide则是以主流的技术选型、Pragmatic的编程实践来开发JavaEE企业级应用的总结与演示。</pre>
<!--more-->
刚刚说到了spring是Struts和Hibernate的解耦合框架，如果说spring是struts和hibernate的<strong>粘合剂</strong>，那么SS就是sturts、spring、hibernate的粘合剂，但是幸运的告诉你中奖了，springside中还提供了对于<span style="background-color: #ffcc00;">团队开发</span>和企业应用开发中经常使用的用例演示，很多功能你可以直接搬运过来再自己的项目中实施，包含了我们平常经常使用<strong>CRUD</strong>操作的-<a href="http://wiki.springside.org.cn/display/SpringSide3/SpringSide+Mini-Example" target="_blank">MiniWeb</a>模块，千奇百怪的企业应用演示-<a href="http://wiki.springside.org.cn/display/SpringSide3/SpringSide+Showcase" target="_blank">Showcase</a>模块，这两个模块都依赖于一个功能的模块——<a href="http://wiki.springside.org.cn/display/SpringSide3/Springside+Modules" target="_blank">Modules</a>，在Modules中就会看到了SS的核心功能<span style="background-color: #ff0000;">Core</span>、Showcase的依赖<span style="background-color: #ff0000;">Extension</span>，还有SS的的<span style="background-color: #ff0000;">Parent</span>

<span style="font-size: medium;">这里就简单的说明SS的大体结构，引导，详细还是请看全面的<a href="http://wiki.springside.org.cn/display/SpringSide3/Home" target="_blank">SS WIKI文档</a>。</span>
<pre>如果你只是想快速开发，那么你需要做的仅仅是<strong>拿来主义</strong>。如果想看源码白衣做了很详细的源码说明和详细的WIKI文档，各种企业应用的：选型、使用、注意事项、问题列表、规范等等尽在<a href="http://wiki.springside.org.cn/display/SpringSide3/Reference" target="_blank">WIKI</a>中写明。</pre>
<h3>三、学习使用Springside</h3>
既然推荐了SS那就要说说怎么使用了;

首先说一下SS的整体结构，SS是以<a href="http://maven.apache.org" target="_blank">Maven</a>为<strong>构建</strong>工具，以Eclipse With JAVAEE为<strong>开发</strong>工具（外加各种插件），目前最新的版本要求使用JDK6+
<ol>
	<li>
<h4>转变你的思想</h4>
就比如一个C（面向过程）语言程序员转换到Java（面向对象）程序员一个道理，加入你一直使用C语言开发，然后为了发展你需要学习Java语言，那么你必须学会<strong>强奸式</strong>的接受方式，你必须遵守面向对象规范……
到了这里同样适用，使用Springside会进一步提升应用的开发进度和稳定性，毕竟是经过全方位测试的核心框架；对于提供的示例你只需要按照Springside团队的代码风格来写，当然如果需要你也可以修改源码扩展一些<span title="我在SS基础上扩展了jqGrid的CRUD功能，以后会写教程"><strong>功能</strong></span></li>
	<li>
<h4>Springside使用的构建工具——Maven</h4>
<pre><strong>程序员的固定思想</strong>：在做某件事情之前会想想有没有工具可以帮我实现（自动化、代工）？很明显的体现出程序员的懒惰……</pre>
<pre>关于Maven是说明东东或者刚刚接触的同学请看《<a href="http://www.wsria.com/archives/1072" target="_blank">Maven学习引导</a>》</pre>
如果你一直处于传统的开发模式或者公司技术落后的话你可能感觉怎么怪怪的呢，如果你没有接触过Maven首先会感觉目录结构为什么是这样的，和之前使用的WebRoot方式完全不一样，这个就是Maven的标准结构，Maven的设计思想是以<strong><span style="color: #800080;">约定优于配置</span></strong>为中心的，如果你接触过ruby on rails或者Struts2的话就能理解说明是约定由于配置，简单来说就是有工具、架构的设计者来制定一系列规则，开发人员只需要按照预设的规则书写、配置自己的功能，把注意力集中到业务上而不是分散部分注意力到架构或工具上，维基上有<a href="http://zh.wikipedia.org/zh/%E7%BA%A6%E5%AE%9A%E4%BC%98%E4%BA%8E%E9%85%8D%E7%BD%AE" target="_blank">详细解释</a>。
<pre>一个设计(工具)的出现必定有它存在的道理，所以<strong>告诫</strong>一些人不要盲目的反驳，先研究一下这样的结构设计对自己有利还是有弊，或者是否是利大于弊！</pre>
</li>
	<li>
<h4>万变不离其宗</h4>
<strong>声明</strong>：再次强调一下SS只是SSH框架的粘合剂，外加一些企业应用的示例集合；
<strong>基础</strong>：所以使用SS必须有Struts（严格来说是Struts2）、Spring、Hibernate基础
<strong>变化</strong>：SS的每次版本升级目的都是怎么包裹SSH框架使得其在应用中更稳定、更易用</li>
	<li>
<h4>不入虎穴焉得虎子</h4>
如果你有时间那么我建议你研究（或者浏览）一下SS的源码，有两个目的：
<strong>一、看其概貌</strong>
把SS的大体结构储存于脑海中，看点是对于Struts、Spring、Hibernate各个框架是怎么封装并整合在一起的，这是以后在开发过程中解决问题的最牢靠的线索（当然你可以到QQ群和论坛）
<strong>二、使用方法</strong>
上面提到了SS的几个Modules，例如你只需要普通的CRUD操作，那么就要仔细的浏览<a href="http://wiki.springside.org.cn/display/SpringSide3/SpringSide+Mini-Example" target="_blank">Mini-Web</a>模块的结构、代码实现，如果有必要可以Debug；虽然是拿来主义但是也要做<strong>有底气的拿来主义。</strong>
Mini-Service和Showcase模块也是同样的道理

除了代码部分还需要了解一些SS的parent模块的<a href="http://code.google.com/p/springside/source/browse/springside3/trunk/modules/parent/pom.xml?spec=svn1105&amp;r=1105">pom.xml</a>配置，这里配置的SS的最外层约束配置，每个框架、插件的版本和团队配置都在这里面，如果你懂Maven就不用多说了。</li>
</ol>
<h3>四、结束语</h3>
可以想象你现在已经大体了解了SS是什么了，或许也和我一样对它产生了浓厚的兴趣，然后就是<a href="http://www.springside.org.cn/download.php" target="_blank">下载</a>源码、浏览<a href="http://wiki.springside.org.cn/display/SpringSide3/Home" target="_blank">WIKI文档</a>，想在自己的项目中实验一下效果，那么恭喜你咱们在同一行列了……
我写此文章的目的在于怎么提高企业应用的开发效率和稳定性，还有一点就是<strong>规范</strong>；当然如果你公司自己封装的比SS好你可以忽略我的存在。
PS：接下来会和大家分享一些使用SS开发过程中积累的一些技术知识和一些DEMO。
如果需要联系我请看<strong><a href="http://www.wsria.com/about">这里</a></strong>。
