---
layout: post
title: "一个基于Maven的配置文件管理成功案例"
category: solution 
tags: 
 - 配置文件
 - 管理方式
 - Maven
 - portable-config-maven-plugin
 - Juven
 - 成功案例
---

## 引言

配置文件几乎是每个项目中不可或缺的文件类型之一，常用的配置文件类型有xml、properties等，配置文件的好处不言而喻，利用配置文件可以灵活地设置软件的运行参数，并且可以在更改配置文件后在不重启应用的情况下即时生效。

写这篇文章的原因是最近在一个项目中引入了我对配置文件的管理方式，我觉得有必要与大家分享，希望能抛砖引玉。

## 1. 我所知道的配置文件管理方式

下面大概列出了几类对配置文件的管理方式，请对号入座^_^

### 1.1 配置文件是什么？

除非应用不需要配置文件（例如Hello World）,否则请无视，continue;

### 1.2 数据库方式

把配置文件保存在数据库，看起来这种方式很不错，配置不会丢失方便管理，其实问题很大；举个简单的例子，在A模块需要调用B模块的服务，访问B模块的URL配置在数据库，首先需要在A中读取B模块的URL，然后再发送请求，问题紧随而来，如果这个功能只有一个开发人员负责还好，假如多个人都要调试那就麻烦了，因为配置保存在数据库（整个Team使用同一个数据库测试），每个开发人员的B模块的访问端口（Web容器的端口）又不相同或者应用的ContextPath不同，要想顺利调试就要更改数据库的B模块URL值，这样多个开发人员就发生了冲突；问题很严重！

### 1.3 XML方式

对于使用SSH或者其他的框架、插件的应用在src/main/resources下面肯定有不少的xml配置文件，今天的主题是应用级的配置管理，所以暂且抛开框架必须的XML配置文件，先来看看下面的XML配置文件内容。

<pre class="brush:xml">
<?xml version="1.0" encoding="UTF-8"?>
<SystemConfig>
	<param code="SysName" name="系统名称" type="String" value="XXX后台系统"/>
	<param code="SysVersion" name="系统版本" type="String" value="1.0"/>
</SystemConfig>
</pre>

这种方式在之前很受欢迎，也是系统属性的主要配置方式，不过使用起来总归不太简洁、灵活（不要和我争论XML与Properties）。

### 1.4 属性文件方式

下面是kft-activiti-demo中**application.properties**文件的一部分:
<pre class="brush:bash">
sql.type=h2

jdbc.driver=org.h2.Driver
jdbc.url=jdbc:h2:file:~/kft-activiti-demo;AUTO_SERVER=TRUE
jdbc.username=sa
jdbc.password=

system.version=${project.version}
activiti.version=${activiti.version}

export.diagram.path=${export.diagram.path}
diagram.http.url=${diagram.http.url}
</pre>

相比而言属性文件方式比XML方式要简洁一些，不用严格的XML标签包装即可设置属性的名称，对于多级配置可以用点号（.）分割的方式。

## 2. 分析我的管理方式

