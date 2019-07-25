/* eslint-disable no-trailing-spaces */
/**
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Sprout/AddChild'
import {ChildActions, getAvatar, isProcessing}
  from '../../Redux/Reducers/ChildReducer'
import { getUserID, getUserEmail, isUserSSNAdded, UserActions }
  from '../../Redux/Reducers/UserReducer'
import {getProfileData, OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import { getImageMetadata, SettingActions }
  from '../../Redux/Reducers/SettingReducer'
import { getIDToken }
  from '../../Redux/Reducers/AuthReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import { reset } from 'redux-form'
import { FORM_TYPES } from '../../Config/contants'
import { analytics }
  from '../../Config/AppConfig'
import {events}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.SUBMIT_ADD_CHILD:
      dispatch(ChildActions.addChild(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.FIRST_NAME],
        action[CHILD_ENTITIES.LAST_NAME],
        action[CHILD_ENTITIES.DOB],
        undefined,
        action[USER_ENTITIES.EMAIL_ID],
        action[COMMON_ENTITIES.NAVIGATOR],
        action[SETTINGS_ENTITIES.IMAGE_METADATA],
        action[AUTH_ENTITIES.ID_TOKEN],
        dispatch,
        action[CHILD_ENTITIES.IS_ADDING_DREAM],
        action[CHILD_ENTITIES.IS_ADDING_DESIRE],
        undefined,
        action[USER_ENTITIES.IS_SSN_ADDED]
      ))
      break
    case localActions.ADD_CHILD_BIRTH_DATE:
      dispatch(ChildActions.addChildBirthDate(action[CHILD_ENTITIES.FIRST_NAME], action[CHILD_ENTITIES.LAST_NAME], action[CHILD_ENTITIES.IMAGE_META_DATA], action[COMMON_ENTITIES.NAVIGATOR], action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.ACCOUNT_KYC_CHILD_NAME
      })
      // *********** Log Analytics ***********
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.ADD_CHILD_SCREEN))
      break
    case localActions.ON_BACK:
      dispatch(reset(FORM_TYPES.ADD_CHILD))
      dispatch(SettingActions.flushImageMetadata())
      dispatch(UserActions.popScreen(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SUBMIT_ADD_CHILD: 'SUBMIT_ADD_CHILD',
  ADD_CHILD_BIRTH_DATE: 'ADD_CHILD_BIRTH_DATE',
  UPDATE_CURRENT_ONBOARDING: 'UPDATE_CURRENT_ONBOARDING',
  ON_BACK: 'ON_BACK'
}

const mapStateToProps = (state, props) => {
  const avatar = getAvatar(state.root.children)
  const processing = isProcessing(state.root.children)
  let userID = getUserID(state.root.u)
  let identityData = getProfileData(state.onboard, userID)
  let emailID = getUserEmail(state.root.u)
  let isAddingDream = props[CHILD_ENTITIES.IS_ADDING_DREAM]
  let isAddingDesire = props[CHILD_ENTITIES.IS_ADDING_DESIRE]
  let shouldUpdateOnboarding = props[CHILD_ENTITIES.SHOULD_UPDATE_ONBOARDING]
  let isOnboardingFlow = props[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
  const userSSNAdded = isUserSSNAdded(state.root.u)
  const imageMetadata = getImageMetadata(state.util)
  const token = getIDToken(state.auth)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // child's photo/avatar
    avatar: avatar,

    // is add child processing,
    isProcessing: processing,

    // user id
    userID: userID,

    // email id
    emailID: emailID,

    // user identity data
    identityData: identityData,

    // image meta data
    imageMetadata,

    // user ssn added or not
    userSSNAdded: userSSNAdded,

    // token
    token,

    // adding dream
    isAddingDream,
    // adding desire
    isAddingDesire,
    // should update onboarding process
    shouldUpdateOnboarding,
    // onboarding process
    isOnboardingFlow
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
