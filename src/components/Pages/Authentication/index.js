import Axios from 'axios'
import router from '@/router'

const apiURL = 'http://localhost:3001' // 'https://focus-budget-manager-api.herokuapp.com'

export default {
  user: { authenticated: false },
  authenticate (context, credentials, redirect) {
    Axios.post(`${apiURL}/api/v1/auth`, credentials)
      .then(({data}) => {
        context.$cookie.set('token', data.token, '1D')
        context.$cookie.set('emp_id', data.user.emp_id, '1D')
        context.validLogin = true
        this.user.authenticated = true
        if (redirect) router.push(redirect)
      }).catch(({response: {data}}) => {
        context.snackbar = true
        context.message = data.message
      })
  },
  signout (context, redirect) {
    context.$cookie.delete('token')
    this.user.authenticated = false

    if (redirect) router.push(redirect)
  },
  signup (context, credentials, redirect) {
    Axios.post(`${apiURL}/api/v1/signup`, credentials)
      .then(({data: {token}}) => {
        context.$cookie.set('token', token, '1D')
        context.validSignUp = true
        this.user.authenticated = true
        this.authenticate(context, credentials, redirect)
      // if (redirect) router.push(redirect)
      }).catch(({response: {data}}) => {
        context.snackbar = true
        context.message = data.message
      })
  },

  checkAuthentication () {
    const token = document.cookie
    this.user.authenticated = !!token
  },

  getAuthenticationHeader (context) {
    return `Bearer ${context.$cookie.get('token')}`
  }
}