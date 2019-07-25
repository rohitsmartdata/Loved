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
  from '../../Components/Common/SignUpEmail'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {AuthActions, isProcessing, getError} from '../../Redux/Reducers/AuthReducer'
import {SettingActions} from '../../Redux/Reducers/SettingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.NAVIGATE:
      dispatch(AuthActions.navigate(action[AUTH_ENTITIES.AUTH_TYPE], action[COMMON_ENTITIES.NAVIGATOR], action[AUTH_ENTITIES.EMAIL]))
      break

    case localActions.HIDE_ERROR:
      dispatch(AuthActions.disableError())
      break

    default:
      // console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE: 'NAVIGATE',
  HIDE_ERROR: 'HIDE_ERROR'
}

// Todo:-
// get authentication 'type' via props via navigation stack
const mapStateToProps = (state, props) => {
  const processing = isProcessing(state.auth)
  const error = getError(state.auth)
  let type = props[AUTH_ENTITIES.AUTH_TYPE]
  let errorObj = (error && (error.error || error)) || undefined
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    isProcessing: processing,

    errorObj: errorObj,

    type: type === AUTH_ENTITIES.SIGNUP ? localActions.SIGNUP : localActions.LOGIN,

    heading: type === AUTH_ENTITIES.SIGNUP ? 'Welcome! What\'s your email?' : 'Welcome! Enter your email.'
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
