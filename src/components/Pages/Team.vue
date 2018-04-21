<template>
  <v-content>
    <v-layout>
      <app-header></app-header>
      <v-container>

        <v-dialog v-model="teamDialog" fullscreen transition="dialog-bottom-transition" :overlay="false" scrollable>
          <v-card>
            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="teamDialog = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Team</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat @click.native="create()">Save</v-btn>
                <v-btn dark flat>Update</v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <v-list three-line subheader>

              <v-subheader>Team Controls</v-subheader>

              <v-divider></v-divider>
              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field label='Team Name' v-model='team.name'>
                  </v-text-field>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-text-field label='Team Desc' v-model='team.desc'>
                  </v-text-field>
                </v-list-tile-content>
              </v-list-tile>


              <v-list-tile avatar>
                <v-list-tile-content>
                  <v-flex xs12>
                    <v-select label="Select" :items="usersList" v-model="team.members" item-text="username" item-value="_id" multiple chips max-height="300"
                      autocomplete>
                      <template slot="selection" slot-scope="data">
                        <v-chip close @input="data.parent.selectItem(data.item)" :selected="data.selected" class="chip--select-multi" :key="JSON.stringify(data.item)">
                          <v-avatar class='teal'>
                            <span class="white--text"> {{ data.item.username.charAt(0).toUpperCase() }}</span>
                          </v-avatar>
                          {{ data.item.username }}
                        </v-chip>

                      </template>
                      <template slot="item" slot-scope="data">
                        <template v-if="typeof data.item !== 'object'">
                          <v-list-tile-content v-text="data.item"></v-list-tile-content>
                        </template>
                        <template v-else>
                          <v-list-tile-avatar class="dropdown_avatar">
                            <span class="white--text"> {{ data.item.username.charAt(0).toUpperCase() }}</span>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.username"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="data.item.username"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </template>
                      </template>
                    </v-select>
                  </v-flex>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

            <v-list two-line>
              <v-subheader>Teams</v-subheader>
              <template v-for="(id, index) in team.members">

                <v-divider :inset="true" :key="index"></v-divider>
                <v-list-tile avatar :key="id" @click="">
                  <v-list-tile-avatar>
                    <span class="red--text"> {{usersListMap[id].username.charAt(0)}}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="usersListMap[id].username"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="usersListMap[id].username"></v-list-tile-sub-title>
                  </v-list-tile-content>             
                </v-list-tile>
              </template>
            </v-list>


          </v-card>
        </v-dialog>
        <v-btn color="primary" @click.native="openDialog" fab dark>
          <v-icon dark>group_add</v-icon>
        </v-btn>

        <v-list two-line>
          <v-subheader>Teams</v-subheader>
          <template v-for="(team, index) in teams" >

            <v-divider :inset="true" :key="index"></v-divider>
            <v-list-tile avatar :key="team.name">
              <v-list-tile-avatar>
                <span class="red--text"> {{team.name.charAt(0)}}</span>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="team.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="team.name"></v-list-tile-sub-title>
              </v-list-tile-content>
                   <v-list-tile-action>
                  <router-link :to="'teamInfo/'+team._id " style="text-decoration: none">
                 <v-btn  >View</v-btn>  
                  </router-link>          
                  </v-list-tile-action>
                  <v-list-tile-action>
                     <v-btn  @click="editTeam(team)" >Edit</v-btn>                       
                  </v-list-tile-action>
                  <v-list-tile-action>
                   <v-btn  @click="editTeam(team)" >Delete</v-btn>                       
                  </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>

      </v-container>
      <app-footer></app-footer>
    </v-layout>
  </v-content>
</template>
<script>
  import Authentication from '@/components/pages/Authentication'
  import Axios from 'axios'
  import APIurlConfig from '../../apiConfig'
  const apiURL = APIurlConfig.API_URL
  export default {
    data() {
      return {
        teamDialog: false,
        team: {
          name: null,
          members: []
        },
        user: {
          username: this.$cookie.get('username'),
          password: '',
          emp_id: ''
        },
        usersList: [],
        usersListMap: {},
        teams: [],
      }
    },
    mounted() {
      this.getAllUsers(),
        this.getAllTeams(),
        this.getAllTeamsMember()
    },
    methods: {
      create() {
        this.team.manager_id = this.$cookie.get('id'),
        Axios.post(`${apiURL}/api/v1/manage/team`, this.team, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.teams.push(data.team),
          this.teamDialog = false        
        ));
      },

      getAllUsers(context) {
        Axios.get(`${apiURL}/api/v1/users/admin`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.usersList = data,
          data.forEach((user) => {
            this.usersListMap[user._id] = user
          })
        ))
      },

      test(test){
        console.log(test);
      },

      editTeam(team){
       this.team = team;
       this.teamDialog = true;
      },
      openDialog (){
        this.teamDialog = true;
        this.team = {    name: null,
          members: []}
      },

         getAllTeamsMember(context) {
        Axios.get(`${apiURL}/api/v1/manage/team/members`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },
          params: {
            manager_id: this.$cookie.get('id'),
          }
        }).then(({
          data
        }) => (
          console.log(data)
        ))
      },
      getAllTeams(context) {
        Axios.get(`${apiURL}/api/v1/manage/team`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          },
          params: {
            manager_id: this.$cookie.get('id'),
          }
        }).then(({
          data
        }) => (
          this.teams = data
        ))
      }
    }
  }

</script>
<style>
  .dropdown_avatar .avatar {
    background-color: #009688 !important;
    border-color: #009688 !important;
  }

</style>
