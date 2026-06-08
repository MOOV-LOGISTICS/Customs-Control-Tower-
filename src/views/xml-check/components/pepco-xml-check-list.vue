<template>
  <div class="page-container" ref="pageContainer">
    <el-card class="pd-20">
      <div style="overflow: auto;width:calc(100%);">
        <el-row style="margin-top: 5px;float: none;">
          <div style="float: left;margin-left: 5px;margin-right: 5px;">
            <el-input v-model="queryParams.orderNumber" @keyup.enter.native="searchList" placeholder="Order Number" clearable @clear="searchList" />
          </div>
          <div style="float: left;margin-left: 5px;margin-right: 5px;">
            <el-select @change="searchList" clearable v-model="queryParams.currentStatus" filterable 
              placeholder="Current Status">
              <el-option v-for="item in currentStatusDic" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
          <div style="float: left;margin-left: 5px;margin-right: 5px;">
            <el-popover v-model="filterPopover" placement="bottom" title=" " popper-class="popover-filter" width="400" trigger="click">
              <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="12">
                  <el-select clearable v-model="queryParams.dc" filterable @clear="searchList" placeholder="DC">
                    <el-option v-for="item in dcDic" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select clearable v-model="queryParams.shippingType" filterable @clear="searchList"
                    placeholder="SO Type">
                    <el-option v-for="item in shippingTypeDic" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="12">
                  <el-select clearable v-model="queryParams.originCountry" filterable @clear="searchList"
                    placeholder="Country">
                    <el-option v-for="item in originCountryDic" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select clearable v-model="queryParams.originPort" filterable @clear="searchList"
                    placeholder="POL">
                    <el-option v-for="item in originPortDic" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <!-- <el-row :gutter="10" style="margin-bottom: 15px;">
                <el-col :span="24">
                  <div style="float: right;margin-left: 5px;margin-right: 5px;">
                    <el-button @click="cleanSearch" icon="el-icon-delete" plain>Clean</el-button>
                    <el-button @click="searchList" icon="el-icon-search" style="background-color: #004F7C; color: white;" plain>Search</el-button>
                  </div>
                </el-col>
              </el-row> -->
              <el-button slot="reference" icon="el-icon-plus" style="color:#004F7C" plain>Filter</el-button>
            </el-popover>
          </div>
        </el-row>
        <el-row style="margin-left: 5px;margin-right: 5px;float: none;">
          <div style="float: left;margin-right: 5px;">
            <el-select v-model="queryParams.poChangeStatus" filterable placeholder="Progress" @change="searchList">
              <el-option key="0" label="Unfinished" value="0"></el-option>
              <el-option key="1" label="Finished" value="1"></el-option>
            </el-select>
          </div>
          <div style="float: left;margin-left: 5px;margin-right: 5px;">
            <el-button @click="searchList" icon="el-icon-search" style="background-color: #004F7C; color: white;" plain>Search</el-button>
            <el-button @click="cleanSearch" plain>Clear Filters</el-button>
            <el-button @click="downloadExcel" icon="el-icon-download" type="primary" :loading="downloadLoading" plain>
              Download
            </el-button>

          </div>
          <div style="float: left;margin-left: 5px;margin-right: 5px;">
            <el-dropdown @command="handleCommand">
              <el-button @click="sendMail" icon="el-icon-message">Send Email</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">Select All</el-dropdown-item>
                <el-dropdown-item command="none">Select None</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-row>
        <el-table ref="singleTable" v-loading="loading" :data="tableData" :height="tableHeight" highlight-current-row
          row-key="id" @selection-change="handleSelectionChange" @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column label="Order Number" width="110" prop="orderNumber"></el-table-column>
          <el-table-column label="Current Status" width="150" prop="currentStatus"></el-table-column>
          <el-table-column label="Item Id" width="80" prop="tcid"></el-table-column>
          <el-table-column label="Article Id" width="70" prop="articleid"></el-table-column>
          <el-table-column label="Send Flag" width="140" v-slot="scope">{{ mapDict(scope.row.sendMailFlag, sendFlagDic)
            || 'Not Sent' }}</el-table-column>

          <el-table-column label="Vendor Name" width="140" prop="supplierNameInSm"></el-table-column>
          <el-table-column label="Dc" width="60" prop="dcInSm"></el-table-column>
          <el-table-column label="SO Type" width="60" prop="shippingType"></el-table-column>
          <el-table-column label="Country" width="70" prop="originCountryInSm"></el-table-column>
          <el-table-column label="POL" width="80" prop="originPortInSm"></el-table-column>
          <el-table-column label="Modify Time" width="130" prop="fileDate"></el-table-column>
        </el-table>
      </div>
      <div style="clear:both"></div>
      <!-- 分页组件 -->
      <div>
        <pagination :total="total" :page.sync="queryParams.pageNo" small :limit.sync="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]" @pagination="handlePageChange" />
      </div>
    </el-card>
    <el-dialog title="Send Email" :visible.sync="dialogFormVisible">
      <div :style="'height: ' + dialogHeight + 'px; overflow: auto;'">
        <template v-for="(item, index) in emailAddressList">
          <el-row style="margin-bottom: 15px;">
            <el-col :span="2">
              <div style="text-align: center; margin-top: 5px;">
                <span>{{ index + 1 }}</span>
              </div>
            </el-col>
            <el-col :span="18">
              <el-input v-model="emailAddressList[index]" placeholder="Email Address" clearable />
            </el-col>
            <el-col :span="4">
              <i v-if="index === 0" @click="addEmailAddress()" class="el-icon-circle-plus-outline"
                style="font-size: 20px; padding-top: 4px; color: #0b951c"></i>
              <i v-else @click="removeEmailAddress(index)" class="el-icon-remove-outline"
                style="font-size: 20px; padding-top: 4px; color: #aa1111"></i>
            </el-col>
          </el-row>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :loading="loading">Cancel</el-button>
        <el-button type="primary" @click="doSendEmail" :loading="loading">Sure</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getSearchDic, getXmlCheckPage, sendEmail, exportXmlCheck } from '@/api/xmlcheck/xmlCheck'

