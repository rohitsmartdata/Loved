
// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/EditProfile'
import {
  getFirstName,
  getImageUrl,
  getLastName,
  getUserEmail,
  getUserID, getUserImage,
  getUserPhoneNumber,
  getUserImageProcessing,
  UserActions, getDebugMode
} from '../../Redux/Reducers/UserReducer'
import { AuthActions, getPIN, isLogoutProcessing } from '../../Redux/Reducers/AuthReducer'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import { isProcessing as isSettingProcessing, SettingActions } from '../../Redux/Reducers/SettingReducer'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { childrenAvailable } from '../../Redux/Reducers/ChildReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.LOGOUT:
      dispatch(UserActions.resetStore())
      setTimeout(() => dispatch(AuthActions.logout(action[COMMON_ENTITIES.NAVIGATOR])), 2000)
      break
    case localActions.CHANGE_PASSWORD:
      dispatch(SettingActions.changePassword(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.CHANGE_PIN:
      dispatch(SettingActions.changePin(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SWITCH_ON_DEBUG_MODE:
      dispatch(UserActions.switchOnDebugMode(action[USER_ENTITIES.USER_ID]))
      break
    case localActions.SWITCH_OFF_DEBUG_MODE:
      dispatch(UserActions.switchOffDebugMode())
      break
    case localActions.NAVIGATE_TO_DEBUG_WINDOW:
      dispatch(UserActions.navigateToDebugWindow(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.BROKER_DEALER_INFO:
      dispatch(SettingActions.navigateToBrokerDealerInfo(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  LOGOUT: 'LOGOUT',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  CHANGE_PIN: 'CHANGE_PIN',
  NAVIGATE_TO_DEBUG_WINDOW: 'NAVIGATE_TO_DEBUG_WINDOW',
  BROKER_DEALER_INFO: 'BROKER_DEALER_INFO',
  SWITCH_ON_DEBUG_MODE: 'SWITCH_ON_DEBUG_MODE',
  SWITCH_OFF_DEBUG_MODE: 'SWITCH_OFF_DEBUG_MODE'
}

const mapStateToProps = (state) => {
  // first name
  let firstName = getFirstName(state.root.u) || ''
  // last name
  let lastName = getLastName(state.root.u) || ''

  let isLogoutHappening = isLogoutProcessing(state.auth)
  // is statements/confirmations fetch processing
  let isFetchProcessing = isSettingProcessing(state.util)
  const emailID = getUserEmail(state.root.u)
  const phoneNumber = getUserPhoneNumber(state.root.u)
  const passcode = getPIN(state.auth)
  const userID = getUserID(state.root.u)
  const imageUrl = getImageUrl(state.root.u)
  const userImage = getUserImage(state.root.u)
  const userImageProcessing = getUserImageProcessing(state.root.u)
  // debug mode
  let debugMode = getDebugMode(state.root.u)
  // children available
  let childAvailable = childrenAvailable(state.root.children)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    firstName,
    lastName,
    isFetchProcessing,
    isLogoutHappening,
    emailID,
    phoneNumber,
    passcode,
    userID,
    imageUrl,
    userImage,
    userImageProcessing,
    debugMode,
    childAvailable
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
