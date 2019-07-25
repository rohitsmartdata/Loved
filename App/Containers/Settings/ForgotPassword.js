/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 17/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React from 'react'
import { Alert } from 'react-native'
import { connect } from 'react-redux'
import Screen from '../../Components/Settings/ForgotPassword'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import {getUserID} from '../../Redux/Reducers/UserReducer'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import { SettingActions, getError, isProcessing, isEmailVerified, getVerifiedEmail } from '../../Redux/Reducers/SettingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action
  switch (type) {
    case localActions.FORGOT_PASSWORD:
      dispatch(SettingActions.processForgotPassword(action[AUTH_ENTITIES.EMAIL], action[COMMON_ENTITIES.NAVIGATOR], dispatch, action[USER_ENTITIES.USER_ID]))
      break
    case localActions.CONFIRM_PASSWORD:
      dispatch(
        SettingActions.processConfirmPassword(
          action[AUTH_ENTITIES.EMAIL],
          action[AUTH_ENTITIES.VERIFICATION_CODE],
          action[AUTH_ENTITIES.PASSWORD],
          action[COMMON_ENTITIES.NAVIGATOR],
          dispatch
        )
      )
      break
    case localActions.HIDE_ERROR:
      dispatch(SettingActions.disableError())
      break
    case localActions.RESET_FORGOT_PASSWORD_EMAIL:
      dispatch(SettingActions.resetForgotPasswordEmail())
      break
    default:
    // console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  CONFIRM_PASSWORD: 'CONFIRM_PASSWORD',
  RESET_FORGOT_PASSWORD_EMAIL: 'RESET_FORGOT_PASSWORD_EMAIL'
}

// Todo:-
// get authentication 'type' via props via navigation stack
const mapStateToProps = (state, props) => {
  let email = getVerifiedEmail(state.util)
  const isAuthProcessing = isProcessing(state.util)
  const error = getError(state.util)
  const isVerified = isEmailVerified(state.util)
  const userID = getUserID(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions,

    email,

    isProcessing: isAuthProcessing,

    errorObj: error,

    isVerified,

    // user id
    userID
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleLocalAction: (actionType, navigation) => handleLocalAction(dispatch, actionType, navigation)
  }
}

// ========================================================
// Connect & Export
// ========================================================

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
