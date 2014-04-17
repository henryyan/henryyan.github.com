---
layout: post
title: "在Activiti中集成JPA（解决动态表单生成的大量数据）"
category: activiti
tags: 
 - Activiti
---

## 1. 为何集成JPA

在《[比较Activiti中三种不同的表单及其应用](/activiti/2012/08/05/diff-activiti-workflow-forms.html)》一文中介绍了不同表单的特点以及表现形式，相信这是每个初学者都会面临表单类型的选择。

如果选择了使用**动态表单**那么将面临一个比较“严峻”的问题——大数据量，我们知道动态表单的内容都保存在一张表中（**ACT_HI_DETAIL**），我们也清楚动态表单中每一个Field都会在该表中插入一条记录，假如一个流程共有20个字段，这个数据量大家可以计算一下，每天多少个流程实例，每个月、每年多少？

日积月累的大数据会影响系统的性能，尤其涉及到关联查询时影响更深，除了性能之外动态表单还有一个弊端那就是数据是以**行**的形式存储没有任何**数据结构**可言，流程运行中生成的数据很难被用于分析、查询，如何破解嘞？

## 2. 如何集成JPA

Activiti除了核心的Engine之外对企业现有的技术、平台、架构都有所支持，对于业务实体的持久化当然也会有所支持，那就是EJB的标准之一）——JPA，引擎把JPA的API引入到了内部，使用JPA功能的时候只需要把**entityManagerFactory**配置到引擎配置对象（参考：[谈谈Activiti的引擎与引擎配置对象](/activiti/2013/04/19/about-process-egine-and-configuration.html)）即可。

参考用户手册的JPA章节，介绍了引擎配置对象中的几个jpa有关的属性，如下：

* jpaPersistenceUnitName: 使用持久化单元的名称（要确保该持久化单元在类路径下是可用的）。根据该规范，默认的路径是/META-INF/persistence.xml)。要么使用 jpaEntityManagerFactory 或者jpaPersistenceUnitName。
* jpaEntityManagerFactory: 一个实现了javax.persistence.EntityManagerFactory的bean的引用。它将被用来加载实体并且刷新更新。要么使用jpaEntityManagerFactory 或者jpaPersistenceUnitName。
* jpaHandleTransaction: 在被使用的EntityManager 实例上，该标记表示流程引擎是否需要开始和提交/回滚事物。当使用Java事物API（JTA）时，设置为false。
* jpaCloseEntityManager: 该标记表示流程引擎是否应该关闭从 EntityManagerFactory获取的 EntityManager的实例。当EntityManager 是由容器管理的时候需要设置为false（例如 当使用并不是单一事物作用域的扩展持久化上下文的时候）。

### 2.1 配置持久化单元或者EntityManagerFactory

要在引擎中使用JPA需要提供EntityManagerFactory或者提供持久化单元名称（引擎会自动查找最终获取到EntityManagerFactory对象），在使用的时候可以根据自己的实际情况进行选择，在**kft-activiti-demo**中使用了**jpaEntityManagerFactory**属性注入EntityManagerFactory对象的方式。

### 2.2 Standalone模式的JPA配置

<pre class="brush:xml">
	<property name="jpaPersistenceUnitName" value="kft-jpa-pu" />
	<property name="jpaHandleTransaction" value="true"></property>
    <property name="jpaCloseEntityManager" value="true"></property>
</pre>

### 2.3 Spring（托管）模式的JPA配置

<pre class="brush:xml">
	<property name="jpaEntityManagerFactory" ref="entityManagerFactory" />
	<property name="jpaHandleTransaction" value="false"></property>
    <property name="jpaCloseEntityManager" value="false"></property>
</pre>

## 3. 实例分析

