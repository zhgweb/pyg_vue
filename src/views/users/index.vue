<template>
  <div class="users-container">
    <my-bread>
      <template v-slot:Menus>用户管理</template>
      <template v-slot:Menu>用户列表</template>
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
        <el-col :span="18">
          <el-button type="primary" plain size="small" @click="showAddForm()"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- el-switch 默认使用布尔值  如果为true激活 反之...  -->
            <el-switch
              @change="updateState(scope.row.id, scope.row.mg_state)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ccc"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                round
                icon="el-icon-edit"
                @click="showEditForm(scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="DeleteVisible(scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                round
                icon="el-icon-setting"
                @click="showRoleForm(scope.row)"
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
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleAddForm"
        :rules="rules"
        ref="ruleAddForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleAddForm.username" size="small"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleAddForm.password" size="small"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleAddForm.email" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleAddForm.mobile" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="ruleEditForm.username"
            disabled
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleEditForm.email" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleEditForm.mobile" size="small"></el-input>
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
      <el-form label-width="100px">
        <el-form-item label="当前用户: ">
          <span>{{ roleUsername }}</span>
        </el-form-item>
        <el-form-item label="当前角色: ">
          <span>{{ roleRole_name }}</span>
        </el-form-item>
        <el-form-item label="分配角色: ">
          <el-select v-model="Rolevalue" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 定义  校验函数
    const checkMobile = (rule, value, callback) => {
      // rule 规则信息  value 验证的输入框的值  callback回调函数 (成功 失败)
      // 1开头 3456789 后面9数字
      // callback回调函数 (成功 不传任何 失败 传失败信息 错误对象)
      if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error('手机号不对'))
      }
      callback()
    }
    return {
      // 分配角色
      roleVisible: false,
      roleUsername: '',
      role_id: '',
      roleRole_name: '',
      options: [],
      Rolevalue: '',
      // 修改
      editVisible: false,
      ruleEditForm: {},
      rulesEdit: {
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 手机号必须自定义校验规则  通过自己的函数来校验 （rule,value,callback）
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 添加
      addVisible: false,
      ruleAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 手机号必须自定义校验规则  通过自己的函数来校验 （rule,value,callback）
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      total: 0,
      tableData: [],
      queryParams: {
        pagenum: 1,
        pagesize: 5,
        query: ''
      },
      mg_state: false
    }
  },
  mounted () {
    this.search()
  },
  created () {},
  methods: {
    handleClose () {
      this.addVisible = false
      this.editVisible = false
      this.roleVisible = false
    },
    // 分配角色
    async showRoleForm (row) {
      // 显示编辑对话框
      this.Rolevalue = ''
      this.roleVisible = true
      const {
        data: { data, meta }
      } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取用户数据失败')
      // 把数据展示表单内
      this.options = data
      this.roleUsername = row.username
      this.roleRole_name = row.role_name
      this.role_id = row.id
    },
    async roleSubmit () {
      console.log(this.role_id)
      const {
        data: { meta }
      } = await this.$http.put(`users/${this.role_id}/role`, {
        rid: this.Rolevalue
      })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.$message.success(meta.msg)
      this.roleVisible = false
      this.getTable()
    },
    // 修改
    async showEditForm (id) {
      // 显示编辑对话框
      this.editVisible = true
      // 可能需要重置表单
      // 填充数据
      // 发请求需要用户的ID
      const {
        data: { data, meta }
      } = await this.$http.get(`users/${id}`)
      if (meta.status !== 200) return this.$message.error('获取用户数据失败')
      // 把数据展示表单内
      this.ruleEditForm = data
    },
    editSubmit () {
      this.$refs.ruleEditForm.validate(async (valid) => {
        if (valid) {
          const {
            data: { meta }
          } = await this.$http.put(`users/${this.ruleEditForm.id}`, {
            email: this.ruleEditForm.email,
            mobile: this.ruleEditForm.mobile
          })
          if (meta.status !== 200) return this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.getTable()
          this.editVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加
    showAddForm () {
      this.addVisible = true
      // 下一帧  要做的事情
      this.$nextTick(() => {
        this.$refs.ruleAddForm.resetFields()
      })
    },
    addSubmit () {
      this.$refs.ruleAddForm.validate(async (valid) => {
        if (valid) {
          const {
            data: { meta }
          } = await this.$http.post('users', this.ruleAddForm)
          if (meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
          this.addVisible = false
          this.getTable()
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
      } = await this.$http.get('users', { params: this.queryParams })
      this.tableData = data.users
      this.total = data.total
    },
    // 修改状态
    async updateState (uId, type) {
      const {
        data: { meta }
      } = await this.$http.put(`users/${uId}/state/${type}`)
      if (meta.status !== 200) return this.$message.error('修改状态失败')
      this.$message.success('修改状态成功')
      this.getTable()
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
          } = await this.$http.delete(`users/${id}`)
          if (meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
          this.getTable()
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang='less'>
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
