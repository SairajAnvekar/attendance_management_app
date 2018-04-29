<template>
  <v-content>
    <v-layout>
      <app-header></app-header>       
      <v-container>        
        <h3>Users</h3>
        <v-dialog v-model="dialog2" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable>
          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="dialog2 = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Employe</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat v-if="!employe._id" @click.native="save()">Save</v-btn>
                <v-btn dark flat v-if="employe._id" @click.native="update()">Update</v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <v-list three-line subheader>
              <v-subheader>User Controls</v-subheader>

              <v-divider></v-divider>
              <v-list-tile avatar>
                <v-list-tile-content>               
                  <v-text-field prepend-icon="person" label="Employe Name " v-model="employe.name"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="person_outline" label="Employe Username " v-model="employe.username"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field :disabled="!!employe._id" prepend-icon="person_outline" label="Employe Id " v-model="employe.emp_id"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field   prepend-icon="mail" label="Employe Email " v-model="employe.email"></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="phone" label="contact No " v-model="employe.tel_no" required></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="star" label="New Password" v-model="employe.password" required></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field  prepend-icon="weekend" label="leaves" v-model="employe.leaves.privilege" required></v-text-field>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-subheader>Role</v-subheader>

              <v-radio-group v-model="employe.role">
                <v-list-tile avatar>
                  <v-list-tile-action>
                    <v-radio name='emp' :value="`employe`"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content for="emp">
                    <v-list-tile-title>Employe</v-list-tile-title>
                    <v-list-tile-sub-title>Can add there attendance and apply leave</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>

                <div v-if="role =='admin'">
                  <v-list-tile avatar>
                    <v-list-tile-action>
                      <v-radio :value="`manager`"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Manager</v-list-tile-title>
                      <v-list-tile-sub-title>Has ability to manage the team </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile avatar>
                    <v-list-tile-action>
                      <v-radio :value="`admin`"></v-radio>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Admin</v-list-tile-title>
                      <v-list-tile-sub-title>Can add Manager</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </div>
              </v-radio-group>
            </v-list>
          </v-card>
        </v-dialog>
        <v-btn color="primary" fab dark @click="create()">
          <v-icon dark>group_add</v-icon>
        </v-btn>
        <v-progress-linear v-if="tableLoading" style="margin-bottom:0" :indeterminate="true"></v-progress-linear>
        <v-data-table :headers="headers" :items="usersList" :pagination.sync="pagination" item-key="name" class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.role.toUpperCase() }}</td>
            <td class="text-xs-center">
              <router-link :to="'attendance/'+props.item._id+'/'+props.item.emp_id " style="text-decoration: none">
                <v-btn  fab outline  color="indigo lighten-1 white--text">
                  <v-icon>content_paste</v-icon>
                </v-btn>
              </router-link>
            </td>
            <td class="text-xs-center">       
                <v-btn  v-on:click="editEmploye(props.item)" outline  fab color="indigo">
                  <v-icon>edit</v-icon>
                </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-container>
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
  const dailyDuration = 8
  export default {
    data() {
      return {
        validated: 0,
        usersList: [],
        loginPage: false,
        tableLoading:false,
        dialog2: false,
        role: this.$cookie.get('role'),
        employe: {
          username: '',
          password: '',
          emp_id: '',
          email: '',
          _id: '',
          tel_no: '',
          leaves: {
           privilege : null
          },
          role: 'employe'
        },
        defaultSate: this.employe,
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
            text: 'Email',
            align: 'left',
            value: 'Action'
          },
            {
            text: 'Role',
            align: 'left',
            value: 'Role'
          },
          {
            text: 'Attendance',
            align: 'center',
            value: 'Action',
            sortable: false,
          },
          {
            text: 'Edit',
            align: 'center',
            value: 'Action',
            sortable: false,
          }
        ]
      }
    },
    mounted() {
      this.getAllUsers(),
      this.getAllRegularize()
    },
    methods: {
      getAllUsers(context) {
        this.tableLoading=true;
        Axios.get(`${apiURL}/api/v1/users/admin`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.usersList = data,
          this.tableLoading=false,
          this.handleUsers()
        ))
      },

      getAllRegularize(context) {
        Axios.get(`${apiURL}/api/v1/attendance/regularize`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          console.log(data)
        ))
      },

      create() {
        this.dialog2 = true;
        this.employe = {
          username: '',
          password: '',
          emp_id: '',
          email: '',
          _id: '',
          tel_no: '',
          role: 'employe',
          leaves: {
           privilege : null
          },
        };
      },

      editEmploye(emp) {
        delete emp.password;
        this.dialog2 = true;
        this.employe = emp;
      },
      
      save() {
        Axios.post(`${apiURL}/api/v1/signup`, this.employe)
          .then(({
            data: {
              token
            }
          }) => {
            this.getAllUsers();
          }).catch(({
            response: {
              data
            }
          }) => {})
      },

      update(context) {
        Axios.put(`${apiURL}/api/v1/user`, this.employe, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (console.log(data)))
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
