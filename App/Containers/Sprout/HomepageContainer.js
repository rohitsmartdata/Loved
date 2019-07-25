/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by viktor on 14/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Sprout/HomepageContainer'
import {ChildActions, isProcessing, getChildren}
  from '../../Redux/Reducers/ChildReducer'
import {isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {
  isUserProcessing, getUserID, getUserEmail, UserActions, getNavTab
}
  from '../../Redux/Reducers/UserReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {AuthActions, getIDToken}
  from '../../Redux/Reducers/AuthReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type} = action
  switch (type) {
    case localActions.ADD_ACCOUNT:
      dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.NAVIGATE_TO:
      dispatch(SettingActions.navigateTo(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ADD_NEW_CHILD:
      dispatch(ChildActions.addNewChild(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.NAVIGATOR], action[COMMON_ENTITIES.CAN_SKIP], action[COMMON_ENTITIES.SKIP_SCREEN]))
      break
    case localActions.LOGOUT:
      dispatch(UserActions.resetStore())
      setTimeout(() => dispatch(AuthActions.logout(action[COMMON_ENTITIES.NAVIGATOR], true)), 2000)
      break
    case localActions.SHOW_DOCUMENTS:
      dispatch(SettingActions.showDocuments(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.RESET_NAV_TAB:
      dispatch(UserActions.setNavTab(undefined))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_ACCOUNT: 'ADD_ACCOUNT',
  NAVIGATE_TO: 'NAVIGATE_TO',
  ADD_NEW_CHILD: 'ADD_NEW_CHILD',
  SHOW_DOCUMENTS: 'SHOW_DOCUMENTS',
  LOGOUT: 'LOGOUT',
  RESET_NAV_TAB: 'resetNavTab'
}

const mapStateToProps = (state, props) => {
  const goalProcessing = isGoalProcessing(state.root.goal)
  const childProcessing = isProcessing(state.root.children)
  const userProcessing = isUserProcessing(state.root.u)

  const navTab = getNavTab(state.root.u)

  let emailID = getUserEmail(state.root.u)
  let children = getChildren(state.root.children)
  let childIDs = (children && Object.keys(children)) || []
  let userID = getUserID(state.root.u)
  let childrenAvailable = childIDs.length > 0

  let shouldRefresh = props[USER_ENTITIES.SHOULD_REFRESH]
  let newChildID = props[CHILD_ENTITIES.CHILD_ID]
  // id token
  const idToken = getIDToken(state.auth)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    isProcessing: goalProcessing && childProcessing && userProcessing,

    children: children,
    childIDs: childIDs,
    navTab,
    userID: userID,
    childrenAvailable: childrenAvailable,
    shouldRefresh,
    newChildID,
    emailID: emailID,
    idToken
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
