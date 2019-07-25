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
  from '../../Components/Sprout/AddChildBirthDate'
import {ChildActions, getAvatar, isProcessing}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, getUserEmail, isUserSSNAdded}
  from '../../Redux/Reducers/UserReducer'
import {getProfileData, OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import { getImageMetadata }
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
        action[USER_ENTITIES.IS_SSN_ADDED],
        action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]
      ))
      // dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      break
    case localActions.NOTIFY_AGE_LIMITATION:
      dispatch(ChildActions.notifyAgeLimitation(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.ADD_CHILD_BIRTH_DATE))
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
  NOTIFY_AGE_LIMITATION: 'NOTIFY_AGE_LIMITATION',
  UPDATE_CURRENT_ONBOARDING: 'UPDATE_CURRENT_ONBOARDING'
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
    // should update onboarding process
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
