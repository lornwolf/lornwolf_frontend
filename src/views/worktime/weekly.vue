<template>
    <div class="app-container">
        <div class="block">
            <el-date-picker
                v-model="week"
                type="week"
                format="yyyy 第 WW 周"
                @change="reload"
                value-format="yyyy-MM-dd"
                :picker-options="{firstDayOfWeek: 1}"
                :disabled="disabled"
                placeholder="选择周">
            </el-date-picker>
        </div>
        <br>

        <el-card style="max-width:1033px;" shadow="always">
            <el-table
                v-loading="listLoading"
                :data="data.worktimes"
                element-loading-text="Loading"
                :header-cell-style="getRowHeaderClass"
                border
                fit
                highlight-current-row>
                <el-table-column label="名前" width="110" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column :label="data.dates.monday" width="110" align="center" :render-header="renderheader">
                    <template slot-scope="scope">
                        <span v-if="scope.row.monday < 7.5 || scope.row.monday > 10" style="color:red">{{ scope.row.monday }}</span>
                        <span v-else style="color: black">{{ scope.row.monday }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="data.dates.tuesday" width="110" align="center" :render-header="renderheader">
                    <template slot-scope="scope">
                        <span v-if="scope.row.tuesday < 7.5 || scope.row.tuesday > 10" style="color:red">{{ scope.row.tuesday }}</span>
                        <span v-else style="color: black">{{ scope.row.tuesday }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="data.dates.wednesday" width="110" align="center" :render-header="renderheader">
                    <template slot-scope="scope">
                        <span v-if="scope.row.wednesday < 7.5 || scope.row.wednesday > 10" style="color:red">{{ scope.row.wednesday }}</span>
                        <span v-else style="color: black">{{ scope.row.wednesday }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="data.dates.thurday" width="110" align="center" :render-header="renderheader">
                    <template slot-scope="scope">
                        <span v-if="scope.row.thurday < 7.5 || scope.row.thurday > 10" style="color:red">{{ scope.row.thurday }}</span>
                        <span v-else style="color: black">{{ scope.row.thurday }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="data.dates.friday" width="110" align="center" :render-header="renderheader">
                    <template slot-scope="scope">
                        <span v-if="scope.row.friday < 7.5 || scope.row.friday > 10" style="color:red">{{ scope.row.friday }}</span>
                        <span v-else style="color: black">{{ scope.row.friday }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="data.dates.saturday" width="110" align="center" :render-header="renderheader">
                    <template slot-scope="scope">
                        <span>{{ scope.row.saturday }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="data.dates.sunday" width="110" align="center" :render-header="renderheader">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sunday }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="来週作業予定" width="110" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.nextWeek == '有'" style="color:black">有</span>
                        <span v-else style="color:red">無</span>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-button class="btn-add" :loading="downloadLoading" @click="download" type="primary" :disabled="disabled">
                週報出力
            </el-button>
        </el-card>
    </div>
</template>

<script>
    import { getWeeklyWorkTimes } from '@/api/worktimes'
    import api from '../../repository/worktimes'

    export default {
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'gray',
                    deleted: 'danger'
                }
                return statusMap[status]
            }
        },
        data() {
            return {
                week: '',
                data: null,
                listLoading: true,
                downloadLoading: false,
                disabled: false
            }
        },
        created() {
            this.fetchData()
        },
        methods: {
            getCurrentDate() {
                var date = new Date()
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                var day = date.getDate()
                month = (month < 10 ? '0' + month : month)
                day = (day < 10 ? '0' + day : day)
                return year + '-' + month + '-' + day
            },
            fetchData() {
                this.disabled = true
                if (!this.week) {
                    this.week = this.getCurrentDate()
                }
                this.listLoading = true
                getWeeklyWorkTimes(this.week).then(response => {
                    this.data = response.data
                    this.listLoading = false
                    this.disabled = false
                })
            },
            getRowHeaderClass({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background:#2e718c;color:#fff;'
                } else {
                    return ''
                }
            },
            async download() {
                if (!this.week) {
                    this.week = this.getCurrentDate()
                }
                this.downloadLoading = true
                await api.download({ date: this.week }).then(() => {
                    this.downloadLoading = false
                })
            },
            reload() {
                this.fetchData()
            },
            renderheader(h, { column, $index }) {
                return h('span', {}, [
                    h('span', {}, column.label.split('<br>')[0]),
                    h('br'),
                    h('span', {}, column.label.split('<br>')[1])
                ])
            }
        }
    }
</script>
