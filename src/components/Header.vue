<template>
  <header class="l-header-container">
    <v-layout row wrap>
      <v-flex xs12 offset-md1 md1>
        <v-btn block color="red lighten-1 white--text" @click.native="submitSignout()">Sign out</v-btn>
      </v-flex>
    </v-layout>
  </header>
</template>

<script>
import Authentication from '@/components/pages/Authentication'
export default {
  data () {
    return {
      search: '',
      status: '',     
    }
  },
  methods: {
    submitSignout () {
      Authentication.signout(this, '/login')
    }
  }
}
</script>

<style lang="scss">
  @import "./../assets/styles";
</style>
