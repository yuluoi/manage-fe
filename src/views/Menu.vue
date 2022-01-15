<template>
  <div class="menu-manager">
    <!-- query-form -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="query-form">
        <!-- 注意配置prop -->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('query-form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增按钮 -->
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleAdd(1)"
          v-has:add="'menu-create'"
          >创建</el-button
        >
      </div>
      <el-table
        :data="menuList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
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
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleAdd(2, scope.row)"
              v-has:add="'menu-create'"
              >新增</el-button
            >
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              v-has:add="'menu-edit'"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id)"
              v-has:add="'menu-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增菜单 -->
    <el-dialog
      :title="action === 'add' ? '新增菜单' : '菜单设置'"
      v-model="showModal"
    >
      <el-form
        ref="dialogForm"
        :model="menuForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          ></el-cascader>
          <span style="margin-left: 10px">不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <!-- 这里的label不是显示的值 而是提交的值 -->
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuForm.menuType == 2"
        >
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件地址" />
        </el-form-item>
        <el-form-item
          label="菜单类型"
          prop="menuState"
          v-show="menuForm.menuType == 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <!-- 这里的label不是显示的值 而是提交的值 -->
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
import utils from '../utils/utils'

export default {
  name: 'menu',
  data () {
    return {
      queryForm: {
        menuState: 1
      },
      menuForm: {
        parentId: [null],
        menuState: 1,
        menuType: 1
      },
      menuList: [],
      showModal: false,
      dialogTitle: '新增菜单',
      action: 'add',
      rules: {
        menuName: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度2-8字符',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          lable: '菜单名称',
          prop: 'menuName',
          width: 150
        },
        {
          lable: '图标',
          prop: 'icon'
        },
        {
          lable: '菜单类型',
          prop: 'menuType',
          formatter (row, column, value) {
            return {
              1: '菜单',
              2: '按钮'
            }[value]
          }
        },
        {
          lable: '权限标识',
          prop: 'menuCode'
        },
        {
          lable: '路由地址',
          prop: 'path'
        },
        {
          lable: '组件路径',
          prop: 'component'
        },
        {
          lable: '菜单状态',
          prop: 'menuState',
          width: 90,
          formatter (row, column, value) {
            return {
              1: '正常',
              2: '停用'
            }[value]
          }
        },
        {
          lable: '创建时间',
          prop: 'createTime',
          width: 90,
          formatter (row, column, value) {
            return utils.formateDate(new Date(value))
          }
        }
      ]
    }
  },
  mounted () {
    this.getMenuList()
  },
  methods: {
    //   菜单列表初始化
    async getMenuList () {
      try {
        const res = await this.$api.menuList(this.queryForm)
        this.menuList = res
      } catch (err) {
        throw new Error(err)
      }
    },
    //   查询
    handleQuery () {
      this.getMenuList()
    },
    // 重置
    handleReset (form) {
      this.$refs[form].resetFields();
    },
    // 按钮新增
    handleAdd (type, row) {
      this.showModal = true
      this.action = 'add'
      this.handleReset('dialogForm')
      if (type == 2) {
        console.log('按钮新增');
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        )
        // this.menuForm = { ...row }
        console.log(this.menuForm.parentId);
      }
    },
    // 编辑
    handleEdit (row) {
      this.showModal = true
      this.action = 'edit'
      this.$nextTick(() => {
        //   枚举法 触发响应式
        this.menuForm = { ...row }
        // Object.assign(this.menuForm, row)
      })
    },
    // 删除
    async handleDelete (_id) {
      this.action = 'delete'
      await this.$api.menuSubmit({ _id, action: this.action })
      this.$message.success('删除成功')

      //   刷新数据
      this.getMenuList()
    },
    // 新增表单关闭按钮
    handleClose () {
      //   重置表单数据
      // this.handleReset('dialogForm')
      this.showModal = false
    },
    // 新增表单提交按钮
    handleSubmit () {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { action, menuForm } = this
          let params = { ...menuForm, action }

          try {
            const res = await this.$api.menuSubmit(params)
            this.$message.success('提交成功')

            //   重置表单数据
            this.handleReset('dialogForm')
            this.showModal = false

            // 重新获取列表数据 刷新
            this.getMenuList()
          } catch (err) {
            console.log(err);
          }
        }
      })
    },
  }

}
</script>

<style>
</style>