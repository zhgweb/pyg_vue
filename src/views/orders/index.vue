<template>
  <div class="orders-container">
    <my-bread>
      <template v-slot:Menus>订单管理</template>
      <template v-slot:Menu>订单列表</template>
    </my-bread>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            size="small"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%" size="small">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单金额" align="center">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" align="center">
          <template slot-scope="scope">
            <span>{{ !scope.row.pay_status ? "已支付" : "未支付" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_pay" label="付款方式" align="center">
          <template slot-scope="scope">
            <span>{{
              !scope.row.order_pay
                ? "支付宝"
                : scope.row.order_pay
                ? "未支付"
                : scope.row.order_pay === 2
                ? "微信"
                : "银行卡"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" align="center">
          <template slot-scope="scope">
            <span>{{ !scope.row.is_send ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | ft }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                round
                icon="el-icon-edit"
                @click="showEditForm(scope.row)"
              ></el-button>
              <el-button
                size="mini"
                round
                icon="el-icon-location"
                @click="showAddressForm(scope.row)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="queryParams.pagesize"
        :current-page="queryParams.pagenum"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑订单 -->
    <el-dialog
      title="编辑订单"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleEditForm"
        :rules="rulesEdit"
        ref="refEditForm"
        label-width="100px"
      >
        <el-form-item label="订单编号" prop="order_number">
          <el-input
            v-model="ruleEditForm.order_number"
            disabled
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单金额" prop="order_price">
          <el-input v-model="ruleEditForm.order_price" size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否付款" prop="pay_status">
          <el-select
            v-model="ruleEditForm.pay_status"
            placeholder="请选择付款状态"
            size="small"
            style="width: 100%"
            @change="changeDisavled"
          >
            <el-option
              v-for="item in pay_statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式" prop="order_pay">
          <el-select
          :disabled="disabled"
            v-model="ruleEditForm.order_pay"
            placeholder="请选择付款方式"
            size="small"
            style="width: 100%"
             @change="changeDisavled2"
          >
            <el-option
              v-for="item in order_payData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否发货" prop="is_send">
          <el-select
          :disabled="disabled2"
            v-model="ruleEditForm.is_send"
            placeholder="请选择是否发货"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="item in is_sendData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :close-on-click-modal="false"
      :visible.sync="roleVisible"
      width="400px"
      :before-close="handleClose"
    >
    <!--时间线-->
      <el-timeline>
        <el-timeline-item
          v-for="(item, i) in wlList"
          :key="i"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddressSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      roleVisible: false,
      wlList: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ],
      disabled: true,
      disabled2: true,
      // 发货状态
      is_sendData: [
        { value: '0', label: '未发货' },
        { value: '1', label: '已经发货' }
      ],
      // 支付状态 是否付款
      pay_statusData: [
        { value: '0', label: '未付款' },
        { value: '1', label: '已付款' }
      ],
      // 付款方式
      order_payData: [
        { value: '0', label: '未支付' },
        { value: '1', label: '支付宝' },
        { value: '2', label: '微信' },
        { value: '3', label: '银行卡' }
      ],
      // 修改
      editVisible: false,
      ruleEditForm: {
        is_send: ''
      },
      rulesEdit: {
        order_price: [
          { required: true, message: '订单金额必填', trigger: 'blur' }
        ],
        pay_status: [
          { required: true, message: '是否付款必填', trigger: 'blur' }
        ],
        order_pay: [
          { required: true, message: '付款方式必填', trigger: 'blur' }
        ],
        is_send: [{ required: true, message: '是否发货必填', trigger: 'blur' }]
      },
      total: 0,
      tableData: [],
      queryParams: {
        pagenum: 1,
        pagesize: 5,
        query: ''
      }
    }
  },
  mounted () {
    this.search()
  },
  created () {},
  methods: {
    changeDisavled (val) {
      if (val === '1') {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    changeDisavled2 (val) {
      if (val !== '0') {
        this.disabled2 = false
      } else {
        this.disabled2 = true
      }
    },
    handleClose () {
      this.editVisible = false
      this.roleVisible = false
    },
    // 地址
    showAddressForm (row) {
      this.roleVisible = true
    },
    AddressSubmit () {
      this.roleVisible = false
    },
    // 修改
    async showEditForm (row) {
      this.ruleEditForm = row
      if (row.is_send === '否') {
        this.ruleEditForm.is_send = '0'
      } else {
        this.ruleEditForm.is_send = '1'
      }
      this.editVisible = true
    },
    editSubmit () {
      this.$refs.refEditForm.validate(async (valid) => {
        if (valid) {
          const id = this.ruleEditForm.order_id
          const params = {
            is_send: this.ruleEditForm.is_send, // 订单是否发货
            order_pay: this.ruleEditForm.order_pay, // 订单支付方式
            order_price: this.ruleEditForm.order_price, // 订单价格
            order_number: this.ruleEditForm.order_number, // 订单编码(数量)
            pay_status: this.ruleEditForm.pay_status// 支付状态
          }
          console.log(params)
          const {
            data: { meta }
          } = await this.$http.put(`orders/${id}`, params)
          if (meta.status !== 201) return this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.getTable()
          this.editVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCurrentChange (val) {
      this.queryParams.pagenum = val
      this.getTable()
    },
    search () {
      this.queryParams.pagenum = 1
      this.getTable()
    },
    async getTable () {
      const {
        data: { data }
      } = await this.$http.get('orders', { params: this.queryParams })
      console.log(data)
      this.tableData = data.goods
      this.total = data.total
    }
  }
}
</script>

<style scoped lang='less'>
</style>
