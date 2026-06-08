<template>
  <div>
    <div v-if="isPopoverVisible" class="overlay" @click="closeWholePopover"></div>

    <el-popover style="margin-top: 10px;" placement="bottom" popper-class="pv-body" trigger="click" title=" "
                @show="onOuterShow" @hide="onOuterHide">
      <!-- icon 展示 -->
      <el-badge class="item" slot="reference" :hidden="allCount == 0" :value="allCount" :max="99">
        <el-button style="font-size: 20px;border: 0px;background-color:transparent;" class="el-icon-message-solid"
                   type="primary"></el-button>
      </el-badge>

      <div class="popover-content" @click="closeInPopover">
        <el-row :gutter="20">
          <el-col :span="9">
            <el-card>
              <el-tabs v-model="activeName" class="pv-tabs" @tab-click="changeTabs">
                <el-tab-pane class="pv-pane" name="amendRequest" v-if="customerReqFlag || customerAdminReqFlag">
                  <span slot="label">
                    Amend request
                    <el-badge v-if="approvalInfoNum != 0" class="mark" :value="approvalInfoNum" />
                  </span>
                  <div style="padding-bottom: 20px">
                    <div style="display: inline-block; width: 75%; margin-right: 10px">
                      <el-input v-model="queryApproval.query" placeholder="Search" clearable @clear="queryLikeList"
                                @keyup.enter.native="queryApproval.query = $event.target.value.trim(); queryLikeList()"></el-input>
                    </div>
                    <div style="display: inline-block; width: 20%;">
                      <el-popover v-model="filterPopover" placement="bottom" title width="400" trigger="click" :teleported="false"  @click.native.stop>
                        <el-form>
                          <el-row :gutter="10" style="margin-bottom: 15px;">
                            <el-col :span="12">
                              <el-input clearable v-model="queryApproval.po" placeholder="PO"></el-input>
                            </el-col>
                            <el-col :span="12">
                              <!--                              <el-input clearable v-model="queryApproval.pol" placeholder="POL"></el-input>-->
                              <el-select clearable placeholder="POL" filterable v-model="queryApproval.pol">
                                <el-option v-for="dict in polDataList" :key="dict.value"
                                           :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
                              </el-select>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10" style="margin-bottom: 15px;">
                            <el-col :span="12">
                              <el-select clearable v-model="queryApproval.soType" placeholder="SO TYPE">
                                <el-option label="FCL" value="FCL"></el-option>
                                <el-option label="LCL" value="LCL"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="12">
                              <el-input clearable v-model="queryApproval.moovRef" placeholder="Moov Ref"
                                        filterable></el-input>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10" style="margin-bottom: 15px;">
                            <el-col :span="12">
                              <el-select clearable v-model="queryApproval.dcCode" placeholder="DC Code">
                                <el-option label="0006" value="0006"></el-option>
                                <el-option label="0015" value="0015"></el-option>
                                <el-option label="0018" value="0018"></el-option>
                                <el-option label="0021" value="0021"></el-option>
                                <el-option label="0027" value="0027"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="12">
                              <el-select clearable v-model="queryApproval.approvalType" placeholder="Request category">
                                <el-option v-for="[key, value] in Array.from(approvalTypeMap.entries())" :key="key"
                                           :label="key" :value="value">
                                </el-option>
                              </el-select>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10" style="margin-bottom: 15px;">
                            <el-col :span="24">
                              <el-date-picker v-model="queryApproval.timeRange" clearable type="daterange"
                                              range-separator="-" start-placeholder="Time From" end-placeholder="Time To"
                                              value-format="yyyy-MM-dd HH:mm:ss" style="margin-bottom: 15px;"
                                              :picker-options="pickerOptions"></el-date-picker>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10" style="margin-bottom: 15px;">
                            <el-col :span="12">
                              <el-input clearable v-model="queryApproval.shipmentRef"
                                        placeholder="Shipment Ref"></el-input>
                            </el-col>
                            <el-col :span="12">
                              <el-radio v-model="queryApproval.isDone" :label="false">Undo</el-radio>
                              <el-radio v-model="queryApproval.isDone" :label="null">All</el-radio>
                              <!--                              <el-button type="text" @click="queryApproval.isDone = false " > Reset </el-button>-->
                            </el-col>
                          </el-row>
                          <el-row :gutter="15" style="margin-bottom: 15px;">
                            <el-col style="text-align: right">
                              <el-button plain @click="resetQueryApproval">Reset All</el-button>
                              <el-button @click="queryLikeList(); filterPopover = false" icon="el-icon-search"
                                         plain>Search</el-button>
                            </el-col>
                          </el-row>
                        </el-form>
                        <el-button slot="reference" icon="el-icon-plus" plain
                                   :style="{ color: hasFilter ? 'red' : '' }">Filter</el-button>
                      </el-popover>
                    </div>
                  </div>
                  <el-empty v-show="approvalData.length == 0" style="height: 100%;"></el-empty>
                  <!-- <div
                    style="margin-bottom: 10px;height:90%;overflow-y:auto"
                    v-infinite-scroll="customerRequestList"
                    infinite-scroll-disabled="scrollLoading"
                    infinite-scroll-distance="10"
                    infinite-scroll-immediate="false"
                  > -->
                  <el-card v-for="item in approvalData" :key="item.id"
                           :class="!aReqReadStatus(item.status) ? 'pv-card-bg-read' : item.isCancel ? 'pv-card-bg-cancel' : 'pv-card-bg'">
                    <div @click="amendRequestDetail(item)">
                      <div :class="aReqReadStatus(item.status) ? 'read-div not-read-css' : 'read-div read-css'">
                        <el-row>
                          <el-col :span="1">
                            <el-badge v-if="aReqReadStatus(item.status)" is-dot class="notify-badge">
                              <span :class="item.isCancel ? 'el-icon-s-release' : 'el-icon-s-claim'"
                                    style="font-size: 20px; color: #5dade2; "></span>
                            </el-badge>
                            <span v-else :class="item.isCancel ? 'el-icon-s-release' : 'el-icon-s-claim'"
                                  style="font-size: 20px; color: #708090ad; "></span>
                          </el-col>
                          <el-col :span="21">
                            <span :class="aReqReadStatus(item.status) ? 'pv-head-title' : 'pv-head-title-read'">
                              <div>
                                <span
                                  v-if="item.type && (item.type == 'PO CRD' || item.type == 'PO CRD NO APPROVAL')">{{
                                    item.orderRef }}</span>
                                <span v-else>{{ item.soRef }}</span>
                              </div>
                              <div>
                                <span
                                  v-if="item.type && (item.type == 'PO CRD' || item.type == 'PO CRD NO APPROVAL')">SO
                                  Number: {{ item.soRef }}</span>
                              </div>
                              <div>
                                <span v-if="(item.type === 'PO CRD' || item.type === 'PO CRD NO APPROVAL')">
                                  POL: {{ item.pol }}
                                </span>
                              </div>
                              <div>
                                <span v-if="(item.type === 'PO CRD' || item.type === 'PO CRD NO APPROVAL')">
                                  DC Code: {{ item.dcCode }}
                                </span>
                              </div>
                              <!-- 添加的 SO_TYPE 显示行 -->
                              <div>
                                <span
                                  v-if="item.shipmentType && (item.type === 'PO CRD' || item.type === 'PO CRD NO APPROVAL')">
                                  SO_TYPE: {{ item.shipmentType }}
                                </span>
                              </div>
                              <el-tag style="margin-left: 20px;" type="danger" v-if="item.isCancel">Cancel
                                request</el-tag>
                              <el-tag style="margin-left: 20px;" type="danger"
                                      v-else-if="item.type == 'Remove PO'">Remove
                                PO request</el-tag>
                              <el-tag style="margin-left: 20px;" type="success" v-else-if="item.type == 'Add PO'">Add PO
                                request</el-tag>
                              <el-tag style="margin-left: 20px;" type="success" v-else-if="item.type == 'PO CRD'">PO CRD
                                Amend Request</el-tag>
                              <el-tag style="margin-left: 20px;" type="success" v-else-if="item.type == 'Amend QTY'">Qty
                                Amend request</el-tag>
                              <el-tag style="margin-left: 20px;" type="success"
                                      v-else-if="item.type == 'PO CRD NO APPROVAL'">PO CRD has already been modified</el-tag>
                              <el-tag style="margin-left: 20px;" v-else type="warning">Amend request</el-tag>
                            </span>
                            <div :class="aReqReadStatus(item.status) ? 'pv-head-title' : 'pv-head-title-read'"
                                 v-html="filteredHtml(item.approvalRecordDOList[item.approvalRecordDOList.length - 1]?.remark)">
                            </div>
                          </el-col>
                          <el-col :span="2">
                            <span v-if="aReqReadStatus(item.status)">
                              <el-badge class="ar-badge" :value="1" type="primary" />
                            </span>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="text-ellipsis-css" v-html="item.templateContent"></div>
                      <div class="text-time-css">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}') }}</div>
                    </div>
                  </el-card>
                  <!-- </div> -->
                  <!-- 在 </div> 结束标签后添加分页组件 -->
                  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                 :current-page="queryApproval.pageNo" :page-sizes="[10, 20, 50]" :page-size="queryApproval.pageSize"
                                 layout="total, sizes, prev, pager, next, jumper" :total="approvalTotal">
                  </el-pagination>
                </el-tab-pane>
                <el-tab-pane class="pv-pane" name="notifications">
                  <span slot="label">
                    Notifications
                    <el-badge class="mark" v-if="notifySubscribeCount != 0" :value="notifySubscribeCount" />
                  </span>
                  <div style="padding-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <!-- <div style="display: inline-block; width: 40%;"> -->
                    <el-input v-model="notifyQueryParams.orderNumber" placeholder="Search" clearable
                              @clear="queryNotifyLikeList"
                              @keyup.enter.native="notifyQueryParams.orderNumber = $event.target.value.trim(); queryNotifyLikeList()"></el-input>
                    <!-- </div> -->
                    <!-- <div style="display: inline-block; width: 25%;"> -->
                    <el-button type="info" @click="markAllAsRead">Mark All Read</el-button>
                    <!-- </div> -->
                    <!-- <div style="display: inline-block; width: 20%;"> -->
                    <el-popover v-model="notifyFilterPopover" placement="bottom" title width="400" trigger="click" :teleported="false"  @click.native.stop>
                      <el-form>
                        <el-row :gutter="10" style="margin-bottom: 15px;">
                          <el-col :span="12">
                            <el-input clearable v-model="notifyQueryParams.orderNumber" placeholder="PO"></el-input>
                          </el-col>
                          <el-col :span="12">
                            <el-input clearable v-model="notifyQueryParams.originPort" placeholder="Origin Port"></el-input>
                          </el-col>
                        </el-row>
                        <el-row :gutter="10" style="margin-bottom: 15px;">
                          <el-col :span="12">
                            <el-select clearable v-model="notifyQueryParams.soType" placeholder="SO TYPE">
                              <el-option label="FCL" value="FCL"></el-option>
                              <el-option label="LCL" value="LCL"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="12">
                            <el-select clearable placeholder="POL" filterable v-model="notifyQueryParams.pol">
                              <el-option v-for="dict in polDataList" :key="dict.value"
                                         :label="dict.label + ' (' + dict.value + ')'" :value="dict.value" />
                            </el-select>
                          </el-col>
                        </el-row>
                        <el-row :gutter="10" style="margin-bottom: 15px;">
                          <el-col :span="24">
                            <el-date-picker v-model="notifyQueryParams.createTime" clearable type="daterange"
                                            range-separator="-" start-placeholder="Time From" end-placeholder="Time To"
                                            value-format="yyyy-MM-dd HH:mm:ss" style="margin-bottom: 15px;"
                                            :picker-options="pickerOptions"></el-date-picker>
                          </el-col>
                        </el-row>
                        <el-row :gutter="10" style="margin-bottom: 15px;">
                          <el-col :span="24">
                            <el-radio v-model="notifyQueryParams.readStatus" :label="false">Unread</el-radio>
                            <el-radio v-model="notifyQueryParams.readStatus" :label="true">Read</el-radio>
                            <el-radio v-model="notifyQueryParams.readStatus" :label="null">All</el-radio>
                            <!--                              <el-button type="text" @click="queryApproval.isDone = false " > Reset </el-button>-->
                          </el-col>
                        </el-row>
                        <el-row :gutter="15" style="margin-bottom: 15px;">
                          <el-col style="text-align: right">
                            <el-button plain @click="resetNotifyQueryParams">Reset All</el-button>
                            <el-button @click="queryNotifyLikeList(); notifyFilterPopover = false" icon="el-icon-search"
                                       plain>Search</el-button>
                          </el-col>
                        </el-row>
                      </el-form>
                      <el-button slot="reference" icon="el-icon-plus" plain
                                 :style="{ color: hasFilter ? 'red' : '' }">Filter</el-button>
                    </el-popover>
                    <!-- </div> -->
                  </div>
                  <div v-hasPermi="['system:notify:subscribe:show']"
                       style="display: flex; margin-bottom: 10px; justify-content: flex-end;">
                    <el-popover placement="bottom" width="400" trigger="click">
                      <div>Select Notifications to Subscribe to:</div>
                      <div v-for="item in subcribeList" :key="item.subscribeId">
                        <el-checkbox v-model="item.enabled" :label="item.subscribeDesc"
                                     @change="handleSubcribeChange(item)"></el-checkbox>
                      </div>
                      <el-button class="el-icon-setting" slot="reference"></el-button>
                    </el-popover>
                  </div>
                  <el-empty v-show="notifySubscribeList.length == 0" style="height: 100%;"></el-empty>
                  <el-card :class="!item.readStatus ? 'pv-card-bg' : 'pv-card-bg-read'"
                           v-for="item in notifySubscribeList" :key="item.id">
                    <div @click="notifyDetail(item)">
                      <div :class="!item.readStatus ? 'read-div read-css' : 'read-div not-read-css'">
                        <el-row :gutter="10">
                          <el-col :span="1">
                            <el-badge v-if="!item.readStatus" is-dot class="notify-badge">
                              <span
                                :class="(item.templateCode == 'notification' || item.templateCode == 'notification_update_crd') ? 'el-icon-message-solid' : 'el-icon-s-claim'"
                                :style="{ 'font-size': '20px', 'color': '#5dade2' }"></span>
                            </el-badge>
                            <span v-else
                                  :class="(item.templateCode == 'notification' || item.templateCode == 'notification_update_crd') ? 'el-icon-message-solid' : 'el-icon-s-claim'"
                                  :style="{ 'font-size': '20px', 'color': '#708090ad' }"></span>
                          </el-col>
                          <el-col :span="21">
                            <span :class="!item.readStatus ? 'pv-head-title' : 'pv-head-title-read'">
                              <span v-if="item.templateCode === 'notification_update_crd'">PO CRD has been
                                modified</span>
                              <span v-else-if="item.templateCode === 'notification_po_crd_request_approve'">CRD
                                modification request has been approved</span>
                              <span v-else-if="item.templateCode === 'notification_po_crd_request_reject'">CRD
                                modification request has been rejected</span>
                              <span v-else-if="item.templateCode === 'notification_amend_qty_request'">{{
                                  item.templateNickname }}</span>
                              <span v-else-if="item.templateCode === 'notification_shipper_booking_request'">{{
                                  item.templateNickname }}</span>
                              <span v-else-if="item.templateCode === 'notification_amend_request'">{{
                                  item.templateNickname }}</span>
                              <span v-else>{{ item.templateNickname }}</span>
                            </span>
                          </el-col>
                          <!-- <el-col :span="2"></el-col> -->
                        </el-row>
                      </div>
                      <div v-if="notifyTemplateCodes.includes(item.templateCode)"
                           :class="!item.readStatus ? 'pv-head-title' : 'pv-head-title-read'">{{ item.templateContent }}
                      </div>
                      <div v-if="item.templateCode == 'subscribe'" class="text-ellipsis-css"
                           v-html="item.templateContent"></div>
                      <!-- <div class="text-time-css">{{ parseTime(item.createTime,'{y}-{m}-{d} {h}:{i}') }}</div> -->
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div class="text-time-css">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}') }}</div>
                      <div class="po-info-tags" v-show="item.templateCode=='notification_cancelled_po'">
                        <el-tag size="mini" type="info" class="po-tag">
                          <i class="el-icon-location-outline"></i> Origin Port: {{ item.pol }}
                        </el-tag>
                        <el-tag size="mini" type="warning" class="po-tag">
                          <i class="el-icon-office-building"></i> DC: {{ item.dcCode }}
                        </el-tag>
                      </div>
                      <div class="action-btn" v-show="!item.readStatus">
                        <el-button type="success" size="mini" round @click="handleReadAndClear(item)"
                                   style="padding: 5px 9px; font-size: 11px;">Read And Clear</el-button>
                      </div>
                    </div>
                  </el-card>
                  <!-- 添加分页组件 -->
                  <el-pagination @size-change="handleNotificationSizeChange"
                                 @current-change="handleNotificationCurrentChange" :current-page="notifyQueryParams.pageNo"
                                 :page-sizes="[10, 20, 50]" :page-size="notifyQueryParams.pageSize"
                                 layout="total, sizes, prev, pager, next, jumper" :total="notificationTotal"
                                 style="text-align: right; margin-top: 15px;">
                  </el-pagination>
                </el-tab-pane>
                <el-tab-pane class="pv-pane" name="smartTicket">
                  <span slot="label">
                    smartTicket
                    <el-badge class="mark" v-if="unreadCount != 0" :value="unreadCount" />
                  </span>
                  <el-empty v-show="list.length == 0" style="height: 100%;"></el-empty>

                  <el-card class="pv-card-bg" v-for="item in list" :key="item.id">
                    <div @click="ticketDetail(item)">
                      <div :class="item.isRead ? 'read-div read-css' : 'read-div not-read-css'">
                        <el-row>
                          <el-col :span="1">
                            <el-badge v-if="!item.isRead" is-dot class="notify-badge">
                              <span class="el-icon-s-claim" style="font-size: 20px; color: #5dade2; "></span>
                            </el-badge>
                            <span v-else class="el-icon-s-claim" style="font-size: 20px; color: #708090ad; "></span>
                          </el-col>
                          <el-col :span="21">
                            <span class="pv-head-title">{{ item.templateParams.summary }}</span>
                          </el-col>
                          <el-col :span="2">
                            <span @click="handleUpdateAll(item.id)" class="mark-as-read-css">
                              <i class="el-icon-check" />
                            </span>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="text-ellipsis-css" v-html="item.templateContent"></div>
                      <div class="text-time-css">{{ parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}') }}</div>
                    </div>
                  </el-card>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>

          <!--     ------ 右边 ----     -->
          <el-col :span="15">
            <el-card>
              <div class="pv-pane-right" v-loading="detailDialogFormVisible">
                <el-empty v-show="showDetail" style="height: 100%;"></el-empty>

                <!--                smartTicket-->
                <div v-if="!showDetail && activeName == 'smartTicket'">
                  <div class="pv-detail-head-title">
                    <p>{{ ticketTitle }}</p>
                  </div>
                  <el-divider class="divider-css"></el-divider>
                  <el-timeline style="min-height: 500px;">
                    <el-timeline-item v-for="(item, index) in detailRemarkList" class="timeline-v1"
                                      :color="activityColor(item.result, item.type)" size="large" type="primary"
                                      :icon="activityIcon(item.result, item.type)" :timestamp="item.userName + ' - ' + item.date"
                                      placement="top">
                      <el-card style="padding: 15px;">
                        <span class="timeline-type">{{ activityType(item.type) }}</span>
                        <p v-html="convertRemarkToHtml(item?.remark)"></p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <!--                amendRequest-->
                <div v-if="!showDetail && activeName == 'amendRequest'">
                  <div class="pv-detail-head-title">
                    <!-- <div style="max-height:35px; overflow: hidden;" v-html="filteredHtml(amendShippingText)"></div> -->
                  </div>
                  <el-divider class="divider-css"></el-divider>
                  <el-timeline
                    :style="{ 'height': (customerAdminReqFlag && amendRequestData.status < 2) ? '435px' : '100%', 'overflow-y': 'auto' }">
                    <el-timeline-item v-for="(item, index) in detailRemarkList" class="timeline-v1"
                                      :color="approvalActivityColor(item.status)" size="large" type="primary"
                                      :icon="approvalActivityIcon(item.status)"
                                      :timestamp="item.creator + ' - ' + parseTime(item.createTime)" placement="top">
                      <el-card style="padding: 15px;">
                        <span class="timeline-type">{{ approvalActivityType(item.status) }}</span>
                        <p v-if="index == 0 && amendRequestData.type == 'Remove PO'">
                          <el-tag type="primary" style="cursor: pointer;"
                                  @click="showRemovePoDialog(amendRequestData)">{{ amendRequestData.soRef }}</el-tag>
                          <br />
                        </p>
                        <p v-else-if="index == 0 && amendRequestData.type == 'Add PO'">
                          <el-tag type="primary" style="cursor: pointer;" @click="showAddPoDialog(amendRequestData)">{{
                              amendRequestData.soRef }}</el-tag>
                          <br />
                        </p>
                        <p v-else-if="index == 0 && amendRequestData.type == 'PO CRD'">
                          <el-tag type="primary" style="cursor: pointer;" @click="showPoCrdDialog(amendRequestData)">{{
                              amendRequestData.orderRef }}</el-tag>
                          <br />
                        </p>
                        <p v-else-if="index == 0 && amendRequestData.type == 'PO CRD NO APPROVAL'">
                          <el-tag type="primary" style="cursor: pointer;" @click="showPoCrdDialog(amendRequestData)">{{
                              amendRequestData.orderRef }}</el-tag>
                          <br />
                        </p>
                        <p v-else-if="index == 0 && amendRequestData.type == 'Amend QTY'">
                          <el-tag type="primary" style="cursor: pointer;"
                                  @click="showModifyQtyDialog(amendRequestData)">{{ amendRequestData.soRef }}</el-tag>
                          <br />
                        </p>
                        <p v-else-if="index == 0 && !amendRequestData.isCancel">
                          <el-link type="primary"
                                   :href="'/shipment/amendShipping?id=' + amendRequestData.soId + '&apId=' + amendRequestData.id"
                                   target="_blank">{{ amendRequestData.soRef }}</el-link>
                          <br />
                        </p>
                        <p v-html="convertRemarkToHtml(item?.remark)"></p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                  <el-divider class="divider-css"
                              v-if="(customerAdminReqFlag && amendRequestData.status < 2)"></el-divider>
                  <div
                    v-if="customerAdminReqFlag && amendRequestData.status < 2 && amendRequestData.type != 'PO CRD' && amendRequestData.type != 'Amend QTY' && amendRequestData.type != 'PO CRD NO APPROVAL'"
                    style="border: 1px solid #ccc;  ">
                    <Editor style="height: 150px; overflow-y: hidden;" v-model="amendRemark"
                            :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
                  </div>
                  <div v-if="customerAdminReqFlag && amendRequestData.status < 2">
                    <!--                    <el-button-->
                    <!--                      size="mini"-->
                    <!--                      type="text"-->
                    <!--                      icon="el-icon-video-play"-->
                    <!--                      :disabled="amendRequestData.status >= 2"-->
                    <!--                      @click="handleGo"-->
                    <!--                    >Start Task</el-button>-->

                    <el-button
                      v-if="!(amendRequestData.type == 'Add PO' || amendRequestData.type == 'Remove PO' || amendRequestData.type == 'PO CRD' || amendRequestData.type == 'Amend QTY' || amendRequestData.type == 'PO CRD NO APPROVAL')"
                      size="mini" type="text" icon="el-icon-check" :disabled="amendRequestData.status > 1"
                      @click="submitRemark(2)">Completed</el-button>
                    <el-button
                      v-if="!(amendRequestData.type == 'Add PO' || amendRequestData.type == 'Remove PO' || amendRequestData.type == 'PO CRD' || amendRequestData.type == 'Amend QTY' || amendRequestData.type == 'PO CRD NO APPROVAL')"
                      size="mini" type="text" icon="el-icon-close" :disabled="amendRequestData.status > 1"
                      @click="submitRemark(3)">Reject</el-button>
                  </div>
                </div>
                <!--                notifications-->
                <div v-if="!showDetail && activeName == 'notifications'">
                  <div
                    v-if="templateCode === 'notification_update_crd' || templateCode === 'notification_po_crd_request_approve' || templateCode === 'notification_po_crd_request_reject'">
                    <div style="margin-bottom: 20px;">
                      <span :style="{
                        fontSize: '26px',
                        fontWeight: 'bold'
                      }">{{ notifyUpdateCRD.orderNumber }}</span>
                    </div>
                    <div
                      style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                      <span :style="{ fontSize: '16px' }">
                        <span style="color: #004f7c;">SO TYPE:</span> {{ notifyUpdateCRD.soType }}
                      </span>
                      <span :style="{ fontSize: '16px', textAlign: 'center', flex: 1 }">
                        <span style="color: #004f7c;">POL:</span> {{ notifyUpdateCRD.pol }}
                      </span>
                    </div>
                    <div>
                      <span :style="{ fontSize: '16px' }">
                        <span style="color: #004f7c;">{{ notifyUpdateCRD.remark }}</span>
                      </span>
                    </div>
                    <el-table :data="[parseTemplateParams(notifyData.templateParams)]" :style="{
                      width: '79%',
                      transform: 'scale(1.18)',
                      transformOrigin: 'top left',
                      marginTop: '20px'
                    }" border :header-cell-style="{ background: '#f5f5f5' }" :cell-style="{ textAlign: 'center' }">
                      <el-table-column label="Change data" align="center">
                        <template slot-scope="scope">
                          Cargo ready date
                        </template>
                      </el-table-column>
                      <el-table-column prop="before" label="Before the change" align="center" />
                      <el-table-column prop="after" label="After the change" align="center" />
                    </el-table>
                    <br></br>
                    <!-- 操作按钮 -->
                    <div class="action-btn" style="margin-bottom: 20px; margin-top: 20px;" align="center">
                      <el-button type="success" size="small" @click="handleReadAndClear2(notifyUpdateCRD.id)">Read And
                        Clear</el-button>
                    </div>
                  </div>
                  <!-- 新增: 当 templateCode 为 notification_amend_qty_request 时显示 amendRequest 的样式 -->
                  <div v-else-if="notifyTimelineTypes.includes(templateCode)">
                    <!-- <div class="pv-detail-head-title">
      <p>{{notifyData.templateNickname}}</p>
    </div> -->
                    <el-divider class="divider-css"></el-divider>
                    <el-timeline :style="{ 'height': '100%', 'overflow-y': 'auto' }">
                      <el-timeline-item v-for="(item, index) in detailRemarkList" class="timeline-v1"
                                        :color="approvalActivityColor(item.status)" size="large" type="primary"
                                        :icon="approvalActivityIcon(item.status)"
                                        :timestamp="item.creatorName + ' - ' + parseTime(item.createTime)" placement="top">
                        <el-card style="padding: 15px;">
                          <span class="timeline-type">{{ approvalActivityType(item.status) }}</span>
                          <p v-if="index == 0 && templateCode == 'Remove PO'">
                            <el-tag type="primary" style="cursor: pointer;"
                                    @click="showRemovePoDialog(amendRequestData)">{{
                                amendRequestData.soRef }}</el-tag>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && templateCode == 'Add PO'">
                            <el-tag type="primary" style="cursor: pointer;"
                                    @click="showAddPoDialog(amendRequestData)">{{
                                amendRequestData.soRef }}</el-tag>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && templateCode == 'PO CRD'">
                            <el-tag type="primary" style="cursor: pointer;"
                                    @click="showPoCrdDialog(amendRequestData)">{{
                                amendRequestData.orderRef }}</el-tag>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && templateCode == 'PO CRD NO APPROVAL'">
                            <el-tag type="primary" style="cursor: pointer;"
                                    @click="showPoCrdDialog(amendRequestData)">{{
                                amendRequestData.orderRef }}</el-tag>
                            <br />
                          </p>
                          <p
                            v-else-if="index == 0 && templateCode == 'notification_amend_qty_request'">
                            <el-tag type="primary" style="cursor: pointer;"
                                    @click="notifyTagShowModifyQtyDialog(amendRequestData)">{{
                                amendRequestData.soRef
                              }}</el-tag>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && templateCode == 'notification_amend_request'">
                            <!-- <el-link type="primary">{{ amendRequestData.soRef }}</el-link> -->
                            <span style="color: #409EFF; cursor: pointer;">{{ amendRequestData.soRef }}</span>
                            <br />
                          </p>
                          <p
                            v-else-if="index == 0 && templateCode == 'notification_add_po_approve_request' || templateCode == 'notification_add_po_reject_request'">
                            <!-- <el-link type="primary">{{ amendRequestData.soRef }}</el-link> -->
                            <span style="color: #409EFF; cursor: pointer;">{{ amendRequestData.soRef }}</span>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && templateCode == 'notification_cancel_request'">
                            <!-- <el-link type="primary">{{ amendRequestData.soRef }}</el-link> -->
                            <span style="color: #409EFF; cursor: pointer;">{{ amendRequestData.soRef }}</span>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && templateCode == 'notification_cancelled_po'">
                            <el-link type="primary"
                                     :href="'/order/ppoManagement?orderNumber=' + amendRequestData.orderNumber"
                                     target="_blank">
                              {{ amendRequestData.orderNumber }}
                            </el-link>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && templateCode == 'verify_documents_reject'">
                            <el-link type="primary">
                            <!-- :href="'/order/ppoManagement?orderNumber=' + amendRequestData.orderNumber"
                            target="_blank"> -->
                            {{ amendRequestData.soRef }}
                            </el-link>
                            <br />
                          </p>

                          <p v-else-if="index == 0 && templateCode == 'notification_po_remove_approve_request' || templateCode == 'notification_po_remove_reject_request'">
                            <!-- <el-link type="primary">{{ amendRequestData.soRef }}</el-link> -->
                            <span style="color: #409EFF; cursor: pointer;">{{ amendRequestData.soRef }}</span>
                            <br />
                          </p>
                          <p v-else-if="
                            index === 0 &&
                            [
                              'notification_shipper_booking_reject_request',
                              'notification_shipper_booking_accept_request',
                              'notification_shipper_booking_pepco_reject_request',
                              'notification_shipper_booking_pepco_accept_request'
                            ].includes(templateCode)
                          ">
                            <el-link type="primary"
                                     :href="'/shipment/ppshippingOrderDetail?id=' + notificationShipperBookingData.soId + '&source=shipping-order'"
                                     target="_blank">
                              {{ notificationShipperBookingData.soRef }}
                            </el-link>
                            <br />
                          </p>
                          <p v-else-if="index == 0 && !amendRequestData.isCancel">
                            <el-link type="primary"
                                     :href="'/shipment/amendShipping?id=' + amendRequestData.soId + '&apId=' + amendRequestData.id"
                                     target="_blank">{{ amendRequestData.soRef }}</el-link>
                            <br />
                          </p>

                          <p v-html="convertRemarkToHtml(item?.remark)"></p>
                        </el-card>
                      </el-timeline-item>
                    </el-timeline>
                  </div>


                  <div v-if="!notifyTemplateCodes.includes(templateCode)">
                    <div class="pv-detail-head-title">
                      <p>{{ notifyData.templateNickname }}</p>
                    </div>
                    <el-divider class="divider-css"></el-divider>
                    <div v-html="notifyData.templateContent"></div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!--        <span @click="handleUpdateAll" class="mark-as-read-css"> {{ $t('notify.allRead') }}</span>-->
      </div>
    </el-popover>
    <ReomovePoProcessDialog ref="removePoProcessDialog" @submit="onRemovePoProcessDialogSubmit">
    </ReomovePoProcessDialog>"
    <AddPoProcessDialog ref="addPoProcessDialog" @submit="onRemovePoProcessDialogSubmit"></AddPoProcessDialog>"
    <AmendPoCrdProcessDialog ref="amendPoCrdProcessDialog" @submit="onAmendPoCrdProcessDialogSubmit">
    </AmendPoCrdProcessDialog>"
    <AmendPoQtyProcessDialog ref="amendPoQtyProcessDialog" @submit="onAmendPoQtyProcessDialogSubmit">
    </AmendPoQtyProcessDialog>"
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
import {
  getUnreadNotifyMessageCountByChatLine,
  getUnreadNotifyMessageListByChatLine,
  updateAllChatLineNotifyMessageRead,
  updateNotifyMessageRead,
  getUnreadNotifyMessageCount,
  getMyNotifyMessagePage,
  getUnreadNotifyMessageCountBySubscribe,
  getUnreadNotifyMessageListBySubscribe,
  getMyNotifyMessagePageBySubscribe
} from '@/api/system/notify/message'
import { getSupportTicket } from '@/api/system/supportTicket'
import { getApprovalInfoNumByUser, getCurrentUserApprovalInfoPage, getApprovalInfoNum, getApprovalInfoPage, updateStatus, readLog } from '@/api/shipping/approvalInfo'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { subscribeList, subscribeUpdate } from '@/api/system/notify/message'
import { findShippingSchedulePortList, getTenantPorts } from '@/api/shipment/shipment'
import ReomovePoProcessDialog from '@/views/pepcoShipping/amend-request/remove-po-process-dialog.vue'
import AddPoProcessDialog from '@/views/pepcoShipping/amend-request/add-po-process-dialog.vue'
import AmendPoQtyProcessDialog from '@/views/pepcoShipping/amend-request/amend-qty-process-dialog.vue'
import AmendPoCrdProcessDialog from '@/views/purchaseOrder/pepco/amend-request/amend-po-crd-process-dialog.vue'
import { getByOrderNumber } from '@/api/order/header'
import { getUserProfile } from "@/api/system/user";
import { shippingApprovalDetail } from '@/api/pepco/shipping-approval'
import { orderCommentAll } from '@/api/system/order-comment'

