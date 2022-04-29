import {createStore} from 'vuex'

const defaultState = {
    count: 0
}

const store = createStore({
    state() {
        return {
            count: 0
        }
    },
    getters: {
        double(state: typeof defaultState) {
            return state.count * 2 + 2
        }
    },
    mutations: {
        increment(state: typeof defaultState) {
            state.count++
        }
    },
    actions: {
        increment(context) {
            context.commit('increment')
        }
    }
})

export default store