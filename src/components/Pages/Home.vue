<template>
  <v-content>
    <v-container fluid fill-height>
   <v-layout>
      <app-header></app-header>
  <div>
    <h3>Welcome to Attendance Management</h3>
    </ul>
    <v-btn  v-on:click="markAttendance" color="green lighten-1 white--text" :disabled="validated == 1" >Mark Attendance</v-btn>
  </div>
  <app-footer></app-footer>
</v-layout>
</v-container>
</v-content>
</template>
<script>
import Axios from 'axios'
import moment from 'moment'
import Authentication from '@/components/pages/Authentication'
const apiURL = 'http://localhost:3001'// 'https://focus-budget-manager-api.herokuapp.com'
export default {
  data () {
    return {
      validated : 0,
      loginPage : false, 
      attendances: []
    }
  },
  mounted () {
    this.getAllUsers()
  },
  methods: {
    getAllUsers (context) {
      Axios.get(`${apiURL}/api/v1/attendance`, {
        headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
        }
      }).then(({data}) => (this.attendances = data))
    },
    markAttendance (context) {
      Axios.post(`${apiURL}/api/v1/attendance`, {emp_id: this.$cookie.get('emp_id')}, {
        headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
        }
      }).then(({data}) => ( console.log(data.attendance.date),
      console.log(moment(data.attendance.date).format('MMMM Do YYYY, h:mm:ss a'))))
    }

  }
}
</script>