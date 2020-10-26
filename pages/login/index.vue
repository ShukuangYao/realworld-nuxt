<template>
  <div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign <span v-if="isLogin">In</span><span v-else>Up</span></h1>
        <p class="text-xs-center">
          <nuxt-link to="/login" v-if="!isLogin">Have an account?</nuxt-link>
          <nuxt-link to="/register" v-else>Need an account?</nuxt-link>
        </p>

        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
           <li v-for="(message, index) in messages" :key="index+field">
             {{field}} {{message}}
           </li>
          </template>
        </ul>

        <form @submit.prevent="onSubmit">
          <fieldset class="form-group" v-if="!isLogin">
            <input
              class="form-control form-control-lg"
              type="text"
              placeholder="Your Name"
              v-model="user.username"
              required
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="email"
              placeholder="Email"
              v-model="user.email"
              required
            />
          </fieldset>
          <fieldset class="form-group">
            <input
              class="form-control form-control-lg"
              type="password"
              placeholder="Password"
              v-model="user.password"
              minlength="8"
              required
            />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
              {{isLogin ? 'Sign In' : 'Sign Up'}}
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { login, register } from '@/api/user';

const Cookie = process.client ? require('js-cookie') : undefined;

export default {
  middleware: 'unAuthenticated',
  name: 'Login',
  computed: {
    isLogin() {
      return this.$route.name === 'login';
    },
  },
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      errors: {},
    };
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({ user: this.user })
          : await register({ user: this.user });
        this.$store.commit('setUser', data.user);
        Cookie.set('user', data.user); // saving token in cookie for server rendering
        this.$router.push('/');
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },
  },
};
</script>

<style>

</style>
