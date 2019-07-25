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

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import Screen
  from '../../Components/User/InputDetail_9'
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
    case localActions.UPDATE_FORM_VALUE:
      dispatch(change(action['form'], action['field'], action['value']))
      break

    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      // simply mark that profile has been completed
      dispatch(OnboardingActions.markProfileCompletion(action[USER_ENTITIES.USER_ID]))
      // navigate to program agreement
      dispatch(UserActions.navigateToAgreement(action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.COMPLIANCE_QUESTION_ANSWERED,
        properties: {
          f_member_senior_exec: action['familyPoliticalFlag'],
          f_member_broker: action['familyBrokerageFlag']
        }
      })
      // *********** Log Analytics ***********
      if (action['familyPoliticalFlag'] || action['familyBrokerageFlag']) {
        // *********** Log Analytics ***********
        analytics.identify({
          userId: action[USER_ENTITIES.USER_ID],
          traits: {
            f_member_senior_exec: action['familyPoliticalAnswer'],
            f_member_broker: action['familyBrokerageAnswer']
          }
        })
        // *********** Log Analytics ***********
      }
      break

    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_INPUT_DETAIL_9))
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
  UPDATE_FORM_VALUE: 'UPDATE_FORM_VALUE'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let familyBrokerageFlag = (state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_USER]['values'] && state.form[FORM_TYPES.ADD_USER]['values'][USER_ENTITIES.FAMILY_BROKERAGE_FLAG]) || false
  let familyPoliticalFlag = (state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_USER]['values'] && state.form[FORM_TYPES.ADD_USER]['values'][USER_ENTITIES.FAMILY_POLITICAL_FLAG]) || false
  let stockOwnerFlag = (state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_USER]['values'] && state.form[FORM_TYPES.ADD_USER]['values'][USER_ENTITIES.STOCK_OWNER_FLAG]) || false
  let residencyType = (state.form[FORM_TYPES.ADD_USER] && state.form[FORM_TYPES.ADD_USER]['values'] && state.form[FORM_TYPES.ADD_USER]['values'][USER_ENTITIES.RESIDENCY_TYPE])
  let emailID = getUserEmail(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: SPROUT.ACCEPT_TERMS_CONDITIONS,

    // user id
    userID: userID,

    residencyType: residencyType,

    emailID,

    familyBrokerageFlag: familyBrokerageFlag,
    familyPoliticalFlag: familyPoliticalFlag,
    stockOwnerFlag: stockOwnerFlag
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
