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
  from '../../Components/User/InputDetail_3'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {UserActions, getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {FORM_TYPES}
  from '../../Config/contants'
import {events, errorKeywords}
  from '../../Utility/Mapper/Tracking'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_USER_SSN:
      let address = action['addressData']
      let a1 = address && address['addressLine1']
      let city = address && address['city']
      let state = address && address['state']
      let country = address && address['country']
      let addressString = a1 + ', ' + city + ', ' + state + ', ' + country
      dispatch(UserActions.storeUserAddress(action[USER_ENTITIES.USER_ID], action['addressData']))
      dispatch(ChildActions.navigateToUserSsnScreen(action[CHILD_ENTITIES.CHILD_ID], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.USER_FILLED_ADDRESS
      })
      // *********** Log Analytics ***********
      // *********** Log Analytics ***********
      analytics.identify({
        userId: action[USER_ENTITIES.USER_ID],
        traits: {
          address: addressString
        }
      })
      // *********** Log Analytics ***********
      break
    case localActions.NAVIGATE_TO_INPUT_MANUAL_ADDRESS_SCREEN:
      dispatch(ChildActions.navigateToInputManualAddressScreen(action[CHILD_ENTITIES.CHILD_ID], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action['addressData'], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.CHANGE_FIELD:
      dispatch(change(action['form'], action['field'], action['value']))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_INPUT_DETAIL_3))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_INPUT_MANUAL_ADDRESS_SCREEN: 'NAVIGATE_TO_INPUT_MANUAL_ADDRESS_SCREEN',
  NAVIGATE_TO_USER_SSN: 'NAVIGATE_TO_USER_SSN',
  CHANGE_FIELD: 'CHANGE_FIELD',
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // email id
  let emailID = getUserEmail(state.root.u)
  // location
  let location = getFormValues(FORM_TYPES.ADD_USER)(state) && getFormValues(FORM_TYPES.ADD_USER)(state)[USER_ENTITIES.LOCATION]
  // address text
  let addressText = getFormValues(FORM_TYPES.ADD_USER)(state) && getFormValues(FORM_TYPES.ADD_USER)(state)[USER_ENTITIES.ADDRESS_LINE_1]
  // get user's unique ID
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // is adding desire
  const isAddingDesire = props[CHILD_ENTITIES.IS_ADDING_DESIRE]
  // is adding dream
  const isAddingDream = props[CHILD_ENTITIES.IS_ADDING_DREAM]

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: SPROUT.USER_SSN,

    // user id
    userID: userID,

    // child id
    childID: childID,

    // is adding desire
    isAddingDesire,

    // is adding dream
    isAddingDream,

    // email id
    emailID: emailID,

    // location
    location,

    // address text
    addressText
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
