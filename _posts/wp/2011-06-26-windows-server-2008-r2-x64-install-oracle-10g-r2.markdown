--- 
layout: post
title: "Windows Server 2008 R2 X64安装Oracle 10g R2后不能创建数据库问题解决办法"
wordpress_id: 1519
wordpress_url: http://www.wsria.com/?p=1519
date: 2011-06-26 12:12:46 +08:00
tags: 
 - oracle
---
<h3>一、背景交代</h3>
客户刚刚到的一台新服务器，型号为：IBM X3850，自带的操作系统为：Windows Server 2008 R2 X64；需要安装版本为10.2.0.4版本的Oracle数据库。
<h3>二、遇到问题</h3>
找到Oracle提供的安装光盘后安装数据库一路next，到了最后<strong>创建数据库</strong>的时候遇到了问题，进度停止不前，如下图：
<a href="http://www.kafeitu.me/files/2011/06/oracle-create-db.png"><img src="http://www.kafeitu.me/files/2011/06/oracle-create-db.png" alt="oracle创建数据库时等待状态--停滞不前" title="oracle创建数据库时等待状态--停滞不前" width="575" height="423" class="alignright size-full wp-image-1522" /></a><br/>
查看trace.log内容如下：
<!--more-->
<pre>
[main] [14:46:52:122] [CommandLineArguments.process:563]  CommandLineArguments->process: number of arguments = 32
[main] [14:46:52:122] [CommandLineArguments.process:738]  CommandLineArguments->process: Create Database argument is specified
[main] [14:46:52:122] [CommandLineArguments.process:910]  CommandLineArguments->process: template Name argument is specified
[main] [14:46:52:122] [CommandLineArguments.process:960]  CommandLineArguments->process: db name argument is specified
[main] [14:46:52:122] [CommandLineArguments.process:3074]  CommandLineArguments->process: in Operation Type is Creation/GenerateScripts Mode condition
[main] [14:46:52:137] [CommandLineArguments.process:3298]  CommandLineArguments->process: Successfully process command line arguments
[main] [14:46:52:855] [Host.checkOPS:2055]  Inside checkOPS
[main] [14:46:52:855] [Host.checkOPS:2067]  Trying to check cluster existence
[main] [14:46:52:902] [Library.getInstance:97]  Created instance of Library. 
[main] [14:46:52:902] [Library.load:197]  Loading orauts.dll...
[main] [14:46:52:902] [Library.load:203]  oracleHome D:\oracle\product\10.2.0\db_1
[main] [14:46:52:902] [sPlatform.isHybrid:63]  osName=Windows Vista osArch=amd64 rc=false
[main] [14:46:52:902] [Library.load:223]  Loading  library D:\oracle\product\10.2.0\db_1\bin\orauts.dll
[main] [14:46:52:902] [Library.load:247]  Loaded library D:\oracle\product\10.2.0\db_1\bin\orauts.dll from path=
D:\oracle\product\10.2.0\db_1\bin
[main] [14:46:52:902] [Library.load:197]  Loading MSVCRT.dll...
[main] [14:46:52:902] [Library.load:203]  oracleHome D:\oracle\product\10.2.0\db_1
[main] [14:46:52:902] [sPlatform.isHybrid:63]  osName=Windows Vista osArch=amd64 rc=false
[main] [14:46:52:902] [Library.load:223]  Loading  library D:\oracle\product\10.2.0\db_1\bin\MSVCRT.dll
[main] [14:46:52:902] [Library.load:247]  Loaded library D:\oracle\product\10.2.0\db_1\bin\MSVCRT.dll from path=
D:\oracle\product\10.2.0\db_1\bin
[main] [14:46:52:902] [Library.load:197]  Loading orawsec10.dll...
[main] [14:46:52:902] [Library.load:203]  oracleHome D:\oracle\product\10.2.0\db_1
[main] [14:46:52:902] [sPlatform.isHybrid:63]  osName=Windows Vista osArch=amd64 rc=false
[main] [14:46:52:902] [Library.load:223]  Loading  library D:\oracle\product\10.2.0\db_1\bin\orawsec10.dll
[main] [14:46:52:902] [Library.load:247]  Loaded library D:\oracle\product\10.2.0\db_1\bin\orawsec10.dll from path=
D:\oracle\product\10.2.0\db_1\bin
[main] [14:46:52:902] [Library.load:197]  Loading orasrvm10.dll...
[main] [14:46:52:902] [Library.load:203]  oracleHome D:\oracle\product\10.2.0\db_1
[main] [14:46:52:902] [sPlatform.isHybrid:63]  osName=Windows Vista osArch=amd64 rc=false
[main] [14:46:52:902] [Library.load:223]  Loading  library D:\oracle\product\10.2.0\db_1\bin\orasrvm10.dll
[main] [14:46:52:902] [Library.load:247]  Loaded library D:\oracle\product\10.2.0\db_1\bin\orasrvm10.dll from path=
D:\oracle\product\10.2.0\db_1\bin
[main] [14:46:52:902] [Version.isPre10i:189]  isPre10i.java: Returning FALSE
[main] [14:46:52:902] [WindowsSystem.regKeyExists:1006]  WindowsSystem.regKeyExists: mainkey= HKEY_LOCAL_MACHINE subkey = Software\Oracle\Ocr
[main] [14:46:53:104] [WindowsSystem.getCSSConfigType:1163]  configType=null
[main] [14:46:53:104] [Host.checkOPS:2073]  cluster existence:false
[main] [14:46:53:104] [Host.checkOPS:2111]  Cluster installed=false
[main] [14:46:53:260] [InitParamHandler.endElement:506]  CustomSGA flag: false
[main] [14:46:53:260] [InitParamHandler.endElement:507]  Database Type: MULTIPURPOSE
[main] [14:46:53:260] [InitParamHandler.endElement:508]  Mem Percentage: 40
[main] [14:46:53:260] [InitParamHandler.endElement:526]  distributing Memory: 13737443328
[main] [14:46:53:260] [MemoryCalculator.calculateMemory:122]  Setting SGA to MAX_SGA 1610612736
[main] [14:46:53:276] [StorageAttributes.setAttribute:232]  IN threadID:1 group#=1
[main] [14:46:53:276] [StorageAttributes.setAttribute:232]  IN threadID:1 group#=2
[main] [14:46:53:276] [StorageAttributes.setAttribute:241]  Current threadID=1
[main] [14:46:53:276] [StorageAttributes.setAttribute:248]  Current threadID=1 ==> redoGroups[0]=1
[main] [14:46:53:276] [StorageAttributes.setAttribute:258]  vRedoGroups:[1]
[main] [14:46:53:276] [StorageAttributes.setAttribute:288]  setAttribute: bExists=false
[main] [14:46:53:276] [StorageAttributes.setAttribute:232]  IN threadID:1 group#=3
[main] [14:46:53:276] [StorageAttributes.setAttribute:241]  Current threadID=1
[main] [14:46:53:276] [StorageAttributes.setAttribute:248]  Current threadID=1 ==> redoGroups[0]=1
[main] [14:46:53:276] [StorageAttributes.setAttribute:248]  Current threadID=1 ==> redoGroups[1]=2
[main] [14:46:53:276] [StorageAttributes.setAttribute:258]  vRedoGroups:[1, 2]
[main] [14:46:53:276] [StorageAttributes.setAttribute:288]  setAttribute: bExists=false
[main] [14:46:53:276] [TemplateManager.parseCloneTemplate:1477]  See for any transportable datafiles in TemplateManager.....
[main] [14:46:53:276] [TemplateManager.isInstallTemplate:2178]  Selected Template by user:=General Purpose
[main] [14:46:53:276] [TemplateManager.isInstallTemplate:2185]  The Message Id to be searched:=GENERAL_PURPOSE
[main] [14:46:53:276] [TemplateManager.parseCloneTemplate:1489]  create new clone data file for tp file.......
[main] [14:46:53:276] [Host.setupOIDCommandlineParameters:7184]  setupOIDCommandlineParameters: 
[main] [14:46:53:276] [Host.setupOIDCommandlineParameters:7185]  m_regWithdirService: false
[main] [14:46:53:276] [Host.setupOIDCommandlineParameters:7186]  m_unregWithdirService: false
[main] [14:46:53:276] [Host.setupOIDCommandlineParameters:7187]  m_updateDirService: false
[main] [14:46:53:276] [Verifier.processRawConfigFile:3523]  StorageType == 0
[main] [14:46:53:276] [Verifier.setOradataDest:4349]  setOradataDest:dfDest=D:\oracle\product\10.2.0\oradata
[main] [14:46:53:276] [TemplateManager.updateDatafileDestination:1957]  updateDatafiles:datafileDir=D:\oracle\product\10.2.0\oradata
[main] [14:46:53:276] [TemplateManager.updateDatafileDestination:2103]  From template, RedoLogGrName=1
[main] [14:46:53:307] [TemplateManager.updateDatafileDestination:2118]  new file name redo01.log
[main] [14:46:53:307] [TemplateManager.updateDatafileDestination:2103]  From template, RedoLogGrName=2
[main] [14:46:53:307] [TemplateManager.updateDatafileDestination:2118]  new file name redo02.log
[main] [14:46:53:307] [TemplateManager.updateDatafileDestination:2103]  From template, RedoLogGrName=3
[main] [14:46:53:307] [TemplateManager.updateDatafileDestination:2118]  new file name redo03.log
[main] [14:46:53:307] [ProgressOnlyHost.performOperation:162]  processRawConfigFile=false
[main] [14:46:53:307] [Verifier.validateTemplate:1629]  StorageType == 0
[main] [14:46:53:307] [ProgressOnlyHost.performOperation:178]  validateTemplate=true
[main] [14:46:53:307] [OracleHome.isRacEnabled:149]  bRacOn = false
[main] [14:46:53:323] [Verifier.validateTemplate:1629]  StorageType == 0
[main] [14:46:53:323] [Verifier.calculateCloneDatafilePathsAndSizes:2951]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:323] [Verifier.calculateCloneDatafilePathsAndSizes:2951]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:323] [Verifier.calculateCloneDatafilePathsAndSizes:2951]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:323] [Verifier.calculateCloneDatafilePathsAndSizes:2951]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:323] [Verifier.calculateCloneDatafilePathsAndSizes:2951]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:338] [Verifier.calculateRedoLogGroupFileSizes:3083]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:338] [Verifier.calculateRedoLogGroupFileSizes:3083]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:338] [Verifier.calculateRedoLogGroupFileSizes:3083]  canonicalPath=D:\oracle\product\10.2.0\
[main] [14:46:53:338] [Verifier.getControlfFileSizes:3001]  No. of Control files:=3
[main] [14:46:53:463] [Host.executeSteps:4044]  Executing steps....
[main] [14:46:53:463] [Host.setUpForOperation:2920]  setUpForOperation: Mode = 128
[main] [14:46:53:479] [Host.executeSteps:4186]  setupForOperation returned: true
[main] [14:46:53:479] [Host.createStepSQLInterface:5948]  sid =orcl
[main] [14:46:53:494] [SQLEngine.initialize:242]  Execing SQLPLUS/SVRMGR process...
[main] [14:46:53:494] [SQLEngine.initialize:270]  m_bReaderStarted: false
[main] [14:46:53:494] [SQLEngine.initialize:274]  Starting Reader Thread... 
[Thread-4] [14:46:53:713] [StepContext$ModeRunner.run:2478]  ---- Progress Needed:=true
[Thread-4] [14:46:53:822] [BasicStep.execute:202]  Executing Step : CLONE_DB_CREATION_RMAN_RESTORE
[Thread-4] [14:46:53:822] [StepErrorHandler.setFatalErrors:322]  setting Fatal Error: ORA-01092
[Thread-4] [14:46:53:822] [StepErrorHandler.setFatalErrors:322]  setting Fatal Error: ORA-01034
[Thread-4] [14:46:53:822] [StepErrorHandler.setFatalErrors:322]  setting Fatal Error: ORA-03114
[Thread-4] [14:46:53:822] [StepErrorHandler.setFatalErrors:322]  setting Fatal Error: ORA-12560
[Thread-4] [14:46:53:822] [StepErrorHandler.setIgnorableErrors:250]  setting Ignorable Error: ORA-01109
[Thread-4] [14:46:53:822] [BasicStep.configureSettings:304]  messageHandler being set=null
[Thread-4] [14:46:53:822] [BasicStep.execute:202]  Executing Step : INSTANCE_CREATION
[Thread-4] [14:46:53:822] [BasicStep.configureSettings:304]  messageHandler being set=null
[Thread-4] [14:46:53:838] [InitParamAttributes.sortParams:3532]  m_sortOn:-1 sortOn:4
[Thread-4] [14:46:53:884] [OracleHome.isRacEnabled:149]  bRacOn = false
[Thread-4] [14:46:53:884] [Host.noEntryinOratab:5115]  Check made for oratab arg passed............
[Thread-4] [14:46:53:884] [Oradim.getAddEntryCommand:353]  AddEntry=[D:\oracle\product\10.2.0\db_1\bin\oradim.exe, -new, -sid, ORCL, -startmode, manual, -spfile]
[Thread-4] [14:46:54:976] [Oradim.getEditEntryCommand:422]  getEditEntry cmd=[D:\oracle\product\10.2.0\db_1\bin\oradim.exe, -edit, -sid, ORCL, -startmode, auto, -srvcstart, system]
[Thread-4] [14:46:55:164] [Oradim.addSidToRegistry:871]  oracleHomeKey: SOFTWARE\ORACLE\KEY_OraDb10g_home1
[Thread-4] [14:46:55:226] [BasicStep.configureSettings:304]  messageHandler being set=oracle.sysman.assistants.util.UIMessageHandler@6f27f79d
[Thread-4] [14:46:55:226] [CloneRmanRestoreStep.executeImpl:217]  Instance Creation went fine..........
[Thread-4] [14:46:55:226] [CloneRmanRestoreStep.executeImpl:224]  db_recovery_file_dest=D:\oracle\product\10.2.0\flash_recovery_area
[Thread-4] [14:46:55:226] [CloneRmanRestoreStep.executeImpl:227]  db_recovery_file_dest_size=2147483648
[Thread-4] [14:46:56:115] [SQLEngine.setSpool:1750]  old Spool  = null
[Thread-4] [14:46:56:115] [SQLEngine.setSpool:1751]  Setting Spool  = D:\oracle\product\10.2.0\db_1\cfgtoollogs\dbca\orcl\CloneRmanRestore.log
[Thread-4] [14:46:56:115] [SQLEngine.setSpool:1752]  Is spool appendable? --> true
[Thread-4] [14:46:56:115] [CloneRmanRestoreStep.executeImpl:320]  starting with pfile=D:\oracle\product\10.2.0\admin\orcl\pfile\init.ora
</pre>
开始怀疑是操作系统的问题，然后我在vmware虚拟机上安装Windows Server 2008 R2 X64然后安装数据库顺利通过，之后让管理员安装企业版的系统，再安装orace问题还是存在。
<h3>三、解决办法</h3>
因为是正版的就打电话给oracle咨询，几经周折后得知需要安装补丁，编号：<strong>8202632</strong>，这个补丁需要的安装办法：
<ul>
	<li>安装数据库的时候不要选择“创建数据库”选项</li>
	<li>安装完成后安装补丁<strong>8202632</strong>，注意这个步骤在安装的时候选择安装数据库的时候home路径（例如C:\oracle\product\10.2.0\db_1）</li>
	<li>补丁安装完成之后再运行“Database Configuration Assistant”创建数据库。</li>
</ul>
<strong>补丁8202632下载地址：</strong><a href="ftp://updates.oracle.com/8202632/p8202632_10205_MSWIN-x86-64.zip" target="_blank">ftp://updates.oracle.com/8202632/p8202632_10205_MSWIN-x86-64.zip</a>
<h3>四、延伸问题及解决办法</h3>
如果遇到“<strong>EM不能启动</strong>”的问题请另外打补丁解决，编号：8350262<br/>
下载地址：<a href="http://download.csdn.net/source/3045207">http://download.csdn.net/source/3045207</a>

