import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
    user: null,
    state: {
        show: false,
        user: null,
        loginState: ''
    }
})
