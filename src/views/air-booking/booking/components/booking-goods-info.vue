<!--shipment cargo info table-->
<template>
    <div v-loading="loading" >
        <el-table style="margin-bottom:10px" border v-show="productDOList&&productDOList.length > 0" :data="productDOList">

                      <el-table-column prop="soRef" label="SO Number">
                <template v-slot="scope">
                    <el-link type="primary" target="_blank" :href="'/shipment/ppshippingOrderDetail?id='+scope.row.soId">
                        <span>{{ soRefMapByShippingId[scope.row.soId] }}</span>
                    </el-link>
                </template>
            </el-table-column>
            <!--  Mark&Numbers -->
            <el-table-column prop="markNumbers" label="Mark&Numbers">
                <template v-slot="scope">
                    <span>{{ scope.row.markNumbers }}</span>
                </template>
            </el-table-column>
            <!--  Product Name -->
            <el-table-column prop="productEnglishName" label="Product Name">
                <template v-slot="scope">
                    <span style="white-space: pre-line;">{{ scope.row.productEnglishName }}</span>
                </template>
            </el-table-column>
            <!--  HS code -->
            <el-table-column prop="hscode" label="HS code">
                <template v-slot="scope">
                    <span>{{ scope.row.hscode }}</span>
                </template>
            </el-table-column>
            <!-- Number Of Packages -->
            <el-table-column prop="numberOfPackages" label="Number Of Packages">
                <template v-slot="scope">
                    <span>{{ scope.row.numberOfPackages }}</span>
                </template>
            </el-table-column>
            <!-- Packages -->
            <el-table-column prop="packages" :label="'Packages'">
                <template v-slot="scope">
                    <span>{{ scope.row.packages }}</span>
                </template>
            </el-table-column>
            <!-- Total Weight -->
            <el-table-column prop="grossWeight" :label="'Gross Weight (KG)'">
                <template v-slot="scope">
                    <span>{{ scope.row.grossWeight }}</span>
                </template>
            </el-table-column>
            <!-- Total Volume -->
            <el-table-column prop="volume" :label="'Volume (CBM)'">
                <template v-slot="scope">
                    <span>{{ scope.row.volume }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>


<script>
import { getShippingOrderListByIds } from '@/api/shipping/order'


/**
 * shipmentCargoInfoTable
 * @author edwin
 */
export default {
    name: 'shipmentCargoInfoTable',
    props: {},
    data() {
        return {
            // shipping order list
            shippingOrderList: [],
            soRefMapByShippingId: {},
            loading: false,
            isShowSoCargoInfo: false,
            productDOList:[],
        }
    },
    created() {
        console.log('shipmentCargoInfoTable created')
    },
    methods: {
        active(shippingOrderList, shippingOrderIds) {
            this.loading = true
            if (shippingOrderList && shippingOrderList.length > 0) {
                this.refresh(shippingOrderList)
                this.loading = false
            } else {
                getShippingOrderListByIds(shippingOrderIds).then(response => {
                    this.refresh(response.data)
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                })
            }
        },
        refresh(shippingOrderList) {
            this.shippingOrderList = shippingOrderList ? shippingOrderList : []
            this.soRefMapByShippingId = this.shippingOrderToMap(this.shippingOrderList)
            this.productDOList = this.getAllProductDOList(this.shippingOrderList)
            this.$emit('so-product-list', this.productDOList)
            console.log('this.productDOList', this.productDOList)
            console.log('this.shippingOrderList', this.shippingOrderList)
            console.log('this.soRefMapByShippingId', this.soRefMapByShippingId)
            this.showSoCargoInfo(this.productDOList)
            // this.$emit('complete', this.shippingOrderList)
        },
        shippingOrderToMap(shippingOrderList) {
            if (!shippingOrderList) return
            return shippingOrderList.reduce((acc, cur) => {
                acc[cur.id] = cur.soRef
                return acc
            }, {})
        },
        showSoCargoInfo(productDOList){
            if(productDOList && productDOList.length > 0){
                this.showSoCargoInfo = true
            }else{
                this.showSoCargoInfo = false
            }
        },
        getAllProductDOList(orderList) {
            if (!orderList || orderList.length === 0) return []
            const allProducts = []
            for (const order of orderList) {
                if (order.productDOList && order.productDOList.length > 0) {
                    allProducts.push(...order.productDOList)
                }
            }
            return allProducts
        },
        parseTimeToZ1(timestamp) {
            // console.log(timestamp,timestamp)
            if (!timestamp) return null
            const date = new Date(timestamp)
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const seconds = date.getSeconds().toString().padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        },
    }

}
</script>

<style scoped></style>
