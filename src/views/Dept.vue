<template>
  <div class="dept-mange">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm">
        <el-form-item prop="deptName" label="部门名称">
          <el-input
            v-model="queryForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen" v-has:add="'dept-create'"
          >创建</el-button
        >
      </div>
      <!-- 树形结构需要使用row-key :tree-props指定children -->
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <!-- 使用v-bind="item" 挂载所有属性 -->
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        </el-table-column>
        <!-- 注意el-table使用button 要用插槽 template -->
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
              v-has:add="'dept-edit'"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id)"
              v-has:add="'dept-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action === 'create' ? '创建部门' : '编辑'"
      v-model="showModal"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <!-- :show-all-levels="true" 默认展开所有的子菜单 :options="deptList" 数据来自deptList-->
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            :options="deptList"
            :show-all-levels="true"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="deptForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            placeholder="请选择部门负责人"
            v-model="deptForm.user"
            @change="handleSelect"
          >
            <el-option
              v-for="item in userList"
              :key="item._id"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input
            placeholder="请输入用户邮箱"
            v-model="deptForm.userEmail"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from './../utils/utils'
export default {
  name: 'dept',
  data () {
    return {
      queryForm: {
        deptName: ''
      },
      deptList: [],
      action: '',
      showModal: false,
      deptForm: {
        parentId: [null]
      },
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择上级部门',
            trigger: 'blur'
          }
        ],
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }
        ],
        user: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'blur'
          }
        ]
      },
      userList: [],
      columns: [
        {
          label: '部门名称',
          prop: 'deptName'
        },
        {
          label: '负责人',
          prop: 'userName'
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          formatter (row, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter (row, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
      ]
    }
  },
  mounted () {
    //   初始化部门列表数据
    this.getDeptList()
    // 初始化用户列表数据
    this.getUserList()
  },
  methods: {
    // 获取部门列表
    async getDeptList () {
      const list = await this.$api.deptList(this.queryForm)
      this.deptList = list
    },
    //   获取部门列表
    async getUserList () {
      const list = await this.$api.userAllList()
      this.userList = list
    },
    //   查询
    handleQuery () {
      this.getDeptList()
    },
    // 重置
    handleReset (form) {
      this.$refs[form].resetFields()
    },
    // 打开创建页面
    // 创建按钮
    handleOpen (row) {
      this.action = 'create'
      this.showModal = true
      this.$nextTick(() => {
        // 重置表单
        this.$refs.dialogForm.resetFields()
      })
    },
    // 编辑按钮
    handleEdit (row) {
      this.action = 'edit'
      this.showModal = true
      console.log(row);
      this.$nextTick(() => {
        // Object.assign(this.deptForm, row)
        console.log(this.deptForm.user);
        this.deptForm = { ...row, user: `${row.userId}/${row.userName}/${row.userEmail}` }
      })
    },
    // 删除按钮
    async handleDelete (_id) {
      this.action = 'delete'
      let params = { _id, action: this.action }
      const res = await this.$api.deptOperate(params)
      if (res) {
        this.$message.success(`${this.actionName(this.action)}成功`)
        this.getDeptList()
      }
    },
    // dialogForm 取消按钮
    handleClose () {
      this.showModal = false
      // 重置表单
      this.$refs.dialogForm.resetFields()
    },
    // dialogForm 提交确认按钮
    handleSubmit () {
      // 校验
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { ...this.deptForm, action: this.action }
          // 删除user字段
          delete params.user;
          const res = await this.$api.deptOperate(params)
          if (res) {
            // 关闭弹窗 置空dialogForm
            this.handleClose()

            this.$message.success(`${this.actionName(this.action)}成功`)

            // 重新获取数组 刷新
            this.getDeptList()
          }
        }
      })
    },
    // 下拉框change事件
    handleSelect (value) {
      // 转换为数组 解构赋值  真秒啊
      const [userId, userName, userEmail] = value.split('/')
      console.log(value);
      // 浅拷贝
      // this.deptForm.userEmail = userEmail
      Object.assign(this.deptForm, { userId, userName, userEmail })
      console.log(this.deptForm);
    },
    // 按钮字典
    actionName (name) {
      return {
        'create': '创建',
        'edit': '编辑',
        'delete': '删除'
      }[name]
    }
  }
}
</script>

<style>
</style>