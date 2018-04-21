<template>
    <div>
        <br>
        <v-card>
            <v-container fluid grid-list-lg>
                <v-layout row>
                    <v-flex xs6>
                        <div>
                            <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="date">
                                <v-text-field slot="activator" label="Picker in menu" v-model="date" prepend-icon="event" readonly></v-text-field>
                                <v-date-picker v-model="date" type='month' no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </div>
                    </v-flex>
                    <v-flex xs6>
                        <v-btn color="success" v-on:click='getAllAttendance'>Submit</v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
        
        <v-dialog v-model="dialog2" persistent max-width="600px">
            <v-card>
                <v-card-title>
                   Regularize
                </v-card-title>
                <v-card-text>                  
                    <v-layout row>
                        <v-flex xs11 sm5>
                            <v-menu ref="checkin" lazy :close-on-content-click="false" v-model="checkinMenu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px" :return-value.sync="checkin">
                                <v-text-field slot="activator" label="Check in " v-model="checkin" prepend-icon="access_time" readonly></v-text-field>
                                <v-time-picker v-model="checkin" @change="$refs.checkin.save(checkin)"></v-time-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs11 sm5>
                            <v-menu ref="checkout" lazy :close-on-content-click="false" v-model="checkoutMenu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px" :return-value.sync="checkout">
                                <v-text-field slot="activator" label="Checkout" v-model="checkout" prepend-icon="access_time" readonly></v-text-field>
                                <v-time-picker v-model="checkout" @change="$refs.checkout.save(checkout)"></v-time-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>                
                    <v-btn color="primary"  v-bind:class="{ 'btn--disabled' : !checkout || !checkin }"  @click="regularize()">Regularize</v-btn>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary"  @click.stop="dialog2=false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-data-table :headers="headers" :items="attendanceList" :pagination.sync="pagination" item-key="name" :rows-per-page-items=[15,31] class="elevation-1">
            <template slot="items" slot-scope="props" class='row'>
                <tr class="row">
                    <td>{{ props.item.emp_id }}</td>
                    <td class="text-xs-left">{{ props.item.date.format('DD-MM-YYYY') }}</td>
                    <td class="text-xs-left">{{ props.item.in_time }}</td>
                    <td class="text-xs-left">{{ props.item.out_time }}</td>
                    <td class="text-xs-left">{{ props.item.status }}</td>
                    <td class="text-xs-left">{{ props.item.duration }}</td>
                    <td class="text-xs-center">
                        <v-btn color="info" @click.native="regularizeDialog(props.item.emp_id,props.item.date)">Regularize</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
</template>
<script>
    import Axios from 'axios'
    import moment from 'moment'
    import DateOnly  from 'dateonly'
    import Authentication from '@/components/pages/Authentication'
    import APIurlConfig from '../../apiConfig'
    const apiURL =  APIurlConfig.API_URL // 'http://localhost:3001'
    const dailyDuration = 8
    export default {
          props: [
            'prop_emp_id'
        ],
        data () {
        return {
            validated : 0,
            attendanceList: [],
            loginPage : false,
            attendances : [],
            date: moment().format('YYYY-MM'),
            menu: false,
            checkin:null,
            checkinMenu:false,
            checkout:null,
            checkoutMenu:false,
            menu1:false,
            modal: false, 
            dialog2:false, 
            checkinTime :null,
            checkoutTime : null,
            slectedForRegularize:{},

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
                { text: 'Status', value: 'status' },
                { text: 'Hours Worked Today', value: 'HoursToday' },
                { text: 'Regularization', value: 'Regularization' , align: 'center', sortable: false}
                ]
        }
        },
      
        filters: {
            month: function (value) {
            if (!value) return ''          
            return value
            }
        },
        mounted () {
        this.getAllAttendance(),
        console.log(this.props);
        },
        methods: {
                getAllUsers (context) {
                    Axios.get(`${apiURL}/api/v1/attendance`, {
                    headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                    }).then(({data}) => (this.attendances = data))
                },


                 regularizeDialog(emp_id,date){
                     this.dialog2 = true;
                     this.slectedForRegularize.emp_id= emp_id;              
                     this.slectedForRegularize.date= date;                                   
                },


                generateDateTime(date,time){                    
                    const formatTime = moment(time, 'HH:mm');
                    const formatDate = moment(date);                
                    formatDate.set({
                        hour:   formatTime.get('hour'),
                        minute: formatTime.get('minute'),
                        second: formatTime.get('second')
                    });
                   return formatDate; 
                 },

                regularize(){  
                    Axios.post(`${apiURL}/api/v1/attendance/regularize`, {
                        emp_id: this.slectedForRegularize.emp_id, 
                        date:this.slectedForRegularize.date, 
                        in_time: this.generateDateTime(this.slectedForRegularize.date, this.checkin),
                        out_time: this.generateDateTime(this.slectedForRegularize.date, this.checkout)
                         }, {
                    headers: {
                        'Authorization': Authentication.getAuthenticationHeader(this)
                    }
                }).then(({data}) => (console.log(data)
                ));
                },

                getAllAttendance (context) {            
                    Axios.get(`${apiURL}/api/v1/attendance/employe`, {
                        headers: {
                            'Authorization': Authentication.getAuthenticationHeader(this)
                        },
                        params: {
                            emp_id: this.prop_emp_id,
                            month : this.date           
                        }
                    }).then(({data   
                    }) => (
                        this.attendanceList = data,                  
                        this.changeDateFormat() ,
                        this.attendanceList = this.calculateForMonth()
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

                

               calculateForMonth(){
                var ar = [];
                var start = moment(this.date,"YYYY-MM"); 
                console.log('start');               
                console.log(start);               
      
                    for(var end = moment(start).add(1,'month');  start.isBefore(end); start.add(1,'day')){
                        let contains =false;
                        for(let i=0; i < this.attendanceList.length;i++) {
                        const element=  this.attendanceList[i];
                        if( start.isSame(moment(element.date).format('YYYY-MM-DD'), 'day')){
                            element.status ='present'
                            element.date= element.date,
                            ar.push(element);
                            contains = true;
                            break;                       
                        }                   
                        }
                        if(contains == false){
                        ar.push({
                            "date": moment(start),
                            "in_time": "Na", 
                            "emp_id": this.prop_emp_id, 
                            "out_time": "Na",
                            "duration": 0,
                            "status": "absent"
                            });
                        }                       
                    }             
               return ar;
               },



                changeDateFormat(){
                if( this.attendanceList instanceof Array){
                    this.attendanceList.forEach(element => {
                        var inTime = element.in_time,outTime =  element.out_time
                            var attendanceDate = new DateOnly(element.date);                    
                            element.date = moment(attendanceDate.toDate());                                      
                            element.in_time = moment(element.in_time);
                            if(element.out_time){
                                element.out_time = moment(element.out_time)                      
                                element.duration = (element.out_time.diff(element.in_time, 'minutes')/60).toFixed(2); 
                                element.out_time= element.out_time.format('h:mm:ss a');   
                            }else{
                                element.out_time = 0;
                                element.duration = dailyDuration;                      
                            }
                            element.in_time= element.in_time.format('h:mm:ss a');                             
                    });
                }
             },
           
        }
    }
</script>