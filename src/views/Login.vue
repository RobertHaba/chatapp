<template>
  <section class="w-full h-screen bg-red flex justify-center items-center">
    <form @submit.prevent="handlerLogin" class="flex justify-center flex-col">
      <div class="flex flex-col gap-4 text-center mb-4">
        <label for="newUser" class="text-white font-semibold"
          >Nazwa użytkownika</label
        >
        <input
          type="text"
          min-length="3"
          id="newUser"
          class="rounded-lg py-1 px-4"
          v-model="newUser.name"
        />
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <button
        class="rounded-lg px-10 py-1 bg-white font-semibold text-indigo-500"
      >
        Zaloguj
      </button>
    </form>
  </section>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { supabase } from '../supabase/init';

export default {
  setup() {
    // Router, Store etc.
    const router = useRouter();
    const store = useStore();
    // Data
    const newUser = ref({
      name: null,
    });
    const storeUser = computed(()=>store.state.user);
    const PASSWORD = 'bestapp';
    const errorMessage = ref(null);
    // Function
    const handlerLogin = () => {
      if (checkInputLength()) {
        signUpUser();
      }
    };
    const checkInputLength = () => {
      if (newUser.value.name && newUser.value.name.length >= 3) {
        errorMessage.value = null;
        return true;
      } else {
        errorMessage.value = 'Minimalna długość to 3 znaki.';
        return false;
      }
    };
    const signUpUser = async () => {
      try {
        const { user, error } = await supabase.auth.signUp({
          email: newUser.value.name + '@email.pl',
          password: PASSWORD,
        });
        if (error) throw error;
        newUser.value.id = user.id;
        createUserInDB();
      } catch (error) {
        console.log(error);
      }
    };
    const createUserInDB = async () => {
      try {
        const { data, error } = await supabase
          .from('Users')
          .insert(newUser.value);
        if (error) throw error;
        console.log(data);
        setUserInStore();
        setUserInLocalStorage();
        changeRouterToChatApp();
      } catch (error) {
        console.log(error);
      }
    };
    const setUserInLocalStorage = () => {
      localStorage.setItem('newUser', JSON.stringify(newUser.value));
    };
    const setUserInStore = () => {
      store.commit('setUser', newUser.value);
    };
    const changeRouterToChatApp = () => {
      router.push('/');
    };
    const isUserInStore = () => {
      if (storeUser.value) {
        console.log('asd');
        signInUser();
      }
    };
    const signInUser = async () => {
      try {
        const { error } = await supabase.auth.signIn({
          email: storeUser.value.name + '@email.pl',
          password: PASSWORD,
        });
        if (error) throw error;
        changeRouterToChatApp();
      } catch (error) {
        console.log(error);
      }
    };
    //Mounted
    watch(
      (storeUser,
      (newVal) => {
        console.log(newVal);
        isUserInStore();
      })
    );
    // Return
    return { newUser, handlerLogin, errorMessage };
  },
};
</script>
