<template>
  <div class="categories-container">
    <my-bread>
      <template v-slot:Menus>商品管理</template>
      <template v-slot:Menu>商品分类</template>
    </my-bread>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-button type="primary" plain size="small" @click="showAddForm()"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        :indent="50"
        style="width: 100%; margin-bottom: 20px"
        size="small"
        row-key="cat_id"
      >
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column label="等级" align="center">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="
                scope.row.cat_level === 0
                  ? ''
                  : scope.row.cat_level === 1
                  ? 'success'
                  : 'warning'
              "
              >{{
                scope.row.cat_level === 0
                  ? "一级分类"
                  : scope.row.cat_level === 1
                  ? "二级分类"
                  : "三级分类"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" align="center">
          <template slot-scope="scope">
            <i
              :class="
                !scope.row.cat_deleted ? 'el-icon-success' : 'el-icon-error'
              "
              :style="!scope.row.cat_deleted ? 'color: green' : 'color: red'"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                round
                icon="el-icon-edit"
                @click="showEditForm(scope.row.cat_id)"
              ></el-button>
              <el-button
                size="mini"
                round
                icon="el-icon-delete"
                @click="DeleteVisible(scope.row.cat_id)"
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
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleAddForm"
        :rules="rulesEdit"
        ref="refAddForm"
        label-width="100px"
      >
        <el-form-item label="父级分类: ">
          <el-cascader
            ref="cascaderHandle"
            size="small"
            clearable
            style="width: 100%"
            v-model="ruleAddForm.categoryValues"
            :options="ascaderOptions"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
            }"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="ruleAddForm.cat_name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog
      title="编辑分类"
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
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ruleEditForm.cat_name" size="small"></el-input>
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
      tableData: [], // 表格数据
      queryParams: {
        pagenum: 1,
        pagesize: 5
      },
      total: 1,
      editVisible: false, // 编辑默认隐藏
      ruleEditForm: {},
      rulesEdit: {
        cat_name: [
          { required: true, message: '分类名称必填', trigger: 'blur' }
        ]
      },
      addVisible: false, // 添加默认隐藏
      ruleAddForm: {
        cat_name: '',
        categoryValues: []
      },
      ascaderOptions: [] // 分类数据
    }
  },
  methods: {
    // 切换cascader事件
    handleChange (val) {
      this.ruleAddForm.categoryValues = val
      this.$refs.cascaderHandle.dropDownVisible = false // 监听值发生变化就关闭它
    },
    // 统一x
    handleClose () {
      this.editVisible = false
      this.addVisible = false
    },
    // pagenum改变的时候触发
    handleCurrentChange (val) {
      this.queryParams.pagenum = val
      this.getData()
    },
    // 添加模态框显示
    showAddForm () {
      this.addVisible = true
      this.$nextTick(() => {
        this.ruleAddForm.categoryValues = []
        this.$refs.refAddForm.resetFields()
        this.getCategories()
      })
    },
    async getCategories () {
      const {
        data: { data, meta }
      } = await this.$http.get('categories', { params: { type: 2 } })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.ascaderOptions = data
    },
    addSubmit () {
      this.$refs.refAddForm.validate(async (valid) => {
        if (valid) {
          const row = this.ruleAddForm.categoryValues
          let catPid = ''
          if (row.length === 0) {
            catPid = 0
          } else {
            catPid = row[row.length - 1]
          }
          const catLevel = row.length
          const {
            data: { meta }
          } = await this.$http.post('categories', {
            cat_pid: catPid,
            cat_name: this.ruleAddForm.cat_name,
            cat_level: catLevel
          })
          if (meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
          this.getData()
          this.addVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑模态框显示
    async showEditForm (id) {
      this.editVisible = true
      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${id}`)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.ruleEditForm = data
    },
    editSubmit () {
      this.$refs.refEditForm.validate(async (valid) => {
        if (valid) {
          const row = this.ruleEditForm
          const {
            data: { meta }
          } = await this.$http.put(`categories/${row.cat_id}`, {
            cat_name: row.cat_name
          })
          if (meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success('修改分类成功')
          this.getData()
          this.editVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    DeleteVisible (id) {
      this.$confirm('是否删除该数据?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击了确认  发请求
          const {
            data: { meta }
          } = await this.$http.delete(`categories/${id}`)
          if (meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
          this.getData()
        })
        .catch(() => {})
    },
    async getData () {
      // 获取表格数据
      const {
        data: { data, meta }
      } = await this.$http.get('categories', { params: this.queryParams })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.tableData = data.result
      this.total = data.total
    }
  },
  mounted () {
    this.getData()
    this.timer = setInterval(function () {
      document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click()
        }
      })
    }, 1000)
  }
}
</script>

<style scoped lang='less'>
</style>
