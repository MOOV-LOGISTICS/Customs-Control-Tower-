<template>
    <div class="app-container">
        <el-tabs v-model="activeName">
            <el-tab-pane v-hasPermi="['booking:contract:query']" label="Allocation" name="first">
                <contract-list></contract-list>
            </el-tab-pane>
            <el-tab-pane v-hasPermi="['booking:rate:list']" label="Rate" name="second">
                <rate-list></rate-list>
            </el-tab-pane>
            <el-tab-pane v-hasPermi="['system:container-track-setting:query']" label="Destination" name="third">
                <container-track></container-track>
            </el-tab-pane>
        </el-tabs>

    </div>
  </template>
  
  <script>
  import RateList from '../rate/list/index.vue';
  import ContractList from '../contract/index';
  import ContainerTrack from '../../system/containerTrackSetting/index';

  export default {
    name: "contract",
    components: {
        RateList,
        ContractList,
        ContainerTrack,
    },
    data() {
      return {
        activeName: 'first'
      };
    },
    created() {


    },
    methods: {





    }
  };
  </script>
  