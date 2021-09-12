<template>
  <div class="table-group">
    <table v-for="(table, index) in tableList" :key="index" class="el-table el-table--border">
      <thead>
        <tr class="el-table__row">
          <th class="el-table__cell"></th>
          <th class="el-table__cell">
            <div class="cell">父规格</div>
          </th>
          <th v-if="hasSubSpec(table.rows)" class="el-table__cell">
            <div class="cell">子规格</div>
          </th>
          <th
            v-for="(spec, colSpecIndex) in table.cols" :colspan="spec.children && spec.children.length || 1" :key="colSpecIndex"
            class="el-table__cell"
          >
            <el-dropdown>
              <el-button icon="el-icon-plus" size="mini" circle></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-circle-plus-outline"
                  @click.native="addSubSpec(spec, colSpecIndex, table.cols)"
                >添加子规格</el-dropdown-item>
                <el-dropdown-item
                  v-if="spec.children && spec.children.length > 0"
                  icon="el-icon-delete"
                  @click.native="removeSubSpec(spec, colSpecIndex, table.cols)"
                >删除子规格</el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-circle-plus-outline"
                  divided
                  @click.native="addParentSpec(spec, colSpecIndex, table.cols)"
                >添加父规格</el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-delete"
                  @click.native="removeParentSepc(spec, colSpecIndex, table.cols)"
                >删除父规格</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="el-table__row">
          <th class="el-table__cell">
            <div class="cell">父规格</div>
          </th>
          <td
            :colspan="hasSubSpec(table.rows) ? 2 : 1"
            :rowspan="hasSubSpec(table.cols) ? 2 : 1"
            class="el-table__cell"
          >
            <div class="cell">规格</div>
          </td>
          <td
            v-for="(spec, colSpecIndex) in table.cols"
            :key="colSpecIndex"
            :colspan="spec.children && spec.children.length || 1"
            :rowspan="spec.children && spec.children.length > 0 ? 1 : 2"
            class="el-table__cell"
          >
            <div class="cell">{{ spec.value }}</div>
          </td>
        </tr>
        <tr class="el-table__row">
          <th v-if="hasSubSpec(table.cols)" class="el-table__cell">
            <div class="cell">子规格</div>
          </th>
          <template v-for="(spec, colSpecIndex) in table.cols">
            <td
              v-for="(subSpec, subSpecIndex) in spec.children" :key="colSpecIndex + '-' + subSpecIndex"
              class="el-table__cell"
            >
              <div class="cell">{{ subSpec.value }}</div>
            </td>
          </template>
        </tr>
        <template v-for="(spec, rowSpecIndex) in table.rows">
          <tr
            v-for="(subSpec, subSpecIndex) in (spec.children && spec.children.length > 0 ? spec.children : 1)"
            :key="rowSpecIndex + '-' + subSpecIndex" class="el-table__row"
          >
            <template v-if="subSpecIndex === 0">
              <td :rowspan="spec.children.length || 1" class="el-table__cell">
                <el-dropdown>
                  <el-button icon="el-icon-plus" size="mini" circle></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      icon="el-icon-circle-plus-outline"
                      @click.native="addSubSpec(spec, rowSpecIndex, table.rows)"
                    >添加子规格</el-dropdown-item>
                    <el-dropdown-item
                      v-if="spec.children && spec.children.length > 0"
                      icon="el-icon-delete"
                      @click.native="removeSubSpec(spec, rowSpecIndex, table.rows)"
                    >删除子规格</el-dropdown-item>
                    <el-dropdown-item
                      icon="el-icon-circle-plus-outline"
                      divided
                      @click.native="addParentSpec(spec, rowSpecIndex, table.rows)"
                    >添加父规格</el-dropdown-item>
                    <el-dropdown-item
                      icon="el-icon-delete"
                      @click.native="removeParentSepc(spec, rowSpecIndex, table.rows)"
                    >删除父规格</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </td>
              <td :rowspan="spec.children.length || 1" :colspan="spec.children.length > 0 ? 1 : 2" class="el-table__cell">
                <div class="cell">{{ spec.value }}</div>
              </td>
            </template>
            <td v-if="subSpec !== 1" class="el-table__cell">
              <div class="cell">{{ subSpec.value }}</div>
            </td>
            <template v-for="(spec, colSpecIndex) in table.cols">
              <td v-for="num in (spec.children && spec.children.length || 1)" :key="colSpecIndex + '-' + num" class="el-table__cell">
                <div class="cell">待定</div>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tableGroup: null,
      tableList: tableList
    }
  },
  methods: {
    hasSubSpec (specList) {
      return specList && specList.length && specList.some(spec => spec.children && spec.children.length > 0)
    },
    addSubSpec (spec, specIndex, specList) {
      if (!spec.children) {
        spec.children = []
      }
      spec.children.push({
        value: '子规格-新增'
      })
      // 使其响应式
      specList.splice(specIndex, 1, spec)
    },
    removeSubSpec (spec, specIndex, specList) {
      if (!spec.children || spec.children.length === 0) {
        return
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        spec.children.splice(spec.children.length - 1, 1)
      }).catch(() => {})
    },
    addParentSpec (spec, specIndex, specList) {
      specList.splice(specIndex + 1, 0, {
        value: '父规格-新增',
        children: []
      })
    },
    removeParentSepc (spec, specIndex, specList) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        specList.splice(specIndex, 1)
      }).catch(() => {})
    }
  }
}

export const tableList = [
  {
    rows: Array(2).fill().map((item, i) => {
      return {
        value: '父规格' + i,
        children: Array(3).fill().map((item, subindex) => {
          return {
            value: '子规格' + i + '-' + subindex
          }
        })
      }
    }),
    cols: Array(2).fill().map((item, i) => {
      return {
        value: '父规格' + i,
        children: Array(3).fill().map((item, subindex) => {
          return {
            value: '子规格' + i + '-' + subindex
          }
        })
      }
    })
  },
  {
    rows: [
      {
        value: '父规格',
        children: Array(3).fill().map((item, subindex) => {
          return {
            value: '子规格' + subindex
          }
        })
      }
    ],
    cols: [
    ]
  }
]

</script>

<style scoped>
.table-group table {
  border-collapse: collapse;
  margin-bottom: 20px;
}
.table-group th,
.table-group td {
  text-align: center;
  white-space: nowrap;
}
.table-group th {
  color: #909399;
}
</style>
