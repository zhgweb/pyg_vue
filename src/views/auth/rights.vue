<template>
  <div class="rights-container">
    <my-bread>
      <template v-slot:Menus>权限管理</template>
      <template v-slot:Menu>权限列表</template>
    </my-bread>
    <el-card>
      <el-table
        size="small"
        height="500px"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column width="100px" label="#" type="index">
        </el-table-column>
        <el-table-column property="authName" label="权限名称">
        </el-table-column>
        <el-table-column property="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag
              size="small"
              :type="scope.row.level === '0'? '': scope.row.level === '1'? 'success': 'warning'"
              >{{ scope.row.level === "0" ? "一级权限": scope.row.level === "1" ? "三级权限": "三级权限"}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      // 获取权限列表数据
      const {
        data: { data, meta }
      } = await this.$http.get('rights/list')
      if (meta.status !== 200) { return this.$message.error('获取权限列表数据失败') }
      this.tableData = data
    }
  }
}
</script>

<style scoped lang='less'></style>
