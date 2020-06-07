<template>
    <div>
        <div class="block" style="padding-left:20px;padding-top:20px;">
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
            <el-button :loading="loading" @click="reload" type="primary" size="medium" style="margin-left: 12px;" :disabled="disabled">
                検索
            </el-button>
            <el-button @click="drawer = true" type="primary" size="medium" style="margin-left: 12px;" :disabled="dataListDisabled">
                データ表示
            </el-button>
        </div>
        <br>
        <div class="chart-container">
            <chart height="100%" width="100%" />
        </div>
        <Chart ref="chart" style="height:0px;"></Chart>
        <el-drawer
            title="なし"
            size="50%"
            :visible.sync="drawer"
            :direction="direction"
            :with-header="false"
            style="overflow-x: auto; overflow-y: auto;">
            <div class="app-container">
                <el-table
                    :data="tableData"
                    element-loading-text="Loading"
                    :header-cell-style="getRowHeaderClass"
                    border
                    fit
                    highlight-current-row
                    style="font-size: 12px;"
                    :row-style="{height:'36px'}"
                    :cell-style="{padding:'0px'}"
                >
                    <el-table-column
                        width="200"
                        v-for="col in cols"
                        :prop="col.prop" :label="col.label" >
                    </el-table-column>
                </el-table>
            </div>
        </el-drawer>
    </div>
</template>

<script>
  import Chart from '@/components/Charts/MixChart'
  import { getUsers } from '@/api/worktimes'

  export default {
    name: 'MixChart',
    components: { Chart },
    data() {
      return {
        month: '',
        user: '',
        users: [],
        disabled: false,
        dataListDisabled: true,
        loading: false,
        drawer: false,
        direction: 'rtl',
        tableData: null,
        cols: null
      }
    },
    mounted() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.month = year + "-" + (month < 10 ? "0" + month : month);
      this.getNimbusUsers();
    },
    methods: {
      async reload() {
        this.loading = true;
        this.dataListDisabled = true;
        await this.$refs.chart.reload(this.month, this.user);
        if (this.user) {
          let username;
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == this.user) {
              username = this.users[i].name;
              break;
            }
          }
          this.$refs.chart.setOption({
            title: {
              text: '工数統計（月単位）  --  ' + username,
            }
          });
        }
        this.tableData = this.$refs.chart.getTableData();
        this.cols = this.$refs.chart.getCols();
        this.loading = false;
        this.dataListDisabled = false;
      },
      getNimbusUsers() {
        getUsers().then(response => {
          this.users = response.data;
        });
      },
      getRowHeaderClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background:#2e718c;color:#fff;padding:0px;height:36px;'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>
    .chart-container{
        position: relative;
        width: 100%;
        height: calc(100vh - 128px);
    }
</style>
