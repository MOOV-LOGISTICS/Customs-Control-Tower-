import { taskSettingAll } from "@/api/pepco/milestone";
import { airTaskSettingAll } from "@/api/air/booking";

const state = {
  milestoneSetList: [],
  signal: false,
  airMilestoneSetList: [],
  airSignal: false,
};

const mutations = {
  SET_MILESTONE_SET_LIST: (state, setList) => {
    state.milestoneSetList = setList;
  },
  SET_AIR_MILESTONE_SET_LIST: (state, setList) => {
    state.airMilestoneSetList = setList;
  },
};

const actions = {
  // 获取信息
  async fetchTaskSetList({ commit, state }) {
    if (!state.signal) {
      state.signal = true;
      try {
        const res = await taskSettingAll();
        const setList = res.data || [];
        commit("SET_MILESTONE_SET_LIST", setList);
        // 4s后可以重新加载，避免大量请求
        setTimeout(() => {
          state.signal = false;
          console.log("-------state.signal---------------");
        }, 4000);
      } catch (error) {
        console.error("Failed to fetch supplier list:", error);
      }
    }
  },
  // 获取air milestone settings
  async fetchAirTaskSetList({ commit, state }) {
    console.log("-------fetchAirTaskSetList---------------");
    if (!state.airSignal) {
      state.airSignal = true;
      try {
        const res = await airTaskSettingAll({});
        const setList = res.data || [];
        commit("SET_AIR_MILESTONE_SET_LIST", setList);
        // 4s后可以重新加载，避免大量请求
        setTimeout(() => {
          state.airSignal = false;
          console.log("-------state.airSignal---------------");
        }, 4000);
      } catch (error) {
        console.error("Failed to fetch supplier list:", error);
      }
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
