<template>
  <div class="add-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="请按照步骤录入商品信息" type="info" center show-icon>
      </el-alert>
      <el-steps
        :active="active"
        finish-status="success"
        align-center
        style="margin: 15px 0"
      >
        <el-step
          :title="item"
          v-for="(item, i) in breadcrumbList"
          :key="i"
        ></el-step>
      </el-steps>
      <el-tabs :before-leave="changeTabBefore" tab-position="left">
        <el-tab-pane label="基本信息">
          <el-form
            :model="form"
            :rules="rulesAdd"
            ref="ruleAddForm"
            label-width="200px"
            autocomplete="off"
            size="small"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="form.goods_name"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                style="width: 200px"
                v-model="categoryValues"
                :options="categoryList"
                :props="{
                  value: 'cat_id',
                  label: 'cat_name',
                  expandTrigger: 'hover',
                }"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="form.goods_price"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="form.goods_number"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="form.goods_weight"
                style="width: 200px"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form label-width="200px">
            <el-form-item
              v-for="(item, i) in manyAttrs"
              :key="i"
              :label="item.attr_name"
            >
              <el-tag
                size="small"
                v-for="(tag, i) in item.attr_vals.split(',')"
                :key="i"
                >{{ tag == "" ? "空" : tag }}</el-tag
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form label-width="200px">
            <el-form-item
              v-for="(item, i) in onlyAttrs"
              :key="i"
              :label="item.attr_name"
            >
              <el-tag size="small" style="width: 300px">{{
                item.attr_vals == "" ? "空" : item.attr_vals
              }}</el-tag>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload
            :on-success="handleSuccess"
            :headers="HeadersRes"
            :action="BasUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor v-model="form.goods_introduce"></quill-editor>
          <el-button
            style="margin-top: 20px"
            type="success"
            @click="addSubmit()"
            >保存商品</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      // 是当前步骤的索引
      active: 0,
      breadcrumbList: [
        '基本信息',
        '商品参数',
        '商品属性',
        '商品图片',
        '商品内容'
      ],
      // 添加商品表单数据
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 参数列表数据
      manyAttrs: [],
      onlyAttrs: [],
      rulesAdd: {
        goods_name: [
          { required: true, message: '商品名称必填', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '分类必须是第三级', trigger: 'change' }
        ],
        goods_price: [
          { required: true, message: '商品价格必填', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量必填', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量必填', trigger: 'blur' }
        ]
      },
      // 级联相关的数据
      categoryList: [],
      categoryValues: [],
      // 图片上传
      dialogImageUrl: '',
      dialogVisible: false,
      BasUrl: this.$http.defaults.baseURL + 'upload',
      HeadersRes: {
        Authorization: local.getUser()
      }
    }
  },
  created () {},
  mounted () {
    this.getCategories()
  },
  methods: {
    // 图片删除
    handleRemove (file, fileList) {
      // 删除图片后台触发的事件
      console.log(file, fileList)
      // 移除 form.pics 中对应的图片对象
      // 根据索引删除一条即可
      // 在file中可以获取当前删除图片的临时路径
      // 根据路径去 form.pics 获取对应的索引
      const tmpPath = file.response.data.tmp_path
      const index = this.form.pics.findIndex((item) => item.pic === tmpPath)
      this.form.pics.splice(index, 1)
    },
    // 预览图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //  图片上传
    handleSuccess (res) {
      this.form.pics.push({ pic: res.data.tmp_path })
      console.log(this.form.pics)
    },
    // 获取分类列表
    async getCategories () {
      const {
        data: { data, meta }
      } = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.categoryList = data
      console.log(data)
    },
    // 切换tab
    changeTabBefore (activeName, oldActiveName) {
      console.log(activeName, oldActiveName)
      // 对整个表单进行校验
      // 如果校验失败 阻止切换
      // return false 即可阻止   必须在当前函数的作用域下有效
      // return Promise 对象 执行 reject 阻止
      if (oldActiveName === '0') {
        return new Promise((resolve, reject) => {
          this.$refs.ruleAddForm.validate((valid) => {
            if (valid) {
              // 校验成功  随着tab的索引去切步骤条
              this.active = +activeName
              // 获取第二个和第三个选项卡的数据
              this.getParams('many')
              this.getParams('only')
              resolve()
            } else {
              reject(new Error('校验表单失败'))
            }
          })
        })
      } else {
        // 如果不是第一个选项  随着tab的索引去切步骤条
        this.active = +activeName
      }
    },
    async getParams (type) {
      const id = this.categoryValues[2]
      const {
        data: { data, meta }
      } = await this.$http.get(`categories/${id}/attributes`, {
        params: { sel: type }
      })
      if (meta.status !== 200) return this.$message.error('获取参数数据失败')
      this[type + 'Attrs'] = data
    },
    handleChange (value) {
      console.log(value)
      if (value.length === 3) {
        // 以为','分割的分类列表
        this.form.goods_cat = value.join(',')
        // 他这里是为了以 ','分割 比如刚才的值是[1,3,6],这里就变成了 '1,3,6'
      } else {
        this.form.goods_cat = ''
      }
    },
    async addSubmit () {
      this.form.attrs = [...this.manyAttrs, ...this.onlyAttrs]
      const {
        data: { meta }
      } = await this.$http.post('goods', this.form)
      if (meta.status !== 201) return this.$message.error('商品录入失败')
      this.$message.success('商品录入成功')
      // 3. 去列表页
      this.$router.push('/goods')
    }
  }
}
</script>

<style scoped lang='less'>
.el-tag {
  margin: 5px;
}
</style>
