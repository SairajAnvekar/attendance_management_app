<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <app-approval ></app-approval>
      <app-footer></app-footer>
    </v-layout>
  </v-content>
</template>


<script>
import Authentication from '@/components/pages/Authentication'
import Axios from 'axios'
import APIurlConfig from '../../apiConfig'
const apiURL =  APIurlConfig.API_URL
export default {
  data () {
    return {     
      user: {
        username: this.$cookie.get('username'),
        password: '',
        emp_id: ''
      }
    }
  },
  props: {
        source: String
  },
  methods: {
    update (context) {    
        Axios.put(`${apiURL}/api/v1/user`, {id: this.$cookie.get('id') ,username : this.user.username, password: this.user.password}, {
        headers: {
        'Authorization': Authentication.getAuthenticationHeader(this)
        }
        }).then(({data}) => (console.log(data)))
    },

    submitAuthentication () {
      Authentication.authenticate(this, this.credentials, '/')
    },

    submitSignUp () {
      Authentication.signup(this, this.newUser, '/')
    }
  }
}
</script>