export default {
  name: 'NotifyMessage',
  components: { Editor, Toolbar, ReomovePoProcessDialog, AddPoProcessDialog, AmendPoCrdProcessDialog, AmendPoQtyProcessDialog },
  data() {
    return {
      notifyFilterPopover: false,
      tableData: [],
      ohaPermission: 0,
      notifyUpdateCRD: null,
      templateCode: null,
      approvalTypeMap: new Map([
        ['Cancel', 'Cancel'],
        ['Remove PO request', 'Remove PO'],
        ['Add PO request', 'Add PO'],
        ['PO CRD Amend Request', 'PO CRD'],
        ['PO CRD has already been modified', 'PO CRD NO APPROVAL'],
        ['Amend QTY request', 'Amend QTY'],
        ['Amend request', 'Amend']
      ]),
      pickerOptions: {
        onPick: (date) => {
          if (date.maxDate) {
            // 设置结束时间为当天的 23:59:59
            date.maxDate.setHours(23);
            date.maxDate.setMinutes(59);
            date.maxDate.setSeconds(59);
          }
          if (date.minDate) {
            // 设置开始时间为当天的 00:00:00
            date.minDate.setHours(0);
            date.minDate.setMinutes(0);
            date.minDate.setSeconds(0);
          }
        }
      },
      editor: null,
      editorConfig: {
        placeholder: 'Remark...',
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 20 * 1024 * 1024
          },
          uploadVideo: {
            customUpload(file, insertFn) {
              // TS 语法
              console.log(file)
              file
                .arrayBuffer()
                .then(buffer => {
                  // 处理 ArrayBuffer，可以根据需要转换为其他格式
                  const uint8Array = new Uint8Array(buffer)

                  // 将 Uint8Array 转换为字符串
                  const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '')

                  // 使用 btoa 将二进制字符串转换为 Base64
                  const base64String = btoa(binaryString)
                  console.log('Base64 Content:', base64String)
                  insertFn('data:video/mp4;base64,' + base64String, '')
                })
                .catch(error => {
                  console.error('Error reading file:', error)
                })
              //
            }
          }
        }
      },
      mode: 'default',
      // 遮罩层
      loading: false,
      // 列表
      list: [],
      // 未读数量,
      unreadCount: 0,
      message: 'UnRead',
      messageShow: false,
      clickItem: {},
      activeName: 'amendRequest',
      showDetail: true,
      detailDialogFormVisible: false,
      scrollLoading: false,
      detailRemarkList: [],
      approvalInfoNum: 0,
      notifyLoading: false,
      notifyList: [],
      notifyData: {},
      unreadNotifyCount: 0,
      queryApproval: {
        pageSize: 10,
        pageNo: 1,
        showAll: null,
        status: null,
        query: null,
        po: null,
        pol: null,
        soType: null,
        moovRef: null,
        shipmentRef: null,
        isDone: false,
        approvalType: null,
        dcCode: null,
        timeRange: []
      },
      notifyQueryParams: {
        pageSize: 10,
        pageNo: 1,
        userType: 2,
        orderNumber: null,
        createTime: [],
        readStatus: false,
        soType: null,
        pol: null
      },
      notificationTotal: 0,
      subscribeQueryParams: {
        userType: 2,
        pageSize: 20,
        pageNo: 1
      },
      approvalData: [],
      approvalTotal: 0,
      amendShippingText: null,
      customerReqFlag: false,
      customerAdminReqFlag: false,
      subscribeUnreadCount: 0,
      subscribeList: [],
      subscribeData: {},
      ticketData: {},
      amendRemark: null,
      ticketTitle: '',
      amendRequestData: {},
      approvalInfoResponse: {},
      isCustomerRequestLoading: false,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      isPopoverVisible: false,
      subcribeList: [], // 用户订阅列表
      filterPopover: false,
      polDataList: [],
      orderPolMap: new Map(),
      orderDcCodeMap: new Map(),
      notificationShipperBookingData: {}
    }
  },
  computed: {
    notifyTemplateCodes() {
      return [
        'notification_update_crd',
        'notification_po_crd_request_approve',
        'notification_po_crd_request_reject',
        'notification_amend_qty_request',
        'notification_amend_request',
        'notification_add_po_approve_request',
        'notification_add_po_reject_request',
        'notification_cancel_request',
        'notification_po_remove_approve_request',
        'notification_po_remove_reject_request',
        'notification_cancelled_po',
        'notification_shipper_booking_reject_request',
        'notification_shipper_booking_accept_request',
        'notification_shipper_booking_pepco_reject_request',
        'notification_shipper_booking_pepco_accept_request',
        'verify_documents_reject'
      ]
    },
    notifyTimelineTypes() {
      return [
        'notification_amend_qty_request',
        'notification_amend_request',
        'notification_add_po_approve_request',
        'notification_add_po_reject_request',
        'notification_cancel_request',
        'notification_po_remove_reject_request',
        'notification_po_remove_approve_request',
        'notification_cancelled_po',
        'verify_documents_reject',
        'notification_shipper_booking_reject_request',
        'notification_shipper_booking_accept_request',
        'notification_shipper_booking_pepco_reject_request',
        'notification_shipper_booking_pepco_accept_request'
      ]
    },
    shipperBookingReviewTypes() {
      return [
        'notification_shipper_booking_reject_request',
        'notification_shipper_booking_accept_request',
        'notification_shipper_booking_pepco_reject_request',
        'notification_shipper_booking_pepco_accept_request'
      ]
    },
    allCount() {
      return this.unreadCount + this.approvalInfoNum + this.unreadNotifyCount + this.subscribeUnreadCount
    },
    notifySubscribeCount() {
      return this.subscribeUnreadCount + this.unreadNotifyCount
    },
    notifySubscribeList() {
      var allList = this.notifyList.concat(this.subscribeList)
      allList.sort(function (a, b) {
        return b.createTime - a.createTime // 降序排序
      })
      return allList
    },
    hasFilter() {
      return this.queryApproval.po || this.queryApproval.pol || this.queryApproval.soType || this.queryApproval.moovRef || this.queryApproval.shipmentRef || this.queryApproval.isDone !== null
    }
  },
  created() {
    this.getPermission()
    // 首次加载小红点
    this.getSubcribeSetList()
    this.getUnreadCount()
    this.getUnreadNotifyCount()
    this.getSubscribeUnreadCount()
    //shipper
    if (this.$auth.hasPermi('shipment:customerRequest-currentUser')) {
      this.customerReqFlag = true
      this.customerRequest()
    } else if (this.$auth.hasPermi('shipment:customerRequest')) {
      this.customerAdminReqFlag = true
      this.customerRequest()
    }
    // 轮询刷新小红点
    setInterval(() => {
      this.getUnreadCount()
      if (this.customerReqFlag || this.customerAdminReqFlag) {
        this.customerRequest()
      }
      this.getSubscribeUnreadCount()
      this.getUnreadNotifyCount()
    }, 1000 * 60 * 1)

    findShippingSchedulePortList().then(response => {
      this.portData = response.data
      getTenantPorts().then(res => {
        this.polDataList = res.data.polList
        this.porDataList = res.data.porList
        this.polDataList = this.portData.filter(item => this.polDataList.includes(item.value))
        this.porDataList = this.portData.filter(item => this.porDataList.includes(item.value))
      })
    })
  },
  methods: {
    /* 点遮罩直接关 popover */
    closeWholePopover() {
      this.isPopoverVisible = false
    },
    /* 外层 popover 打开时 */
    onOuterShow() {
      // 捕获阶段监听整个外层弹窗
      this.isPopoverVisible = true   // 遮罩会同时出现
      this.reList()
      this.$nextTick(() => {
        const popper = document.querySelector('.pv-body')
        if (popper) {
          popper.addEventListener('click', this.closeFilterIfOutside, true)
        }
      })
    },
    /* 外层 popover 关闭时 */
    onOuterHide() {
      this.isPopoverVisible = false   // 遮罩会同时出现)
      const popper = document.querySelector('.pv-body')
      if (popper) {
        popper.removeEventListener('click', this.closeFilterIfOutside, true)
      }
    },
    /* 真正关闭逻辑 */
    closeFilterIfOutside(e) {
      // 如果点的是 Filter 按钮本身，忽略
      if (e.target.closest && e.target.closest('.el-icon-plus')) return
      // 如果点的是里层弹窗内部，忽略
      if (e.target.closest && e.target.closest('.el-popover__popper')) return
      // 否则一律关掉
      this.filterPopover = false
      this.notifyFilterPopover = false
    },
    parseTemplateParams(templateParams) {
      try {
        // 如果是字符串则解析JSON，否则直接使用
        const params = typeof templateParams === 'string'
          ? JSON.parse(templateParams)
          : templateParams;

        return {
          before: params.oldDate || '',
          after: params.newDate || ''
        };
      } catch (e) {
        console.error('解析 templateParams 失败:', e);
        return { before: '', after: '' };
      }
    },
    // 添加分页处理方法
    handleSizeChange(newSize) {
      this.queryApproval.pageSize = newSize;
      this.queryApproval.pageNo = 1; // 重置到第一页
      this.approvalData = []; // 清空现有数据
      this.customerRequestList();
    },
    getPermission() {
      getUserProfile().then((response) => {
        this.user = response.data
        console.log('user:', this.user)

        // 初始化权限值
        this.ohaPermission = 0

        // 检查 user 和 roles 是否存在
        if (this.user && this.user.roles) {
          this.user.roles.forEach(element => {
            console.log('element11:', element)
            if (element.name && element.name.includes('OHA')) {
              console.log('ohaPermission:', true)
              this.ohaPermission = 1
            }
          })
        }
      }).catch(error => {
        console.error('获取用户信息失败:', error)
        this.ohaPermission = 0
      })
    },
    handleCurrentChange(newPage) {
      this.queryApproval.pageNo = newPage;
      this.approvalData = []; // 清空现有数据
      this.customerRequestList();
    },
    // 添加通知分页相关方法
    handleNotificationSizeChange(newSize) {
      this.notifyQueryParams.pageSize = newSize;
      this.notifyQueryParams.pageNo = 1;
      this.getNotifyList();
    },

    handleNotificationCurrentChange(newPage) {
      this.notifyQueryParams.pageNo = newPage;
      this.getNotifyList();
    },
    compareData(oldData, newData) {
      return ''
    },
    aReqReadStatus(status) {
      return (this.customerReqFlag && status != 4 && [1, 2, 3].includes(status)) || [0, 1].includes(status)
    },
    onCreated(editor) {
      i18nChangeLanguage('en')
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getSubcribeSetList() {
      subscribeList().then(response => {
        console.log('getSubcribeList-')
        console.log(response)
        this.subcribeList = response.data
      })
    },
    handleSubcribeChange(subscribe) {
      console.log(subscribe)
      subscribeUpdate(subscribe).then(response => {
        this.$modal.msgSuccess('Success')
        this.getSubcribeSetList()
      })
    },
    getSubscribeList() {
      this.loading = true
      getMyNotifyMessagePageBySubscribe(this.subscribeQueryParams).then(response => {
        this.subscribeList = response.data.list
        this.subscribeList.forEach(item => {
          const linkText = item.templateNickname
          if (item.templateType == 1) {
            const url = '/order/POManagement?orderNumber=' + linkText
            item.templateContent = item.templateContent.replace(linkText, '<a target="_blank" href=' + url + '>' + linkText + '</a>')
          } else if (item.templateType == 2) {
            const url = '/shipment/list?uuid=' + linkText
            item.templateContent = item.templateContent.replace(linkText, '<a target="_blank" href=' + url + '>' + linkText + '</a>')
          }
        })
        this.loading = false
      })
    },
    showRemovePoDialog(data) {
      this.$refs.removePoProcessDialog.openDialog(data.id)
    },
    showAddPoDialog(data) {
      this.$refs.addPoProcessDialog.openDialog(data.id)
    },
    showModifyQtyDialog(data) {
      this.$refs.amendPoQtyProcessDialog.openDialog(data.id)
    },
    notifyTagShowModifyQtyDialog(data) {
      this.$refs.amendPoQtyProcessDialog.openDialog(data.approvalInfoId)
    },
    showPoCrdDialog(data) {
      this.$refs.amendPoCrdProcessDialog.openDialog(data.id)
    },
    onRemovePoProcessDialogSubmit() {
      this.customerRequest()
    },
    onAmendPoCrdProcessDialogSubmit() {
      this.customerRequest()
    },
    onAmendPoQtyProcessDialogSubmit() {
      this.customerRequest()
    },
    handleGo() {
      this.submitRemark(1)
      const url = this.$router.resolve({
        path: '/shipment/detail'
      }).href
      window.open(url + '?id=' + this.amendRequestData.shipmentId, '_blank')
    },
    submitRemark(status) {
      var text = this.amendRemark
        .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
        .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
        .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
        .replace(/<[^<br>]+>/g, '') // 将所有 换行符 replace ''
        .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
      if (status == 3 && !text) {
        this.$notify({ message: 'Please fill in the remarks', type: 'warning' })
        return
      }
      this.detailDialogFormVisible = true
      var req = {
        id: this.amendRequestData.id,
        status: status,
        remark: this.amendRemark
      }
      updateStatus(req).then(res => {
        var query = {
          pageSize: 1,
          pageNo: 1,
          id: this.amendRequestData.id
        }
        getApprovalInfoPage(query).then(res => {
          if (res.data.list) {
            for (var i = 0; i < this.approvalData.length; i++) {
              if (this.approvalData[i].id == this.amendRequestData.id) {
                this.$set(this.approvalData[i], 'approvalRecordDOList', res.data.list[0].approvalRecordDOList)
              }
            }
            //更新当前dom
            this.amendRequestDetail(res.data.list[0])
            this.detailDialogFormVisible = false
          }
        })

        this.amendRemark = ''
      })
    },
    getSubscribeUnreadCount() {
      var queryParams = {
        userType: 2
      }
      getUnreadNotifyMessageCountBySubscribe(queryParams).then(response => {
        this.subscribeUnreadCount = response.data
      })
    },
    reList() {
      this.isPopoverVisible = true
      this.getList()
      // this.getNotifyList()
      this.getSubscribeList()
      // 重置通知分页参数
      this.notifyQueryParams.pageNo = 1;
      this.getNotifyList();
      if (this.customerAdminReqFlag || this.customerReqFlag) {
        if (this.approvalData && this.approvalData.length > 0) {
          this.scrollLoading = false
          // this.queryApproval.pageNo = 0
          this.queryApproval.pageNo = 1
          this.approvalData = []
        }
        this.customerRequestList()
      }
      this.showDetail = true
    },
    changeTabs() {
      //右侧详情块隐藏
      this.isPopoverVisible = true
      this.showDetail = true
    },
    getList() {
      this.loading = true
      var queryParams = {
        userType: 2
      }
      getUnreadNotifyMessageListByChatLine(queryParams).then(response => {
        this.list = response.data
        this.loading = false
      })
    },
    filteredHtml(val) {
      if (!val) {
        return ''
      }
      var text = val
        .replace(/<\/?li[^>]*>/gi, '')
        .replace(/<\/?ol[^>]*>/gi, '')
        .replace(/<\/?a[^>]*>/gi, '')
        .replace(/<\/?img[^>]*>/gi, '')
        .replace(/<\/?video[^>]*>/gi, '')
        .replace(/\n/g, '<br>')
        .replace(/(<[^>]*\s)style="[^"]*">/g, '')
      return text
    },
    getNotifyList() {
      this.getPermission()
      this.notifyLoading = true
      getMyNotifyMessagePage(this.notifyQueryParams).then(response => {
        this.notifyList = response.data.list
        this.notificationTotal = response.data.total
        // 处理 tableData，解析 templateParams JSON 字符串
        this.tableData = []
        if (response.data.list && response.data.list.length > 0) {
          response.data.list.forEach(notify => {
            if (notify.templateParams) {
              try {
                // 解析 JSON 字符串
                const params = typeof notify.templateParams === 'string'
                  ? JSON.parse(notify.templateParams)
                  : notify.templateParams

                // 构造表格数据
                this.tableData.push({
                  field: 'Cargo ready date',
                  before: params.oldDate || '',
                  after: params.newDate || ''
                })
              } catch (e) {
                console.error('解析 templateParams 失败:', e)
              }
            }
          })
        }
        this.notifyLoading = false
      })
    },
    customerRequest() {
      //admin
      if (this.customerAdminReqFlag) {
        getApprovalInfoNum().then(response => {
          if (this.approvalInfoNum != 0 && this.approvalInfoNum != response.data) {
            this.queryLikeList()
          }
          this.approvalInfoNum = response.data
        })
      } else if (this.customerReqFlag) {
        //shipper
        getApprovalInfoNumByUser().then(response => {
          if (this.approvalInfoNum != 0 && this.approvalInfoNum != response.data) {
            this.queryLikeList()
          }
          this.approvalInfoNum = response.data
        })
      }
    },
    queryLikeList(text) {
      // this.scrollLoading = false
      // this.queryApproval.pageNo = 0
      this.queryApproval.pageNo = 1; // 改为从第1页开始
      this.approvalData = []
      this.customerRequestList()
    },
    queryNotifyLikeList() {
      this.notifyQueryParams.pageNo = 1;
      this.notifyQueryParams.pageSize = 10;
      this.getNotifyList()
    },
    customerRequestList() {
      this.detailDialogFormVisible = true
      // if (this.scrollLoading) {
      // this.detailDialogFormVisible = false
      // return
      // }
      // this.scrollLoading = true
      // this.queryApproval.pageNo++
      //moov
      if (this.customerAdminReqFlag) {
        getApprovalInfoPage(this.queryApproval).then(res => {
          this.approvalTotal = res.data.total
          // this.approvalData = this.approvalData.concat(res.data.list)
          this.approvalData = res.data.list;
          // 添加对 getHeader 接口的调用
          // if (res.data.list && res.data.list.length > 0) {
          //   res.data.list.forEach(item => {
          //     if (item.orderRef) {
          //       getByOrderNumber(item.orderRef).then(headerRes => {
          //          // 将 orderNumber 作为 key，shippingPol 作为 value 存入 Map
          //         this.orderPolMap.set(item.orderRef, headerRes.data.shippingPol);
          //         // 例如将数据存储到 item 对象中
          //         // this.$set(item, 'headerInfo', headerRes.data)
          //       }).catch(error => {
          //         console.error('获取订单头信息失败:', error)
          //       })
          //     }
          //   })
          // }
          // 提取所有需要查询的orderRef并去重
          const uniqueOrderRefs = [...new Set(
            res.data.list
              .filter(item => item.orderRef)
              .map(item => item.orderRef)
          )]

          // 过除已经存在的orderRef，避免重复请求
          const newOrderRefs = uniqueOrderRefs.filter(ref => !this.orderPolMap.has(ref))

          // 批量获取新的order信息
          this.fetchOrderHeadersBatch(newOrderRefs)
          this.detailDialogFormVisible = false
          //分页超出控制
          // if (this.approvalData.length >= this.approvalTotal) {
          //   this.scrollLoading = true
          // } else {
          //   this.scrollLoading = false
          // }
        })
      } else if (this.customerReqFlag) {
        //shipper
        getCurrentUserApprovalInfoPage(this.queryApproval).then(res => {
          this.approvalTotal = res.data.total
          this.approvalData = res.data.list;
          // this.approvalData = this.approvalData.concat(res.data.list)
          //分页超出控制
          // if (this.approvalData.length >= this.approvalTotal) {
          //   this.scrollLoading = true
          // } else {
          //   this.scrollLoading = false
          // }
          this.detailDialogFormVisible = false
        })
      }
    },
    amendRequestDetail(row) {
      console.log(row)
      this.detailDialogFormVisible = true
      this.showDetail = true
      this.detailRemarkList = []
      this.amendRequestData = row
      setTimeout(() => {
        this.showDetail = false
        if (row.approvalRecordDOList) {
          this.amendShippingText = row.approvalRecordDOList[row.approvalRecordDOList.length - 1].remark
          this.detailRemarkList = JSON.parse(JSON.stringify(row.approvalRecordDOList)).reverse()
        }
        this.detailDialogFormVisible = false
      }, 200)
      //shipper 确认已读 在moov完成操作之后才是确认
      if (!this.customerAdminReqFlag && this.customerReqFlag && row.status != 4 && row.status > 1) {
        //readStatus(row.soId).then(res => { })
        var req = {
          id: this.amendRequestData.id,
          status: 4
        }
        readLog(req).then(res => {
          row.status = 4
          //this.customerRequest()
        })
      }
    },
    activityType(value) {
      switch (value) {
        case 'IN_TASK_NORMAL':
          return 'In progress'
        case 'EXECUTE_TASK_NORMAL':
          return 'Done'
        case 'ADD_REMARK':
          return 'Add remark'
        case 'START_PROCESS_INSTANCE':
          return 'Begin'
        case 'REDIRECT_TASK':
          return 'Transfer task'
        default:
          return ''
      }
    },
    activityColor(value, type) {
      if (type == 'START_PROCESS_INSTANCE') {
        return '#0bbd87'
      }
      switch (value) {
        case 'NONE':
          return '#E6A23C'
        case 'REFUSE':
          return '#F56C6C'
        case 'AGREE':
          return '#0bbd87'
        default:
          return '#E6A23C'
      }
    },
    activityIcon(value, type) {
      if (type == 'START_PROCESS_INSTANCE') {
        return 'el-icon-check'
      }
      switch (value) {
        case 'NONE':
          return 'el-icon-more'
        case 'REFUSE':
          return 'el-icon-close'
        case 'AGREE':
          return 'el-icon-check'
        default:
          return ''
      }
    },
    approvalActivityType(value) {
      console.log("status value", value)
      switch (value) {
        case 1:
          return 'In progress'
        case 2:
          return 'Done'
        case 3:
          return 'Rejected'
        case 4:
          return 'PO Cancelled'
        case 5:
          return 'Verify Document Rejected'
        case 0:
          return 'Begin'
        case 'REDIRECT_TASK':
          return 'Transfer task'
        default:
          return ''
      }
    },
    approvalActivityIcon(value) {
      switch (value) {
        case 1:
          return 'el-icon-more'
        case 3:
          return 'el-icon-close'
        case 2:
          return 'el-icon-check'
        case 4:
          return 'el-icon-close'
        case 5:
          return 'el-icon-close'

        default:
          return ''
      }
    },
    approvalActivityColor(value) {
      switch (value) {
        case 0:
          return '#E6A23C'
        case 3:
          return '#F56C6C'
        case 2:
          return '#0bbd87'
        case 4:
          return '#F56C6C'
        case 5:
          return '#F56C6C'
        default:
          return '#E6A23C'
      }
    },
    convertRemarkToHtml(val) {
      if (val) {
        return val.replace(/\n/g, '<br>')
      }
    },
    notifyDetail(row) {
      console.log('row', row)
      this.detailDialogFormVisible = true
      this.showDetail = false
      this.notifyData = row
      this.detailDialogFormVisible = false
      this.templateCode = row.templateCode
      this.notifyUpdateCRD = row
      this.amendRequestData = {}
      this.notificationShipperBookingData = {}
      this.approvalInfoResponse = {}
      this.detailRemarkList = []

      if (row.templateCode === 'notification_cancelled_po') {
        this.amendRequestData = row

        this.detailRemarkList = [
          {
            status: 4,
            creatorName: row.initiator || 'System',
            createTime: row.createTime,
            remark: row.templateContent
          }
        ]
        return
      }
      if (row.templateCode === 'verify_documents_reject') {
        this.amendRequestData = row

        this.detailRemarkList = [
          {
            status: 5,
            creatorName: row.initiator || 'System',
            createTime: row.createTime,
            remark: row.templateContent
          }
        ]
        return
      }
      console.log('row.templateCode', this.notifyUpdateCRD)
      //oha,pepco shipper booking validation
      if (this.shipperBookingReviewTypes.includes(row.templateCode)) {
          this.notificationShipperBookingData.templateCode = row.templateCode
          this.$set(this.notificationShipperBookingData, 'templateCode', row.templateCode);
          this.$set(this.notificationShipperBookingData, 'soId', row.soId);
          this.$set(this.notificationShipperBookingData, 'soRef', row.soRef);
          console.log('notification_shipper_booking_request', JSON.stringify(row), JSON.stringify(this.notificationShipperBookingData))
          orderCommentAll({ orderId: row.soId, orderType: 2 }).then(response => {
          console.log('orderCommentAll-response', response)
          //shipper booking oha accept or reject
          if (row.templateCode == 'notification_shipper_booking_reject_request' || row.templateCode == 'notification_shipper_booking_accept_request') {
            this.detailRemarkList = response.data.filter(item => item.commentType == 'Accept' || item.commentType == 'Reject').map(item => ({
              status: item.commentType == 'Accept' ? 2 : 3,
              creatorName: item.commentUser || 'System',
              createTime: item.createTime,
              remark: item.content
            }));
          } else {// shipper booking pepco accept or reject
            this.detailRemarkList = response.data.filter(item => item.commentType == 'SAApproved' || item.commentType == 'Awaiting Approval' || item.commentType == 'Pepco Reject').map(item => ({
              status: item.commentType == 'SAApproved' || item.commentType == 'Awaiting Approval' ? 2 : 3,
              creatorName: item.commentUser || 'System',
              createTime: item.createTime,
              remark: item.content
            }));
          }
          console.log('this.detailRemarkList', JSON.stringify(this.detailRemarkList))
        })
        
      } else if (this.notifyTimelineTypes.includes(row.templateCode)) {
        shippingApprovalDetail(row.approvalInfoId).then(response => {
          console.log('response1', response)
          this.approvalInfoResponse = response.data
          console.log('this.approvalInfoResponse', this.approvalInfoResponse)
          if (response.data.records) {
            // this.amendShippingText = row.approvalRecordDOList[response.approvalRecordDOList.length - 1].remark
            // this.detailRemarkList = JSON.parse(JSON.stringify(response.data.records)).reverse()
            this.detailRemarkList = JSON.parse(JSON.stringify(response.data.records))
            this.amendRequestData = row
            console.log('response2', this.amendRequestData)

          }
        })
      }
      //未读消息，改成已读
      // if (!row.readStatus) {
      //   this.handleNotifyUpdate(row.id)
      //   row.readStatus = true
      // }
    },
    ticketDetail(row) {
      this.detailDialogFormVisible = true
      this.detailRemarkList = []
      this.showDetail = true
      if (row.templateParams && !row.templateParams.stId) {
        this.detailDialogFormVisible = false
        return
      }
      this.ticketTitle = row.templateParams.summary
      //this.getTicketFiles(row.templateParams.stId)
      getSupportTicket(row.templateParams.stId).then(response => {
        this.detailRemarkList = response.data
        this.detailDialogFormVisible = false
        if (this.detailRemarkList.length > 0) {
          this.detailRemarkList[this.detailRemarkList.length - 1].remark = row.templateParams.detail
          this.showDetail = false
        }
      })
    },
    getUnreadNotifyCount() {
      var queryParams = {
        userType: 2
      }
      getUnreadNotifyMessageCount(queryParams).then(response => {
        if (this.unreadNotifyCount !== response.data) {
          this.unreadNotifyCount = response.data
        }
      })
    },
    getUnreadCount() {
      var queryParams = {
        userType: 2
      }
      getUnreadNotifyMessageCountByChatLine(queryParams).then(response => {
        this.unreadCount = response.data
      })
    },
    goMyList: function () {
      this.$router.push({
        name: 'MyNotifyMessage'
      })
    },
    handleUpdateAll(id) {
      updateAllChatLineNotifyMessageRead(id).then(response => {
        this.getList()
        this.getUnreadCount()
      })
    },
    handleReadAndClear(row) {
      this.handleNotifyUpdate(row.id)
      row.readStatus = true
      this.notifyQueryParams.pageNo = 1
      this.getNotifyList()
      this.showDetail = true
    },
    handleReadAndClear2(id) {
      console.log('handleReadAndClear2', id)
      this.handleNotifyUpdate(id)
      this.notifyQueryParams.pageNo = 1
      this.getNotifyList()
      this.showDetail = true
    },
    handleNotifyUpdate(ids) {
      updateNotifyMessageRead([ids]).then(response => {
        this.getUnreadNotifyCount()
        this.getSubscribeUnreadCount()
      })
    },
    markAllAsRead() {
      // 添加确认框
      this.$confirm('Are you sure mark all read this page?', 'Confirm', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        // 获取当前tab中所有的通知ID
        const allIds = this.notifySubscribeList.map(item => item.id);

        if (allIds.length > 0) {
          updateNotifyMessageRead(allIds).then(response => {
            // 重新加载列表以反映已读状态
            this.notifyQueryParams.pageNo = 1
            this.getNotifyList()

            this.$message.success('All notifications marked as read');
          }).catch(error => {
            this.$message.error('Failed to mark all as read');
            console.error('Mark all as read error:', error);
          });
        }
      }).catch(() => {
        // 用户点击取消按钮
        this.$message.info('Operation cancelled');
      });
    },
    closeInPopover() {
      if (this.$refs['inPopover'] && this.$refs['inPopover'].showPopper) {
        // 关闭 doClose()
        this.$refs.inPopover.doClose()
      }
    },
    handlePopoverHide() {
      this.isPopoverVisible = false
    },
    resetNotifyQueryParams() {
      this.notifyQueryParams.orderNumber = null,
        this.notifyQueryParams.timeRange = null,
        this.notifyQueryParams.readStatus = false,
        this.notifyQueryParams.timeRange = [],
        this.notifyQueryParams.soType = null,
        this.notifyQueryParams.pol = null,
        this.notifyFilterPopover =false;
      this.queryNotifyLikeList()
    },
    resetQueryApproval() {
      this.queryApproval.po = null
      this.queryApproval.pol = null
      this.queryApproval.soType = null
      this.queryApproval.moovRef = null
      this.queryApproval.shipmentRef = null
      this.queryApproval.isDone = false
      this.queryApproval.dcCode = null
      this.queryApproval.approvalType = null
      this.queryApproval.timeRange = []

      this.queryLikeList()
      this.filterPopover = false
    },
    async fetchOrderHeadersBatch(orderRefs) {
      if (!orderRefs.length) return

      const orderNumbers = []
      orderRefs.forEach((orderRef) => {
        if (orderRef.includes(',')) {
          const orderNumberList = orderRef.split(',')
          orderNumbers.push(...orderNumberList)
        } else {
          orderNumbers.push(orderRef)
        }
      })
      getByOrderNumbers({ orderNumbers: [...new Set(orderNumbers)] }).then(res => {
        if (res) {
          const orderPolMap = new Map()
          const orderDcCodeMap = new Map()
          res.data.forEach(result => {
            orderPolMap.set(result.orderNumber, result.shippingPol)
            orderDcCodeMap.set(result.orderNumber, result.dc)
          })
          this.orderPolMap = orderPolMap
          this.orderDcCodeMap = orderDcCodeMap
        }
      })

      try {
        // 并发请求所有订单头信息
        const promises = orderRefs.map(orderRef =>
          getByOrderNumber(orderRef).catch(error => {
            console.error(`获取订单${orderRef}头信息失败:`, error)
            return { data: { orderNumber: orderRef, shippingPol: '' } }
          })
        )

        const results = await Promise.all(promises)

        // 更新Map
        results.forEach((result, index) => {
          const orderRef = orderRefs[index]
          this.orderPolMap.set(orderRef, result.data.shippingPol)
          this.orderDcCodeMap.set(orderRef, result.data.dc)
        })

        // 触发视图更新
        this.$forceUpdate()
      } catch (error) {
        console.error('批量获取订单头信息失败:', error)
      }
    },
    covStatus(status) {
      if (status == -1) {
        return 'Draft'
      } else if (status == 0) {
        return 'Requested'
      } else if (status == 1) {
        return 'MOOV-OHA accepted booking'
      } else if (status == 2) {
        return 'MOOV-OHA Rejected'
      } else if (status == 3) {
        return 'Cancel'
      } else if (status == 4) {
        return 'SAApproved'
      } else if (status == 5) {
        return 'Awaiting Pepco booking approval'
      } else if (status == 6) {
        return 'Pepco Pending'
      } else if (status == 7) {
        return 'Pepco Rejected'
      }
    },
  }
}
</script>
<style>
.read-div {
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  width: 90%;
  /* 段落宽度，可以调整为适合的值 */
  margin-top: 5px;
}

