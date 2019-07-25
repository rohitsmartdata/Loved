/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * User Input detail 2
 * - Date of birth
 *
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/User/InputVisaExpiry'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {UserActions, getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      let nextScreen = action[COMMON_ENTITIES.SCREEN_TYPE]
      dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], nextScreen))
      dispatch(UserActions.navigateUserDetailInput(nextScreen, action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_VISA_EXPIRY))
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
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  const userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: SPROUT.USER_INPUT_DETAIL_5,

    // user id
    userID: userID,

    // email id
    emailID
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
