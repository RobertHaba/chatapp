import { createStore } from 'vuex';
import { supabase } from '../supabase/init.js';
const store = createStore({
  state: {
    user: null,
    activeChannel: null,
    lastestMessages: {},
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    changeActiveChannel(state, payload) {
      state.activeChannel = payload;
    },
    addNewLastestMessage(state, payload) {
      state.lastestMessages[state.activeChannel.id] = payload;
    },
  },
  actions: {
    createUser(context, payload) {
      if (payload) {
        const userName = payload.email.split('@');
        payload.name =
          userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
        context.commit('setUser', payload);
      } else {
        const user = localStorage.getItem('newUser');
        console.log('Getting from localStorage');
        if (user) {
          context.commit('setUser', JSON.parse(user));
        }
      }
    },
  },
});

store.dispatch('createUser', supabase.auth.user());
export default store;
