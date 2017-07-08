import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
     exit(context){
       context.commit('setUser', null);
     },
     login(context, user){
       context.commit('setUser', user);
     }
   }
})

export default store
