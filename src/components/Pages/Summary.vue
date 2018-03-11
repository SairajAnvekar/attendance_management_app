<template>
        <v-content>
            <v-container fluid fill-height>
                <v-layout>
                        <app-header></app-header>
                    <div>
                        <h3>Your Attendance Summary</h3>
                        <v-data-table
                        :headers="headers"
                        :items="attendanceList"
                        :pagination.sync="pagination"
                        item-key="name"
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                        <td>{{ props.item.emp_id }}</td>
                        <td class="text-xs-right">{{ props.item.date }}</td>
                        <td class="text-xs-right">{{ props.item.in_time }}</td>
                        <td class="text-xs-right">{{ props.item.out_time }}</td>
                        </template>
                        </v-data-table>
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
                { text: 'Out Time', value: 'outTIme' }
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
        }).then(({data}) => (this.attendanceList = data))
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
      }

        }
    }
</script>