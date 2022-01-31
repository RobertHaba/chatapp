import { createStore } from 'vuex';
import { supabase } from '../supabase/init.js';
const store = createStore({
  state: {
    user: null,
    activeChannel: null,
    messages: {},
    subscribeMessages: {},
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    changeActiveChannel(state, payload) {
      state.activeChannel = payload;
    },
    addMessageFromDB(state, payload) {
      console.log('New message from subscribe');
      state.messages[payload.channelID].data.push(payload.message)
    },
    addMessagesFromDB(state, payload) {
      console.log(payload);
      state.messages[payload.channelID].data = state.messages[
        payload.channelID
      ].data.concat(payload.messages).reverse();;
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
    createMessageObject(context, channels) {
      let newObject = {};
      channels.forEach((channel) => {
        newObject[channel.id] = {
          data: [],
        };
      });
      context.state.messages = newObject;
    },
  },
});

store.dispatch('createUser', supabase.auth.user());
export default store;
