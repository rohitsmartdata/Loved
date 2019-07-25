/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * User Input detail 1
 * - first name
 * - last name
 *
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/User/InputDetail_1'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {UserActions, getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { analytics }
  from '../../Config/AppConfig'
import Moment
  from 'moment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:

      let userID = action[USER_ENTITIES.USER_ID]
      let firstname = action[USER_ENTITIES.FIRST_NAME]
      let lastname = action[USER_ENTITIES.LAST_NAME]
      let currentDate = Moment()
      let name = firstname + ' ' + lastname
      // *********** Log Analytics ***********
      analytics.identify({
        userId: userID,
        traits: {
          first_name: firstname,
          last_name: lastname,
          name: name,
          created: currentDate
        }
      })
      // *********** Log Analytics ***********

      dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.SCREEN_TYPE]))
      dispatch(UserActions.navigateUserDetailInput(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(UserActions.setFirstName(firstname))
      dispatch(UserActions.setLastName(lastname))
      break
    case localActions.ONBOARDING_STARTED:
      dispatch(OnboardingActions.onboardingStarted(action[USER_ENTITIES.EMAIL_ID]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_INPUT_DETAIL_1))
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
  ONBOARDING_STARTED: 'onboardingStarted',
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: SPROUT.USER_INPUT_DETAIL_2,

    userID: userID,

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