.mark-as-read-css {
  display: none;
}

.pv-card-bg:hover .mark-as-read-css {
  display: block;
}

.mark-as-read-css:hover {
  color: blue;
}

.pv-tabs .el-tabs__header.is-top {
  padding-left: 15px;
  padding-right: 15px;
  margin: 5px;
}

.pv-card-bg {
  box-shadow: none;
  background-color: #e6ebf5f2;
  margin-bottom: 10px;
  margin-right: 5px;
  padding: 10px;
  cursor: pointer;
}

.pv-card-bg-cancel {
  box-shadow: none;
  background-color: #ff00002b;
  margin-bottom: 10px;
  margin-right: 5px;
  padding: 10px;
  cursor: pointer;
}

.pv-card-bg-read {
  box-shadow: none;
  background-color: #ffffff;
  margin-bottom: 10px;
  margin-right: 5px;
  padding: 10px;
  cursor: pointer;
}

.pv-card-bg:hover {
  background-color: #dfe4ed;
}

.pv-body {
  width: 90%;
  top: 120px !important;
}

.pv-pane {
  height: 600px;
  overflow-y: auto;
  padding: 10px;
}

.pv-pane-right {
  height: 655px;
  overflow: auto;
  padding: 20px;
}

.not-read-css {}

.read-css {}

