/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/9/18.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect } from 'react-redux'
import Screen from '../../Components/Sprout/UserSSN'
import { SPROUT } from '../../Utility/Mapper/Screens'
import { ChildActions, isProcessing, getTotalChildren, getSingularChildID } from '../../Redux/Reducers/ChildReducer'
import { getUserEmail, getUserID, isStoreUserSSNProcessing, isUserSSNAdded, UserActions } from '../../Redux/Reducers/UserReducer'
import { OnboardingActions } from '../../Redux/Reducers/OnboardingReducer'
import { getImageMetadata } from '../../Redux/Reducers/SettingReducer'
import { getIDToken } from '../../Redux/Reducers/AuthReducer'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { FORM_TYPES } from '../../Config/contants'
import { analytics } from '../../Config/AppConfig'
import {screens, events} from '../../Utility/Mapper/Tracking'
import { change } from 'redux-form'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action

  switch (type) {
    case localActions.NAVIGATE_TO_CHILD_SSN:
      dispatch(change(action['form'], action['field'], action['value']))
      dispatch(UserActions.storeUserSsn(
        action[USER_ENTITIES.USER_ID],
        action[USER_ENTITIES.SSN],
        action[COMMON_ENTITIES.NAVIGATOR],
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      ))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.USER_ENTERED_SSN
      })
      // *********** Log Analytics ***********
      break
    case localActions.SKIP:
      dispatch(UserActions.navigateToDashboard(action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      // // *********** Log Analytics ***********
      analytics.screen({
        userId: action[USER_ENTITIES.USER_ID],
        name: screens.SKIP_USER_SSN
      })
      // *********** Log Analytics ***********
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_SSN))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_CHILD_SSN: 'NAVIGATE_TO_CHILD_SSN',
  SKIP: 'skip',
  UPDATE_CURRENT_ONBOARDING: 'UPDATE_CURRENT_ONBOARDING'
}

const mapStateToProps = (state, props) => {
  // is user ssn
  const isOnboardingFlow = props[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
  // get user's unique ID
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID] || getSingularChildID(state.root.children)
  // email id
  const email = getUserEmail(state.root.u)
  // is adding desire
  const isAddingDesire = props[CHILD_ENTITIES.IS_ADDING_DESIRE]
  // is adding dream
  const isAddingDream = props[CHILD_ENTITIES.IS_ADDING_DREAM]
  // is user ssn entered ?
  const userSSNAdded = isUserSSNAdded(state.root.u)
  // is  processing
  const isProcessing = isStoreUserSSNProcessing(state.root.u)
  // can pop
  const canPop = props[COMMON_ENTITIES.CAN_POP]

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    userID: userID,
    emailID: email,
    childID: childID,
    isAddingDream,
    isAddingDesire,
    isUserSSNAdded: userSSNAdded,
    canPop: canPop,
    isProcessing
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
