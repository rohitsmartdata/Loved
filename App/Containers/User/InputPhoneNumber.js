/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * InputPhoneNumber
 * - Phone number
 *
 * Created by Anita on 5/9/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {
  getFormValues,
  change
}
  from 'redux-form'
import Screen
  from '../../Components/User/InputPhoneNumber'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {UserActions, getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.SCREEN_TYPE]))
      dispatch(UserActions.navigateUserDetailInput(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********

      analytics.identify({
        userId: action[USER_ENTITIES.USER_ID],
        traits: {
          phone: action[USER_ENTITIES.PHONE_NUMBER]
        }
      })
      // *********** Log Analytics ***********
      break

    case localActions.CHANGE_FIELD:
      dispatch(change(action['form'], action['field'], action['value']))
      break

    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_INPUT_PHONE_NUMBER))
      break

    case localActions.CREATE_PIN:
      dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.SCREEN_TYPE]))
      // *********** Log Analytics ***********
      analytics.identify({
        userId: action[USER_ENTITIES.USER_ID],
        traits: {
          phone: action[USER_ENTITIES.PHONE_NUMBER]
        }
      })
      // *********** Log Analytics ***********
      dispatch(UserActions.setPasscode(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_NEXT_SCREEN: 'NAVIGATE_TO_NEXT_SCREEN',
  CHANGE_FIELD: 'CHANGE_FIELD',
  CREATE_PIN: 'CREATE_PIN',
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: SPROUT.LOGIN_PIN,

    // user id
    userID: userID,

    // email id
    emailID: emailID
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
