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
            <el-button
              size="mini"
              @click="handleDetail(scope.row)"
              v-if="
                scope.row.curAuditUserName == userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审核</el-button
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
      <!-- 申请休假详情 -->
      <!-- destroy-on-close 关闭弹窗 清除缓存 -->
      <el-dialog
        title="审核"
        width="50%"
        v-model="showDetailModal"
        destroy-on-close
      >
        <el-form
          ref="dialogForm"
          :model="auditForm"
          label-width="120px"
          label-suffix=":"
          :rules="rules"
        >
          <el-form-item label="申请人">
            <div>{{ detail.applyUser.userName }}</div>
          </el-form-item>
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
          <el-form-item label="备注信息" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入审核备注"
              v-model="auditForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleApprove('pass')">审核通过</el-button>
            <el-button @click="handleApprove('refuse')" type="primary"
              >驳回</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs } from "vue"
import utils from '../utils/utils'
export default {
  name: 'approve',
  setup () {
    //  获取composition API 上下文对象
    const { proxy } = getCurrentInstance();

    // 定义查询表单对象
    const queryForm = reactive({
      applyState: 1
    })

    // 定义审核表单
    const auditForm = reactive({
      remark: ''
    })

    // 休假详情开关
    let showDetailModal = ref(false)

    // 休假详情表单数据
    let detail = ref({})

    // 当前登录人
    const userInfo = proxy.$store.state.userInfo


    // 定义申请列表
    let applyList = ref([])

    // 定义 dialogForm 表单校验
    const rules = reactive({
      remark: [
        {
          required: true,
          message: '请输入审核备注',
          tigger: 'change'
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
        lable: '申请人',
        prop: '',
        formatter (row) {
          return row.applyUser.userName
        }
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
      let params = { ...queryForm, ...pager, type: 'approve' }
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

    // 审核按钮
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

    // 审核：通过/驳回
    const handleApprove = (action) => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = { action, remark: auditForm.remark, _id: detail.value._id }
            const res = await proxy.$api.leaveApprove(params)
            if (res) {
              showDetailModal.value = false
              proxy.$nextTick(() => {
                proxy.$refs.dialogForm.resetFields()
              })
              getApplyList()
              proxy.$message.success('处理成功')

              // 处理通知
              proxy.$store.commit('saveNoticeCount', proxy.$store.state.noticeCount - 1)
            }
          } catch (err) {
            proxy.$message.error('处理失败')
          }
        }
      })
    }


    return {
      queryForm,
      applyList,
      columns,
      pager,
      rules,
      showDetailModal,
      detail,
      userInfo,
      auditForm,
      handleReset,
      handleCurrentChange,
      getApplyList,
      handleDetail,
      handleApprove
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
