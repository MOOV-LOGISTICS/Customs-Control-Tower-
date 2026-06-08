<template>
  <div class="app-container redoc-container">
    <div v-loading="loading" class="redoc-wrapper">
      <redoc 
        v-if="!loading && demoSpec" 
        :spec="demoSpec" 
        :options="redocOptions"
        @error="handleRedocError"
      />    
    </div>
  </div>
</template>

<script>
import Redoc from '@/components/Redoc'

import { getOpenApi } from '@/api/system/redocApi'  

export default {
  name: 'InfraRedoc',
  components: {
    Redoc
  },
  data() {
    return {
      loading: true,
      error: null,
      demoSpec: null,
      redocOptions: {
        scrollYOffset: 100, // 设置为顶部菜单的高度，避免点击菜单时顶部菜单被滚动上去
        hideDownloadButton: false,
        hideHostname: false,
        expandResponses: '200,201',
        jsonSampleExpandLevel: 2,
        theme: {
          colors: {
            primary: {
              main: '#004F7C'
            }
          },
          typography: {
            fontSize: '14px',
            code: {
              fontSize: '13px'
            },
            headings: {
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '400'
            }
          },
          sidebar: {
            backgroundColor: '#fafafa'
          },
          rightPanel: {
            backgroundColor: '#263238'
          }
        }
      }
    }
  },
  created() {
         getOpenApi().then(response => {
          this.loading = false
          this.demoSpec = response.data 
      })
  },
  methods: {

    handleRedocError(error) {
      console.error('Redoc component error:', error)
      this.error = error.message || 'Redoc 初始化失败'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

