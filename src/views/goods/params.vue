<template>
  <div class="params-container">
    <my-bread>
      <template v-slot:Menus>商品管理</template>
      <template v-slot:Menu>分类参数</template>
    </my-bread>
    <el-card>
      <el-alert
        title="注意：只有第三级分类才能设置参数。"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-form style="margin: 15px 0">
        <el-form-item label="选择商品分类: ">
          <el-cascader
            size="small"
            v-model="categoryValues"
            :options="ascaderOptions"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="success"
            size="small"
            :disabled="disabled"
            @click="addShow()"
            >添加动态参数</el-button
          >
          <el-table :data="manyData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(tag, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="delTag(scope.row, i)"
                >
                  {{ tag }}
                </el-tag>
                <el-tag
                  v-show="!scope.row.inputShow"
                  @click="showInput(scope.row)"
                  :disable-transitions="true"
                  class="w100"
                  size="normal"
                >
                  +添加tag
                </el-tag>
                <el-input
                  size="small"
                  v-model="scope.row.inputValue"
                  @blur="hideInput(scope.row)"
                  @keyup.native.enter="hideInput(scope.row)"
                  :ref="'input' + scope.row.attr_id"
                  v-show="scope.row.inputShow"
                  class="w100 newInput"
                >
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="120px">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  icon="el-icon-edit"
                  circle
                  @click="editShow(scope.row)"
                ></el-button>
                <el-button
                  size="small"
                  icon="el-icon-delete"
                  @click="delParams(scope.row.attr_id)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="success"
            size="small"
            :disabled="disabled"
            @click="addShow()"
            >添加静态参数</el-button
          >
          <el-table :data="onlyData" style="width: 100%">
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="属性值">
              <template slot-scope="scope">
                <el-tag size="normal" style="width: 300px">{{
                  scope.row.attr_vals
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  icon="el-icon-edit"
                  circle
                  @click="editShow(scope.row)"
                ></el-button>
                <el-button
                  size="small"
                  icon="el-icon-delete"
                  @click="delParams(scope.row.attr_id)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数 -->
    <el-dialog
      :title="activeName === 'many' ? '添加动态参数' : '添加静态参数'"
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
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="ruleAddForm.attr_name" size="small"></el-input>
        </el-form-item>
        <el-form-item
          v-if="activeName !== 'many'"
          label="属性值: "
          prop="attr_vals"
        >
          <el-input v-model="ruleAddForm.attr_vals" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数 -->
    <el-dialog
      :title="activeName == 'many' ? '修改动态参数' : '修改静态参数'"
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
        <el-form-item label="属性名称: " prop="attr_name">
          <el-input v-model="ruleEditForm.attr_name" size="small"></el-input>
        </el-form-item>
        <el-form-item
          v-if="activeName !== 'many'"
          label="属性值: "
          prop="attr_vals"
        >
          <el-input v-model="ruleEditForm.attr_vals" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      onlyData: [], // 静态
      manyData: [], // 动态
      ascaderOptions: [],
      categoryValues: [],
      // tab
      activeName: 'many',
      // 控制按钮的禁用状态
      disabled: true,
      inputVisible: false,
      inputValue: '',
      // 修改
      editVisible: false,
      ruleEditForm: {},
      rulesEdit: {
        attr_name: [
          { required: true, message: '属性名称不能为空', trigger: 'blur' }
        ],
        attr_vals: [
          { required: true, message: '属性值不能为空', trigger: 'blur' }
        ]
      },
      // 添加
      addVisible: false,
      ruleAddForm: {
        attr_name: '',
        attr_vals: ''
      }
    }
  },
  mounted () {
    this.getCascaderData()
  },
  methods: {
    handleClose () {
      this.editVisible = false
      this.addVisible = false
    },
    // 显示添加框
    addShow () {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.refAddForm.resetFields()
      })
    },
    // 添加参数
    addParams () {
      this.$refs.refAddForm.validate(async (valid) => {
        if (valid) {
          const {
            data: { meta }
          } = await this.$http.post(
            `categories/${this.categoryValues[2]}/attributes`,
            {
              attr_name: this.ruleAddForm.attr_name,
              attr_sel: this.activeName,
              attr_vals: this.ruleAddForm.attr_vals
            }
          )
          if (meta.status !== 201) return this.$message.error('添加参数失败')
          this.$message.success('添加参数成功')
          // 更新当前的列表
          this.getParams(this.categoryValues[2])
          this.addVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 显示修改框
    async editShow (row) {
      this.editVisible = true
      const id = this.categoryValues[2]
      const attrId = row.attr_id
      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${id}/attributes/${attrId}`, {
        params: { attr_sel: this.activeName }
      })
      if (meta.status !== 200) return this.$message.error('获取参数失败')
      this.ruleEditForm = data
    },
    // 修改该参数
    editParams () {
      this.$refs.refEditForm.validate(async (valid) => {
        if (valid) {
          console.log(this.activeName)
          // :id 传 分类的ID
          const id = this.categoryValues[2]
          // :attrid 就是当前的参数ID
          const row = this.ruleEditForm
          const {
            data: { meta }
          } = await this.$http.put(
            `categories/${id}/attributes/${row.attr_id}`,
            {
              attr_name: row.attr_name,
              attr_sel: this.activeName,
              attr_vals: row.attr_vals
            }
          )
          if (meta.status !== 200) return this.$message.error('修改参数失败')
          this.$message.success('修改参数成功')
          // 更新当前的列表
          this.getParams(this.categoryValues[2])
          this.editVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除该参数
    delParams (attrId) {
      this.$confirm('是否删除该参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // :id 传 分类的ID
          const id = this.categoryValues[2]
          // :attrid 就是当前的参数ID
          const {
            data: { meta }
          } = await this.$http.delete(`categories/${id}/attributes/${attrId}`)
          if (meta.status !== 200) return this.$message.error('删除参数失败')
          this.$message.success('删除参数成功')
          // 更新当前的列表
          this.getParams(this.categoryValues[2])
        })
        .catch(() => {})
    },
    // 删除tag
    delTag (row, i) {
      // 删除tag的效果  并没有真正的去修改后台的数据
      row.attr_vals.splice(i, 1)
      this.editAttr(row)
    },
    // 点击显示 输入框
    showInput (row) {
      row.inputShow = true
      // dom.focus() 获取焦点  dom 当前行的input
      console.log(this.$refs['input' + row.attr_id])
      this.$nextTick(() => {
        this.$refs['input' + row.attr_id].focus()
      })
    },
    // 隐藏input事件
    hideInput (row) {
      row.inputShow = false
      if (row.inputValue) {
        // 当前input输入的内容 追加到 attr_vals 中
        row.attr_vals.push(row.inputValue)
        // 把修改好的数据给后台
        this.editAttr(row)
        row.inputValue = ''
      }
    },
    async editAttr (row) {
      // 根据现在的arr去修改后台的参数的值
      const {
        data: { meta }
      } = await this.$http.put(
        `categories/${this.categoryValues[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (meta.status !== 200) return this.$message.error('更新参数值失败')
      this.$message.success('更新参数值成功')
    },
    // 分类联级选择
    async getCascaderData () {
      const {
        data: { data, meta }
      } = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.ascaderOptions = data
    },
    // 联级切换事件
    handleChange (val) {
      console.log(val.length)
      if (val.length !== 3) {
        this.disabled = true
        this.categoryValues = []
        this.manyData = []
        this.onlyData = []
      } else {
        this.disabled = false
        this.getParams(this.categoryValues[2])
      }
    },
    // tab切换
    handleClick () {
      this.getParams(this.categoryValues[2])
    },
    async getParams (id) {
      const {
        data: { data }
      } = await this.$http.get(`categories/${id}/attributes`, {
        params: { sel: this.activeName }
      })
      if (this.activeName === 'many') {
        data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          // 添加字段 inputShow 控制tag和input显示隐藏
          item.inputShow = false
          item.inputValue = ''
        })
        this.manyData = data
      }
      this.onlyData = data
    }
  }
}
</script>

<style scoped lang='less'>
.el-tag {
  margin: 5px;
}
.w100 {
  width: 100px;
}
.newInput {
  margin: 5px;
}
</style>
