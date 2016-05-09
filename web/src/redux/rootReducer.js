import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import auth from 'redux/auth/authenticate'

export default combineReducers({
  router,
  auth,
  form
})
