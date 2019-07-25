/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 7/7/17.
 */

// ========================================================
// Import Packages
// ========================================================
import React from 'react'
import {Alert} from 'react-native'
import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Common/Login'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {AuthActions, isProcessing, getError} from '../../Redux/Reducers/AuthReducer'
import {SettingActions} from '../../Redux/Reducers/SettingReducer'
import { FORM_TYPES } from '../../Config/contants'
import { change } from 'redux-form'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.SIGNUP:
      dispatch(AuthActions.signup(action[AUTH_ENTITIES.EMAIL], action[AUTH_ENTITIES.PASSWORD], action[COMMON_ENTITIES.NAVIGATOR], dispatch))
      break

    case localActions.LOGIN:
      dispatch(AuthActions.login(action[AUTH_ENTITIES.EMAIL], action[AUTH_ENTITIES.PASSWORD], action[COMMON_ENTITIES.NAVIGATOR], dispatch, false))
      break

    case localActions.HIDE_ERROR:
      dispatch(AuthActions.disableError())
      break

    case localActions.FORGOT_PASSWORD:
      dispatch(SettingActions.forgotPassword(action[COMMON_ENTITIES.NAVIGATOR], dispatch))
      break

    case localActions.REMOVE_VALUE:
      dispatch(change(action['form'], action['field'], action['value']))
      break
    default:
    // console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  HIDE_ERROR: 'HIDE_ERROR',
  REMOVE_VALUE: 'REMOVE_VALUE',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD'
}

// Todo:-
// get authentication 'type' via props via navigation stack
const mapStateToProps = (state, props) => {
  const processing = isProcessing(state.auth)
  const error = getError(state.auth)
  let type = props[AUTH_ENTITIES.AUTH_TYPE]
  let errorObj = (error && (error.error || error)) || undefined

  let showEmailError = (state.form[FORM_TYPES.AUTH] && state.form[FORM_TYPES.AUTH]['fields'] && state.form[FORM_TYPES.AUTH]['fields'][AUTH_ENTITIES.EMAIL] && state.form[FORM_TYPES.AUTH]['fields'][AUTH_ENTITIES.EMAIL]['touched'])
  let showPasswordError = (state.form[FORM_TYPES.AUTH] && state.form[FORM_TYPES.AUTH]['fields'] && state.form[FORM_TYPES.AUTH]['fields'][AUTH_ENTITIES.PASSWORD] && state.form[FORM_TYPES.AUTH]['fields'][AUTH_ENTITIES.PASSWORD]['touched'])

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    isProcessing: processing,

    errorObj: errorObj,

    type: type === AUTH_ENTITIES.SIGNUP ? localActions.SIGNUP : localActions.LOGIN,

    heading: type === AUTH_ENTITIES.SIGNUP ? 'Welcome! What\'s your email?' : 'Welcome! Enter your email.',
    showEmailError,
    showPasswordError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLocalAction: (actionType, navigation) => handleLocalAction(dispatch, actionType, navigation)
  }
}

// ========================================================
// Connect & Export
// ========================================================

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
