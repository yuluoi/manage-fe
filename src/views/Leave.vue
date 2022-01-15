<template>
  <div class="user-manager">
    <!-- query-form -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="query-form">
        <!-- 注意配置prop -->
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- applyList -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList">
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
            <el-button size="mini" @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)"
              >作废</el-button
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
    <!-- 弹框 -->
    <div class="dialogForm">
      <el-dialog title="申请休假" v-model="showModel" width="70%">
        <el-form
          ref="dialogForm"
          :model="leaveForm"
          label-width="120px"
          :rules="rules"
        >
          <el-form-item label="休假类型" required>
            <el-select
              v-model="leaveForm.applyType"
              placeholder="请选择休假类型"
            >
              <el-option label="事假" :value="1"></el-option>
              <el-option label="调休" :value="2"></el-option>
              <el-option label="年假" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="休假时间" required>
            <el-row>
              <el-col :span="6" class="dialogForm-col">
                <el-form-item prop="startTime" required>
                  <el-date-picker
                    v-model="leaveForm.startTime"
                    placeholder="请选择开始日期"
                    type="date"
                    @change="(val) => handleDateChange('startTime', val)"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="2"
                class="dialogForm-col"
                style="text-align: center"
                >-</el-col
              >
              <el-col :span="6" class="dialogForm-col" style="">
                <el-form-item prop="endTime" required>
                  <el-date-picker
                    v-model="leaveForm.endTime"
                    placeholder="请选择结束日期"
                    type="date"
                    @change="(val) => handleDateChange('endTime', val)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="休假时长">
            {{ leaveForm.leaveTime }}
          </el-form-item>
          <el-form-item label="休假原因" prop="reasons" required>
            <el-input
              type="textarea"
              v-model="leaveForm.reasons"
              :rows="3"
              placeholder="请输入休假原因"
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
      <!-- 申请休假详情 -->
      <!-- destroy-on-close 关闭弹窗 清除缓存 -->
      <el-dialog
        title="申请休假详情"
        width="50%"
        v-model="showDetailModal"
        destroy-on-close
      >
        <el-steps
          :active="detail.applyState > 2 ? 3 : detail.applyState"
          align-center
        >
          <el-step title="待审批"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批拒绝/审批通过"></el-step>
        </el-steps>
        <el-form label-width="120px" label-suffix=":">
          <el-form-item label="休假类型">
            <div>{{ detail.applyTypeName }}</div>
          </el-form-item>
          <el-form-item label="休假时间">
            <div>{{ detail.time }}</div>
          </el-form-item>
          <el-form-item label="休假时长">
            <div>{{ detail.leaveTime }}</div>
          </el-form-item>
          <el-form-item label="休假原因">
            <div>{{ detail.reasons }}</div>
          </el-form-item>
          <el-form-item label="审批状态">
            <div>{{ detail.applyStateName }}</div>
          </el-form-item>
          <el-form-item label="审批人">
            <div>{{ detail.curAuditUserName }}</div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from "vue"
