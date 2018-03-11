<template>
  <div>
    <app-header></app-header>
    <h3>Hi! this is our App's Home</h3>
    <ul>
      <li v-if="attendances != null" v-for="attendance in attendances">
        {{ attendance.emp_id }}
      </li>
    </ul>

    <v-btn  v-on:click="markAttendance" color="green lighten-1 white--text" :disabled="validated == 1" >Mark Attendance</v-btn>
  </div>
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