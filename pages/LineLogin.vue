<template>
  <div>
    <div class="container" v-if="response.error || response.error_description">
      <p>登入失敗</p>
    </div>
    {{ $store.state.token }}
    <div class="container">
      <button @click="lineLoginBtn">LINE 登入</button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    async asyncData({store, query, redirect}) {

      if(query.code) {
        store.commit('setToken', query.code);
        // const hasToken = store.getters['hasToken'];
        // console.log(hasToken)
        // router.push({ name: 'Home' });
        // if(hasToken) {
        redirect('/Home');
        // }
      }

      return {
        loading: false,
        response: {
          state: query.state,
          code: query.code,
          friendship_status_changed: query.friendship_status_changed,
          error: query.error,
          error_description: query.error_description
        }
      };

    },
    methods: {
      lineLoginBtn() {

        let client_id = '1656806317';
        let redirect_uri = 'http://localhost:8087/LineLogin';

        // axios.get('https://access.line.me/oauth2/v2.1/authorize', {
        //   headers: {
        //     Authorization: 'Bearer ' + TOKEN //the token is a variable which holds the token
        //   },
        //   params: {
        //     response_type: 'code',
        //     client_id: client_id,
        //     redirect_uri: redirect_uri,
        //     state: 'login',
        //     bot_prompt: 'normal',
        //     scope: 'profile%20openid%20email'
        //   }
        // })

        let link = 'https://access.line.me/oauth2/v2.1/authorize?';
        link += 'response_type=code';
        link += '&client_id=' + client_id;
        link += '&redirect_uri=' + redirect_uri;
        link += '&state=login';
        link += '&bot_prompt=normal';
        link += '&scope=profile%20openid%20email';
        window.location.href = link;

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
