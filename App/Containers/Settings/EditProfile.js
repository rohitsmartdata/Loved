/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/EditProfile'
import {change}
  from 'redux-form'
import {getPIN}
  from '../../Redux/Reducers/AuthReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {getUserID, UserActions, getFirstName, getLastName, getUserEmail, getImageUrl, getUserImage}
  from '../../Redux/Reducers/UserReducer'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {PIN_ACTION_TYPE}
  from '../../Utility/Mapper/Auth'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.CHANGE_PASSWORD:
      dispatch(SettingActions.changePassword(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.CHANGE_PIN:
      dispatch(SettingActions.changePin(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SET_VALUE:
      dispatch(change(action['form'], action['field'], action['value']))
      break
    case localActions.NAVIGATE_TO_SCREEN:
      dispatch(UserActions.navigateUserDetailInput(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR], USER_ENTITIES.NO_RESIDENCY))
      break
    case localActions.SET_PASSCODE:
      dispatch(UserActions.setPasscode(action[COMMON_ENTITIES.NAVIGATOR], PIN_ACTION_TYPE.SET_NEW_PIN))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SET_VALUE: 'SET_VALUE',
  NAVIGATE_TO_SCREEN: 'NAVIGATE_TO_SCREEN',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  CHANGE_PIN: 'CHANGE_PIN',
  SET_PASSCODE: 'SET_PASSCODE'
}

const mapStateToProps = (state, props) => {
  const firstName = getFirstName(state.root.u)
  const lastName = getLastName(state.root.u)
  const emailID = getUserEmail(state.root.u)
  const passcode = getPIN(state.auth)
  const userID = getUserID(state.root.u)
  const imageUrl = getImageUrl(state.root.u)
  const userImage = getUserImage(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // first name of user
    firstName: firstName,
    // last name of user
    lastName: lastName,
    // passcode
    passcode: passcode,
    // password
    password: 'choudharyVictor5432',
    // email id of user
    emailID: emailID,
    userID,
    imageUrl,
    userImage
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
