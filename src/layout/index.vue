<template>
  <div class="layout-wrapper">

    <!-- Top Navigation Bar -->
    <header class="topnav">
      <!-- Left: Logo -->
      <div class="topnav-logo">
        <img src="/MoovLogoSmall.png" alt="MOOV" class="logo-img" />
      </div>

      <!-- Centre: Nav items -->
      <el-menu
        :default-active="$route.path"
        mode="horizontal"
        background-color="#004F7C"
        text-color="rgba(255,255,255,0.75)"
        active-text-color="#ffffff"
        router
        class="topnav-menu"
      >
        <!-- Dashboard tab hidden — route still reachable via direct URL -->
        <el-menu-item index="/customs/document-upload">
          <i class="el-icon-upload2"></i> Document Upload
        </el-menu-item>
        <el-menu-item index="/customs/pepco-review">
          <i class="el-icon-finished"></i> Pepco Review
        </el-menu-item>
        <el-menu-item index="/customs/document-center">
          <i class="el-icon-folder-opened"></i> Document Center
        </el-menu-item>
      </el-menu>

      <!-- Right: Role switcher + user -->
      <div class="topnav-right">
        <el-tag size="mini" type="warning" style="margin-right:12px">
          <i class="el-icon-warning-outline"></i> Demo Mode
        </el-tag>
        <el-dropdown style="margin-right:16px">
          <span class="role-switch">
            Role: <strong>{{ currentRole }}</strong>
            <i class="el-icon-arrow-down" style="margin-left:4px"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="r in roles" :key="r" @click.native="switchRole(r)">{{ r }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-avatar :size="28" style="background:#3A71A8;cursor:default">D</el-avatar>
      </div>
    </header>

    <!-- Page content -->
    <main class="page-content">
      <router-view />
    </main>

  </div>
</template>

<script>
import { roleStore, ROLES, setRole } from '@/store/role'

export default {
  name: 'Layout',
  data() { return { roles: ROLES } },
  computed: {
    currentRole() { return roleStore.currentRole },
  },
  methods: {
    switchRole(r) {
      setRole(r)
      this.$message.info(`Switched to role: ${r}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

// ── Top nav bar ───────────────────────────────────────────────────────────────
.topnav {
  height: $topbar-height;
  background: $bg-sidebar;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 16px 0 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.topnav-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 100%;
  border-right: 1px solid rgba(255,255,255,0.1);
  flex-shrink: 0;
  .logo-img {
    height: 32px;
    width: auto;
    object-fit: contain;
  }
}

.topnav-menu {
  flex: 1;
  border-bottom: none !important;
  height: $topbar-height;

  ::v-deep .el-menu-item {
    height: $topbar-height;
    line-height: $topbar-height;
    font-size: 13px;
    font-weight: 500;
    padding: 0 18px;
    border-bottom: 3px solid transparent !important;
    transition: all 0.2s;

    i { margin-right: 6px; font-size: 14px; }

    &:hover {
      background: rgba(255,255,255,0.1) !important;
      color: #fff !important;
    }
    &.is-active {
      background: rgba(255,255,255,0.12) !important;
      color: #fff !important;
      font-weight: 700;
      border-bottom: 3px solid #fff !important;
    }
  }
}

.topnav-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}

.role-switch {
  cursor: pointer;
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  padding: 4px 10px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  white-space: nowrap;
  strong { color: #fff; }
  &:hover { border-color: rgba(255,255,255,0.7); }
}

// ── Page content ──────────────────────────────────────────────────────────────
.page-content {
  flex: 1;
  overflow-y: auto;
  background: $bg-page;
}
</style>
