<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <!-- div md8 -->
      <v-container>
        <h3>Admin Approal</h3>

        <v-tabs v-model="active" slider-color="yellow">
          <v-tab :key="`Regularize`" ripple>
            Regularize
          </v-tab>

          <v-tab :key="`Leaves`" ripple>
            leave
          </v-tab>


          <v-tab-item :key="`Regularize`">
            <v-data-table :headers="headers" :items="approvalList" :pagination.sync="pagination" item-key="name" class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.emp_id }}</td>
                <td>{{ format(props.item.date) }}</td>
                <td class="text-xs-center">
                  <v-btn v-on:click="markAttendance((props.item.emp_id),(props.item.date),(props.item.checkin), (props.item.checkout))" color="green lighten-1 white--text">
                    Aprove
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item :key="`Leaves`">
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
          </v-tab-item>

        </v-tabs>


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
        approvalList: [],
        loginPage: false,
        leaves: [],
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
      this.getAllRegularize(),
        this.getAllLeave()
    },
    methods: {
      getAllRegularize(context) {
        Axios.get(`${apiURL}/api/v1/attendance/regularize`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.approvalList = data
        ))
      },

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

      format(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
      },
      markAttendance(emp_id, date, inTime, outTime) {
        var attendanceDate = new DateOnly(date);
        const date1 = attendanceDate.toDate();
        Axios.post(`${apiURL}/api/v1/attendance`, {
          emp_id: emp_id,
          date: date1,
          in_time: inTime,
          out_time: outTime
        }, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (this.disableCheckin = true, this.currentAttendance = data.attendance));
      },
      format(date) {
        var attendanceDate = new DateOnly(date);
        return moment(attendanceDate.toDate()).format('YYYY-MM-DD');
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
