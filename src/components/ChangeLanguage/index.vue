<template>
    <el-dropdown class="lang-container hover-pointer" trigger="click">
      <span>{{ language }} <i class="el-icon-caret-bottom el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="changeLangauge('zh')">
          <span style="display:block;">简体中文</span>
        </el-dropdown-item>
        <el-dropdown-item @click.native="changeLangauge('en')">
          <span style="display:block;">English</span>
        </el-dropdown-item>
<!--        <el-dropdown-item @click.native="changeLangauge('ja')">-->
<!--          <span style="display:block;">日本語</span>-->
<!--        </el-dropdown-item>-->
        <el-dropdown-item @click.native="changeLangauge('nl')">
          <span style="display:block;">Nederlands</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </template>
  <script>
  export default {
    data() {
      return {
        language: ''
      }
    },
    created() {
      this.showLangauge()
    },
    methods: {
      showLangauge() {
        const currentLang = window.localStorage.getItem('lang') || 'en'
        switch (currentLang) {
          case 'zh':
            this.language = '简体中文'
            break
          case 'en':
            this.language = 'English'
            break
          //case 'ja':
            //this.language = '日本語'
            //break
          case 'nl':
            this.language = 'Nederlands'
        }
      },
      changeLangauge(lang) {
        this.$i18n.locale = lang
        window.localStorage.setItem('lang', lang)
        window.location.reload()
      }
    }
  }
  </script>
  <style lang="scss">
  .hover-pointer {
    span {
      cursor: pointer
    }
  }
  </style>
