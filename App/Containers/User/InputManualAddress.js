/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * User Input detail 3
 * - Phone number
 * - Address
 *
 * Created by viktor on 21/6/17.
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
  from '../../Components/User/InputManualAddress'
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
import {FORM_TYPES}
  from '../../Config/contants'
import { ChildActions } from '../../Redux/Reducers/ChildReducer'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      dispatch(UserActions.storeUserAddress(action[USER_ENTITIES.USER_ID], action['addressData']))
      dispatch(ChildActions.navigateToUserSsnScreen(action[CHILD_ENTITIES.CHILD_ID], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.CHANGE_FIELD:
      dispatch(change(action['form'], action['field'], action['value']))
      break

    case localActions.UPDATE_CURRENT_ONBOARDING:
      // dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_INPUT_MANUAL_ADDRESS))
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
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  let emailID = getUserEmail(state.root.u)
  let location = getFormValues(FORM_TYPES.ADD_USER)(state) && getFormValues(FORM_TYPES.ADD_USER)(state)[USER_ENTITIES.LOCATION]
  let addressText = getFormValues(FORM_TYPES.ADD_USER)(state) && getFormValues(FORM_TYPES.ADD_USER)(state)[USER_ENTITIES.ADDRESS_LINE_1]
  let addressState = getFormValues(FORM_TYPES.ADD_USER)(state) && getFormValues(FORM_TYPES.ADD_USER)(state)[USER_ENTITIES.STATE]

  let nextScreen = props[COMMON_ENTITIES.NEXT_SCREEN] || SPROUT.USER_SSN
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen,

    // user id
    userID: userID,

    childID,

    // email id
    emailID: emailID,

    // location
    location,

    addressText,

    addressState
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
