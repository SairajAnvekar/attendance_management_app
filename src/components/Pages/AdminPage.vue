<template>
        <v-content>
            
                <v-layout>
                        <app-header></app-header>
                    <!-- div md8 -->
                        <v-container >
                        <h3>Admin Page</h3>
                        <v-data-table
                        :headers="headers"
                        :items="usersList"
                        :pagination.sync="pagination"
                        item-key="name"
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                        <td>{{ props.item.username }}</td>
                        <td class="text-xs-center"><v-btn  color="blue" @click.native="">view</v-btn></td>
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
            usersList: [],
            loginPage : false,
            pagination: {
                sortBy: 'date'
            },
            headers: [
                {
                    text: 'Username',
                    align: 'left',
                    sortable: false,
                    value: 'username'
                },
                { text: 'Action', align: 'center', value: 'Action' }
                ]
        }
        },
        mounted () {
        this.getAllUsers()
        },
        methods: {
        getAllUsers (context) {
            Axios.get(`${apiURL}/api/v1/users/admin`, {
            headers: {
                'Authorization': Authentication.getAuthenticationHeader(this)
            }
            }).then(({data}) => (
                this.usersList = data,
                    this.handleUsers()
                ))

        },
        toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
        },
        handleUsers(){
            console.log(this.usersList)
        }

        }
    }
</script>