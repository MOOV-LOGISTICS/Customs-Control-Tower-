<!-- components/Toast.vue -->
<template>
  <transition name="toast-fade">
    <div
      v-if="visible"
      :class="['comp-toast-container', `toast-${type}`]"
      style="top: 20px; left: 50%; transform: translateX(-50%)"
    >
      <div class="toast-content">
        <div class="toast-icon" v-if="showIcon">
          <slot name="icon">
            <i
              v-if="type === 'success'"
              class="el-icon-success icon-success"
            ></i>
            <i v-if="type === 'info'" class="el-icon-info icon-info"></i>
            <i v-if="type === 'error'" class="el-icon-error icon-error"></i>
            <i
              v-if="type === 'warning'"
              class="el-icon-warning icon-warning"
            ></i>
            <i
              v-if="type === 'loading'"
              class="el-icon-loading icon-loading"
            ></i>
          </slot>
        </div>
        <div :class="['toast-text',`toast-text-${type}` ]">
          <slot>{{ message }}</slot>
        </div>
        <!-- <div class="toast-close" v-if="closable" @click="handleClose">
          <i class="el-icon-close"></i>
        </div> -->
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "MoovToast",
  props: {
    message: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "info",
      validator: (value) =>
        ["success", "error", "warning", "info", "loading"].includes(value),
    },
    duration: {
      type: Number,
      default: 3000,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
      timer: null,
    };
  },
  mounted() {
    this.visible = true;
    if (this.duration > 0 && this.type !== "loading") {
      this.startTimer();
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    startTimer() {
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration);
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    handleClose() {
      this.close();
    },
    close() {
      this.visible = false;
      this.clearTimer();
      setTimeout(() => {
        this.onClose();
      }, 300);
    },
  },
};
</script>

<style scoped>
.comp-toast-container {
  position: fixed;
  z-index: 9999;
  min-width: 30rem;
  height: 4.4rem;
  background: white;
  border-radius: 0.8rem;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.15);
  padding: 1.6rem;
  animation: toast-slide-in 0.3s ease;
  border-radius: 4rem;
}

.toast-content {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 0.725rem;
}

.toast-icon {
  /* flex-shrink: 0;
  width: 24px;
  height: 24px; */
}

.icon-success {
  color: var(--moov-success);
}

.icon-error {
  color: var(--moov-error);
}

.icon-warning {
  color: var(--moov-warning);
}

.icon-info {
  color: var(--moov-info);
}
.icon-loading {
  color: var(--moov-white);
}

.toast-text {
  flex: 1;
  color: #333;
  font-size: 1.4rem;
  line-height: 1.5;
}
.toast-text-loading {
  color: var(--moov-white);
}

/* .toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
} */

.toast-close:hover {
  opacity: 1;
}

@keyframes toast-slide-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-2rem);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-fade-enter,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-2rem);
}

.toast-success {
  border: 1px solid var(--moov-success);
  background: var(--moov-success-light);
}

.toast-error {
  border: 1px solid var(--moov-error);
  background: var(--moov-error-light);
}

.toast-warning {
  border: 1px solid var(--moov-warning);
  background: var(--moov-warning-light);
}

.toast-info {
  border: 1px solid var(--moov-info);
  background: var(--moov-info-light);
}

.toast-loading {
  border: 1px solid var(--moov-loading);
  background: var(--moov-loading);
}
</style>
