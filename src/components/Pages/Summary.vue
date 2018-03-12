<template>
        <v-content>
            
                <v-layout>
                        <app-header></app-header>
                    <!-- div md8 -->
                        <v-container >
                        <h3>Your Attendance Summary</h3>
                        <v-data-table
                        :headers="headers"
                        :items="attendanceList"
                        :pagination.sync="pagination"
                        item-key="name"
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                        <td>{{ props.item.emp_id }}</td>
                        <td class="text-xs-left">{{ props.item.date }}</td>
                        <td class="text-xs-left">{{ props.item.in_time }}</td>
                        <td class="text-xs-left">{{ props.item.out_time }}</td>
                        <td class="text-xs-left">{{ props.item.duration }}</td>
                        </template>
                        </v-data-table>
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
    const apiURL = 'http://localhost:3001'// 'https://focus-budget-manager-api.herokuapp.com'
    const dailyDuration = 8
    export default {
        data () {
        return {
            validated : 0,
            attendanceList: [],
            loginPage : false,
            attendances : [],
            pagination: {
                sortBy: 'date'
            },
            headers: [
                {
                    text: 'EmpId',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Date', value: 'Date' },
                { text: 'In Time', value: 'inTime' },
                { text: 'Out Time', value: 'outTIme' },
                { text: 'Hours Worked Today', value: 'HoursToday' }
                ]
        }
        },
        mounted () {
        this.getAllAttendance()
        },
        methods: {
        getAllUsers (context) {
            Axios.get(`${apiURL}/api/v1/attendance`, {
            headers: {
                'Authorization': Authentication.getAuthenticationHeader(this)
            }
            }).then(({data}) => (this.attendances = data))
        },
        getAllAttendance (context) {
        Axios.get(`${apiURL}/api/v1/attendance/employe`, {
            headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
            },
            params: {
                emp_id: this.$cookie.get('emp_id'),            
            }
        }).then(({
            data        
        }) => (
            this.attendanceList = data,
            this.changeDateFormat()  
        ))
        },
        toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      changeDateFormat(){
           if( this.attendanceList instanceof Array){
            this.attendanceList.forEach(element => {
                var inTime = element.in_time,outTime =  element.out_time
                    element.date = new Date(element.date).toLocaleDateString();
                    element.in_time = new Date(element.in_time).toLocaleDateString()
                    if(element.out_time){
                        element.out_time = new Date(element.out_time).toLocaleDateString()
                        var duration = Math.abs((new Date(inTime)).getTime() - (new Date(outTime)).getTime());
                        var hours = duration/3600000
                        var minutes = duration/60000
                        var seconds = duration/1000
                        element.duration = Math.floor(hours) + ":" + Math.floor(minutes/100) + ":" + Math.floor(seconds/10000); 
                    }else{
                        element.out_time = 0;
                        element.duration = dailyDuration;
                    }

            });
            }
      }

        }
    }
</script>