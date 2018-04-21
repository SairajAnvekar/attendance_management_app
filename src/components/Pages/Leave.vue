<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <!-- div md8 -->
      <v-container>
        <h3>Admin Approal</h3>

        <v-form v-model="valid" ref="form" lazy-validation>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex d-flex xs12 sm5 md5>
                <v-menu ref="startDateMenu" lazy :close-on-content-click="false" v-model="startDateMenu" transition="scale-transition" offset-y
                  full-width :nudge-right="40" min-width="290px" :return-value.sync="leave.startDate">
                  <v-text-field slot="activator" label="Start Date" v-model="leave.startDate" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="leave.startDate" @input="$refs.startDateMenu.save(leave.startDate)"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex d-flex xs12 sm5 md5>
                <v-menu ref="endDateMenu" lazy :close-on-content-click="false" v-model="endDateMenu" transition="scale-transition" offset-y
                  full-width :nudge-right="40" min-width="290px" :return-value.sync="endDate">
                  <v-text-field slot="activator" label="End Date" v-model="leave.endDate" :rules="endDateRule" prepend-icon="event" readonly></v-text-field>
                  <v-date-picker v-model="leave.endDate" @input="$refs.endDateMenu.save(leave.endDate)"></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
 <v-layout row wrap>
  <v-flex d-flex xs12 sm6 md5>
      <v-text-field label="Reason" prepend-icon="event" :multi-line=true rue :row-height=5 v-model="leave.desc" :no-resize=true
            rue rows=2></v-text-field>
  </v-flex>
 </v-layout>

          </v-container>
          <v-btn v-on:click="applyLeave" color="green lighten-1 white--text" :disabled="!valid">
            <v-icon left dark>directions_run</v-icon> Check Out</v-btn>

          <v-list two-line>
            <v-subheader>leaves</v-subheader>
            <template v-for="(leave, index) in leaves">
              <v-list-tile :key="leave.username">
              <v-list-tile-avatar>
                  <span class=" headline">{{leave.username.charAt(0).toUpperCase()}}</span>
              </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title> {{leave.username}} </v-list-tile-title>
                  <v-list-tile-sub-title>Leave from {{format(leave.start_date)}} to {{format(leave.end_date)}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title v-html="leave.desc"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn @click="">Edit</v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < leaves.length" :key="index"></v-divider>
            </template>
          </v-list>
        </v-form>
      </v-container>
      <!--/div -->
      <app-footer></app-footer>
    </v-layout>
  </v-content>
</template>
<script>
  import Axios from 'axios'
  import moment from 'moment'
  import Authentication from '@/components/pages/Authentication'
  import APIurlConfig from '../../apiConfig'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  import DateOnly from 'dateonly'
  export default {
    data() {
      return {
        valid: true,
        leaves: [],
        empId: this.$cookie.get('id'),
        startDateMenu: false,
        leave: {
          emp_id: this.$cookie.get('id')
        },
        startDate: null,
        endDateMenu: false,
        endDate: null,
        loginPage: false,
        leavesAvailable: 0,
        endDateRule: [
          v => !!v || 'Name is required',
          v => (v && moment(this.leave.endDate).isSameOrAfter(moment(this.leave.startDate))) ||
          'End Date must be greater than Start Date',
          v => (v && this.verifyEndDate()) || 'no leavs availabe'

        ],
        pagination: {
          sortBy: 'date'
        },
        headers: [{
            text: 'Username',
            align: 'left',
            sortable: false,
            value: 'username'
          },
          {
            text: 'Date',
            align: 'left',
            sortable: false,
            value: 'date'
          },
          {
            text: 'Action',
            align: 'center',
            value: 'Action'
          }
        ]
      }
    },
    mounted() {
      this.getAllLeave(),
      this.getEmpDetails()
    },
    methods: {
      getAllLeave(context) {
        Axios.get(`${apiURL}/api/v1/attendance/leave`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.leaves = data
        ))
      },

      verifyEndDate() {
        return (moment(this.leave.endDate).diff(moment(this.leave.startDate), 'days') + 1) < this.leavesAvailable;
      },


      getEmpDetails(context) {
        Axios.get(`${apiURL}/api/v1/users/admin`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },
          params: {
            _id: this.empId
          }
        }).then(({
          data
        }) => (console.log(data[0].leaves.privilege),
          this.leavesAvailable = data[0].leaves.privilege
        ));
      },

      format(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      },

      applyLeave() {
        Axios.post(`${apiURL}/api/v1/attendance/leave`, this.leave, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (this.disableCheckin = true, this.currentAttendance = data.attendance));
      },
      format(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('MMMM Do YYYY');
      },
      toggleAll() {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      handleUsers() {
        console.log(this.usersList)
      }
    }
  }

</script>
