import { createStore } from 'vuex';
import { supabase } from '../supabase/init.js';

const store = createStore({
  state: {
    user: null,
    activeChannel: null,
    newActiveChannel: null,
    messages: {},
    subscribeMessages: {},
    showMenu: true,
    isMobileDevice: false,
    allowNotifications: false,
    allowSound: true,
    isNewMessage: { status: false, channel: null },
  },
  mutations: {
    createUser(state,payload) {
      if (payload) {
        const userName = payload.email.split('@');
        payload.name =
          userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
          this.commit('setUser', payload);
      }
    },
    setUser(state, payload) {
      if (payload) {
        payload.name =
          payload.name.charAt(0).toUpperCase() + payload.name.slice(1);
      }
      state.user = payload;
    },
    changeActiveChannel(state, payload) {
      state.activeChannel = payload;
    },
    addMessageFromDB(state, payload) {
      state.messages[payload.channelID].data.push(payload.message);
    },
    addMessagesFromDB(state, payload) {
      if (!payload.toEnd) {
        state.messages[payload.channelID].data = state.messages[
          payload.channelID
        ].data
          .concat(payload.messages)
          .reverse();
      } else if (payload.toEnd) {
        state.messages[payload.channelID].data.unshift(
          ...payload.messages.reverse()
        );
      }
    },
    createMessageObject(state, channels) {
      let newObject = {};
      channels.forEach((channel) => {
        newObject[channel.id] = {
          data: [],
        };
      });
      state.messages = newObject;
    },
    toggleAllowNotification(state, payload) {
      state.allowNotifications = payload;
    },
    toggleAllowSound(state) {
      state.allowSound = !state.allowSound;
    },
    toggleShowMenu(state, payload) {
      state.showMenu =
        payload === true || payload === false ? payload : !state.showMenu;
    },
    chechIfIsMobileDevice(state) {
      let isMobile = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent.toLocaleLowerCase()
      );
      state.isMobileDevice = isMobile;
    },
    handlerIsNewMessage(state, payload) {
      state.isNewMessage = payload;
    },
    getAudioAllowStatusFromLocalStorage(state) {
      const audioStatusFromLocalStorage = localStorage.getItem('allowAudio');
      state.allowSound = audioStatusFromLocalStorage === 'true';
    },
  },
});

store.commit('createUser', supabase.auth.user());
export default store;
