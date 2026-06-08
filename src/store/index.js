import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import dict from './modules/dict'
import dept from './modules/dept'
import system from './modules/system'
import getters from './getters'
import bdData from './modules/bd-data'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
    dict,
    dept,
    system,
    bdData
  },
  getters
})


export default store
