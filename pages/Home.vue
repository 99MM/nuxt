<template>
  <div>
    <h1>HOME</h1>
    {{ $store.state.token }}
    {{ token }}
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        token: this.$store.state.token
      }
    },
    created() {
      this.getAccessToken();
    },
    methods: {
      getAccessToken() {

        let client_id = '1656806317';
        let redirect_uri = 'http://localhost:8087/Home';

        let res = axios.post('https://api.line.me/oauth2/v2.1/token',{
            headers: {'Content-type': 'application/x-www-form-urlencoded'},
            params: {
              grant_type:'authorization_code',
              code: 'Hl7904A5VfX1lzO9z7fw',
              redirect_uri: redirect_uri,
              client_id: client_id,
              client_secret: 'a7d33dec4df5c2d1a5ff6de462224fe5'
            }
          }
        )

        console.log(res);

      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
