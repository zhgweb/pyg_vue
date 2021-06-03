<template>
  <div class="roles-container">
    <my-bread>
      <template v-slot:Menus>权限管理</template>
      <template v-slot:Menu>角色列表</template>
    </my-bread>
    <el-card class="box-card">
      <el-button type="primary" plain size="small" @click="showAddForm()">添加角色</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <span v-if="!scope.row.child.length" style="color: #eee">暂无分配任何权限</span>
            <!-- 一级权限 -->
            <el-row
              style="border-bottom: 1px solid #eee"
              :style="{ 'border-top': i === 0 ? '1px solid #eee' : 'none' }"
              v-for="(item, i) in scope.row.child"
              :key="item.id">
              <el-col :span="4">
                <el-tag closable size="small" @close="DelClose(scope.row,item.id)">{{ item.authName }}</el-tag>
                <span class="el-icon-caret-right"></span>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="20">
                <el-row
                  :style="{ 'border-top': i === 0 ? 'none' : '1px solid #eee' }"
                  v-for="(itemChild, i) in item.child"
                  :key="itemChild.id">
                  <el-col :span="8">
                    <el-tag closable size="small" type="success" @close="DelClose(scope.row,itemChild.id)">{{itemChild.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                   <!-- 三级权限 -->
                  <el-col :span="16">
                    <el-tag
                      closable
                      size="small"
                      v-for="threeChild in itemChild.child"
                      :key="threeChild.id"
                      type="warning" @close="DelClose(scope.row,threeChild.id)">{{ threeChild.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
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
    </el-card>
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      width="400px"
      :before-close="handleClose">
      <el-form
        :model="ruleAddForm"
        :rules="rules"
        ref="ruleAddForm"
        label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleAddForm.roleName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleAddForm.roleDesc" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
      </span>
    </el-dialog>
      <!-- 编辑角色 -->
    <el-dialog
      title="编辑角色"
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      width="400px"
      :before-close="handleClose">
      <el-form
        :model="ruleEditForm"
        :rules="rules"
        ref="ruleEditForm"
        label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleEditForm.roleName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleEditForm.roleDesc" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
        <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :close-on-click-modal="false"
      :visible.sync="treeVisible"
      width="400px"
      :before-close="handleClose"
    >
        <el-tree
    ref="tree"
  :data="treeData"
  show-checkbox
  node-key="id"
  default-expand-all
  :default-checked-keys="checkedKeyList"
  :props="defaultProps">
</el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treeVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleSubmit()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import { delete } from 'vue/types/umd'
export default {
  data () {
    return {
      // 分配权限
      treeVisible: false,
      checkedKeyList: [],
      roleID: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 表格数据
      tableData: [],
      // 添加角色
      addVisible: false,
      ruleAddForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色
      editVisible: false,
      ruleEditForm: {},
      rules: {
        roleName: { required: true, message: '角色名称必填', trigger: 'blur' },
        roleDesc: { required: true, message: '角色名称必填', trigger: 'blur' }
      }
    }
  },
  created () {

  },
  mounted () {
    this.getData()
  },
  methods: {
    // 统一 x
    handleClose () {
      this.addVisible = false
      this.editVisible = false
      this.treeVisible = false
    },
    // 删除权限
    DelClose (row, rightId) {
      this.$confirm('是否删除该权限', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { data, meta } } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
        if (meta.status !== 200) return this.$message.error('删除失败')
        // this.getData()
        this.$message.success('删除成功')
        // 更新整个列表  重新展开后  看到操作结果
        // this.getData()
        // 局部更新 当前行的数据  child 数据
        // 当前修改后返回的数据 就是child数据
        // 处理成需要的数据结构
        data.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
            delete item.children
          })
        })
        row.child = data
      }).catch((e) => {
        console.log(e)
      })
    },
    // 添加角色
    showAddForm () {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.ruleAddForm.resetFields()
      })
    },
    addSubmit (ruleAddForm) {
      this.$refs.ruleAddForm.validate(async (valid) => {
        if (valid) {
          const { data: { meta } } = await this.$http.post('roles', this.ruleAddForm)
          if (meta.status !== 201) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
          this.getData()
          this.addVisible = false
        }
      })
    },
    // 编辑角色
    async showEditForm (id) {
      this.editVisible = true
      const { data: { data, meta } } = await this.$http.get(`roles/${id}`)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.ruleEditForm = data
    },
    editSubmit (ruleEditForm) {
      this.$refs.ruleEditForm.validate(async (valid) => {
        if (valid) {
          const { data: { meta } } = await this.$http.put(`roles/${this.ruleEditForm.roleId}`, { roleName: this.ruleEditForm.roleName, roleDesc: this.ruleEditForm.roleDesc })
          if (meta.status !== 200) return this.$message.error(meta.msg)
          this.$message.success(meta.msg)
          this.getData()
          this.editVisible = false
        }
      })
    },
    // 删除角色
    DeleteVisible (id) {
      this.$confirm('是否删除该数据', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { meta } } = await this.$http.delete(`roles/${id}`)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.getData()
        this.$message.success(meta.msg)
      }).catch((e) => {
        console.log(e)
      })
    },
    // 显示分配权限
    async showRoleForm (row) {
      const { data: { data } } = await this.$http.get('rights/tree')
      this.treeData = data
      const arr = []
      row.children.map(item => {
        item.children.map(item => {
          item.children.map(item => {
            return arr.push(item.id)
          })
        })
      })
      this.checkedKeyList = arr
      // 获取数据 进行选中  再展示对话框
      this.treeVisible = true
      // 设置当前分配权限的角色ID
      this.roleID = row.id
    },
    // 确定修改角色授权
    async roleSubmit () {
      // 合并全选与半选
      const treeDom = this.$refs.tree
      const checkedArr = treeDom.getCheckedKeys()// 获取目前被选中的节点的 key 所组成的数组
      const halfCheckArr = treeDom.getHalfCheckedKeys()// 目前半选中的节点的 key 所组成的数组
      const arr = [...checkedArr, ...halfCheckArr]
      const { data: { meta } } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: arr.join(',') })
      if (meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.treeVisible = false
      this.getData()
    },
    // 获取表格
    async getData () {
      const {
        data: { data, meta }
      } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      // 表格的data对数据格式是有固定的要求
      // 以前数据中没有 children 选项
      // 默认认为 有展开内容 而且回去使用children数据
      // 如果数据的结构不符合要求  报错
      // {id: 1, roleName: '管理员', roleDesc: '管理员123'}
      // 把后台返回的数据 处理一下  去除children数据  保留children有的数据
      data.forEach(item => {
        item.child = item.children
        delete item.children
        item.child.forEach(item => {
          item.child = item.children
          delete item.children
          item.child.forEach(item => {
            item.child = item.children
            delete item.children
          })
        })
      })
      this.tableData = data
    }
  }
}
</script>

<style scoped lang='less'>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 5px;
}
</style>