我在几个项目中所采用的是第4中方式，也就是**属性文件**的方式来管理应用的配置，读取属性文件可以利用Java的Properties对象，或者借助Spring的[properties](http://stackoverflow.com/questions/7219097/spring-utilproperties-injection-via-annotations-into-a-bean)模块。

### 2.1 利用Maven资源过滤设置属性值

简单来说就是利用Maven的Resource Filter功能，pom.xml中的build配置如下：
<pre class="brush:xml">
<build>
	<resources>
		<resource>
			<directory>src/main/resources</directory>
			<filtering>true</filtering>
		</resource>
	</resources>
</build>
</pre>

这样在编译时**src/main/resources**目录下面中文件（）只要有**${foo}**占位符就可以自动替换成实际的值了，例如1.4节中属性**system.version**使用的是一个占位符而非实际的值，${project.version}表示pom.xml文件中的**project**标签的**version**。

属性**export.diagram.path**、**diagram.http.url**也是使用了占位符的方式，很明显这两个属性的值不是pom.xml文件可以提供，所以如果要动态设置值可以通过在pom.xml中添加<properties>的方式，或者把<properties>放在profile中，如此可以根据不同的环境（开发、UAT、生产）动态设置不同的值。

----

当然也可以在编译时通过给JVM传递参数的方式，例如：

> mvm clean compile -Dexport.diagram.path=/var/kft/diagrams

编译完成后查看target/classes/application.properties文件的内容，属性**export.diagram.path**的值被正确替换了：

> export.diagram.path=/var/kft/diagrams

### 2.2 读取配置文件

读取配置文件可以直接里面Java的Properties读取，下面的代码简单实现了读取属性集合：
<pre class="brush:java">
Properties props = new Properties();
ResourceLoader resourceLoader = new DefaultResourceLoader();
Resource resource = resourceLoader.getResource(location);
InputStream is = resource.getInputStream();
propertiesPersister.load(props, new InputStreamReader(is, "UTF-8"));
</pre>

如果在把读取的属性集合保存在一个静态Map对象中就可以在任何可以执行Java代码的地方获取应用的属性了，工具类PropertiesFileUtil简单实现了属性缓存功能：

<pre class="brush:java">
public class PropertyFileUtil {
	private static Properties properties;
	public void loadProperties(String location) {
		ResourceLoader resourceLoader = new DefaultResourceLoader();
		Resource resource = resourceLoader.getResource(location);
		InputStream is = resource.getInputStream();
		PropertiesPersister propertiesPersister = new DefaultPropertiesPersister();
		propertiesPersister.load(properties, new InputStreamReader(is, "UTF-8"));
	}

	// 获取属性值
	public static String get(String key) {
        String propertyValue = properties.getProperty(key);
        return propertyValue;
    }
}
</pre>

先*抛出*一个问题：属性文件中定义了属性的值和平台有关，团队中的成员使用的平台有Window、Linux、Mac，对于这样的情况目前只能修改**application.properties**文件，但是不能把更改提交到SCM上否则会影响其他人的使用……目前没有好办法，稍后给出解决办法。

### 2.2 多配置文件重载功能

2.1节中简单的PropertyFileUtil工具只能做到读取一个配置文件，这对于一些多余一个子系统来说就不太能满足需求了。

对于一个项目拆分的多个子系统来说如果每个子系统都配置一套属性集合最后就会出现一个问题——配置重复，修改起来也会比较麻烦；解决的办法很简单——把公共的属性抽取出来单独保存在一个公共的属性文件中，我喜欢命名为：**application.common.properties**。

这个公共的属性文件可以用来保存一些数据库连接、公共目录、子模块的URL等信息，如此一来子系统中的**application.properties**中只需要设置当前子系统需要的属性即可，在读取属性文件时可以依次读取多个（**先**读取application.common.properties，**再**读取application.properties），这样最终获取的属性集合就是两个文件的并集。

在刚刚的PropertyFileUtil类中添加一个**loadProperties**方法，接收的参数是一个可变数组，循环读取属性文件。

<pre class="brush:java">
/**
 * 载入多个properties文件, 相同的属性在最后载入的文件中的值将会覆盖之前的载入.
 * 文件路径使用Spring Resource格式, 文件编码使用UTF-8.
 *
 * @see org.springframework.beans.factory.config.PropertyPlaceholderConfigurer
 */
public static Properties loadProperties(String... resourcesPaths) throws IOException {
    Properties props = new Properties();
    for (String location : resourcesPaths) {
        Resource resource = resourceLoader.getResource(location);
        InputStream is = resource.getInputStream();
        propertiesPersister.load(props, new InputStreamReader(is, DEFAULT_ENCODING));
    }
    return props;
}
</pre>

有了这个方法我们可以这样调用这个工具类：
> PropertyFileUtil.loadProperties("application.common.properties", "application.properties");

在**2.1**中抛出的问题也迎刃而解了，把配置文件再根据类型划分：

* application.common.properties  公共属性 
* application.properties 各个子系统的属性
* application.**local**.properties 本地属性（用于开发时）

> 请注意：不要把application.local.properties纳入到版本控制（SCM）中，这个文件只能在本地开发环境出现！！！

最后读取的顺序应该这样写：

> PropertyFileUtil.loadProperties("application.common.properties", "application.properties", "application.local.properties");

### 2.3 根据环境不同选择不同的配置文件

**2.2**的多文件重载解决了**2.1**中的问题，但是现在又遇到一个新问题：如何根据不同的环境读取不同的属性文件。

* **开发时**最后读取**application.local.properties**
* **测试时**最后读取**application.test.properties**
* **生产环境**最后读取**/etc/foo/application.properties**

这么做的目的在于每一个环境的配置都不相同，第一步读取公共配置，第二步读取子系统的属性，最后读取不同环境使用的特殊配置，这样才能做到最完美、最灵活。

既然属性的值可以通过国占位符的方式替换，我们也可以顺藤摸瓜把读取文件的顺序也管理起来，所以又引入了一个属性文件：**application-file.properties**；它的配置如下：

<pre class="brush:bash">
A=application.common.properties
B=application.properties
C=${env.prop.application.file}
</pre>

占位符**env.prop.application.file**的值可以动态指定，可以利用Maven的Profile功能实现，例如针对开发环境配置一个ID为**dev**的profile并设置默认激活状态；对于部署到测试、生产环境可以在打包时添加-Ptest或者-Pproduct参数使用不同的Profile；关键在于每一个profile中配置的env.prop.application.file值不同，例如：

<pre class="brush:xml">
<profile>
	<id>dev</id>
	<properties>
	    <dev.mode>true</dev.mode>
	    <env.spring.application.file>
	    	classpath*:/application.local.properties
	    </env.spring.application.file>
	</properties>
</profile>

<profile>
	<id>product</id>
	<properties>
	    <dev.mode>true</dev.mode>
	    <env.spring.application.file>
	    	file:/etc/foo/application.properties
	    </env.spring.application.file>
	</properties>
</profile>

<activeProfiles>
    <activeProfile>dev</activeProfile>
</activeProfiles>
</pre>

而对于生产环境来说可以把**env.spring.application.file**改为**/etc/foo/application.properties**。

----
<pre class="brush:java">
<xmp>
public class PropertyFileUtil {

    private static Logger logger = LoggerFactory.getLogger(PropertyFileUtil.class);

    private static Properties properties;

    private static PropertiesPersister propertiesPersister = new DefaultPropertiesPersister();
    private static ResourceLoader resourceLoader = new DefaultResourceLoader();
    private static final String DEFAULT_ENCODING = "UTF-8";

    /**
     * 初始化读取配置文件，读取的文件列表位于classpath下面的application-files.properties<br/>
     *
     * 多个配置文件会用最后面的覆盖相同属性值
     *
     * @throws IOException	读取属性文件时
     */
    public static void init() throws IOException {
        String fileNames = "application-files.properties";
        innerInit(fileNames);
    }

    /**
     * 初始化读取配置文件，读取的文件列表位于classpath下面的application-[type]-files.properties<br/>
     *
     * 多个配置文件会用最后面的覆盖相同属性值
     *
     * @param type 配置文件类型，application-[type]-files.properties
     *
     * @throws IOException	读取属性文件时
     */
    public static void init(String type) throws IOException {
        String fileNames = "application-" + type + "-files.properties";
        innerInit(fileNames);
    }

    /**
     * 内部处理
     * @param fileNames
     * @throws IOException
     */
    private static void innerInit(String fileNames) throws IOException {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        InputStream resourceAsStream = loader.getResourceAsStream(fileNames);

        // 默认的Properties实现使用HashMap算法，为了保持原有顺序使用有序Map
        Properties files = new LinkedProperties();
        files.load(resourceAsStream);

        Set<Object> fileKeySet = files.keySet();
        String[] propFiles = new String[fileKeySet.size()];
        List<Object> fileList = new ArrayList<Object>();

        fileList.addAll(files.keySet());
        for (int i = 0; i < propFiles.length; i++) {
            String fileKey = fileList.get(i).toString();
            propFiles[i] = files.getProperty(fileKey);
        }

        logger.debug("读取属性文件：{}", ArrayUtils.toString(propFiles));;
        properties = loadProperties(propFiles);
        Set<Object> keySet = properties.keySet();
        for (Object key : keySet) {
            logger.debug("property: {}, value: {}", key, properties.getProperty(key.toString()));
        }
    }
</xmp>
</pre>

> 默认的Properties类使用的是Hash算法故无序，为了保持多个配置文件的读取顺序与约定的一致
> 所以需要一个自定义的有序Properties实现，参加：[LinkedProperties.java](https://github.com/henryyan/kft-activiti-demo/blob/master/src/main/java/me/kafeitu/demo/activiti/util/LinkedProperties.java#)

### 2.4 启动载入与动态重载

为了能让其他类读取到属性需要有一个地方统一管理属性的读取、重载，我们可以创建一个Servlet来处理这件事情，在Servlet的**init()**方法中读取属性（调用PropertiesFileUtil.init()方法），可以根据请求参数的**action**值的不同做出不同的处理。

我们把这个Servlet命名为**PropertiesServlet**，映射路径为：/properties-servlet。

<pre class="brush:java">
import java.io.IOException;
import java.util.Set;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import me.kafeitu.demo.activiti.util.PropertyFileUtil;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * classpath下面的属性配置文件读取初始化类
 */
public class PropertiesServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		try {
			PropertyFileUtil.init();
            ServletContext servletContext = config.getServletContext();
            setParameterToServerContext(servletContext);;
			logger.info("++++ 初始化[classpath下面的属性配置文件]完成 ++++");
		} catch (IOException e) {
			logger.error("初始化classpath下的属性文件失败", e);
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String action = StringUtils.defaultString(req.getParameter("action"));
		resp.setContentType("text/plain;charset=UTF-8");
		if ("reload".equals(action)) { // 重载
			try {
				PropertyFileUtil.init();
                setParameterToServerContext(req.getSession().getServletContext());
				logger.info("++++ 重新初始化[classpath下面的属性配置文件]完成 ++++，{IP={}}", req.getRemoteAddr());
				resp.getWriter().print("<b>属性文件重载成功！</b><br/>");
				writeProperties(resp);
			} catch (IOException e) {
				logger.error("重新初始化classpath下的属性文件失败", e);
			}
		} else if ("getprop".equals(action)) { // 获取属性
			String key = StringUtils.defaultString(req.getParameter("key"));
			resp.getWriter().print(key + "=" + PropertyFileUtil.get(key));
		} else if ("list".equals(action)) { // 获取属性列表
			writeProperties(resp);
		}
	}

    private void setParameterToServerContext(ServletContext servletContext) {
        servletContext.setAttribute("prop", PropertyFileUtil.getKeyValueMap());
    }

}
</pre>

Servlet发布之后就可以动态管理配置了，例如发布到生产环境后如果有配置需要更改（编辑服务器上保存的配置文件）可以访问下面的路径重载配置：
> http://yourhost.com/appname/properties-servlet?action=reload

### 2.5 让人凌乱的占位符配置

下面的log4j代码来自实际项目，看一看${…}的数量，有点小恐怖了，对于大型项目配置文件会更多，占位符也会更多。

<script src="https://gist.github.com/henryyan/5893935.js"></script>

## 3. 配置文件辅助Maven插件--portable-config-maven-plugin

[portable-config-maven-plugin](https://github.com/juven/portable-config-maven-plugin)是《Maven实战》作者[Juven Xu](http://www.juvenxu.com/)刚刚发布的一款插件，这个插件的用途就是在打包时根据不同环境替换原有配置，这个插件独特的地方在于不用使用占位符预先定义在配置文件中，而是直接替换的方式覆盖原有配置。

该插件支持替换properties、xml格式的配置文件，使用方法也很简单，在pom.xml中添加插件的定义：
<pre class="brush:xml;highlight:13">
<plugin>
   <groupId>com.juvenxu.portable-config-maven-plugin</groupId>
   <artifactId>portable-config-maven-plugin</artifactId>
   <version>1.0.1</version>
     <executions>
       <execution>
         <goals>
           <goal>replace-package</goal>
         </goals>
       </execution>
     </executions>
     <configuration>
       <portableConfig>src/main/portable/test.xml</portableConfig>
     </configuration>
</plugin>
</pre>

**src/main/portable/test.xml**文件的内容就是需要替换的属性集合，下面列出了properties和xml的不同配置，xml替换使用XPATH规则。
<pre class="brush:xml">
<?xml version="1.0" encoding="utf-8" ?>
<portable-config>
  <config-file path="WEB-INF/classes/db.properties">
    <replace key="database.jdbc.username">test</replace>
    <replace key="database.jdbc.password">test_pwd</replace>
  </config-file>
</portable-config>
</pre>
<pre class="brush:xml">
<?xml version="1.0" encoding="utf-8" ?>
<portable-config>
  <config-file path="WEB-INF/web.xml">
    <replace xpath="/web-app/display-name">awesome app</replace>
  </config-file>
</portable-config>
</pre>

当然你可以定义几个不同环境的profile来决定使用哪个替换规则，在打包（mvn package）时该插件会被激活执行替换动作。

有了这款插件对于一些默认的属性可以不使用占位符定义，取而代之的是实际的配置，所以对现有的配置无任何影响，又可以灵活的更改配置。
























