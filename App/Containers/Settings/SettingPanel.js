/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 14/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/SettingPanel'
import {AuthActions, getIDToken, isLogoutProcessing}
  from '../../Redux/Reducers/AuthReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {getUserID, getFirstName, getLastName, UserActions, getDebugMode}
  from '../../Redux/Reducers/UserReducer'
import {ChildActions, childrenAvailable}
  from '../../Redux/Reducers/ChildReducer'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {SettingActions, isProcessing as isSettingProcessing}
  from '../../Redux/Reducers/SettingReducer'
import {canAddChild}
  from '../../Redux/Reducers/OnboardingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.NAVIGATE_DEEP:
      dispatch(SettingActions.navigateDeep(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.LOGOUT:
      dispatch(UserActions.resetStore())
      setTimeout(() => dispatch(AuthActions.logout(action[COMMON_ENTITIES.NAVIGATOR])), 2000)
      break
    case localActions.CLOSE_PANEL:
      dispatch(UserActions.popScreen(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_DOCUMENTS:
      dispatch(SettingActions.showDocuments(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.VIEW_TRANSFERS:
      dispatch(SettingActions.viewTransfers(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_REGULAR_TRANSFERS:
      dispatch(SettingActions.showRegularTransfers(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_CONFIRMATIONS:
      dispatch(SettingActions.showConfirmations(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_CONFIG:
      dispatch(SettingActions.showConfig(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ABOUT_US:
      dispatch(SettingActions.showAboutUs(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.NAVIGATE_TO_ABOUT_US:
      dispatch(SettingActions.navigateToAboutUS(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.FAQ:
      dispatch(SettingActions.showWebWindow(action[SETTINGS_ENTITIES.URL], action[SETTINGS_ENTITIES.HEADING], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.TRANSFER_NOW:
      dispatch(SettingActions.transferNow(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_PROFILE:
      dispatch(SettingActions.showProfile(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ADD_NEW_CHILD:
      dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.BROKER_DEALER_INFO:
      dispatch(SettingActions.navigateToBrokerDealerInfo(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SWITCH_ON_DEBUG_MODE:
      dispatch(UserActions.switchOnDebugMode(action[USER_ENTITIES.USER_ID]))
      break
    case localActions.SWITCH_OFF_DEBUG_MODE:
      dispatch(UserActions.switchOffDebugMode())
      break
    case localActions.CONNECT_BANK:
      dispatch(UserActions.navigateToConnectBank(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.NAVIGATE_TO_DEBUG_WINDOW:
      dispatch(UserActions.navigateToDebugWindow(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_PROFILE: 'NAVIGATE_TO_PROFILE',
  NAVIGATE_DEEP: 'NAVIGATE_DEEP',
  LOGOUT: 'LOGOUT',
  CLOSE_PANEL: 'CLOSE_PANEL',
  ADD_NEW_CHILD: 'ADD_NEW_CHILD',
  SHOW_DOCUMENTS: 'SHOW_DOCUMENTS',
  VIEW_TRANSFERS: 'VIEW_TRANSFERS',
  SHOW_REGULAR_TRANSFERS: 'SHOW_REGULAR_TRANSFERS',
  SHOW_CONFIRMATIONS: 'showConfirmations',
  SHOW_CONFIG: 'SHOW_CONFIG',
  ABOUT_US: 'ABOUT_US',
  FAQ: 'FAQ',
  TRANSFER_NOW: 'TRANSFER_NOW',
  SHOW_PROFILE: 'SHOW_PROFILE',
  BROKER_DEALER_INFO: 'BROKER_DEALER_INFO',
  SWITCH_ON_DEBUG_MODE: 'SWITCH_ON_DEBUG_MODE',
  SWITCH_OFF_DEBUG_MODE: 'SWITCH_OFF_DEBUG_MODE',
  CONNECT_BANK: 'CONNECT_BANK',
  NAVIGATE_TO_DEBUG_WINDOW: 'NAVIGATE_TO_DEBUG_WINDOW',
  NAVIGATE_TO_ABOUT_US: 'NAVIGATE_TO_ABOUT_US'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // id token
  const idToken = getIDToken(state.auth)
  // first name
  let firstName = getFirstName(state.root.u)
  // last name
  let lastName = getLastName(state.root.u)
  // is statements/confirmations fetch processing
  let isFetchProcessing = isSettingProcessing(state.util)
  // debug mode
  let debugMode = getDebugMode(state.root.u)
  // children available
  let childAvailable = childrenAvailable(state.root.children)
  // can add child
  let addChildPossible = canAddChild(state.onboard, userID)

  let isLogoutHappening = isLogoutProcessing(state.auth)

  return {
    // send local actions for (presentation <--> container)
    localActions,
    // user id
    userID,
    // first name of user
    firstName,
    // last name of user
    lastName,
    // id token
    idToken,
    // is fetch processing
    isFetchProcessing,
    // debug mode
    debugMode,
    // child available
    childAvailable,
    // is logout processing
    isLogoutHappening,
    // can add child
    addChildPossible: childAvailable || addChildPossible
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
