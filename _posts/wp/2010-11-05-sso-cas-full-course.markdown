--- 
layout: post
title: "CAS单点登录(SSO)完整教程(2012-02-01更新)"
wordpress_id: 1349
wordpress_url: http://www.wsria.com/?p=1349
date: 2010-11-05 20:25:51 +08:00
category: sso
tags: 
 - cas
 - sso
 - java
 - 单点登录
 - 教程
---

## 一、教程说明

#### 前言

*  教程目的：从头到尾细细道来单点登录服务器及客户端应用的每个步骤
*  单点登录（SSO）：请看百科解释<a href="http://baike.baidu.com/view/993620.htm">猛击这里打开</a>
*  本教程使用的SSO服务器是Yelu大学研发的CAS(Central Authentication Server)，<br/>官网：<a href="http://www.jasig.org/cas">http://www.jasig.org/cas</a>

#### 本教程环境：
*  Tomcat6.0.29
*  JDK6
*  CAS Server版本：cas-server-3.4.3.1、cas-server-3.4.10
*  CAS Client版本：cas-client-3.1.12、cas-client-3.2.1
*  教程撰写日期：2010-11-05(第一版)、2011-11-05(一年后更新)、2012-02-01(异常处理)
*  教程作者：<a href="http://www.kafeitu.me">咖啡兔</a>

## 二、创建证书

啰嗦几句：证书是单点登录认证系统中很重要的一把钥匙，客户端于服务器的交互安全靠的就是证书；本教程由于是演示所以就自己用JDK自带的keytool工具生成证书；如果以后真正在产品环境中使用肯定要去证书提供商去购买，证书认证一般都是由VeriSign认证，中文官方网站：<a href="http://www.verisign.com/cn/" target="_blank">http://www.verisign.com/cn/</a>

用JDK自带的keytool工具生成证书：<pre>keytool -genkey -alias wsria -keyalg RSA -keystore d:/keys/wsriakey</pre>

无图不给力，有图有真相：

![用keytool生成证书](/files/2010/11/use-keytool-create-key.gif)

具体的输入项图片中都有说明，有一点我要解释一下；在输入完密码后提示输入域名是我输入的是sso.wsria.com，其实这个域名是不存在的，但是我为了演示所以虚拟了这个域名，技巧在于修改
<pre>C:\Windows\System32\drivers\etc\hosts</pre>
添加内容如下：
<pre>127.0.0.1	sso.wsria.com</pre>
这样在访问sso.wsria.com的时候其实是访问的127.0.0.1也就是本机

**严重提醒**：提示输入域名的时候不能输入IP地址

## 三、导出证书

<pre>D:\keys>keytool -export -file d:/keys/wsria.crt -alias wsria -keystore d:/keys/wsriakey</pre>

**特别提示：**如果提示：
<pre>keytool error: java.io.IOException: Keystore was tampered with, or password was incorrect</pre>
那么请输入密码：**changeit**

来点颜色：

![用keytool导出证书](/files/2010/11/use-keytool-export-crt.gif)

至此导出证书完成，可以分发给应用的JDK使用了，接下来讲解客户端的JVM怎么导入证书。

## 四、为客户端的JVM导入证书

<pre>keytool -import -keystore D:\tools\jdk\1.6\jdk1.6.0_20\jre\lib\security\cacerts -file D:/keys/wsria.crt -alias wsria</pre>

来点颜色瞧瞧：

![用keytool导出证书](/files/2010/11/use-keytool-import-crt-to-client-jvm.gif)

### 特别说明

D:\tools\jdk\1.6\jdk1.6.0_20\jre\lib\security -- 是jre的目录；密码还是刚刚输入的密码。至此证书的创建、导出、导入到客户端JVM都已完成，下面开始使用证书到Web服务器中，本教程使用tomcat。

## 五、应用证书到Web服务器-Tomcat

