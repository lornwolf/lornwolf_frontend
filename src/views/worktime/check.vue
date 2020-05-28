<template>
  <div class="app-container">
      <div class="block">
          <el-date-picker
              v-model="month"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月">
          </el-date-picker>
          <el-select filterable
                     v-model="user"
                     clearable
                     class="item-width">
              <el-option
                  v-for="item in users"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
          </el-select>
          <el-button :loading="loading" @click="fetchData" type="primary" size="medium" style="margin-left: 12px;" :disabled="disabled">検索
          </el-button>
      </div>
      <br>

      <el-card shadow="always">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          :header-cell-style="getRowHeaderClass"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="名前" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="日付" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.date}}
            </template>
          </el-table-column>
          <el-table-column label="活動" width="150" align="left">
            <template slot-scope="scope">
                {{ scope.row.action}}
            </template>
          </el-table-column>
          <el-table-column label="チケット" align="left">
            <template slot-scope="scope">
                {{ scope.row.ticket}}
            </template>、
          </el-table-column>
          <el-table-column label="コメント" align="left">
            <template slot-scope="scope">
                {{ scope.row.comment}}
            </template>
          </el-table-column>
              <el-table-column label="工数" width="60" align="left">
            <template slot-scope="scope">
                {{ scope.row.hours}}
            </template>
          </el-table-column>
          <el-table-column label="修正" width="160" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
                <a :href="scope.row.linkToTicket" target="_blank" style="color:blue">チケット</a>&nbsp;&nbsp;
                <a :href="scope.row.linkToTimeEntry" target="_blank" style="color:blue">工数記録</a>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>
import { checkWorkTimes } from '@/api/worktimes'

export default {
  data() {
    return {
      month: '',
      user: '',
      users: [
        {id: 'fengkai', name: '馮凱'},
        {id: 'zanghongwen', name: '臧宏文'},
        {id: 'lihuimin', name: '李慧敏'},
        {id: 'tianyulin', name: '田語林'},
        {id: 'lornwolf', name: '宋宗正'},
        {id: 'chenqu', name: '陳曲'},
        {id: 'songtao', name: '宋涛'},
      ],
      list: null,
      listLoading: true,
      loading: false,
      disabled: false
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    getCurrentDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      return year + "-" + (month < 10 ? "0" + month : month);
    },
    fetchData() {
      this.disabled = true;
      this.loading = true
      if (!this.month) {
        this.month = this.getCurrentDate();
      }
      this.listLoading = true
      checkWorkTimes(this.month, !this.user ? 'all' : this.user).then(response => {
        this.list = response.data
        this.listLoading = false
        this.loading = false
        this.disabled = false;
      })
    },
    getRowHeaderClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#2e718c;color:#fff;'
      } else {
        return ''
      }
    },
    reload() {
      this.fetchData();
    }
  }
}
</script>
