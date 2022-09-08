<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { getMonthlyWorkTimes } from "@/api/worktimes";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "200px",
    },
  },
  data() {
    return {
      chart: null,
      chartData: null,
      tableData: null,
      cols: null,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    reload(month, user = "all") {
      if (!user) {
        user = "all";
      }
      return getMonthlyWorkTimes(month, user).then((response) => {
        this.chartData = response.data;
        for (let i = 0; i < this.chartData.bars.length; i++) {
          this.chartData.bars[i].itemStyle.normal.label.formatter = function (p) {
            return p.value > 0 ? p.value : "";
          };
        }
        this.initChart();
        this.tableData = this.chartData.tableData;
        this.cols = this.chartData.cols;
      });
    },
    getTableData() {
      return this.tableData;
    },
    getCols() {
      return this.cols;
    },
    setOption(option) {
      this.chart.setOption(option);
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption(
        {
          backgroundColor: "#344b58",
          title: {
            text: "工数統計（月単位）",
            x: "20",
            top: "20",
            textStyle: {
              color: "#fff",
              fontSize: "22",
            },
            subtextStyle: {
              color: "#90979c",
              fontSize: "16",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          grid: {
            left: "5%",
            right: "5%",
            borderWidth: 0,
            top: 150,
            bottom: 95,
            textStyle: {
              color: "#fff",
            },
          },
          legend: {
            x: "5%",
            top: "10%",
            textStyle: {
              color: "#90979c",
            },
            data: [
              "管理",
              "会議・打合せ",
              "要件",
              "仕様",
              "製造",
              "テスト（開発）",
              "テスト（QA）",
              "データ移行",
              "環境構築",
              "調査",
              "レビュー",
              "待機",
              "その他",
            ],
          },
          calculable: true,
          xAxis: [
            {
              type: "category",
              axisLine: {
                lineStyle: {
                  color: "#90979c",
                },
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitArea: {
                show: false,
              },
              axisLabel: {
                interval: 0,
              },
              data: this.chartData.series,
              max: 15,
            },
          ],
          yAxis: [
            {
              type: "value",
              splitLine: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: "#90979c",
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                interval: 0,
              },
              splitArea: {
                show: false,
              },
            },
          ],
          dataZoom: [
            {
              show: true,
              height: 30,
              xAxisIndex: [0],
              bottom: 30,
              start: 10,
              end: 80,
              handleIcon:
                "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
              handleSize: "110%",
              handleStyle: { color: "#d3dee5" },
              textStyle: { color: "#fff" },
              borderColor: "#90979c",
            },
            {
              type: "inside",
              show: true,
              height: 15,
              start: 1,
              end: 35,
            },
          ],
          series: this.chartData.bars,
        },
        true
      );
    },
  },
};
</script>
