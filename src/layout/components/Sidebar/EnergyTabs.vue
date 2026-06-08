<template>
  <div class="ChargeTabs">
    <div class="button_connent">
      <div v-if="isShowNext" class="button_item" @click="reduceOneFn">
        <img src="@/assets/images/tab1.png">
      </div>
    </div>
    <div id="list-box" class="tabList">
      <div id="list" class="list1" ref="menuList">
        <sidebar-item v-for="(route, index) in editPrivateDevicesList" :key="index" :item="route"
          :base-path="route.path" :class="
            currIndex === index
              ? 'tabList_item tabList_item_isSelect'
              : 'tabList_item'
          " @click="changeIndex(index)">

        </sidebar-item>
      </div>
    </div>
    <div class="button_connent">
      <div v-if="isShowNext" class="button_item" @click="addOneFn">
        <img src="@/assets/images/tab2.png">
      </div>
    </div>
  </div>
</template>

<script>
  import Item from "@/layout/components/Sidebar/Item.vue";
  import SidebarItem from "@/layout/components/Sidebar/SidebarItem.vue";
  import { isExternal } from "@/utils/validate";
  import path from "path";

  export default {
    name: 'EnergyTabs',
    components: { SidebarItem, Item },
    props: {
      privateDevicesList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        editPrivateDevicesList: [],
        currIndex: 0,
        isShowNext: false,
        leftMove: 0,
        scrollDistance: 200, // 每次滚动距离
      }
    },
    watch: {
      privateDevicesList(value) {
        this.editPrivateDevicesList = value;
        // 列表更新后重置滚动位置，并重新计算是否需要显示按钮
        this.$nextTick(() => {
          const listEl = this.$refs.menuList;
          if (listEl) {
            listEl.style.left = '0px';
          }
          this.leftMove = 0;
          this.updateScrollButtonVisibility();
        });
      }
    },

    mounted() {
      // 监听窗口resize事件
      window.addEventListener('resize', this.handleResize);
      let newArr = this.privateDevicesList.filter(item => item.hidden === false);
      this.editPrivateDevicesList = newArr;

      // 在DOM更新后计算宽度并判断是否需要显示滚动按钮
      this.$nextTick(() => {
        this.updateScrollButtonVisibility();
      });
    },

    beforeDestroy() {
      // 组件销毁移除resize事件监听
      window.removeEventListener('resize', this.handleResize);
    },


    methods: {
      updateScrollButtonVisibility() {
        const containerEl = document.getElementById('list-box');
        const listEl = this.$refs.menuList;

        if (!containerEl || !listEl) {
          this.isShowNext = false;
          return;
        }

        const containerWidth = containerEl.clientWidth;
        const listWidth = listEl.scrollWidth;
        this.isShowNext = listWidth > containerWidth;

        const maxLeft = listWidth - containerWidth;
        if (maxLeft > 0 && this.leftMove > maxLeft) {
          this.leftMove = maxLeft;
          listEl.style.left = '-' + this.leftMove + 'px';
        } else if (maxLeft <= 0) {
          this.leftMove = 0;
          listEl.style.left = '0px';
        }
      },

      handleResize() {
        this.$nextTick(() => {
          this.updateScrollButtonVisibility();
        });
      },

      addOneFn() {
        const containerEl = document.getElementById('list-box');
        const listEl = this.$refs.menuList;
        if (!containerEl || !listEl) return;

        const containerWidth = containerEl.clientWidth;
        const listWidth = listEl.scrollWidth;

        const maxLeft = listWidth - containerWidth;

        if (maxLeft <= 0) {
          this.leftMove = 0;
          listEl.style.left = '0px';
          return;
        }

        let nextLeftMove = this.leftMove + this.scrollDistance;

        if (nextLeftMove > maxLeft) {
          nextLeftMove = maxLeft;
        }

        this.leftMove = nextLeftMove;
        listEl.style.left = '-' + this.leftMove + 'px';
      },

      reduceOneFn() {
        const containerEl = document.getElementById('list-box');
        const listEl = this.$refs.menuList;

        if (!containerEl || !listEl) return;

        const containerWidth = containerEl.clientWidth;
        const listWidth = listEl.scrollWidth;

        const maxLeft = listWidth - containerWidth;

        if (maxLeft <= 0) {
          this.leftMove = 0;
          listEl.style.left = '0px';
          return;
        }


        let nextLeftMove = this.leftMove - this.scrollDistance;

        if (nextLeftMove < 0) {
          nextLeftMove = 0;
        }

        this.leftMove = nextLeftMove;
        listEl.style.left = '-' + this.leftMove + 'px';
      },

      changeIndex(index) {
        this.currIndex = index
      },
      hasOneShowingChild(children = [], parent) {
        if (!children) {
          children = [];
        }
        const showingChildren = children.filter(item => {
          if (item.hidden) {
            return false
          } else {
            // Temp set(will be used if only has one showing child)
            this.onlyOneChild = item
            return true
          }
        })

        // When there is only one child router, the child router is displayed by default
        if (showingChildren.length === 1) {
          return true
        }

        // Show parent if there are no child router to display
        if (showingChildren.length === 0) {
          this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
          return true
        }

        return false
      },
      resolvePath(routePath) {
        if (isExternal(routePath)) {
          return routePath
        }
        if (isExternal(this.basePath)) {
          return this.basePath
        }
        return path.resolve(this.basePath, routePath)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ChargeTabs {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;


    .tabList {
      display: flex;
      align-items: center;
      font-size: 12px;
      width: calc(100% - 160px);
      overflow: hidden;
      position: relative;

      .list1 {
        display: flex;
        position: relative;
        left: 0;
        transition: left 0.5s ease;
        white-space: nowrap;

        .tabList_item {
          flex-shrink: 0;
          cursor: pointer;
          display: flex;
          justify-content: center;
          background-color: #004F7CFF;
          color: #E6F7F8;
          border-radius: 4px;
          padding: 16px 8px;
          margin-right: 10px;

          &:hover {
            background-color: #004F7CFF;
          }
        }

        .tabList_item_isSelect {
          background-color: #004F7CFF;
          border: 1px solid #004F7CFF;
        }
      }
    }

    .button_connent {
      width: 80px;
      flex-shrink: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .button_item {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin: 0 5px;

        img {
          width: 24px;
          height: 32px;
          display: block;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
</style>