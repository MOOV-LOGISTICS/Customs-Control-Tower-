<template>
  <el-dialog :title="title" width="99%" :visible.sync="dimensionsFormVisible">
    <el-row type="flex">
      <el-col style="font-size: 24px; font-weight: bold; width: 450px;">Dimensions(Per Outer Packing)</el-col>
      <el-col>
        <el-popover width="750" placement="left" trigger="hover">
          <BaseTable :data="dimensionTips" :columns="dimensionTipscolumns" />
          <template v-slot:reference>
            <i class="el-icon-question" style="font-size: 30px; color:#004F7C;"></i>
          </template>
        </el-popover>
      </el-col>
    </el-row>
    <div style="font-size: 16px; font-weight: bold;"> Order Number: {{ rowInfo.orderNumber }} </div>
    <BaseTable :data="rowInfo.items" :columns="dimensionDatacolumns" />
    <div slot="footer" v-if="!view" class="dialog-footer">
      <el-button @click="dimensionsFormVisible = false">Cancel</el-button>
      <el-button type="primary" @click="submitTask">Submit</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { DICT_TYPE } from "@/utils/dict";
import { dimensionTips, dimensionTipscolumns } from '@/views/purchaseOrder/pepcoNew/components/enumdata.js'
import BaseTable from "@/views/purchaseOrder/pepcoNew/UIcomponts/baseTable.vue";
import { completeMilestone } from "@/api/air/booking";
import {
  getHeaderInfoForPepco,
} from "@/api/order/header";

