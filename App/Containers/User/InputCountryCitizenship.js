/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 1/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import Screen
  from '../../Components/User/InputCountryCitizenship'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {UserActions, getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {FORM_TYPES}
  from '../../Config/contants'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      dispatch(change(action['form'], action['field'], action['value']))
      dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.SCREEN_TYPE]))
      dispatch(UserActions.navigateUserDetailInput(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR], action[USER_ENTITIES.RESIDENCY_TYPE]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_COUNTRY_CITIZENSHIP))
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
  const residencyType = state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_USER]['values'] && state.form[FORM_TYPES.ADD_USER]['values'][USER_ENTITIES.RESIDENCY_TYPE]
  const userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: residencyType && (residencyType === USER_ENTITIES.GREENCARD ? SPROUT.USER_INPUT_DETAIL_5 : SPROUT.USER_VISA_TYPE),

    // user id
    userID: userID,

    // email ID
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