.popover-content {
  /* 确保内容区域有定位上下文 */
  position: relative;
}

.mark-as-read-css {
  font-size: 16px;
  z-index: 10;
  /* 其他样式，如字体大小、颜色等 */
  cursor: pointer;
  /* 鼠标悬停时显示点击效果 */
  color: #909399;
}

.el-badge__content.is-fixed {
  position: absolute;
  top: 8px;
  right: 23px;
  -webkit-transform: translateY(-50%) translateX(100%);
  transform: translateY(-50%) translateX(100%);
  border-color: transparent;
}

.el-badge__content {
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 11px;
  height: 14px;
  line-height: 14px;
  padding: 0 4px;
  text-align: center;
  white-space: nowrap;
}

.text-time-css {
  color: #868e95;
  font-size: 13px;
  margin-top: 15px;
}

.text-ellipsis-css p {
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* 限制显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  width: 100%;
  /* 段落宽度，可以调整为适合的值 */
  word-break: break-word;
  overflow-wrap: break-word;
}

.text-ellipsis-css a {
  color: #004f7c;
}

.tip-css {
  margin-top: -7px;
  margin-bottom: 10px;
  color: #909399;
  font-size: 13px;
}

.el-timeline-item__content {
  padding-right: 10px;
}

.timeline-type {
  float: right;
  margin-top: -10px;
  color: #909399;
  font-size: 13px;
}

.pv-head-title {
  padding-left: 10px;
  font-size: 14px;
  word-break: keep-all;
  overflow-wrap: break-word;
  max-height: 30px;
  color: #2e86c1;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}

.pv-head-title-read {
  padding-left: 10px;
  color: #868e95;
  font-size: 14px;
  word-break: keep-all;
  overflow-wrap: break-word;
  max-height: 30px;
}

.pv-detail-head-title {
  padding-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}

.divider-css.el-divider.el-divider--horizontal {
  width: 100% !important;
}

.notify-badge sup.el-badge__content.is-fixed.is-dot {
  top: 4px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  /* 半透明黑色 */
  z-index: 999;
  /* 确保遮罩层在最上层 */
}

/* PO信息标签样式 */
.po-info-tags {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 10px;
  margin-top: 15px;
}

.po-tag {
  font-size: 12px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
  border-radius: 4px;
}

.po-tag i {
  margin-right: 4px;
  font-size: 11px;
}

/* POL标签使用info样式 */
.po-tag.el-tag--info {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}

/* DC标签使用warning样式 */
.po-tag.el-tag--warning {
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
}
</style>
