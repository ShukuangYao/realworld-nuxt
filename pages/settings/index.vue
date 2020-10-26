<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>
        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
           <li v-for="(message, index) in messages" :key="index+field">
             {{field}} {{message}}
           </li>
          </template>
        </ul>
        <form>
          <fieldset>
              <fieldset class="form-group">
                <input
                class="form-control"
                type="text"
                placeholder="URL of profile picture"
                v-model="user.image">
              </fieldset>
              <fieldset class="form-group">
                <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username">
              </fieldset>
              <fieldset class="form-group">
                <textarea
                class="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
                 v-model="user.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
                v-model="user.email">
              </fieldset>
              <fieldset
              class="form-group">
                <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password">
              </fieldset>
              <button
              class="btn btn-lg btn-primary pull-xs-right"
              @click="updateCurrent()"
              :disabled="loading"
              >
                Update Settings
              </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import { getUser, updateUser } from '@/api/user';

export default {
  middleware: 'authenticated',
  name: 'setting',
  data() {
    return {
      user: {

      },
      loading: false,
      errors: {},
    };
  },
  async mounted() {
    const { data: { user } } = await getUser();
    this.user = user;
  },
  methods: {
    async updateCurrent() {
      this.loading = true;
      try {
        await updateUser({ user: this.user });
        this.$router.push({
          name: 'profile',
          params: {
            username: this.user.username,
          },
        });
      } catch (error) {
        this.errors = error.response.data.errors;
      } finally {
        this.loading = false;
      }
    },
  },

};
</script>

<style>

</style>