export default defineComponent({
  components: {},
  emits: ['afterSelect'],
  data() {
    return {
      loading: false,
      downloadLoading: false,
      currentRow: null,
      filterPopover: false,
      dialogFormVisible: false,
      tableHeight: window.innerHeight - 299,
      dialogHeight: window.innerHeight * 0.6,
      emailAddrCacheName: 'default_send_email_address',
      tableData: [],
      total: 0,
      currentStatusDic: [],
      originCountryDic: [],
      originPortDic: [],
      dcDic: [],
      shippingTypeDic: [],
      multipleSelection: [],
      emailAddressList: [],
      sendFlagDic: {
        1: 'Sent'
      },
      queryParams: {
        pageNo: 1,
        pageSize: 20,
        poChangeStatus: '0',
        orderNumber: '',
        currentStatus: ''
      }
    }
  },
  mounted() {
    this.initCurrentStatusDic()
    this.initList(() => {
      this.$nextTick(() => {
        if (this.total > 0 && this.tableData && this.tableData.length > 0) {
          this.setCurrent(this.tableData[0])
        }
      })
    })
  },

  beforeDestroy() { },
  computed: {},
  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(newRow) {
      this.currentRow = newRow
      // console.log('select row', newRow)
      this.$emit('afterSelect', { ...this.currentRow, poChangeStatus: this.queryParams.poChangeStatus })
    },
    handlePageChange() {
      this.initList(() => {
        this.clickFirstRow()
      })
    },
    mapDict(value, dict) {
      if (value === null || value === undefined) return ''
      // 统一转成字符串并去掉空格
      const key = String(value).trim()
      return dict[key] ?? ''
    },
    initList(callBack) {
      this.loading = true
      getXmlCheckPage(this.queryParams)
        .then(response => {
          this.loading = false
          this.tableData = response.data.list
          this.total = response.data.total
          if (callBack) {
            callBack()
          }
        })
        .catch(error => {
          this.loading = false
          console.error('Error fetching data:', error)
          this.$message.error('Failed to load list')
        })
    },
    searchList() {
      this.queryParams.pageNo = 1
      this.initList(() => {
        this.clickFirstRow()
      })
    },
    cleanSearch() {
      const pageSize = this.queryParams.pageSize
      const poChangeStatus = this.queryParams.poChangeStatus
      this.queryParams = {
        pageNo: 1,
        pageSize: pageSize,
        poChangeStatus: poChangeStatus,
        orderNumber: '',
        currentStatus: ''
      }
      this.searchList()
    },
    clickFirstRow() {
      this.$nextTick(() => {
        if (this.total > 0 && this.tableData && this.tableData.length > 0) {
          this.setCurrent(this.tableData[0])
          this.currentRow = this.tableData[0]
          this.$emit('afterSelect', { ...this.currentRow, poChangeStatus: this.queryParams.poChangeStatus })
        } else {
          this.$emit('afterSelect', null)
        }
      })
    },
    initCurrentStatusDic() {
      getSearchDic().then(response => {
        this.currentStatusDic = response.data.currentStatus
        this.originCountryDic = response.data.originCountry
        this.originPortDic = response.data.originPort
        this.dcDic = response.data.dc
        this.shippingTypeDic = response.data.shippingType
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCommand(command) {
      if (command === 'all') {
        this.selectAll()
      } else if (command === 'none') {
        this.selectNone()
      }
    },
    selectAll() {
      if (this.tableData) {
        this.tableData.forEach(row => {
          this.$refs.singleTable.toggleRowSelection(row)
        })
      }
    },
    selectNone() {
      this.$refs.singleTable.clearSelection()
    },
    sendMail() {
      if (!this.multipleSelection || this.multipleSelection.length === 0) {
        this.$message.warning('Please select at least one item')
        return false
      }
      this.openEmailInput()
    },
    openEmailInput() {
      const defaultEmailAddress = localStorage.getItem(this.emailAddrCacheName)
      if (defaultEmailAddress) {
        try {
          this.emailAddressList = JSON.parse(defaultEmailAddress)
        } catch (e) {
          this.emailAddressList = []
        }
      }
      if (!this.emailAddressList || this.emailAddressList.length === 0) {
        this.emailAddressList.push('')
      }
      this.dialogFormVisible = true
    },
    addEmailAddress() {
      this.emailAddressList.push('')
    },
    removeEmailAddress(index) {
      this.emailAddressList.splice(index, 1)
    },
    doSendEmail() {
      // 只检查格式，不检查是否为空
      const emailRegex = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
      for (let i = 0; i < this.emailAddressList.length; i++) {
        const email = this.emailAddressList[i]
        if (email && email.trim() !== '' && !emailRegex.test(email)) {
          this.$message.error(`Email Format Incorrect In The [${i + 1}] Input`)
          return false
        }
      }

      this.loading = true
      localStorage.setItem(this.emailAddrCacheName, JSON.stringify(this.emailAddressList))
      sendEmail({
        emailAddrList: this.emailAddressList.filter(email => email && email.trim() !== ''),
        poChangeStatus: this.queryParams.poChangeStatus,
        checkPageRespVOList: this.multipleSelection
      })
        .then(response => {
          this.loading = false
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: 'Send Success!'
          })
          this.multipleSelection.forEach(row => {
            console.log(row)
            row.sendMailFlag = '1' // 直接更新当前行
          })
        })
        .catch(error => {
          this.loading = false
          this.dialogFormVisible = false
          console.error('Error fetching detail data:', error)
          this.$message({
            type: 'error',
            message: 'Send Failed!'
          })
        })
    },
    downloadExcel() {
      this.downloadLoading = true
      exportXmlCheck(this.queryParams)
        .then(response => {
          const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
          const link = document.createElement('a')
          const url = window.URL.createObjectURL(blob)
          link.href = url
          link.download = 'XmlCheck.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          this.downloadLoading = false
        })
        .catch(error => {
          console.error('Error exporting Excel:', error)
          this.$message.error('Export failed')
          this.downloadLoading = false
        })
    }
  }
})
</script>

<style scoped>
.page-container {
  position: relative;
}

/* 设置行悬停颜色 */
/deep/.el-table tbody tr:hover>td {
  background-color: #eff3f4 !important;
}
</style>
