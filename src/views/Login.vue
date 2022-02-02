<template>
  <section
    class="w-full h-screen bg-gradient-to-tr from-purple to-red flex flex-col justify-center items-center text-white"
  >
    <div class="max-w-xs md:max-w-md">
      <h2 class="text-2xl font-bold mb-20 max-w-sm">
        Hej! <br />
        Rozpocznij korzystanie z ChatApp
      </h2>
      <nav class="flex max-w-xs w-full mb-4">
        <ul class="flex gap-4">
          <li class="">
            <button
              class="opacity-70 hover:opacity-100"
              :class="[
                activeCard === 'signIn'
                  ? 'opacity-100 font-semibold underline underline-offset-4'
                  : '',
              ]"
              @click="
                (activeCard = 'signIn'),
                  getUserFromLocalStorage(),
                  (errorMessage = null)
              "
            >
              Zaloguj się
            </button>
          </li>
          <li class="">
            <button
              class="opacity-70 hover:opacity-100 transition-all"
              :class="[
                activeCard === 'signUp'
                  ? 'opacity-100 font-semibold underline underline-offset-4'
                  : 'opacity-70',
              ]"
              @click="
                (activeCard = 'signUp'),
                  ((user.name = null),
                  (user.password = null),
                  (errorMessage = null))
              "
            >
              Utwórz konto
            </button>
          </li>
        </ul>
      </nav>
      <form @submit.prevent="handlerForm" class="flex justify-center flex-col">
        <LoginInput
          :inputObj="loginInputsData[0]"
          v-model="user.name"
          :key="loginInputsData[0].id"
        />
        <LoginInput
          :inputObj="loginInputsData[1]"
          v-model="user.password"
          :key="loginInputsData[1].id"
        />
        <p v-if="errorMessage" class="text-xs mb-2">{{ errorMessage }}</p>
        <button
          class="rounded-lg text-sm py-2 border-2 border-white border-solid font-semibold"
        >
          {{ loginPageButtonText }}
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { supabase } from '../supabase/init';
import LoginInput from '../components/LoginInput.vue';
export default {
  components: { LoginInput },
  setup() {
    // Router, Store etc.
    const router = useRouter();
    const store = useStore();
    // Data
    const user = ref({ name: null, password: null });
    const errorMessage = ref(null);
    const activeCard = ref('signIn');
    const loginInputsData = ref([
      {
        title: 'Użytkownik',
        placeholder: 'Wprowadź nazwę',
        type: 'text',
        minLength: 3,
        maxLength: 10,
        id: 'userLogin',
        isValid: false,
        errorMsg: 'Nazwa musi zawierać min. 3 znaki, max. 10',
        showError: false,
      },
      {
        title: 'Hasło',
        placeholder: 'Wprowadź hasło',
        type: 'password',
        minLength: 3,
        maxLength: 99,
        id: 'userPassword',
        isValid: false,
        errorMsg: 'Hasło musi zawierać min. 3 znaki',
        showError: false,
      },
    ]);
    //Computed
    const loginPageButtonText = computed(() =>
      activeCard.value === 'signIn' ? 'Zaloguj się' : 'Zarejestruj się'
    );
    // Function
    const handlerForm = () => {
      console.log('asd');
      if (activeCard.value === 'signIn') {
        handlerLogin();
      } else if (activeCard.value === 'signUp') {
        handlerRegister();
      }
    };
    const handlerLogin = () => {
      if (checkInputsValidation()) {
        signInUser();
      }
    };
    const handlerRegister = () => {
      if (checkInputsValidation()) {
        signUpUser();
      }
    };
    const checkInputsValidation = () => {
      let isAllValid = true;
      loginInputsData.value.forEach((inputData) => {
        if (inputData.isValid === false) {
          inputData.showError = true;
          isAllValid = false;
        } else {
          inputData.showError = false;
        }
      });
      return isAllValid;
    };
    const signInUser = async () => {
      try {
        const {session, error } = await supabase.auth.signIn({
          email: user.value.name + '@email.pl',
          password: user.value.password,
        });
        if (error) throw error;
        user.value.id = session.user.id;
        setUserInStore(user.value);
        setUserInLocalStorage(user.value);
        changeRouterToChatApp();
      } catch (error) {
        errorMessage.value = error.message;
        console.log(error);
      }
    };
    const signUpUser = async () => {
      console.log(user.value.name);
      console.log(user.value.name + '@email.pl');
      console.log(user.value.password);
      try {
        const { session, error } = await supabase.auth.signUp({
          email: user.value.name + '@email.pl',
          password: user.value.password,
        });
        if (error) throw error;
        user.value.id = session.user.id;
        setUserInStore(user.value);
        setUserInLocalStorage(user.value);
        changeRouterToChatApp();
      } catch (error) {
        errorMessage.value = error.message;
        console.log(error);
      }
    };
    const getUserFromLocalStorage = () => {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      user.value = userFromStorage ? userFromStorage : user.value;
    };
    const setUserInLocalStorage = (userObj) => {
      localStorage.setItem('user', JSON.stringify(userObj));
    };
    const setUserInStore = (userObj) => {
      store.commit('setUser', userObj);
    };
    const changeRouterToChatApp = () => {
      router.push('/');
    };
    getUserFromLocalStorage();
    // Return
    return {
      user,
      handlerLogin,
      handlerRegister,
      errorMessage,
      activeCard,
      loginPageButtonText,
      loginInputsData,
      handlerForm,
      getUserFromLocalStorage,
    };
  },
};
</script>