说是应用起始做的事情就是启用Web服务器(Tomcat)的SSL，也就是HTTPS加密协议，为什么加密我就不用啰嗦了吧……
准备好一个干净的tomcat，本教程使用的apache-tomcat-6.0.29
打开tomcat目录的conf/server.xml文件，开启83和87行的注释代码，并设置keystoreFile、keystorePass修改结果如下：

<pre class="brush: xml">
<Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true"
           maxThreads="150" scheme="https" secure="true"
           clientAuth="false" sslProtocol="TLS" 
       keystoreFile="D:/keys/wsriakey"
       keystorePass="wsria.com"
/>
</pre>

### 参数说明：

* keystoreFile：在第一步创建的key存放位置
* keystorePass：创建证书时的密码

好了，到此Tomcat的SSL启用完成，现在你可以启动tomcat试一下了，例如本教程输入地址：https://sso.wsria.com:8443/
打开的是：

![浏览器提示证书错误](/files/2010/11/explorer-tip-unsafe-crt-1.gif)

好的，那么我们点击“继续浏览此网站(不推荐)。现在进入Tomcat目录了吧，如果是那么你又向成功迈进了一步。

OK，接下来要配置CAS服务器了。

## 六、CAS服务器初体验

* CAS服务端下载：[http://www.jasig.org/cas/download](http://www.jasig.org/cas/download)

* 下载完成后将cas-server-3.4.3.1.zip解压，解压cas-server-3.4.3/modules/cas-server-webapp-3.4.3.1.war，改名为cas，然后复制cas目录到你的tomcat/webapp目录下

* 现在可以访问CAS应用了，当然要使用HTTPS加密协议访问，例如本教程地址：https://sso.wsria.com:8443/cas/login ，现在打开了CAS服务器的页面输入admin/admin点击登录（CAS默认的验证规则只要用户名和密码相同就通过）所以如果你看到下面的这张图片你就成功了

![CAS登录成](/files/2010/11/cas-login-success.gif)

你成功了吗？如果没有成功请再检查以上步骤！

### 2011-11-05更新说明

#### 使用Maven构建：
使用cmd或者shell进入cas-server-3.4.10目录，运行：
<pre class="brush: shell">mvn package -pl cas-server-webapp,cas-server-support-jdbc</pre>
意思是只需要构建cas-server-webapp和cas-server-support-jdbc，如果需要其他的请根据文件夹名称设置或者构建全部模块，打包全部模块命令：mvn package 即可。打包过程中会从网络下载需要的jar包，请耐心等待；如果在~/.m2/settings.xml中定义了mirror代理<mirrorOf>*</mirrorOf>，那么请把*随便修改一个字符，否则下载jar包会失败！

打包完成后就可以从cas-server-webapp/target/cas.war复制到你的tomcat/webapp中；或者直接复制cas-server-webapp/target/cas-server-webapp-3.4.10目录到tomcat/webapp目录下，其他步骤和上面一样。

## 七、CAS服务器深入配置

上面的初体验仅仅是简单的身份验证，实际应用中肯定是要读取数据库的数据，下面我们来进一步配置CAS服务器怎么读取数据库的信息进行身份验证。
首先打开<pre>tomcat/webapp/cas/WEB-INF/deployerConfigContext.xml</pre>
配置的地方如下：

找到第92行处，注释掉：SimpleTestUsernamePasswordAuthenticationHandler这个验证Handler，这个是比较简单的，只是判断用户名和密码相同即可通过，这个肯定不能在实际应用中使用，弃用！

注释掉92行后在下面添加下面的代码： 

<pre class="brush:xml">
<bean class="org.jasig.cas.adaptors.jdbc.QueryDatabaseAuthenticationHandler">
	<property name="dataSource" ref="dataSource"></property>
	<property name="sql" value="select password from t_admin_user where login_name=?"></property>
	<property name="passwordEncoder" ref="MD5PasswordEncoder"></property>
</bean>
</pre>

在文件的末尾之前加入如下代码：
<pre class="brush:xml">
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
   <property name="driverClassName"><value>com.mysql.jdbc.Driver</value></property>
   <property name="url"><value>jdbc:mysql:///wsriademo</value></property>
   <property name="username"><value>root</value></property>
   <property name="password"><value>root</value></property>
</bean>

<bean id="MD5PasswordEncoder" class="org.jasig.cas.authentication.handler.DefaultPasswordEncoder">
    <constructor-arg index="0">
        <value>MD5</value>
    </constructor-arg>
</bean>
</pre>

复制cas-server-3.4.3.1\modules\cas-server-support-jdbc-3.4.3.1.jar和mysql驱动jar包到tomcat/webapp/cas/WEB-INF/lib目录

### 配置解释：

* **QueryDatabaseAuthenticationHandler**，是cas-server-support-jdbc提供的查询接口其中一个，QueryDatabaseAuthenticationHandler是通过配置一个 SQL 语句查出密码，与所给密码匹配

* **dataSource**,我就不用解释了吧，就是使用JDBC查询时的数据源

* **sql**，语句就是查询哪一张表，本例根据t_admin_user表的login_name字段查询密码，CAS会匹配用户输入的密码，如果匹配则通过；下面是t_admin_user的表结构：

<pre class="brush: sql">
create table t_admin_user (
	id bigint not null auto_increment,
	email varchar(255),
	login_name varchar(255) not null unique,
	name varchar(255),
	password varchar(255),
	primary key (id)
) ENGINE=InnoDB;
</pre>

* **passwordEncoder**，这个就算是自己加的盐巴了，意思很明显就是处理密码的加密，看你的应用中数据库保存的是明码还是加密过的，比如本例是使用MD5加密的，所以配置了MD5PasswordEncoder这个Handler，cas内置了MD5的功能所以只需要配置一下就可以了；如果在实际应用中使用的是公司自己的加密算法那么就需要自己写一个Handler来处理密码，实现方式也比较简单，创建一个类继承org.jasig.cas.authentication.handler.PasswordEncoder然后在encode方法中加密用户输入的密码然后返回即可

## 八、配置CAS客户端

添加cas-client的jar包，有两种方式：

#### 传统型

下载cas-client，地址：[http://www.ja-sig.org/downloads/cas-clients/](http://www.ja-sig.org/downloads/cas-clients/)，然后解压cas-client-3.1.12.zip，在modules文件夹中有需要的jar包，请根据自己的项目情况选择使用

##### 2011-11-05更新：
用maven打包server的方式一样，在cas-client-3.2.1目录中运行命令：
<pre class="brush: shell">mvn package -pl cas-client-core -DskipTests=true</pre>
然后从target目录中复制cas-client-core-3.2.1.jar到应用的WEB-INF/lib目录中

#### Maven型

<pre class="brush:xml">
<dependency>
	<groupId>org.jasig.cas.client</groupId>
	<artifactId>cas-client-core</artifactId>
	<version>3.1.12</version>
</dependency>
</pre>

### 设置filter

编辑web.xml，然后粘贴下面的代码：
<pre class="brush:xml">
<!-- 用于单点退出，该过滤器用于实现单点登出功能，可选配置-->
<listener>
<listener-class>org.jasig.cas.client.session.SingleSignOutHttpSessionListener</listener-class>
</listener>

<!-- 该过滤器用于实现单点登出功能，可选配置。 -->
<filter>
    <filter-name>CAS Single Sign Out Filter</filter-name>
    <filter-class>org.jasig.cas.client.session.SingleSignOutFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>CAS Single Sign Out Filter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

<!-- 该过滤器负责用户的认证工作，必须启用它 -->
<filter>
    <filter-name>CASFilter</filter-name>
    <filter-class>org.jasig.cas.client.authentication.AuthenticationFilter</filter-class>
    <init-param>
        <param-name>casServerLoginUrl</param-name>
        <param-value>https://sso.wsria.com:8443/cas/login</param-value>
    </init-param>
    <init-param>
        <!--这里的server是服务端的IP-->
        <param-name>serverName</param-name>
        <param-value>http://localhost:10000</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>CASFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

<!-- 该过滤器负责对Ticket的校验工作，必须启用它 -->
<filter>
    <filter-name>CAS Validation Filter</filter-name>
    <filter-class>
org.jasig.cas.client.validation.Cas20ProxyReceivingTicketValidationFilter</filter-class>
    <init-param>
        <param-name>casServerUrlPrefix</param-name>
        <param-value>https://sso.wsria.com:8443/cas</param-value>
    </init-param>
    <init-param>
        <param-name>serverName</param-name>
        <param-value>http://localhost:10000</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>CAS Validation Filter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

<!--
该过滤器负责实现HttpServletRequest请求的包裹，
比如允许开发者通过HttpServletRequest的getRemoteUser()方法获得SSO登录用户的登录名，可选配置。
-->
<filter>
    <filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
    <filter-class>
org.jasig.cas.client.util.HttpServletRequestWrapperFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

<!--
该过滤器使得开发者可以通过org.jasig.cas.client.util.AssertionHolder来获取用户的登录名。
比如AssertionHolder.getAssertion().getPrincipal().getName()。
-->
<filter>
    <filter-name>CAS Assertion Thread Local Filter</filter-name>
    <filter-class>org.jasig.cas.client.util.AssertionThreadLocalFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>CAS Assertion Thread Local Filter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

<!-- 自动根据单点登录的结果设置本系统的用户信息 -->
<filter>
    <display-name>AutoSetUserAdapterFilter</display-name>
    <filter-name>AutoSetUserAdapterFilter</filter-name>
    <filter-class>com.wsria.demo.filter.AutoSetUserAdapterFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>AutoSetUserAdapterFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
<!-- ======================== 单点登录结束 ======================== -->
</pre>


每个Filter的功能我就不多说了，都有注释的，关键要解释一下AutoSetUserAdapterFilter的作用和原理.
查看完整的web.xml请 [猛击这里](http://code.google.com/p/wsria/source/browse/branches/wsria-demo-sso/src/main/webapp/WEB-INF/web.xml)

### 利用AutoSetUserAdapterFilter自动根据CAS信息设置Session的用户信息

先看一下这个[AutoSetUserAdapterFilter.java](http://code.google.com/p/wsria/source/browse/branches/wsria-demo-sso/src/main/java/com/wsria/demo/filter/AutoSetUserAdapterFilter.java)的源码

好的，如果你是老程序员应该很快就清楚Filter的目的，如果不太懂我再讲解一下；
主要是通过CAS的**_const_cas_assertion_**获取从CAS服务器登陆的用户名，然后再根据系统内部的用户工具（[UserUtil.java](http://code.google.com/p/wsria/source/browse/branches/wsria-demo-sso/src/main/java/com/wsria/demo/util/UserUtil.java)）来判断是否已经登录过，如果没有登录根据登录名从数据库查询用户信息，最后使用设置把用户信息设置到当前session中。
这样就把用户信息保存到了Sessino中，我们就可以通过UserUtil工具来获取当前登录的用户了，我在实例项目中也加入了此功能演示，请看代码：[main.jsp](http://code.google.com/p/wsria/source/browse/branches/wsria-demo-sso/src/main/webapp/WEB-INF/content/main/main.jsp)的第44行处

#### 补充一下：
如果是为一个老项目添加单点登录功能，那么基本不需要其他的修改，设置好上面的filter即可；当然最好获取用户信息的地方都调用一个工具类，统一管理不容易出错。

## 九、单点退出

这个比较简单，把你的退出链接设置为：https://sso.wsria.com/cas/logout 即可。

## 十、美化CAS服务器界面

CAS服务端(cas-server)的界面只能在测试的时候用一下，真正系统上线肯定需要定制开发自己的页面，就像[网易](http://reg.163.com)和[CSDN](http://passport.csdn.net/UserLogin.aspx)的统一认证平台一样，所有子系统的认证都通过此平台来转接，大家可以根据他们的页面自己定制出适合所属应用或者公司的界面；简单介绍一下吧，复制
cas\WEB-INF\view\jsp\default\ui的一些JSP文件，每一个文件的用途文件名已经区分了，自己修改了替换一下就可以了。
例如：

* 登录界面：casLoginView.jsp
* 登录成功：casGenericSuccess.jsp
* 登出界面：casLogoutView.jsp

## 十一、结束语

花了一下午时间终于写完了，总共十项也算完美了。
现在看来起始利用CAS实现单点登录其实不难，不要畏惧，更不要排斥！
本教程后面的代码部分均来自[http://code.google.com/p/wsria](http://code.google.com/p/wsria)的项目分支[wsria-demo-sso](http://code.google.com/p/wsria/source/browse/#svn/branches/wsria-demo-sso)

### 和本教程相关资料下载

* 本教程使用的演示程序，点击[这里](http://code.google.com/p/wsria/downloads/detail?name=wsria-demo-sso-1.0.0.war&can=2&q=#makechanges)
* 使用keytool生成的key和证书，点击[这里](http://code.google.com/p/wsria/downloads/detail?name=wsria-demo-sso-keys.zip&can=2&q=#makechanges)

到此本教程全部结束，希望看完后对你有帮助，如果有帮助还望继续推荐给其他人，有说明意见或者问题请回复或者IM[联系我](http://www.kafeitu.me/about.html)。

## 十二、疑难问题

如果遇到了意料之外的问题请参考文章的评论部分，或许能找到问题的原因以及解决办法！

### javax.net.ssl.SSLHandshakeException: java.security.cert.CertificateException: No name matching casserver found

由于创建证书的域名和在应用中配置的cas服务域名不一致导致以下错误，详细请参考：
<script src="https://gist.github.com/1717087.js"> </script>

## 十三、更新记录_2011-11-05

整整一年之后因为需要为客户搭建CAS换季再次更新本文章，不知道碰巧呢碰巧呢还是碰巧呢，反正就是11.5号了……
在这里还要感谢大家对我的支持，要不然这篇教程也不会一直处于本博客的第一位……

不知道从哪个版本开始cas全面使用了maven构建项目，所以需要安装[apache maven](http://maven.apache.org/index.html)工具来构建源码，下面step by step讲解如何构建（面向没有接触过maven的童鞋）

* 下载Maven：**打开[http://maven.apache.org/download.html](http://maven.apache.org/download.html)后下载对应的包，windows用户请下载**Binary zip**格式的压缩包，linux或者unix用户请下载**Binary tar.gz**格式的压缩包

* **安装、配置Maven：**解压压缩包到一个目录，例如/home/kafeitu/tools/apache/apache-maven-3.0.3，然后设置系统环境变量**M3_HOME**=/home/kafeitu/tools/apache/apache-maven-3.0.3，在PAT变量中添加路径

	* windows用户：;%M3_HOME%/bin
	* Linux用户：在.bashrc或者/et/profile文件中找到PATH，添加:$M3_HOME/bin

* **验证安装：**重新打开一个命令窗口，

	* linux用户可以运行：<pre class="brush: shell">source .bashrc</pre>或者<pre class="brush: shell">source /etc/profile</pre>
	* windows用户重新打开cmd窗口

在cmd或者shell中进入解压的cas server目录后运行:**mvn -version**后如果看到打印系统信息和maven版本信息后证明配置ok

## 十四、更新记录_2011-11-18

你也可以申请免费的StartSSL CA证书:
StartSSL(公司名：StartCom)也是一家CA机构，它的根证书很久之前就被一些具有开源背景的浏览器支持(Firefox浏览器、谷歌Chrome浏览器、苹果Safari浏览器等)。
申请地址：[http://www.startssl.com](http://www.startssl.com)
申请方法参考：[http://www.linuxidc.com/Linux/2011-11/47478.htm](http://www.linuxidc.com/Linux/2011-11/47478.htm)