export default {
  name: "Dimensions",
  components: { BaseTable },
  props: {},
  data() {
    return {
      title: '',
      dimensionsFormVisible: false,
      view: false,
      rowInfo: {
        items: []
      },
      dimensionDatacolumns: [
        { label: 'Item Number', prop: 'productCode', minWidth: 100, align: 'center' },
        { label: 'TCId', prop: 'tcId', minWidth: 80, align: 'center' },
        {
          label: 'L(cm)', prop: 'length', minWidth: 120, align: 'center', render: ({ row }) => {
            return (<el-input-number disabled={this.view} placeholder="" value={row.length} onInput={(val) => { row.length = val }}
              controls-position="right" clearable min={0} style="min-width: 110px" />
            );
          }
        },
        {
          label: 'W(cm)', minWidth: 120, align: 'center', render: ({ row }) => {
            return (<el-input-number disabled={this.view} placeholder="" value={row.width} onInput={(val) => { row.width = val }}
              controls-position="right" clearable min={0} style="min-width: 110px" />
            );
          }
        },
        {
          label: 'H(cm)', prop: 'height', minWidth: 120, align: 'center', render: ({ row }) => {
            return (<el-input-number
              disabled={this.view} placeholder="" value={row.height} onInput={(val) => { row.height = val }}
              controls-position="right" clearable min={0} style="min-width: 110px" />
            );
          }
        },
        {
          label: 'Gross Weight(kg)', prop: 'outerWeight', minWidth: 120, align: 'center', render: ({ row }) => {
            return (<el-input-number disabled={this.view} value={row.outerWeight} placeholder="" onInput={(val) => { row.outerWeight = val }}
              controls-position="right" clearable style="min-width: 110px" />
            );
          }
        },
        {
          label: 'Net Weight(kg)', prop: 'innerWeight', minWidth: 120, align: 'center', render: ({ row }) => {
            return (<el-input-number disabled={this.view} placeholder="" value={row.innerWeight} onInput={(val) => { row.innerWeight = val }}
              controls-position="right" clearable style="min-width: 110px" />
            );
          }
        },
        { label: 'Ordered Pieces/Outer Carton', prop: 'outerSize', minWidth: 167, align: 'center' },
        {
          label: 'Produced Pieces/Outer Carton', prop: 'bookedProOuterSize', minWidth: 175, align: 'center', render: ({ row }) => {
            return (<el-input-number disabled={this.view || !this.dimensionNumberEditPerm} value={row.bookedProOuterSize} onInput={(val) => { row.bookedProOuterSize = val }}
              controls-position="right" clearable style="min-width: 110px" />
            );
          }
        },
        {
          label: 'Ordered Inner/Outer Carton', minWidth: 165, align: 'center', render: ({ row }) => {
            return <span>{this.calculateDivisionMethod(row.outerSize, row.tcSize)}</span>;
          }
        },
        {
          label: 'Produced Inner/Outer Carton', prop: 'bookedProInnerPerOuter', minWidth: 175, align: 'center', render: ({ row }) => {
            return (
              <el-input-number style="min-width: 110px"
                controls-position="right" disabled={this.view || !this.dimensionNumberEditPerm}
                value={row.bookedProInnerPerOuter} onInput={(val) => { row.bookedProInnerPerOuter = val }} clearable />
            );
          }
        },
        {
          label: 'Ordered Outer(Cartons)', minWidth: 138, align: 'center', render: ({ row }) => {
            return <span>{row.outerQty}</span>;
          }
        },
        {
          label: 'Ordered Volume(cbm)', minWidth: 130, align: 'center', render: ({ row }) => {
            return <span>{row.cbm}</span>;
          }
        },
        {
          label: 'Calculated Volume(cbm)', minWidth: 145, align: 'center', render: ({ row }) => {
            if (row.length && row.width && row.height && row.outerQty) {
              return <span>{this.calculateCBM(row.length, row.width, row.height, row.outerQty).toFixed(3)}</span>;
            }
            return <span></span>;
          }
        }
      ],
      dimensionTips: dimensionTips,
      dimensionTipscolumns: dimensionTipscolumns,
      isProcessing: false,
    }
  },
  watch: {

  },
  computed: {
  },
  methods: {

    handle(milestone, mode) {
      this.openDialog(milestone, mode);
    },
    async openDialog(milestone, mode) {
      if (this.isProcessing) {
        console.log('Already processing, please wait.');
        return;
      }
      this.isProcessing = true;
      if (mode === 'view') {
        this.view = true;
      } else {
        this.view = false;
      }
      this.milestone = milestone;
      this.rowInfo = {};
      this.title = 'Dimensions - ' + milestone.orderNumber;
      await this.fillRowInfo(milestone.orderNumber);
      this.dimensionsFormVisible = true;
      this.isProcessing = false;
    },
    async fillRowInfo(orderNumber) {
      try {
        const response = await getHeaderInfoForPepco({
          orderNumber: orderNumber
        });
        response?.data?.orderItemProductInfo.forEach(item => {
          if (item.bookedProOuterSize === '' || item.bookedProOuterSize === undefined || item.bookedProOuterSize === null) {
            item.bookedProOuterSize = item.outerSize;
          }
          if (item.bookedProInnerPerOuter === '' || item.bookedProInnerPerOuter === undefined || item.bookedProInnerPerOuter === null) {
            item.bookedProInnerPerOuter = this.calculateDivisionMethod(item.outerSize, item.tcSize);
          }
        });
        this.rowInfo = {
          ...response.data, items: response?.data?.orderItemProductInfo,
          shipmentId: response.data.shipmentIds?.[0] || null
        };
        this.dimensionNumberEditPerm = this.rowInfo.shippingId && this.rowInfo.shippingId > 0 && !this.rowInfo.shippingDraft ? false : true
      } catch (err) {
        console.log(err);
      }
    },
    calculateDivisionMethod(A, B) {
      if (A === B) {
        return 1
      }
      return (A / B);
    },
    submitTask() {
      // // 提交任务
      if (!this.validateDimensionsFields(this.rowInfo.items)) {
        return;
      }

      const invalidRows = this.rowInfo.items.filter(row => row.invalidFields && row.invalidFields.size > 0);

      if (invalidRows.length > 0) {
        this.$message.error('Please correct all invalid numeric fields before submitting.');
        return;
      }

      let overConvention = false
      let overWeight = false
      for (let i = 0; i < this.rowInfo.items.length; i++) {
        if (this.rowInfo.items[i].length == 0 || this.rowInfo.items[i].width == 0 || this.rowInfo.items[i].height == 0) {
          this.$message.error('Dimension of 0 cm not permitted, please check and revise.');
          return
        }
        if (this.rowInfo.items[i].length > 100 || this.rowInfo.items[i].width > 100 || this.rowInfo.items[i].height > 100) {
          overConvention = true
        }
        if ((this.rowInfo.items[i].outerWeight > 12) || (this.rowInfo.items[i].innerWeight > 12)) {
          overWeight = true
        }
      }
      if (overWeight) {
        this.$confirm('Your submitted carton weight is more than 12kg. Please note that you must provide the gross and net weight of a single carton.', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if (overConvention) {
            this.$confirm('One of more dimensions is larger than 100cm, please confirm if this is correct.', {
              confirmButtonText: 'Submit',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              this.onSubmitDimension()
            })
          } else {
            this.onSubmitDimension()
          }
        })
      } else if (overConvention) {
        this.$confirm('One of more dimensions is larger than 100cm, please confirm if this is correct.', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.onSubmitDimension()
        })
      } else {
        this.onSubmitDimension()
      }
      this.dimensionsFormVisible = false;
    },
    calculateCBM(length, width, height, qty) {
      return ((length * width * height) * qty) / 1000000;
    },
    validateDimensionsFields(items) {
      const requiredFields = [
        'length',
        'width',
        'height',
        'outerWeight',
        'innerWeight',
        'bookedProOuterSize',
        'bookedProInnerPerOuter'
      ];

      for (const item of items) {
        for (const field of requiredFields) {
          const value = item[field];
          if (value === null || value === undefined || value === '') {
            this.$notify.warning({
              title: 'Validation Failed',
              message: 'All columns are required!',
              duration: 3000
            });
            return false;
          }
        }
      }

      return true;
    },
    async onSubmitDimension() {
      const command = {
        milestoneId: this.milestone.id,
        taskCode: this.milestone.taskCode,
        formData: [],
        params: {"items": JSON.stringify(this.rowInfo.items)}
      }
      await completeMilestone(command)
      // 
      this.$emit('success', true)
    },
  }
}
</script>
