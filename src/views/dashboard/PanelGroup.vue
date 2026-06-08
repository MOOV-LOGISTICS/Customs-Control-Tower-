<template>
  <el-row class="panel-group" style="padding-top: 20px">
    <el-col :span="12">
      <div style="width: 400px; height: 300px; margin: 0 auto" id="main"></div>
    </el-col>
    <el-col :span="12">
      <div style="width: 400px; height: 300px; margin: 0 auto" id="main2"></div>
    </el-col>
    <el-col :span="12">
      <div style="width: 400px; height: 300px; margin: 0 auto" id="main3"></div>
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { listByConditionShipment } from "@/api/shipment/shipment";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  components: {},
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    setData(title, data, id) {
      var chartDom = document.getElementById(id);
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: title,
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    init() {
      listByConditionShipment().then((res) => {
        var data = res.data;
        var polCount = {};
        var podCount = {};
        var carrierCount = {};

        // 遍历 JSON 数组中的每个对象
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var carrier = item.carrier;
          var pol = item.pol;
          var pod = item.pod;

          // 统计 pol 的数量
          if (polCount[pol]) {
            polCount[pol]++;
          } else {
            polCount[pol] = 1;
          }

          // 统计 pod 的数量
          if (podCount[pod]) {
            podCount[pod]++;
          } else {
            podCount[pod] = 1;
          }

          // 统计 carrier 的数量
          if (carrierCount[carrier]) {
            carrierCount[carrier]++;
          } else {
            carrierCount[carrier] = 1;
          }
        }
        var polArray = Object.keys(polCount).map(function (key) {
          return {
            name: key,
            value: polCount[key],
          };
        });

        // 将 podCount 转换为 JSON 数组
        var podArray = Object.keys(podCount).map(function (key) {
          return {
            name: key,
            value: podCount[key],
          };
        });

        // 将 carrierCount 转换为 JSON 数组
        var carrierArray = Object.keys(carrierCount).map(function (key) {
          return {
            name: key,
            value: carrierCount[key],
          };
        });

        // 打印转换后的 JSON 数组
        console.log("Pol统计:");
        console.log(polArray);
        this.setData("Shipment - POL", polArray, "main");
        console.log("Pod统计:");
        console.log(podArray);
        this.setData("Shipment - POD", podArray, "main2");
        console.log("Carrier统计:");
        console.log(carrierArray);
        this.setData("Shipment - Carrier", carrierArray, "main3");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
