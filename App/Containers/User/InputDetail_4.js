/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * User Input detail 4
 * - SSN
 *
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import Screen
  from '../../Components/User/InputDetail_4'
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
import {FORM_TYPES}
  from '../../Config/contants'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      let nextScreen = action[USER_ENTITIES.RESIDENCY_TYPE] === USER_ENTITIES.OTHER_RESIDENCY ? SPROUT.OTHER_RESIDENCE : action[USER_ENTITIES.RESIDENCY_TYPE] === USER_ENTITIES.CITIZEN ? SPROUT.USER_INPUT_DETAIL_5 : SPROUT.USER_COUNTRY_CITIZENSHIP
      dispatch(change(action['form'], action['field'], action['value']))
      dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], nextScreen))
      dispatch(UserActions.navigateUserDetailInput(nextScreen, action[COMMON_ENTITIES.NAVIGATOR], action[USER_ENTITIES.RESIDENCY_TYPE]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_INPUT_DETAIL_4))
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
  SET_RESIDENCY_TYPE: 'SET_RESIDENCY_TYPE',
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  let residencyType = (state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_USER].values && state.form[FORM_TYPES.ADD_USER].values[USER_ENTITIES.RESIDENCY_TYPE]) || USER_ENTITIES.CITIZEN
  let userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    // it will depend on residency type
    nextScreen: SPROUT.USER_INPUT_DETAIL_SSN,

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
