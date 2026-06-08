import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
//import elementJaLocale from 'element-ui/lib/locale/lang/ja'
import elementNlLocale from 'element-ui/lib/locale/lang/nl'
import locale from 'element-ui/lib/locale'
import enLocale from './en'
import zhLocale from './zh'
//import jaLocale from './ja'
import nlLocale from './nl'

Vue.use(VueI18n)

// 引入本地包
const messages = {
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  en: {
    ...enLocale,
    ...elementEnLocale
  },
//  ja: {
//    ...jaLocale,
//    ...elementJaLocale
//  } ,
  nl: {
    ...nlLocale,
    ...elementNlLocale
  }
}

// 创建国际化实例
const i18n = new VueI18n({
  locale: window.localStorage.getItem('lang') || 'en',
  messages
})

locale.i18n((key, value) => i18n.t(key, value))

export default i18n
