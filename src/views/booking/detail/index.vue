<template>
  <div class="app-container" style="width:100%; margin: 0 auto; position: relative">
    <h1>{{ $t("booking.bookingDetail") }}</h1>

    <span v-if="form.status=='2'" style="position: absolute; right: 20px; top: 30px;color: red;font-size: 18px;">Validation Failed</span>

    <el-button v-if="flag&&form.status=='1'" style="position: absolute; right: 20px; top: 30px" type="primary" @click="createShipment">Create Shipment</el-button>

    <el-button v-hasPermi="['order:task:validate']" v-if="flag&&form.status=='0'" style="position: absolute; right: 270px; top: 30px; margin-right: 10px;" type="success" @click="validateBooking(1)">Accept Booking</el-button>

    <el-button v-hasPermi="['order:task:validate']" v-if="flag&&form.status=='0'" style="position: absolute; right: 150px; top: 30px" type="warning" @click="validateBooking(0)">Reject Booking</el-button>

    <el-card style="padding: 15px;margin-bottom: 10px;">
      <div style="float: left">
        <img style="width: 100px; border-radius: 50px; height: 100px" src="../../../assets/container.png" />
      </div>
      <div style="float: left; padding-left: 20px">
        <p>
          {{ $t("booking.container") }}:
          <el-tag style="margin-right: 10px" v-for="(item, i) in form.containers" :key="i + 'container'">{{ item.type }} x {{ item.qty }}</el-tag>
        </p>
        <p>{{ $t("booking.cargoReadyDate") }}</p>
        <p>{{ parseTime(form.cargoReadyForPickup) }}</p>
      </div>
      <div style="clear: both"></div>
    </el-card>

    <el-card style="padding: 15px;margin-bottom: 10px;">
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.shipmentName") }}</b>
            </p>
            <p>{{ form.shipmentName }}</p>
          </div>
        </el-col>

        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.MOOVRef") }}</b>
            </p>
            <p>{{ form.bookingNumber }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.shipperRef") }}</b>
            </p>
            <p>{{ form.shipperRef }}</p>
          </div>
        </el-col>

        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.incoterms") }}</b>
            </p>
            <p>{{ form.incoterms }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.freightMethod") }}</b>
            </p>
            <p>{{ form.freightMethod }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.shipmentType") }}</b>
            </p>
            <p>{{ form.shipmentType }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.truckServices") }}</b>
            </p>
            <p>{{ form.truckServices }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.deliverDate") }}</b>
            </p>
            <p>{{ parseTime(form.deliverDate) }}</p>
          </div>
        </el-col>

        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.deliverServiceFromPodToFnd") }}</b>
            </p>
            <p>{{ form.deliverServiceToFnd }}</p>
          </div>
        </el-col>

        <el-col :span="6">
          <div>
            <p>
              <b>{{ $t("booking.exportCustomService") }}</b>
            </p>
            <p>{{ form.needExportCustomerService }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="padding: 15px;margin-bottom: 10px;">
      <b>{{ $t("booking.involvedParties") }}</b>
      <el-row :gutter="20">
        <el-col :span="8">
          <p>
            <b>{{ $t("booking.shipper") }}</b>
          </p>
          <p>{{ partiesMap[form.shipper] }}</p>
        </el-col>
        <el-col :span="8">
          <p>
            <b>{{ $t("booking.consignee") }}</b>
          </p>
          <p>{{ partiesMap[form.consignee] }}</p>
        </el-col>
        <!--        <el-col :span="8">-->
        <!--          <p>-->
        <!--            <b>{{ $t("booking.suppiler") }}</b>-->
        <!--          </p>-->
        <!--          <p>{{ partiesMap[form.seller] }}</p>-->
        <!--        </el-col>-->
        <el-col :span="8">
          <p>
            <b>{{ $t("booking.notifyParty") }}</b>
          </p>
          <p>{{ partiesMap[form.notifyParty] }}</p>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="padding: 15px;">
      <div>
        <p>
          <b>{{ $t("booking.pickupFrom") }}</b>
        </p>
        <p style="background: rgb(229 238 245 / 40%); padding: 5px 20px">
          <i style="
            background: rgb(0, 79, 124);
            padding: 5px;
            border-radius: 5px;
            font-size: 30px;
            color: #fff;
          " class="el-icon-truck"></i>
          &nbsp;&nbsp;
          <span style="position: relative; top: -5px">
            {{
            form.originLocation
            }}
          </span>
        </p>
      </div>
      <el-divider></el-divider>
      <div>
        <p>
          <b>{{ $t("booking.selectedPorts") }}</b>
        </p>
        <p style="background: rgb(229 238 245 / 40%); padding: 5px 20px">
          <i style="
            background: rgb(0, 79, 124);
            padding: 5px;
            border-radius: 5px;
            font-size: 30px;
            color: #fff;
          " class="el-icon-ship"></i>
          &nbsp;&nbsp;
          <span style="position: relative; top: -5px">
            {{ form.originPort }}
            <i class="el-icon-right"></i>
            {{ form.destinationPort }}
          </span>
        </p>
      </div>
      <el-divider></el-divider>
      <div>
        <p>
          <b>{{ $t("booking.deliverTo") }}</b>
        </p>
        <p style="background: rgb(229 238 245 / 40%); padding: 5px 20px">
          <i style="
            background: rgb(0, 79, 124);
            padding: 5px;
            border-radius: 5px;
            font-size: 30px;
            color: #fff;
          " class="el-icon-truck"></i>
          &nbsp;&nbsp;
          <span style="position: relative; top: -5px">
            {{
            form.destinationLocation
            }}
          </span>
        </p>
      </div>
    </el-card>

    <div>
      <el-descriptions style="background: #fff;padding: 15px!important;" :title="$t("booking.cargoDetails")">
        <el-descriptions-item :label="$t("booking.totalWeight")">{{ form.totalWeight }}</el-descriptions-item>
        <el-descriptions-item :label="$t("booking.totalVolume")">{{ form.totalVolume }}</el-descriptions-item>
        <el-descriptions-item :label="$t("booking.unit")">{{ form.cargoPackageType }}</el-descriptions-item>
        <el-descriptions-item :label="$t("booking.qty")">{{ form.slac }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions style="background: #fff;padding: 15px!important;" :colon="false" direction="vertical" v-for="(item, i) in form.bookingProductDOS" :key="'product' + i" class="margin-top" title :column="2">
        <el-descriptions-item :label="$t('booking.productEnglishName')">
          {{
          item.productEnglishName
          }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('booking.hsCode')">{{ item.hscode }}</el-descriptions-item>
        <el-descriptions-item label>
          <el-row
            :gutter="20"
            style="
              margin-top: 5px;
              color: #004F7C;
              font-weight: 700 !important;
              margin-bottom: 5px;
            "
            v-show="item.hazardousMaterials!=null"
          >
            <el-col :span="4">DG</el-col>
            <el-col v-show="item.dg == 0" :span="3">Batteries</el-col>
            <el-col v-show="item.dg == 1" v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)" :key="dict.value" :span="4">{{ dict.label }}</el-col>
          </el-row>
          <el-row style="margin-top: 10px" :gutter="20" v-show="item.hazardousMaterials!=null">
            <el-col :span="4">
              <el-switch @change="changeDG(item)" :active-value="1" :inactive-value="0" v-model="item.dg" active-text="Yes" inactive-text="No"></el-switch>
            </el-col>
            <el-col
              v-for="dict in getDictDatas(DICT_TYPE.PRODUCT_TYPE_HAZARDOUS_MATERIALS)"
              :key="'d' + dict.value"
              :span="4"
              v-show="item.dg == 1"
            >{{ item.hazardousMaterials!=null?item.hazardousMaterials[dict.value]:'' }}</el-col>
            <span v-show="false">{{ (item.dg = JSON.stringify(item.hazardousMaterials) == "{}"||JSON.stringify(item.hazardousMaterials) == null ? 0 : 1) }}</span>
            <el-col :span="20" v-show="item.dg == 0">
              <el-radio-group @input="changeBatteries(item)" v-model="item.batteries">
                <el-radio :label="2" border>Has batteries</el-radio>
                <el-radio :label="3" border>No batteries</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="color: #004F7C; font-weight: 700 !important; margin-bottom: 5px">
            <el-col :span="8">RefNo&Numbers</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <p>{{ item.mark }}</p>
            </el-col>
          </el-row>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-card style="padding: 15px;margin-top: 10px;">
      <el-table v-show="showItems" :data="itemTableData">
        <el-table-column prop="orderId" label="Order Number">
          <template v-slot="scope">
            <span>{{ orderMap[scope.row.orderId] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productId" :label="$t('booking.product')">
          <template v-slot="scope">
            <span>
              {{
              productMapForBook[scope.row.productId]
              ? productMapForBook[scope.row.productId].code
              : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="productId" :label="$t('booking.product')">
          <template v-slot="scope">
            <span>
              {{
              productMapForBook[scope.row.productId]
              ? productMapForBook[scope.row.productId].name
              : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cargoReadyBy" :label="$t('booking.cargoReadyBy')" width="180">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.cargoReadyBy) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mustArriveBy" :label="$t('booking.mustArriveBy')">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.mustArriveBy) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="requested" :label="$t('booking.requested')">
          <template v-slot="scope">{{ scope.row.requested }}{{ scope.row.requestUnit }}</template>
        </el-table-column>
        <el-table-column prop="bookedQty" :label="$t('booking.booked')">
          <template v-slot="scope">{{ scope.row.bookedQty }}{{ form.cargoPackageType }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getProductList } from '@/api/system/product'
import { get } from '@/api/booking/booking'
import { getDeptList } from '@/api/system/dept'
import { getHeaderList } from '@/api/order/header'
import { getItemList } from '@/api/order/item'
import { getTaskList, updateTask } from '@/api/order/task'
export default {
  name: 'Container',
  components: {},
  data() {
    return {
      form: {},
      partiesMap: {},
      orderItemMap: {},
      itemTableData: [],
      productMapForBook: {},
      orderMap: {},
      showItems: false,
      flag: false,
      tasks: []
    }
  },
  created() {
    this.get()
  },
  methods: {
    validateBooking(status) {
      this.$confirm('Confirm to proceed?', 'Tips', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          if (status == 0) {
            this.$prompt('Please provide a reason.', 'Tips', {
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel'
            })
              .then(({ value }) => {
                var data = {
                  status: status,
                  approveResult: 'Failed',
                  reason: value
                }
                console.log(this.tasks.length)
                for (var i = 0; i < this.tasks.length; i++) {
                  var task = this.tasks[i]
                  task.jsonData = JSON.stringify(data)
                  console.log(task)
                  updateTask(task).then(res => {
                    this.$notify({
                      title: 'Success',
                      message: 'Success',
                      type: 'success'
                    })
                    this.get()
                  })
                }
              })
              .catch(() => {})
          } else {
            var data = {
              status: status,
              approveResult: 'Pass'
            }
            console.log(this.tasks.length)
            for (var i = 0; i < this.tasks.length; i++) {
              var task = this.tasks[i]
              task.jsonData = JSON.stringify(data)
              console.log(task)
              updateTask(task).then(res => {
                this.$notify({
                  title: 'Success',
                  message: 'Success',
                  type: 'success'
                })
                this.get()
              })
            }
          }
        })
        .catch(() => {})
    },
    createShipment() {
      this.$router.push('/shipment/create?ids=' + this.form.id)
    },
    getDeptList(ids) {
      getDeptList({ ids: ids.join(',') }).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.$set(this.partiesMap, response.data[i].id, response.data[i].name + '\n' + (response.data[i].country ? response.data[i].country : '') + ' ' + (response.data[i].address ? response.data[i].address : ''))
        }
      })
    },
    get() {
      this.tasks = []
      get(this.$route.query.id).then(response => {
        var orderItems = []
        for (var i = 0; i < response.data.bookingItemDOS.length; i++) {
          orderItems.push(response.data.bookingItemDOS[i].orderItemId)
          this.orderItemMap[response.data.bookingItemDOS[i].orderItemId] = response.data.bookingItemDOS[i].qty
        }
        if (response.data.shipmentId == null) {
          this.flag = true
        }
        if (orderItems.length > 0) {
          this.showItems = true
          getItemList({ ids: orderItems.join(',') }).then(response => {
            var productIds = []
            var orderIds = []
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].bookedQty = this.orderItemMap[response.data[i].id]
              productIds.push(response.data[i].productId)
              orderIds.push(response.data[i].orderId)
            }
            this.itemTableData = response.data
            getHeaderList({ ids: orderIds.join(',') }).then(response => {
              for (var i = 0; i < response.data.length; i++) {
                this.$set(this.orderMap, [response.data[i].id], response.data[i].orderNumber)
                getTaskList({ orderNumber: response.data[i].orderNumber, status: 1, type: 1 }).then(res => {
                  if (res.data.length > 0) {
                    this.tasks.push(res.data[0])
                  }
                })
              }
            })
            getProductList({ ids: productIds }).then(response => {
              for (var i = 0; i < response.data.length; i++) {
                this.$set(this.productMapForBook, [response.data[i].id], {
                  name: response.data[i].name,
                  code: response.data[i].code
                })
              }
            })
          })
        }
        var products = response.data.bookingProductDOS
        var ids = [response.data.shipper, response.data.consignee, response.data.seller, response.data.notifyParty]
        this.getDeptList(ids)
        for (var j = 0; j < products.length; j++) {
          products[j].hazardousMaterials = JSON.parse(products[j].hazardousMaterials)
          products[j].batteries = Number(products[j].batteries)
          console.log(products[j])
        }

        this.form = response.data
      })
    }
  }
}
</script>
