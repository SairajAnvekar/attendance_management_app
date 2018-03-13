<template>
  <v-content>
   <v-layout>
      <app-header></app-header>
        <v-container fluid fill-height>
          <v-layout row wrap>
            <v-flex xs12>   
              <h1>Mark Your Attendance  For Today  {{currentDate}}</h1>
            </v-flex>
            <v-flex xs2>  
              <p v-if="disableCheckin">Checkin has been Marked</p>
            </v-flex>
            <v-flex xs2>  
              <p v-if="disableCheckout">Checkout has been Marked</p>
            </v-flex>
            <v-flex xs12>  
              <v-btn  v-on:click="markAttendance" color="green lighten-1 white--text" :disabled="disableCheckin" >Check In</v-btn>
              <v-btn  v-on:click="checkout" color="green lighten-1 white--text"  :disabled="disableCheckout" >Check Out</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
  <app-footer></app-footer>
</v-layout>
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
      validated : 1,
      loginPage : false, 
      attendances: [],
      disableCheckout:false,
      disableCheckin:false,
      attendance_id :'', 
      currentAttendance: {},
      currentDate :moment().format('MMMM Do YYYY')
    }
  },
  mounted () {
    this.checkAttendance()
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
      }).then(({data}) => (  this.disableCheckin = true,this.currentAttendance=data.attendance,
      console.log(moment(data.attendance.date).format('MMMM Do YYYY, h:mm:ss a'))))
    },
    

    checkAttendance (context) {
      Axios.get(`${apiURL}/api/v1/attendance/check`, {
        headers: {
        'Authorization': Authentication.getAuthenticationHeader(this)
        },
        params: {
            emp_id: this.$cookie.get('emp_id'),            
        }
      }).then(({data}) => {
         if( data && data.length > 0){
          this.currentAttendance = data[0] ;
          console.log(this.currentAttendance); 
          this.attendance_id = this.currentAttendance._id;
          this.disableCheckin = this.currentAttendance._id ? true : false;
          this.disableCheckout = this.currentAttendance.out_time ? true : false;
         }       
      })
    },

    checkout (context) {
      console.log(this.currentAttendance);
      Axios.put(`${apiURL}/api/v1/attendance/checkout`, {emp_id: this.$cookie.get('emp_id') ,attendance_id : this.currentAttendance._id}, {
        headers: {
          'Authorization': Authentication.getAuthenticationHeader(this)
        }
      }).then(({data}) => (this.disableCheckout = true ))
    }

  }
}
</script>