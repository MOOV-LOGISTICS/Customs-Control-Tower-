import { listDept, getDeptAll } from '@/api/system/dept';

const state = {
    deptList: [],
    supplierList: [],
    signal: false
};

const mutations = {
    SET_DEPT_LIST(state, list) {
        state.deptList = list;
    },
    SET_SUPPLIER_LIST(state, list) {
        state.supplierList = list;
    },
};

const actions = {
    async fetchDeptList({ commit }) {
        try {
            const response = await listDept();
            commit('SET_DEPT_LIST', response.data);
        } catch (error) {
            console.error('Failed to fetch department list:', error);
        }
    },
    async fetchSupplierList({ commit, state }) {
        if (!state.signal) {
            state.signal = true;
            try {
                const response = await getDeptAll('Supplier');
                commit('SET_SUPPLIER_LIST', response.data);
                // 4s后可以重新加载，避免大量请求
                setTimeout(() => {
                    state.signal = false
                    console.log('-------state.signal---------------')
                }, 4000)
            } catch (error) {
                console.error('Failed to fetch supplier list:', error);
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