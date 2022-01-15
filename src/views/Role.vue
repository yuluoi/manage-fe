<template>
  <div class="role-manager">
    <!-- query-form -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="query-form">
        <!-- 注意配置prop -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('query-form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增按钮 -->
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleCreate"
          v-has:add="'role-create'"
          >创建</el-button
        >
      </div>
      <el-table :data="roleList">
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
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              v-has:add="'role-edit'"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleOpenPermission(scope.row)"
              v-has:add="'role-setting'"
              >设置权限</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id)"
              v-has:add="'role-delete'"
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
    <!-- 新增菜单弹框 -->
    <el-dialog :title="dialogTitle" v-model="showModal">
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <!-- prop用户校验数据 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="roleForm.remark"
            :rows="2"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限弹框 -->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100px">
        <!-- prop用户校验数据 -->
        <el-form-item label="角色名称"> : {{ curRoleName }} </el-form-item>
        <el-form-item label="选择权限"
          ><el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePermissionClose">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils/utils'

export default {
  name: 'role',
  data () {
    return {
      queryForm: {
        roleName: ""
      },
      roleList: [],
      dialogTitle: '',
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      showModal: false,
      roleForm: {},
      action: '',
      // 菜单映射表
      actionMap: {},
      columns: [
        {
          lable: '角色名称',
          prop: 'roleName',
          width: 200
        },
        {
          lable: '备注',
          prop: 'remark'
        },
        {
          lable: '权限列表',
          prop: 'permissionList',
          width: 200,
          // 注意作用域问题 此时this 不是指向vue
          // 使用箭头函数
          formatter: (row, column, value) => {
            let names = []
            let list = value.halfCheckedKeys || [];
            list.map(key => {
              let name = this.actionMap[key]
              if (key && name) names.push(name)
            })
            return names.join(', ')
          }
        },
        {
          lable: '创建时间',
          prop: 'createTime',
          width: 200,
          formatter (row, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
        {
          lable: '更新时间',
          prop: 'updateTime',
          width: 200,
          formatter (row, column, value) {
            return utils.formateDate(new Date(value))
          }
        }
      ],
      // 权限弹框展示
      showPermission: false,
      curRoleName: '',
      curRoleId: '',
      menuList: [],
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称'
          }
        ]
      }
    }
  },
  mounted () {
    // 获取角色列表
    this.getRoleList()
    // 获取菜单权限列表
    this.getMenuList()
  },
  methods: {
    //   菜单列表初始化
    async getRoleList () {
      try {
        const { list, page } = await this.$api.roleList({
          ...this.queryForm, ...this.pager
        });
        this.roleList = list;
        this.pager.total = page.total;
      } catch (err) {
        throw new Error(err)
      }
    },
    async getMenuList () {
      try {
        const list = await this.$api.menuList()
        this.menuList = list
        this.getActionMap(list)
      } catch (err) {
        throw new Error(err)
      }
    },
    // 递归出字典 
    getActionMap (list) {
      let actionMap = {}
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName
          }
          if (item.children && !item.action) {
            deep(item.children)
          }
        }
      }
      // !!! 注意list是引用类型 .pop()会改变引用类型的值 需要序列化JSON.parse(JSON.stringify(list))
      deep(JSON.parse(JSON.stringify(list)))
      this.actionMap = actionMap
    },
    // 重置
    handleReset (form) {
      this.$refs[form].resetFields();
    },


    // 删除
    async handleDelete (_id) {
      this.action = 'delete'
      await this.$api.roleOperate({ _id, action: this.action })
      this.$message.success('删除成功')

      //   刷新数据
      this.getRoleList()
    },
    // 分页器
    handleCurrentChange (current) {
      this.pager.pageNum = current;
      this.getRoleList();
    },
    // 创建按钮
    handleCreate () {
      this.dialogTitle = '创建'
      this.action = 'create'
      this.showModal = true
      this.$nextTick(() => {
        this.handleReset('dialogForm')
      })
    },
    // 提交按钮
    handleSubmit () {
      // 验证数据
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { action, roleForm } = this
          let params = { ...roleForm, action }
          const res = await this.$api.roleOperate(params)
          if (res) {
            console.log(res);
            // 关闭弹窗 重置数据
            this.handleClose()

            this.$message.success('更新成功')

            // 重新获取数据 刷新
            this.getRoleList()
          }
        }
      })
    },
    // 取消按钮
    handleClose () {
      this.showModal = false
      this.handleReset('dialogForm')
    },
    // 编辑按钮
    handleEdit (row) {
      this.dialogTitle = '编辑'
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {
        this.roleForm = { roleName: row.roleName, remark: row.remark, _id: row._id }
        // Object.assign(this.roleForm, row)
      })
    },
    // 设置权限按钮
    handleOpenPermission (row) {
      this.curRoleId = row._id
      this.curRoleName = row.roleName
      this.showPermission = true

      console.log(row);
      // 设置权限点
      let { checkedKeys } = row.permissionList
      // 注意此时ref节点树还未生成 需要使用$nextTick
      this.$nextTick(() => {
        // 设置选中的节点
        this.$refs.permissionTree.setCheckedKeys(checkedKeys)
      })
    },
    // 设置权限弹窗关闭按钮
    handlePermissionClose () {
      this.showPermission = false
    },
    // 设置权限弹窗提交按钮
    async handlePermissionSubmit () {
      // 获取选中的节点
      let nodes = this.$refs.permissionTree.getCheckedNodes()
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys()
      let checkedKeys = []
      let parentkeys = []
      nodes.map(item => {
        if (!item.children) {
          checkedKeys.push(item._id)
        } else {
          parentkeys.push(item._id)
        }
      })
      console.log(halfKeys);
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys: checkedKeys,
          halfCheckedKeys: parentkeys.concat(halfKeys)
        }
      }

      await this.$api.updatePermission(params)

      this.showPermission = false
      this.$message.success('更新成功')
      this.getRoleList()
    }
  }
}
</script>

<style>
</style>