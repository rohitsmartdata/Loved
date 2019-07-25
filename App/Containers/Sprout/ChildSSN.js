/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 16/10/17.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect } from 'react-redux'
import Screen from '../../Components/Sprout/ChildSSN'
import { SPROUT } from '../../Utility/Mapper/Screens'
import { ChildActions, isProcessing, isChildSSNAdded, getFirstName as getChildsFirstName, getAvailableChildID, isChildSSNRequested, isCreatingChildAccount, getTotalChildren } from '../../Redux/Reducers/ChildReducer'
import { getUserEmail, isUserDetailProcessing, getFirstName, UserActions, isStoreUserSSNProcessing, getUserID, getCrossedChildSSN, isUserSSNAdded } from '../../Redux/Reducers/UserReducer'
import { OnboardingActions } from '../../Redux/Reducers/OnboardingReducer'
import { getImageMetadata, SettingActions } from '../../Redux/Reducers/SettingReducer'
import { getIDToken } from '../../Redux/Reducers/AuthReducer'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import {FORM_TYPES} from '../../Config/contants'
import { analytics } from '../../Config/AppConfig'
import {screens, events} from '../../Utility/Mapper/Tracking'
import { change, reset } from 'redux-form'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action

  switch (type) {
    case localActions.ADD_CHILD_SSN:
      dispatch(ChildActions.submitChildAccount(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        undefined,
        action[CHILD_ENTITIES.SSN],
        action[COMMON_ENTITIES.NAVIGATOR],
        action[CHILD_ENTITIES.IS_ADDING_DESIRE],
        action[CHILD_ENTITIES.IS_ADDING_DREAM],
        action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
      ))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.USER_ENTERED_CHILD_SSN
      })
      // *********** Log Analytics ***********
      break
    case localActions.SKIP_CHILD_SSN:
      dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      const userSSN = action[USER_ENTITIES.SSN]
      if (userSSN) {
        dispatch(UserActions.storeUserSsn(action[USER_ENTITIES.USER_ID], userSSN, action[COMMON_ENTITIES.NAVIGATOR]))
      } else {
        dispatch(UserActions.navigateToDashboard(action[COMMON_ENTITIES.NAVIGATOR]))
      }
      // // *********** Log Analytics ***********
      analytics.screen({
        userId: action[USER_ENTITIES.USER_ID],
        name: screens.SKIP_CHILD_SSN
      })
      // *********** Log Analytics ***********
      break
    case localActions.REQUEST_CHILD_SSN:
      if (action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]) {
        dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.CHILD_SSN_SCREEN))
      }
      dispatch(UserActions.markSsnRequest(
        action[USER_ENTITIES.USER_ID],
        action[COMMON_ENTITIES.NAVIGATOR],
        true,
        action[CHILD_ENTITIES.CHILD_ID],
        action[CHILD_ENTITIES.SSN_REQUEST_PHONE_NUMBER],
        action[CHILD_ENTITIES.UNIQUE_CODE],
        action[USER_ENTITIES.EMAIL_ID],
        action[CHILD_ENTITIES.UNIQUE_URL],
        action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
      ))
      break
    case localActions.ON_BACK:
      if (action['value']) {
        dispatch(change(action['form'], action['field'], action['value']))
      }
      dispatch(UserActions.popScreen(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.REFRESH_STATE:
      dispatch(UserActions.fetchUser(action[USER_ENTITIES.USER_ID], COMMON_ENTITIES.NAVIGATOR))
      break
    case localActions.AUTO_NAVIGATE_ONBOARDING:
      dispatch(ChildActions.autoNavigateOnboarding(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.IS_ONBOARDING_FLOW], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.CHILD_SSN_SCREEN))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_CHILD_SSN: 'addChildSSN',
  REFRESH_STATE: 'REFRESH_STATE',
  REQUEST_SSN: 'REQUEST_SSN',
  SKIP_CHILD_SSN: 'skipChildSSN',
  REQUEST_CHILD_SSN: 'requestChildSSN',
  ON_BACK: 'onBack',
  AUTO_NAVIGATE_ONBOARDING: 'AUTO_NAVIGATE_ONBOARDING',
  UPDATE_CURRENT_ONBOARDING: 'UPDATE_CURRENT_ONBOARDING'
}

const mapStateToProps = (state, props) => {
  // get user's unique ID
  const userID = getUserID(state.root.u)
  // get user's unique ID
  const childID = props[CHILD_ENTITIES.CHILD_ID] || getAvailableChildID(state.root.children)
  // get user email
  const email = getUserEmail(state.root.u)
  // get whether add child is processing or not
  const processing = isCreatingChildAccount(state.root.children) || isStoreUserSSNProcessing(state.root.u)
  // is adding desire
  const isAddingDesire = props[CHILD_ENTITIES.IS_ADDING_DESIRE]
  // is adding dream
  const isAddingDream = props[CHILD_ENTITIES.IS_ADDING_DREAM]
  // is child ssn added
  const isSSNAdded = isChildSSNAdded(state.root.children, childID)
  // is child ssn requested
  const isSSNRequested = isChildSSNRequested(state.root.children, childID)
  // user ssn
  const userSSN = state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_CHILD].values && state.form[FORM_TYPES.ADD_CHILD].values[USER_ENTITIES.SSN]
  // child ssn
  const childSSN = state.form[FORM_TYPES.ADD_CHILD] && state.form[FORM_TYPES.ADD_CHILD].values && state.form[FORM_TYPES.ADD_CHILD].values[CHILD_ENTITIES.SSN]
  // is onboarding process
  const isOnboardingFlow = props[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
  // is user detail processing
  let userDetailProcessing = isUserDetailProcessing(state.root.u)

  let userName = getFirstName(state.root.u)
  let childName = getChildsFirstName(state.root.children, childID)

  let crossedSSN = getCrossedChildSSN(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    userID: userID,
    childID: childID,
    isProcessing: processing || userDetailProcessing,
    emailID: email,
    userSSN,
    childSSN,
    isAddingDream,
    isAddingDesire,
    isSSNRequested,
    isSSNAdded,
    userName,
    childName,
    isOnboardingFlow
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
