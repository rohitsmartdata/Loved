/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 13/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React
  from 'react'
import {Alert}
  from 'react-native'
import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Common/LoginPin'
import {AUTH_ENTITIES, PIN_VERIFICATION_TYPE}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {AuthActions, getError, getPIN, isLogoutProcessing}
  from '../../Redux/Reducers/AuthReducer'
import {getUserEmail, UserActions, getUserID}
  from '../../Redux/Reducers/UserReducer'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import moment
  from 'moment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.REGISTER_PIN:
      const goToHomepage = action[AUTH_ENTITIES.GO_TO_HOMEPAGE]
      if (goToHomepage) {
        dispatch(AuthActions.registerPin(action[AUTH_ENTITIES.PIN], action[USER_ENTITIES.EMAIL_ID], action[AUTH_ENTITIES.PIN_ACTION_TYPE], action[COMMON_ENTITIES.NAVIGATOR], dispatch, goToHomepage))
      } else {
        dispatch(AuthActions.registerPin(action[AUTH_ENTITIES.PIN], action[USER_ENTITIES.EMAIL_ID], action[AUTH_ENTITIES.PIN_ACTION_TYPE], action[COMMON_ENTITIES.NAVIGATOR], dispatch, goToHomepage))
      }
      break

    case localActions.TOGGLE_TOUCH_ID:
      dispatch(AuthActions.showTouchId(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.LOGIN_SUCCESS:
      dispatch(AuthActions.passcodeLogin(action[USER_ENTITIES.EMAIL_ID], action[COMMON_ENTITIES.NAVIGATOR], dispatch))
      break

    case localActions.LOGOUT:
      dispatch(UserActions.resetStore())
      setTimeout(() => dispatch(AuthActions.logout(action[COMMON_ENTITIES.NAVIGATOR], true)), 2000)
      break

    case localActions.HIDE_ERROR:
      dispatch(AuthActions.disableError())
      break

    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.LOGIN_PIN))
      break

    case localActions.FETCH_USER:
      dispatch(UserActions.fetchUser(action[USER_ENTITIES.USER_ID]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  BUTTON_PRESSED: 'BUTTON_PRESSED',
  TOGGLE_TOUCH_ID: 'TOGGLE_TOUCH_ID',
  REGISTER_PIN: 'REGISTER_PIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  FETCH_USER: 'FETCH_USER',
  LOGOUT: 'LOGOUT',
  HIDE_ERROR: 'HIDE_ERROR',
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  const future = moment('2017/07/03', 'YYYY/MM/DD').add(18, 'y')
  let now = moment()
  let weeks = future.diff(now, 'weeks')
  let username = getUserEmail(state.root.u)
  let pin = getPIN(state.auth)
  let processing = false
  const error = getError(state.auth)
  let errorObj = (error && error.error) || undefined

  let userID = getUserID(state.root.u) || undefined
  let emailID = getUserEmail(state.root.u)

  let goToHomepage = props[AUTH_ENTITIES.GO_TO_HOMEPAGE]

  let isLogoutHappening = isLogoutProcessing(state.auth)

  let popButton = props[COMMON_ENTITIES.CAN_POP] || false

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    username: username,

    firstPIN: pin,

    processing: processing,

    errorObj: errorObj,

    isTouchID: true,

    userID: userID,

    goToHomepage: goToHomepage,

    emailID,

    isLogoutHappening,

    popButton
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
