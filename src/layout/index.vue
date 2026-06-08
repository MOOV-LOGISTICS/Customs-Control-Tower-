<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <img src="/MoovLogoSmall.png" alt="MOOV" class="logo-img" />
      </div>
      <el-menu
        :default-active="$route.path"
        background-color="#004F7C"
        text-color="rgba(255,255,255,0.85)"
        active-text-color="#ffffff"
        router
        class="sidebar-menu"
      >
        <div class="menu-section-label">CUSTOMS</div>
        <el-menu-item index="/customs/dashboard">
          <i class="el-icon-s-home"></i>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/customs/document-upload">
          <i class="el-icon-upload2"></i>
          <span>Document Upload</span>
        </el-menu-item>
        <el-menu-item index="/customs/pepco-review">
          <i class="el-icon-finished"></i>
          <span>Pepco Review</span>
        </el-menu-item>
        <el-menu-item index="/customs/broker-download">
          <i class="el-icon-download"></i>
          <span>Broker Downloads</span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-user">
        <el-avatar :size="28" style="background:#3A71A8">D</el-avatar>
        <div class="user-info">
          <div class="user-name">Demo User</div>
          <div class="user-role">MOOV Ops</div>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div class="main-area">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <span class="page-title">{{ $route.meta.title }}</span>
        </div>
        <div class="topbar-right">
          <el-tag size="mini" type="warning" style="margin-right:12px">
            <i class="el-icon-warning-outline"></i> Demo Mode
          </el-tag>
          <el-dropdown>
            <span class="role-switch">
              Role: <strong>{{ currentRole }}</strong>
              <i class="el-icon-arrow-down" style="margin-left:4px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="currentRole='MOOV Ops'">MOOV Ops</el-dropdown-item>
              <el-dropdown-item @click.native="currentRole='Supplier'">Supplier</el-dropdown-item>
              <el-dropdown-item @click.native="currentRole='Pepco PGS'">Pepco PGS</el-dropdown-item>
              <el-dropdown-item @click.native="currentRole='Pepco Finance'">Pepco Finance</el-dropdown-item>
              <el-dropdown-item @click.native="currentRole='Pepco Customs'">Pepco Customs</el-dropdown-item>
              <el-dropdown-item @click.native="currentRole='Customs Broker'">Customs Broker</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </header>

      <!-- Page content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() { return { currentRole: 'MOOV Ops' } }
}
</script>

<style lang="scss" scoped>
.layout-wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
.sidebar {
  width: $sidebar-width;
  min-width: $sidebar-width;
  background: $bg-sidebar;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: $topbar-height;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  .logo-img {
    width: 100%;
    max-width: 150px;
    height: auto;
    object-fit: contain;
  }
}

.menu-section-label {
  padding: 16px 16px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: rgba(255,255,255,0.4);
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  border: none !important;

  ::v-deep .el-menu-item {
    height: 38px;
    line-height: 38px;
    border-radius: 8px;
    margin: 2px 8px;
    font-size: 13px;
    i { margin-right: 8px; font-size: 15px; }

    &.is-active {
      background: rgba(255,255,255,0.15) !important;
      color: #fff !important;
      font-weight: 600;
    }
    &:hover { background: rgba(255,255,255,0.1) !important; }
  }
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  .user-info { .user-name { color: #fff; font-size: 12px; font-weight: 600; } .user-role { color: rgba(255,255,255,0.5); font-size: 11px; } }
}

// ── Main area ─────────────────────────────────────────────────────────────────
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  height: $topbar-height;
  background: #fff;
  border-bottom: 1px solid $border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;

  .page-title { font-size: 15px; font-weight: 600; color: $text-primary; }
  .topbar-right { display: flex; align-items: center; }
  .role-switch {
    cursor: pointer; font-size: 12px; color: $text-secondary;
    padding: 4px 10px; border: 1px solid $border; border-radius: 6px;
    &:hover { border-color: $primary; color: $primary; }
  }
}

.page-content {
  flex: 1;
  overflow-y: auto;
  background: $bg-page;
}
</style>
