import { createStore } from 'vuex';
import { supabase } from '../supabase/init.js';

const store = createStore({
  state: {
    user: null,
    activeChannel: null,
    newActiveChannel:null,
    messages: {},
    subscribeMessages: {},
    showMenu: true,
    isMobileDevice: false,
    allowNotifications: false,
    allowSound:true,
    isNewMessage: { status: false, channel: null },
  },
  mutations: {
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
    toggleAllowNotification(state, payload) {
      console.log(payload);
      state.allowNotifications = payload;
    },
    toggleAllowSound(state) {
      state.allowSound = !state.allowSound;
    },
    toggleShowMenu(state, payload) {
      state.showMenu =
        payload === true || payload === false ? payload : !state.showMenu;
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
    handlerIsNewMessage(context, payload) {
      context.state.isNewMessage = payload;
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
    getAudioAllowStatusFromLocalStorage(context){
      const audioStatusFromLocalStorage = localStorage.getItem('allowAudio')
      context.state.allowSound = (audioStatusFromLocalStorage === 'true')
    }
  },
});

store.dispatch('createUser', supabase.auth.user());
export default store;
