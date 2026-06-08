<template>
  <div class="app-container" style="width:100%; margin: 0 auto;padding-top: 20px;" >

    <el-card style="padding: 10px;" :style="{'height':(tableHeight)+'px'}">


      <el-form :model="queryParams">
        <div style="float: left;padding-top: 8px;"></div>
        <div style='float:left;margin-left: 5px;padding: 10px 0px; width: 200px;'>
          <el-select  filterable @change="getList" clearable v-model="queryParams.email" placeholder="Account"
          :loading="getDisLoading" loading-text="Loading...">
          <el-option v-for="value in emailList"  :label="value" :value="value"></el-option>
        </el-select>
        </div>
        <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
          <el-select  filterable @change="getList" clearable v-model="queryParams.dateStr" placeholder="Date">
          <el-option v-for="value in weekSet" :label="value.name" :value="value.value"></el-option>
        </el-select>
        </div>
        <div style='float:left;margin-left: 5px;padding: 10px 0px;'>
        <el-button type="primary"  @click="getList"><i class="el-icon-search"></i> Search</el-button>
      </div>



        <div  style="clear: both;"></div>
      </el-form>
      <div   style="overflow: auto;width:calc(100%);float: left;" >
        <el-table  border
        v-loading="loading" :height="tableHeight-150"
          :data="tableData"
          style="width: 100%">

          <el-table-column prop="email" label="Account" min-width="90"></el-table-column>
          <!-- <el-table-column prop="tenantName"label="TenantName" >
              <template v-slot="scope">
                {{ scope.row.tenantName }}
              </template>
            </el-table-column> -->
            <el-table-column prop="customerName"label="Customer" >
              <template v-slot="scope">
                {{ scope.row.customerName }}
              </template>
            </el-table-column>
          <el-table-column prop="fromFull" label="URL" min-width="140">
            <template slot-scope="scope">
            {{ scope.row.fromFull==null?scope.row.toFull:scope.row.fromFull }}
          </template>
          </el-table-column>
          <el-table-column prop="stayTime" label="Stay Time" min-width="90">
            <template slot-scope="scope">
            {{ scope.row.stayTime + 's' }}
          </template>
          </el-table-column>
          <el-table-column prop="userIp"label="IP" ></el-table-column>
          <el-table-column prop="addressName"label="Address" ></el-table-column>
          <el-table-column prop="createTime"label="Operate Time(China Time)" >
            <template v-slot="scope">
                {{ parseTimeToZ1(scope.row.createTime) }}
              </template>
          </el-table-column>

        </el-table>
      </div>
      <div style="clear:both"></div>

        <pagination
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          :page-sizes="[20, 30, 50]"
          @pagination="getList"
        />
</el-card>

  </div>
</template>
<style scoped>

</style>
<script>
import '@icon-park/vue/styles/index.css';
import {IconPark} from '@icon-park/vue/es/all';
import { getStayLogPage,groupByEmail } from "@/api/system/stayLog";


export default {
  name: "Container",
  components: {
    IconPark
  },
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      loading: true,
      total: 0,
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        prop:'',
        orderBy:''
      },
      emailList:[],
      getDisLoading:true,
      weekSet:[{name:"Within a week",value:"1"},{name:"Within two weeks",value:"2"},{name:"Within a month",value:"3"}],


    };
  },
  created() {
    this.calcTableHeight()
    this.getList()

    groupByEmail().then((response) => {
        this.emailList = response.data.emailList;
        this.getDisLoading = false
      });
  },
  methods: {
    calcTableHeight() {
      const clientHeight = document.documentElement.clientHeight;
      this.tableHeight = clientHeight - 180;
    },
    getList() {
      this.loading = true;

      // 执行查询
      getStayLogPage(this.queryParams).then((response) => {
        this.tableData = response.data.list;
        for(var stay of response.data.list) {
          // console.log(stay)
          stay.stayTime = (stay.stayTime/1000).toFixed(0)
          if(stay.stayTime==0) {
            stay.stayTime = 1
          }

        }

        this.total = response.data.total;
        this.loading = false;
      });
    },

    parseTimeToZ1(timestamp) {
        if(!timestamp) return null
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },

  },
};
</script>
