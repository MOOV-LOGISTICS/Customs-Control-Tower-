import { getAirlineList } from '@/api/air/airline';
import { getAirportList } from '@/api/air/airport';

const state = {
    airlineList: [],
    airportList: [],
    signal: false
};

const mutations = {

    SET_AIRLINE_LIST(state, list) {
        state.airlineList = list;
    },

        SET_AIRPORT_LIST(state, list) {
        state.airportList = list;
    },
};

const actions = {
    async fetchAirlineList({ commit, state }) {
        if (!state.signal) {
            state.signal = true;
            try {
                const response = await getAirlineList();
                console.log('-------response---------------',response.data)
                commit('SET_AIRLINE_LIST', response.data);
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
     async fetchAirportList({ commit, state }) {
        console.log('-------state.signal---------------',state.signal)
         try {
             const response = await getAirportList();
             console.log('airPORT-------response---------------',response.data)
             commit('SET_AIRPORT_LIST', response.data);
             // 4s后可以重新加载，避免大量请求
             setTimeout(() => {
                 state.signal = false
                 console.log('-------state.signal---------------')
             }, 4000)
         } catch (error) {
             console.error('Failed to fetch supplier list:', error);
         }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};