<template>
  <div class="user-manager">
    <!-- userSearch -->
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <!-- 注意配置prop 表单验证 -->
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- userList -->
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleCreate"
          v-has:add="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePathDel"
          v-has:add="'user-patch-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <!-- 多选按钮 -->
        <el-table-column type="selection" width="55" />
        <!-- 数据会自动对应prop -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.lable"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              v-has:add="'user-edit'"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              v-has:add="'user-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 新增用户 -->
    <el-dialog :title="dialogTitle" v-model="showModal">
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="userForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template #append> @163.com </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <!-- 在props里面进行字段转换 -->
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue"
import utils from './../utils/utils'
export default {
  name: 'user',
  setup () {
    //  获取composition API 上下文对象
    const { proxy } = getCurrentInstance();

    // 初始化用户表单对象
    const user = reactive({
      state: 1
    })

    // 初始化用户列表数据
    const userList = ref([])

    // 定义动态表格-格式
    const columns = reactive([
      {
        lable: '用户id',
        prop: 'userId'
      },
      {
        lable: '用户名',
        prop: 'userName'
      },
      {
        lable: '用户邮箱',
        prop: 'userEmail'
      },
      {
        lable: '用户角色',
        prop: 'role',
        formatter (row, column, val) {
          // formatter是elementPlus自带的语法 注意看文档
          // 这样的写法真秒啊！！
          return {
            0: '管理员',
            1: '普通用户'
          }[val]
        }
      },
      {
        lable: '用户状态',
        prop: 'state',
        formatter (row, column, val) {
          // formatter是elementPlus自带的语法 注意看文档
          // 这样的写法真秒啊！！
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[val]
        }
      },
      {
        lable: '注册时间',
        prop: 'createTime',
        width: 180,
        formatter (row, column, val) {
          return utils.formateDate(new Date(val))
        }
      },
      {
        lable: '最后登录时间',
        prop: 'lastLoginTime',
        width: 180,
        formatter (row, column, val) {
          return utils.formateDate(new Date(val))
        }
      }
    ])

    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 1
    })

    // 选中列表对象
    const checkedUserIds = ref([])

    // 获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager }
      try {
        const { list, page } = await proxy.$api.userList(params)
        userList.value = list;
        pager.total = page.total;
      } catch (err) {
        console.log(err);
      }
    }

    // 弹框显示对象
    const showModal = ref(false)

    // 角色列表
    let roleList = ref([])

    // 部门列表
    let deptList = ref([])

    // 定义用户操作行为
    const action = ref('add')

    // 新增用户Form对象
    let userForm = reactive({
      state: 1
    })

    // 定义 用户新增/编辑的title
    const dialogTitle = ref('')

    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        }
      ],
      userEmail: [
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }
      ],
      mobile: [
        {
          pattern: /^1\d{10}/,
          message: '请输入正确的手机号格式',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请输入部门',
          trigger: 'blur'
        }
      ]
    })


    // 初始化接口调用
    onMounted(() => {
      console.log('...init');

      // 获取用户管理列表
      getUserList();

      // 获取部门列表
      getDeptList();

      // 获取角色列表
      getRoleAllList();
    })

    // 查询事件，获取用户列表
    const handleQuery = () => {
      getUserList();
    }

    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    }

    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    }

    // 用户单个删除
    const handleDelete = async (index, row) => {
      try {
        await proxy.$api.userDelete({
          userIds: [row.userId] // 可单个删除，也可批量删除
        })
        proxy.$message.success('删除成功')
        // 重新获取数据，刷新页面数据
        getUserList();
      } catch (err) {
        // proxy.$message.error(err)
      }
    }

    // 批量删除
    const handlePathDel = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error('请选择要删除的对象');
        return
      }
      const res = await proxy.$api.userDelete({
        userIds: checkedUserIds.value
      })
      if (res.nModified > 0) {
        // 重新获取数据，刷新页面数据
        getUserList();
        proxy.$message.success('批量删除成功')
      } else {
        proxy.$message.error('批量删除失败')
      }
    }

    // 表格多选
    const handleSelectionChange = (val) => {
      // 获取多选列表
      let arr = [];
      val.map(item => {
        arr.push(item.userId)
      })
      checkedUserIds.value = arr
    }

    // 用户新增
    const handleCreate = () => {


      dialogTitle.value = '用户新增'

      // 区别新增/编辑
      action.value = 'add'

      // 打开表单
      showModal.value = true

      // 置空表单数据
      proxy.$nextTick(() => {
        handleReset('dialogForm');
      })
    }

    // 获取部门列表
    const getDeptList = async () => {
      const res = await proxy.$api.deptList()
      deptList.value = res
    }

    // 获取角色列表
    const getRoleAllList = async () => {
      const res = await proxy.$api.roleAllList()
      roleList.value = res
    }

    // 用户创建弹窗取消按钮
    const handleClose = () => {
      showModal.value = false;
      handleReset('dialogForm')
    }

    // 用户创建弹窗提交按钮
    const handleSubmit = () => {
      // 注意校验
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            // 转换为普通对象
            let params = { ...toRaw(userForm) };
            // 处理邮箱后缀
            params.userEmail += '@163.com';
            params.action = action.value;
            // 提交
            let res = await proxy.$api.userSubmit(params);
            showModal.value = false
            proxy.$message.success(`${dialogTitle.value}成功`)
            // 重置表单
            handleReset('dialogForm')
            // 刷新用户列表
            getUserList()
          } catch (err) {
            proxy.$message.error(err)
          }
        }
      });
    };

    // 用户的编辑按钮
    const handleEdit = (index, row) => {
      console.log(index, row);
      showModal.value = true

      // 区别是新增还是编辑
      action.value = 'edit'
      dialogTitle.value = '用户编辑'

      // 此时userForm为空 点击编辑按钮之后 dom节点未被渲染 userForm被赋值 初始化
      // userForm认为“初始化的值”是默认的值 所以proxy.$refs.userForm.resetFields()失败
      // 所以使用nextTick()
      // 等待dom节点渲染完毕执行
      proxy.$nextTick(() => {
        // 重置表单
        handleReset('dialogForm')
        // 使用枚举方法赋值
        Object.assign(userForm, row)
      })
    }

    return {
      user,
      columns,
      userList,
      pager,
      checkedUserIds,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      dialogTitle,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePathDel,
      handleSelectionChange,
      handleCreate,
      getRoleAllList,
      getDeptList,
      handleClose,
      handleSubmit,
      handleEdit
    }
  }
}
</script>

<style>
</style>