import utils from '../utils/utils'
export default {
  name: 'leave',
  setup () {
    //  获取composition API 上下文对象
    const { proxy } = getCurrentInstance();

    // 定义查询表单对象
    const queryForm = reactive({
      applyState: ''
    })

    // 休假详情开关
    let showDetailModal = ref(false)

    // 休假详情表单数据
    let detail = ref({})

    // 弹框开关
    let showModel = ref(false)

    // 定义弹框leaveForm表单
    let leaveForm = reactive({
      applyType: 1,
      startTime: '',
      endTime: '',
      leaveTime: '0天',
      reasons: ''
    })

    // 定义申请列表
    let applyList = ref([])

    // 定义当前操作状态 申请休假 作废
    let action = ref('create')

    // 定义 dialogForm 表单校验
    const rules = reactive({
      startTime: [
        {
          type: 'date',
          required: true,
          message: '请选择开始时间',
          tigger: 'change'
        }
      ],
      endTime: [
        {
          type: 'date',
          required: true,
          message: '请选择结束时间',
          tigger: 'change'
        }
      ],
      reasons: [
        {
          required: true,
          message: '请输入休假原因',
          tigger: ['blur', 'change']
        }
      ]
    })

    // 定义动态表格-格式
    const columns = reactive([
      {
        lable: '单号',
        prop: 'orderNo'
      },
      {
        lable: '休假时间',
        prop: '',
        formatter (row) {
          return String(utils.formateDate(new Date(row.startTime), 'yyyy-MM-dd')) + '到' +
            String(utils.formateDate(new Date(row.endTime), 'yyyy-MM-dd'))
        }
      },
      {
        lable: '休假时长',
        prop: 'leaveTime'
      },
      {
        lable: '休假类型',
        prop: 'applyType',
        formatter (row, column, val) {
          // formatter是elementPlus自带的语法 注意看文档
          // 这样的写法真秒啊！！
          return {
            1: '事假',
            2: '调休',
            3: '年假'
          }[val]
        }
      },
      {
        lable: '休假原因',
        prop: 'reasons'
      },
      {
        lable: '申请时间',
        prop: 'createTime',
        width: 180,
        formatter (row, column, val) {
          return utils.formateDate(new Date(val))
        }
      },
      {
        lable: '审批人',
        prop: 'auditUsers'
      },
      {
        lable: '当前审批人',
        prop: 'curAuditUserName'
      },
      {
        lable: '审批状态',
        prop: 'applyState',
        formatter (row, column, value) {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废'
          }[value]
        }
      }
    ])

    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 1
    })


    // 初始化接口调用
    onMounted(() => {
      console.log('...init');

      // 获取审批列表
      getApplyList()
    })

    // 获取审批列表
    const getApplyList = async () => {
      let params = { ...queryForm, ...pager }
      // 加载审批列表数据
      let { list, page } = await proxy.$api.applyList(params)
      console.log(list);
      applyList.value = list
      pager.total = page.total
      // Object.assign(applyList, list)
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

    // 申请休假按钮
    const handleApply = () => {
      showModel.value = true
      action.value = 'create'
    }

    // 弹框关闭
    const handleClose = () => {
      showModel.value = false
      handleReset('dialogForm')
    }

    // dialogForm 表单提交
    const handleSubmit = () => {
      // 表单校验
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = { ...leaveForm, action: action.value }
            await proxy.$api.leaveOperate(params)
            proxy.$message.success('申请成功')
            // 获取成功之后 关闭弹窗 清空表单数据
            handleClose()
            // 刷新列表 获取数据
            getApplyList()
          } catch (err) {

          }
        }
      })
    }

    // 计算休假时长
    const handleDateChange = (key, val) => {
      const { startTime, endTime } = leaveForm
      if (!startTime || !endTime) return;
      if (startTime > endTime) {
        proxy.$message.error('开始日期不能晚于结束日期')
        leaveForm.leaveTime = '0天'
        // 这里清空数据 需要异步
        setTimeout(() => {
          leaveForm[key] = ''
        }, 0)
      } else {
        leaveForm.leaveTime = (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + '天'
      }

    }

    // 休假详情查看按钮
    const handleDetail = (row) => {
      let data = { ...row }
      // 调休类型字典
      data.applyTypeName = {
        1: '事假',
        2: '调休',
        3: '年假'
      }[data.applyType]
      // 审批状态字典
      data.applyStateName = {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废'
      }[data.applyState]
      // 休假时长
      data.time = String(utils.formateDate(new Date(data.startTime), 'yyyy-MM-dd')) + ' - ' +
        String(utils.formateDate(new Date(data.endTime), 'yyyy-MM-dd'))
      // Object.assign(detail, data)
      detail.value = { ...data }

      // 打开弹框
      showDetailModal.value = true
    }

    // 休假作废按钮
    const handleDelete = async (_id) => {
      try {
        action.value = 'delete'
        let params = { _id, action: action.value }
        await proxy.$api.leaveOperate(params)
        proxy.$message.success('删除成功')
        // 重新获取数据 刷新
        getApplyList()
      } catch (err) {
        proxy.$message.error('删除失败')
      }
    }

    return {
      queryForm,
      applyList,
      columns,
      pager,
      showModel,
      leaveForm,
      rules,
      showDetailModal,
      detail,
      handleReset,
      handleCurrentChange,
      getApplyList,
      handleApply,
      handleClose,
      handleSubmit,
      handleDateChange,
      handleDetail,
      handleDelete
    }
  }
}
</script>

<style lang="scss">
.dialogForm-col {
  display: flex;
  justify-content: space-around;
}
</style>
