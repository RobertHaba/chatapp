import { createStore } from 'vuex';
import { supabase } from '../supabase/init.js';

const store = createStore({
  state: {
    user: null,
    activeChannel: null,
    messages: {},
    subscribeMessages: {},
    showMenu: true,
    isMobileDevice: false,
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
      state.messages[payload.channelID].data.push(payload.message);
    },
    addMessagesFromDB(state, payload) {
      console.log(payload);
      state.messages[payload.channelID].data = state.messages[
        payload.channelID
      ].data
        .concat(payload.messages)
        .reverse();
    },
    toggleShowMenu(state) {
      console.log(state.showMenu);
      state.showMenu = !state.showMenu;
    },
  },
  actions: {
    createUser(context, payload) {
      if (payload) {
        const userName = payload.email.split('@');
        payload.name =
          userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
        context.commit('setUser', payload);
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
    chechIfIsMobileDevice(context) {
      let isMobile = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent.toLocaleLowerCase()
      );
      context.state.isMobileDevice = isMobile;
    },
  },
});

store.dispatch('createUser', supabase.auth.user());
export default store;
