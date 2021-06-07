<template>
  <div class="goods-container">
    <my-bread>
      <template v-slot:Menus>商品管理</template>
      <template v-slot:Menu>商品列表</template>
    </my-bread>
    <!-- <router-view></router-view> -->
    <el-card>
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
        <el-col :span="18">
          <el-button type="primary" plain size="small" @click="showAddForm()"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
            <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%" size="small">
        <el-table-column label="#" type="index" align="center">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" align="center">
        </el-table-column>
        <el-table-column prop="goods_price" label="价格" align="center">
        </el-table-column>
        <el-table-column prop="goods_weight" label="重量" align="center"> </el-table-column>
        <el-table-column label="创建时间" width="200" align="center">
          <template slot-scope="scope">
            {{scope.row.add_time|ft}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" >
            <el-button-group>
              <el-button
                size="mini"
                round
                icon="el-icon-edit"
                @click="showEditForm(scope.row.goods_id)"
              ></el-button>
              <el-button
                size="mini"
                 round
                icon="el-icon-delete"
                @click="DeleteVisible(scope.row.goods_id)"
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
        <!-- 编辑用户 -->
    <el-dialog
      title="编辑用户"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleEditForm"
        :rules="rulesEdit"
        ref="ruleEditForm"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input
            v-model="ruleEditForm.goods_name"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="ruleEditForm.goods_price" size="small"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="ruleEditForm.goods_number" size="small"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="ruleEditForm.goods_weight" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryParams: {
        pagenum: 1, // 页码
        pagesize: 5, // 每页多少条
        query: ''// 搜索内容
      },
      // 总条数
      total: 0,
      tableData: [],
      // 修改
      editVisible: false,
      ruleEditForm: {},
      rulesEdit: {
        goods_name: [
          { required: true, message: '商品名称必填', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '价格必填', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '数量必填', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '重量必填', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    handleClose () {
      this.editVisible = false
    },
    search () {
      this.queryParams.pagenum = 1
      this.getData()
    },
    async getData () {
      const { data: { data, meta } } = await this.$http.get('goods', { params: this.queryParams })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.tableData = data.goods
      this.total = data.total
    },
    showAddForm () {
      this.$router.push('/goods/add')
    },
    // 修改
    async showEditForm (id) {
      const { data: { data, meta } } = await this.$http.get(`goods/${id}`)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.ruleEditForm = data
      this.editVisible = true
    },
    editSubmit () {
      this.$refs.ruleEditForm.validate(async (valid) => {
        if (valid) {
          const { data: { meta } } = await this.$http.put(`goods/${this.ruleEditForm.goods_id}`, this.ruleEditForm)
          if (meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success('修改商品成功')
          this.getData()
          this.editVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    async DeleteVisible (id) {
      this.$confirm('是否删除该数据?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击了确认  发请求
          const { data: { meta } } = await this.$http.delete(`goods/${id}`)
          if (meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
          this.getData()
        })
        .catch(() => {})
    },
    handleCurrentChange (val) {
      this.queryParams.pagenum = val
      this.getData()
    }
  }
}
</script>

<style scoped lang='less'>
</style>
