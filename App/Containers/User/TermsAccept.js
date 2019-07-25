/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * User Input detail 6
 * - User's Income Type
 *
 * Created by viktor on 28/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {Alert}
  from 'react-native'
import {connect}
  from 'react-redux'
import {reset}
  from 'redux-form'
import Screen
  from '../../Components/User/TermsAccept'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {UserActions, getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {FORM_TYPES}
  from '../../Config/contants'
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
    case localActions.AGREE:
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.ACCEPTED_TERMS
      })
      // *********** Log Analytics ***********

      // reset ADD_USER form data
      dispatch(reset(FORM_TYPES.ADD_USER))
      // mark program accepted and save form data in store
      dispatch(OnboardingActions.programAccepted(action[USER_ENTITIES.USER_ID], action[USER_ENTITIES.IDENTITY_DATA], action[COMMON_ENTITIES.NAVIGATOR], action[USER_ENTITIES.EMAIL_ID]))
      // navigate to next screen
      dispatch(UserActions.agreeTc(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.DISAGREE:
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.REJECTED_TERMS
      })
      // *********** Log Analytics ***********
      Alert.alert('Sorry', 'Loved App is only available as per terms and conditions.')
      break

    case localActions.CLOSE_TC:
      dispatch(UserActions.closeTc(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.ACCEPT_TERMS_CONDITIONS))
      break

    case localActions.SHOW_URL:
      dispatch(SettingActions.showWebWindow(action[SETTINGS_ENTITIES.URL], action[SETTINGS_ENTITIES.HEADING], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  CLOSE_TC: 'closeTC',
  SHOW_URL: 'SHOW_URL',
  AGREE: 'accept',
  DISAGREE: 'disagree',
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let formData = (state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_USER]['values'])
  let emailID = getUserEmail(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    // identity form data
    formData: formData,

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