在最新版本（1.10）的**kft-activiti-demo**中添加了JPA演示，大家可以从[Github](https://github.com/henryyan/kft-activiti-demo)上下载源码查看源码。

![请假流程-JPA版本](/files/2014/04/leave-jpa.jpg)

### 3.1 相关说明

* 流程定义文件：**leave-jpa.bpmn**
* 实体文件：**me.kafeitu.demo.activiti.entity.oa.LeaveJpaEntity**
* 实体管理器：**me.kafeitu.demo.activiti.service.oa.leave.LeaveEntityManager**

### 3.2 创建实体

在流程定义文件中定义了一个流程的**start**类型监听器：

<pre class="brush:xml">
<extensionElements>
  <activiti:executionListener event="start" expression="${execution.setVariable('leave', leaveEntityManager.newLeave(execution))}"></activiti:executionListener>
</extensionElements>
</pre>

这个监听器的触发的时候会执行一个表达式，调用名称为**leaveEntityManager**的Spring Bean对象的**newLeave**方法，并且把引擎的**Execution**对象传递过去，得到一个LeaveJpaEntity对象后设置到引擎的变量中（名称为**leave**）。

下面是LeaveEntityManager.java的代码：

<pre class="brush:java">
@Entity(name = "LEAVE_JPA")
public class LeaveJpaEntity implements Serializable {

    private Long id;
    private String processInstanceId;
    private String userId;
    private Date startTime;
    private Date endTime;
    private Date realityStartTime;
    private Date realityEndTime;
    private Date reportBackDate;
    private Date applyTime;
    private String leaveType;
    private String reason;

    /**
     * 部门领导是否同意
     */
    private String deptLeaderApproved;

    /**
     * HR是否同意
     */
    private String hrApproved;
    
    ...
}
</pre>

<pre class="brush:java">
@Service
public class LeaveEntityManager {

    @PersistenceContext
    private EntityManager entityManager;
    
    /* 把流程变量的值赋值给JPA实体对象并保存到数据库 */
    @Transactional
    public LeaveJpaEntity newLeave(DelegateExecution execution) {
        LeaveJpaEntity leave = new LeaveJpaEntity();
        leave.setProcessInstanceId(execution.getProcessInstanceId());
        leave.setUserId(execution.getVariable("applyUserId").toString());
        leave.setStartTime((Date) execution.getVariable("startTime"));
        leave.setEndTime((Date) execution.getVariable("endTime"));
        leave.setLeaveType(execution.getVariable("leaveType").toString());
        leave.setReason(execution.getVariable("reason").toString());
        leave.setApplyTime(new Date());
        entityManager.persist(leave);
        return leave;
    }

    public LeaveJpaEntity getLeave(Long id) {
        return entityManager.find(LeaveJpaEntity.class, id);
    }

}
</pre>

当启动流程后查看表**LEAVE_JPA**中的数据与表单填写的一致。

### 3.3 在流程中更改实体的值

当**部门领导**或者**人事审批**节点完成时需要把审批结果更新到LeaveJpaEntity属性中（即更新表LEAVE_JPA），所以在这两个任务上添加一个**complete**类型的监听器，如下所示：

<pre class="brush:xml">
<userTask id="deptLeaderAudit" name="部门领导审批" activiti:candidateGroups="deptLeader">
	<extensionElements>
		<activiti:taskListener event="complete" expression="${leave.setDeptLeaderApproved(deptLeaderApproved)}"></activiti:taskListener>
	</extensionElements>
</userTask>

<userTask id="hrAudit" name="人事审批" activiti:candidateGroups="hr">
	<extensionElements>
		<activiti:taskListener event="complete" expression="${leave.setHrApproved(hrApproved)}"></activiti:taskListener>
	</extensionElements>
</userTask>
</pre>

### 3.4 流程结束后删除表单数据

熟悉Activiti表的应该知道表单数据会保存在表**ACT_HI_DETAIL**中，特性是字段**TYPE_**字段的值为**FormProperty**，我们只要根据流程实例ID过滤删除记录就可以清理掉已经结束流程的表单数据。

在最新版本的Demo中（1.10版本）添加了一个类用来执行SQL：

<pre class="brush:java">
@Component
public class ActivitiDao {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * 流程完成后清理detail表中的表单类型数据
     * @param processInstanceId
     * @return
     */
    public int deleteFormPropertyByProcessInstanceId(String processInstanceId) {
        int i = entityManager.createNativeQuery("delete from act_hi_detail where proc_inst_id_ = ? and type_ = 'FormProperty' ")
                .setParameter(1, processInstanceId).executeUpdate();
        return i;
    }

}
</pre>

流程中定义了一个流程级别的结束监听器**me.kafeitu.demo.activiti.service.oa.leave.LeaveProcessEndListener**

<pre class="brush:java">
@Service
@Transactional
public class LeaveProcessEndListener implements ExecutionListener {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    ActivitiDao activitiDao;

    @Override
    public void notify(DelegateExecution execution) throws Exception {
        String processInstanceId = execution.getProcessInstanceId();

        int i = activitiDao.deleteFormPropertyByProcessInstanceId(processInstanceId);
        logger.debug("清理了 {} 条历史表单数据", i);
    }
}
</pre>

### 3.5 已知问题（未解决）

![由于引擎的Bug导致数据不能完整删除](/files/2014/04/jpa-delete-detail-problem.jpg)

图中的三条数据因为是在销假任务完成后设置的，不知道是不是引擎的Bug导致插入这三个表单属性比调用流程结束监听器还晚（从引擎的日志中可以分析出来）导致这三条记录不能被删除，因为在删除的时候这三条数据还没有插入到数据库。

 这个问题后面会继续跟踪，解决了会在这里更新！！！