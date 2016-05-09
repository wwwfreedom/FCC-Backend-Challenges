import { createAction } from 'redux-actions'
import axios from 'axios'
import { push } from 'react-router-redux'

const ROOT_URL = 'http://localhost:3090'

// ------------------------------------
// Constants
// ------------------------------------

export const AUTHENTICATION_START = "AUTHENTICATION_START"
export const AUTHENTICATION_COMPLETE = "AUTHENTICATION_COMPLETE"
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR"

// ------------------------------------
// Actions
// ------------------------------------

export const authenticationStart = createAction(AUTHENTICATION_START)
export const authenticationComplete = createAction(AUTHENTICATION_COMPLETE)
export const authenticationError = createAction(AUTHENTICATION_ERROR, (error) => error)

// ------------------------------------
// Thunk Actions
// ------------------------------------

export const emailSignIn = ({email, password}) => (dispatch, getState) => {
  dispatch(authenticationStart())
  // submit email password to server
  axios.post(`${ROOT_URL}/api/signin`, { email, password })
  // if request is good...
  .then((response) => {
    // save the JWT token to local storage
    localStorage.setItem('token', response.headers['access-token'])
    // update state to indicate user is authenticated
    setTimeout(function() {
      dispatch(authenticationComplete())
      // redirect to the route /feature
      dispatch(push('/'))
    }, 300) // add slight delay for loader to draw for ux
  })
  .catch((error) => {
    // error case when Api server is down
    if (error instanceof Error && error.message.includes('Network')) {
      dispatch(authenticationError({
        message: `Sorry there's a ${error.message}. Please retry again later.`,
        status: true
      }))
    } else { // if request is bad...
      dispatch(authenticationError({
        message: error.data.errors[0],
        status: true
      }))
    }
  })
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [AUTHENTICATION_START]: (state) => ({
    ...state,
    loading: true,
    error: { message: '', status: false } // reset error on auth start
  }),
  [AUTHENTICATION_COMPLETE]: (state) => ({
    ...state,
    loading: false,
    authenticated: true
  }),
  [AUTHENTICATION_ERROR]: (state, action) => ({
    ...state,
    error: action.payload,
    loading: false
  })
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  authenticated: false,
  loading: false,
  error: {
    message: '',
    status: false
  }
}

export default function Auth(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}