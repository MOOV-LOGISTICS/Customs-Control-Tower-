<template>
    <div class="app-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="Inventory" name="first">
                <inventory-list></inventory-list>
            </el-tab-pane>
            <el-tab-pane label="Inbound" name="second">
                <inventory-in-list></inventory-in-list>
            </el-tab-pane>
            <el-tab-pane label="Outbound" name="third">
                <inventory-out-list></inventory-out-list>
            </el-tab-pane>
        </el-tabs>

    </div>
  </template>
  
  <script>
  import InventoryList from '../inventory/index.vue';
  import InventoryInList from '../inventoryIn/index';
  import InventoryOutList from '../inventoryOut/index';

  export default {
    name: "contract",
    components: {
      InventoryList,
      InventoryInList,
      InventoryOutList,
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
  