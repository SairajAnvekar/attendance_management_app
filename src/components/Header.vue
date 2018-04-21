
<template>
  <header class="l-header-container">
      <v-navigation-drawer fixed v-model="drawer" app>
      <v-list dense>       
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <router-link to="/">
              <v-list-tile-title>Home</v-list-tile-title>
            </router-link>
          </v-list-tile-content>
        </v-list-tile>

         <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <router-link to="/leave">
              <v-list-tile-title>Leave</v-list-tile-title>
            </router-link>
          </v-list-tile-content>
        </v-list-tile>
       
           <v-list-tile  @click="">
            <v-list-tile-action>
              <v-icon>contact_mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <router-link to="/edit">
                  <v-list-tile-title>Edit </v-list-tile-title>
               </router-link>
            </v-list-tile-content>
          </v-list-tile>

           <v-list-tile v-if="role =='admin' || role == 'manager'" @click="">
            <v-list-tile-action>
              <v-icon>contact_mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <router-link to="/approvals">
                  <v-list-tile-title>approvals </v-list-tile-title>
               </router-link>
            </v-list-tile-content>
          </v-list-tile>


          <v-list-tile v-if="role =='admin' || role == 'manager'" @click="">
            <v-list-tile-action>
              <v-icon>contact_mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <router-link to="/teams">
              <v-list-tile-title>Teams</v-list-tile-title>
              </router-link>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="role =='admin' || role == 'manager'" @click="">
            <v-list-tile-action>
              <v-icon>contact_mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <router-link to="/adminView">
              <v-list-tile-title>AdminView</v-list-tile-title>
              </router-link>
            </v-list-tile-content>
          </v-list-tile>
      </v-list>
      
      
    </v-navigation-drawer>      

    <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Application</v-toolbar-title>
         <v-spacer></v-spacer>
         <v-toolbar-items>
          <v-btn icon large @click.native="submitSignout()">
            <v-icon>exit_to_app</v-icon>          
          </v-btn>        
      </v-toolbar-items>   
    </v-toolbar>
  </header>
</template>
<!--v-layout row wrap>
    <v-flex xs12 offset-md1 md1>
      <v-btn block color="red lighten-1 white--text" @click.native="submitSignout()">Sign out</v-btn>
    </v-flex>
  </v-layout -->

<script>
import Authentication from '@/components/pages/Authentication'
export default {
  data () {
    return {
      search: '',
      status: '',     
      drawer: null,
      role: this.$cookie.get('role')
    }
  },
  methods: {
    submitSignout () {
      Authentication.signout(this, '/login')
    }
  },
  props: {
      source: String
    }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
</style>
