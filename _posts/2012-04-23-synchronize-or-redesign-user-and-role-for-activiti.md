---
layout: post
title: "同步或者重构Activiti Identify用户数据的多种方案比较"
category: activiti
tags: 
 - activiti
 - workflow
 - identify
 - 同步
---

相信每个涉及到用户的系统都有一套用户权限管理平台或者模块，用来维护用户以及在系统内的功能、数据权限，我们使用的Activiti工作流引擎配套设计了包括**User、Group**的Identify模块，怎么和业务数据同步呢，这个问题是每个新人必问的问题之一，下面介绍几种同步方案，最后总结比较。

## 方案一：调用IdentifyService接口完成同步

参考IdentifyService接口Javadoc：[http://www.activiti.org/javadocs/org/activiti/engine/IdentityService.html](http://www.activiti.org/javadocs/org/activiti/engine/IdentityService.html)

### 接口定义：
<pre class="brush: java">
package com.foo.arch.service.id;
import java.util.List;

import com.foo.arch.entity.id.User;
import com.foo.arch.service.ServiceException;

/**
 * 维护用户、角色、权限接口
 * 
 * @author HenryYan
 *
 */
public interface AccountService {

	/**
	 * 添加用户并[同步其他数据库]
	 * <ul>
	 * <li>step 1: 保存系统用户，同时设置和部门的关系</li>
	 * <li>step 2: 同步用户信息到activiti的identity.User，同时设置角色</li>
	 * </ul>
	 * 
	 * @param user				用户对象
	 * @param orgId				部门ID
	 * @param roleIds			角色ID集合
	 * @param synToActiviti		是否同步到Activiti数据库，通过配置文件方式设置，使用属性：account.user.add.syntoactiviti
	 * @throws OrganizationNotFoundException	关联用户和部门的时候从数据库查询不到哦啊部门对象
	 * @throws	Exception						其他未知异常
	 */
	public void save(User user, Long orgId, List<Long> roleIds, boolean synToActiviti)
			throws  OrganizationNotFoundException, ServiceException, Exception;
	
	/**
	 * 删除用户
	 * @param userId		用户ID
	 * @param synToActiviti		是否同步到Activiti数据库，通过配置文件方式设置，使用属性：account.user.add.syntoactiviti
	 * @throws Exception
	 */
	public void delete(Long userId, boolean synToActiviti) throws ServiceException, Exception;

	/**
	 * 同步用户、角色数据到工作流
	 * @throws Exception
	 */
	public void synAllUserAndRoleToActiviti() throws Exception;

	/**
	 * 删除工作流引擎Activiti的用户、角色以及关系
	 * @throws Exception
	 */
	public void deleteAllActivitiIdentifyData() throws Exception;
}
</pre>

#### 同步单个接口实现片段：
<pre class="brush: java">
@Service
@Transactional
public class AccountServiceImpl implements AccountService {	
	/**
	 * 保存用户信息，并且同步用户信息到activiti的identity.User和identify.Group
	 * @param user				用户对象{@link User}
	 * @param roleIds			用户拥有的角色ID集合
	 * @param synToActiviti		是否同步数据到Activiti
	 * @see Role
	 */
	public void saveUser(User user, List<Long> roleIds, boolean synToActiviti) {
		String userId = ObjectUtils.toString(user.getId());

		// 保存系统用户
		accountManager.saveEntity(user);

		// 同步数据到Activiti Identify模块
		if (synToActiviti) {
			UserQuery userQuery = identityService.createUserQuery();
			List<org.activiti.engine.identity.User> activitiUsers = userQuery.userId(userId).list();

			if (activitiUsers.size() == 1) {
				updateActivitiData(user, roleIds, activitiUsers.get(0));
			} else if (activitiUsers.size() > 1) {
				String errorMsg = "发现重复用户：id=" + userId;
				logger.error(errorMsg);
				throw new RuntimeException(errorMsg);
			} else {
				newActivitiUser(user, roleIds);
			}
		}

	}

	/**
	 * 添加工作流用户以及角色
	 * @param user		用户对象{@link User}
	 * @param roleIds	用户拥有的角色ID集合
	 */
	private void newActivitiUser(User user, List<Long> roleIds) {
		String userId = user.getId().toString();

		// 添加用户
		saveActivitiUser(user);

		// 添加membership
		addMembershipToIdentify(roleIds, userId);
	}

	/**
	 * 添加一个用户到Activiti {@link org.activiti.engine.identity.User}
	 * @param user	用户对象, {@link User}
	 */
	private void saveActivitiUser(User user) {
		String userId = user.getId().toString();
		org.activiti.engine.identity.User activitiUser = identityService.newUser(userId);
		cloneAndSaveActivitiUser(user, activitiUser);
		logger.debug("add activiti user: {}", ToStringBuilder.reflectionToString(activitiUser));
	}

	/**
	 * 添加Activiti Identify的用户于组关系
	 * @param roleIds	角色ID集合
	 * @param userId	用户ID
	 */
	private void addMembershipToIdentify(List<Long> roleIds, String userId) {
		for (Long roleId : roleIds) {
			Role role = roleManager.getEntity(roleId);
			logger.debug("add role to activit: {}", role);
			identityService.createMembership(userId, role.getEnName());
		}
	}

	/**
	 * 更新工作流用户以及角色
	 * @param user			用户对象{@link User}
	 * @param roleIds		用户拥有的角色ID集合
	 * @param activitiUser	Activiti引擎的用户对象，{@link org.activiti.engine.identity.User}
	 */
	private void updateActivitiData(User user, List<Long> roleIds, org.activiti.engine.identity.User activitiUser) {

		String userId = user.getId().toString();

		// 更新用户主体信息
		cloneAndSaveActivitiUser(user, activitiUser);

		// 删除用户的membership
		List<Group> activitiGroups = identityService.createGroupQuery().groupMember(userId).list();
		for (Group group : activitiGroups) {
			logger.debug("delete group from activit: {}", ToStringBuilder.reflectionToString(group));
			identityService.deleteMembership(userId, group.getId());
		}

		// 添加membership
		addMembershipToIdentify(roleIds, userId);
	}

	/**
	 * 使用系统用户对象属性设置到Activiti User对象中
	 * @param user			系统用户对象
	 * @param activitiUser	Activiti User
	 */
	private void cloneAndSaveActivitiUser(User user, org.activiti.engine.identity.User activitiUser) {
		activitiUser.setFirstName(user.getName());
		activitiUser.setLastName(StringUtils.EMPTY);
		activitiUser.setPassword(StringUtils.EMPTY);
		activitiUser.setEmail(user.getEmail());
		identityService.saveUser(activitiUser);
	}

	@Override
	public void delete(Long userId, boolean synToActiviti, boolean synToChecking) throws ServiceException, Exception {
		// 查询需要删除的用户对象
		User user = accountManager.getEntity(userId);
		if (user == null) {
			throw new ServiceException("删除用户时，找不到ID为" + userId + "的用户");
		}

		/**
		 * 同步删除Activiti User Group
		 */
		if (synToActiviti) {
			// 同步删除Activiti User
			List<Role> roleList = user.getRoleList();
			for (Role role : roleList) {
				identityService.deleteMembership(userId.toString(), role.getEnName());
			}

			// 同步删除Activiti User
			identityService.deleteUser(userId.toString());
		}

		// 删除本系统用户
		accountManager.deleteUser(userId);

		// 删除考勤机用户
		if (synToChecking) {
			checkingAccountManager.deleteEntity(userId);
		}
	}
}
</pre>

#### 同步全部数据接口实现片段：

同步全部数据步骤：

* 删除Activiti的User、Group、Membership数据

* 复制Role对象数据到Group

* 复制用户数据以及Membership数据

##### ActivitiIdentifyCommonDao.java
<pre class="brush: java">
public class ActivitiIdentifyCommonDao {

	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	/**
	 * 删除用户和组的关系
	 */
	public void deleteAllUser() {
		String sql = "delete from ACT_ID_USER";
		jdbcTemplate.execute(sql);
		logger.debug("deleted from activiti user.");
	}

	/**
	 * 删除用户和组的关系
	 */
	public void deleteAllRole() {
		String sql = "delete from ACT_ID_GROUP";
		jdbcTemplate.execute(sql);
		logger.debug("deleted from activiti group.");
	}

	/**
	 * 删除用户和组的关系
	 */
	public void deleteAllMemerShip() {
		String sql = "delete from ACT_ID_MEMBERSHIP";
		jdbcTemplate.execute(sql);
		logger.debug("deleted from activiti membership.");
	}

}
</pre>

##### ActivitiIdentifyService.java
<pre class="brush: java">
public class ActivitiIdentifyService extends AbstractBaseService {
	
	@Autowired
	protected ActivitiIdentifyCommonDao activitiIdentifyCommonDao;
	
	/**
	 * 删除用户和组的关系
	 */
	public void deleteAllUser() {
		activitiIdentifyCommonDao.deleteAllUser();
	}
	
	/**
	 * 删除用户和组的关系
	 */
	public void deleteAllRole() {
		activitiIdentifyCommonDao.deleteAllRole();
	}
	
	/**
	 * 删除用户和组的关系
	 */
	public void deleteAllMemerShip() {
		activitiIdentifyCommonDao.deleteAllMemerShip();
	}
}
</pre>

##### AccountServiceImpl.java
<pre class="brush: java">
public class AccountServiceImpl implements AccountService {
@Override
	public void synAllUserAndRoleToActiviti() throws Exception {

		// 清空工作流用户、角色以及关系
		deleteAllActivitiIdentifyData();

		// 复制角色数据
		synRoleToActiviti();

		// 复制用户以及关系数据
		synUserWithRoleToActiviti();
	}

	/**
	 * 复制用户以及关系数据
	 */
	private void synUserWithRoleToActiviti() {
		List<User> allUser = accountManager.getAll();
		for (User user : allUser) {
			String userId = user.getId().toString();

			// 添加一个用户到Activiti
			saveActivitiUser(user);

			// 角色和用户的关系
			List<Role> roleList = user.getRoleList();
			for (Role role : roleList) {
				identityService.createMembership(userId, role.getEnName());
				logger.debug("add membership {user: {}, role: {}}", userId, role.getEnName());
			}
		}
	}

	/**
	 * 同步所有角色数据到{@link Group}
	 */
	private void synRoleToActiviti() {
		List<Role> allRole = roleManager.getAll();
		for (Role role : allRole) {
			String groupId = role.getEnName().toString();
			Group group = identityService.newGroup(groupId);
			group.setName(role.getName());
			group.setType(role.getType());
			identityService.saveGroup(group);
		}
	}

	@Override
	public void deleteAllActivitiIdentifyData() throws Exception {
		activitiIdentifyService.deleteAllMemerShip();
		activitiIdentifyService.deleteAllRole();
		activitiIdentifyService.deleteAllUser();
	}
}
</pre>

## 方案二：自定义SessionFactory

引擎内部与数据库交互使用的是MyBatis，对不同的表的CRUD操作均由一个对应的实体管理器（XxxEntityManager，有接口和实现类），引擎的7个Service接口在需要CRUD实体时会根据接口获取注册的实体管理器实现类（初始化引擎时用Map对象维护两者的映射关系），并且引擎允许我们覆盖内部的实体管理器，查看源码后可以知道有关Identity操作的两个接口分别为：UserIdentityManager和GroupIdentityManager。

查看引擎配置对象ProcessEngineConfigurationImpl类可以找到一个名称为“customSessionFactories”的属性，该属性可以用来自定义SessionFactory（每一个XXxManager类都是一个Session<实现Session接口>，由SessionFactory来管理），为了能替代内部的实体管理器的实现我们可以自定义一个SessionFactory并注册到引擎。

这种自定义SessionFactory的方式适用于公司内部有独立的身份系统或者公共的身份模块的情况，所有和用户、角色、权限的服务均通过一个统一的接口获取，而业务系统则不保存这些数据，此时引擎的身份模块表就没必要存在（ACT_ID_*）。

下面是有关**customSessionFactories**的示例配置。

<pre class="brush:xml">
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration"> 
    ...
    <property name="customSessionFactories">
        <list>
            <bean class="me.kafeitu.activiti.xxx.CustomUserEntityManagerFactory">
                <property name="customUserEntityManager">
                    <bean class="me.kafeitu.activiti.xxx.CustomUserEntityManager">
                        <property name="CustomUserManager" ref="CustomUserManager" />
                    </bean>
                </property>
            </bean>
            <bean class="me.kafeitu.activiti.xxx.CustomGroupEntityManagerFactory">
                <property name="customGroupEntityManager">
                    <bean class="me.kafeitu.activiti.xxx.CustomGroupEntityManager">
                        <property name="customRoleManager" ref="customRoleManager" />
                    </bean>
                </property>
            </bean>
        </list>
    </property>
    ...
</bean>

<bean id="customUserManager" class="me.kafeitu.activiti.xxx.impl.AiaUserManagerImpl">
    <property name="dao">
        <bean class="me.kafeitu.activiti.xxx.impl.CustomUserDaoImpl"></bean>
    </property>
    <property name="identityService" ref="identityService"/>
</bean>

<bean id="customRoleManager" class="me.kafeitu.activiti.chapter19.identity.impl.AiaRoleManagerImpl">
    <property name="dao">
        <bean class="me.kafeitu.activiti.xxx.impl.CustomRoleDaoImpl"></bean>
    </property>
</bean>
</pre>

以用户操作为例介绍一下如何自定义一个SessionFactory。

<pre class="brush:java">
public class CustomUserEntityManagerFactory implements SessionFactory {

    private CustomUserEntityManager customUserEntityManager;

    public void setCustomUserEntityManager(CustomUserEntityManager customUserEntityManager) {
        this.customUserEntityManager = customUserEntityManager;
    }

    @Override
    public Class<?> getSessionType() { // 返回引擎的实体管理器接口
        return UserIdentityManager.class;
    }

    @Override
    public Session openSession() {
        return customUserEntityManager;
    }
}
</pre>

<pre class="brush:java">
public class CustomUserEntityManager extends UserEntityManager {

	  // 这个Bean就是公司提供的统一身份访问接口，可以覆盖UserEntityManager的任何方法用公司内部的统一接口提供服务
    private CustomUserManager customUserManager;

    @Override
    public Boolean checkPassword(String userId, String password) {
        CustomUser customUser = customUserManager.get(new Long(userId));
        return CustomUser.getPassword().equals(password);
    }

    public void setCustomUserManager(CustomUserManager customUserManager) {
        this.customUserManager = customUserManager;
    }
}
</pre>

## 方案三：用视图覆盖同名的ACT_ID_系列表

此方案和第二种类似，放弃使用系列表：ACT_ID_，创建同名的视图。

### 1.删除已创建的ACT_ID_*表

创建视图必须删除引擎自动创建的ACT_ID_*表，否则不能创建视图。

### 2.创建视图：

* ACT_ID_GROUP
* ACT_ID_INFO
* ACT_ID_MEMBERSHIP
* ACT_ID_USER

创建的视图要保证数据类型一致，例如用户的ACT_ID_MEMBERSHIP表的两个字段都是字符型，一般系统中都是用NUMBER作为用户、角色的主键类型，所以创建视图的时候要把数字类型转换为字符型。

### 3.修改引擎默认配置

在引擎配置中设置属性**dbIdentityUsed**为**false**即可。

<pre class="brush:xml">
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration">
	...
	<property name="dbIdentityUsed" value="false"/>
	...
</bean>
</pre>

## 总结

* 方案**一**：通过数据推送方式同步数据到引擎的身份表，需要把数据备份到引擎的身份表或者公司有平台或者WebService推送用户数据的推荐使用

* 方案**二**：自定义SessionFactory，非侵入式替换接口实现，对于公司内部有统一身份访问接口的推荐使用

* 方案**三**：不需要编写Java代码，只需要创建同名视图即可
