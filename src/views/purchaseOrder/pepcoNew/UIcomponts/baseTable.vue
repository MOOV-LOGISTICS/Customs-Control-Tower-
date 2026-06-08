<template>
  <div>
      <el-table
      :data="data"
      :row-class-name="rowClassName"
      :header-cell-class-name="headerCellClassName"
      :border="border"
      :loading="loading"
      style="width: 100%;"
      :height="height"
      @sort-change="onSortChange"
      @select="onSelect"
      @expand-change="onExpandChange"
      :summary-method="summaryMethod"
      ref="baseTable"
      :show-summary ="showSummary"
      :row-key="rowKey"
      :expand-row-keys="expandRowKeys"
      border
      >
    
      <!-- 动态渲染列  height: calc(100% - 10px)  @pagination="changePage"  -->
      <template v-for="(itm, idx) in columns" >
      <!-- 特殊处理列 -->
        <el-table-column
          v-if=" itm.type === 'expand'"
          v-bind="itm"
          :key="'expand-' + idx"
          :align="itm.align ? itm.align : 'left'"
        >
           <template slot-scope="scope">
            <ex-slot
              :render="itm.render"
              :row="scope.row"
              :index="scope.$index"
              :column="itm"
            />
        </template>
       </el-table-column>
      <el-table-column  v-else-if=" itm.type === 'selection'" type="selection"
       :width="itm.width ? itm.width : null" 
       :selectable="itm.selectable"
       ></el-table-column>
      <el-table-column
        v-else-if="itm.render"
        :key="'render-' + idx"
        :prop="itm.prop ? itm.prop : null"
        :label="itm.label ? itm.label : null"
        :width="itm.width ? itm.width : null"
        :sortable="itm.sortable ? itm.sortable : false"
        :align="itm.align ? itm.align : 'left'" 
        :fixed="itm.fixed ? itm.fixed : null"
        :show-overflow-tooltip="itm.tooltip"
        :min-width="itm.minWidth ? itm.minWidth : null"
        :render-header ="itm.renderHeader"
      >
       <!-- <template slot="header" slot-scope="scope" v-if="item.headerRender">
        {{ item.headerRender }}
        </template> -->
        <template slot-scope="scope">
          <ex-slot
            :render="itm.render"
            :row="scope.row"
            :index="scope.$index"
            :column="itm"
          />
        </template>
      </el-table-column>
     
      <!-- 正常列      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
      <el-table-column
        v-else
        :key="'else-' + idx"
        :prop="itm.prop ? itm.prop : null"
        :label="itm.label ? itm.label : null"
        :width="itm.width ? itm.width : null"
        :sortable="itm.sortable ? itm.sortable : false"
        :align="itm.align ? itm.align : 'left'"
        :fixed="itm.fixed ? itm.fixed : null"
        :formatter="itm.formatter"
        :show-overflow-tooltip="itm.tooltip"
           :min-width="itm.minWidth ? itm.minWidth : null"
         :render-header ="itm.renderHeader"
      />
    </template>
    </el-table>
      <pagination v-if="total"
      :total="total" 
      layout="total, sizes, prev, pager, next, jumper" 
      :page.sync="pageNo"
      :limit.sync="pageSize" 
      :page-sizes="[20, 30, 50]" 
      @pagination="changePage" />
  </div>
  </template>
  
  <script>

  var exSlot = {
    functional: true,
    props: {
      row: Object,
      render: Function,
      index: Number,
      column: {
        type: Object,
        default: null
      }
    },
    render: (h, context) => {
      const params = {
        row: context.props.row,
        index: context.props.index
      };
      if (context.props.column) params.column = context.props.column;
      return context.props.render(params);
    }
}

  export default {
    name: "BaseTable",
    components: { exSlot },
    props: {
      data: { type: Array, default: () => [] },
      columns: { type: Array, default: () => [] }, // 列配置
      rowClassName: Function,
      headerCellClassName: Function,
      height: [String, Number],
      border: { type: Boolean, default: false },
      loading: { type: Boolean, default: false },
      showSummary: { type: Boolean, default: false },
      loading: { type: Boolean, default: false },
      summaryMethod: Function,
      showPage: {type: Boolean, default: true},
      total:[Number],
      pageNo:[Number],
      limitSize:[Number],
      rowKey: [String, Function],
      expandRowKeys: Array,
      pageSize: {type: Number, default: 20}
    },
    methods: {
      onSortChange(...args) {
        this.$emit("sort-change", ...args);
      },
      onSelect(...args) {
        this.$emit("select", ...args);
      },
      onExpandChange(...args) {
        this.$emit("expand-change", ...args);
      },
      changePage(...args){
        this.$emit('pagination',args[0].page)
      },
      // 添加这个方法来暴露 el-table 的 toggleRowSelection 方法
      toggleRowSelection(row, selected) {
        this.$refs.baseTable.toggleRowSelection(row, selected);
      }
    }
  };
  </script>