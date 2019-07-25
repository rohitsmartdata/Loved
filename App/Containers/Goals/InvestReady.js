/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {Alert}
  from 'react-native'
import Screen
  from '../../Components/Goals/InvestReady'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {UserActions, getUserEmail, getUserID}
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import { analytics }
  from '../../Config/AppConfig'
import {events}
  from '../../Utility/Mapper/Tracking'
import { OnboardingActions }
  from '../../Redux/Reducers/OnboardingReducer'
import { SPROUT }
  from '../../Utility/Mapper/Screens'
import { INVESTMENT_ENTITIES } from '../../Utility/Mapper/Investment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.SKIP:
      dispatch(GoalActions.skipBankConnection(action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.SKIPPED_BANK
      })
      // *********** Log Analytics ***********
      break

    case localActions.CONNECT_BANK:
      dispatch(UserActions.linkFundingSource(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[USER_ENTITIES.PLAID_ACCOUNT_ID],
        action[USER_ENTITIES.PLAID_PUBLIC_TOKEN],
        undefined, undefined, undefined,
        action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(GoalActions.navigateToTransferScreen(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR], true))
      dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      break

    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.INVEST_READY, action[COMMON_ENTITIES.PROPS]))
      break

    case localActions.SELECT_ACCOUNT_TYPE:
      dispatch(UserActions.selectBankAccount(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.MICRO_DEPOSIT_INTIATED
      })
      // *********** Log Analytics ***********
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  CONNECT_BANK: 'connectBank',
  CONFIRM: 'CONFIRM',
  SKIP: 'SKIP',
  SELECT_ACCOUNT_TYPE: 'SELECT_ACCOUNT_TYPE',
  UPDATE_CURRENT_ONBOARDING: 'UPDATE_CURRENT_ONBOARDING'
}

const mapStateToProps = (state, props) => {
  // get user id
  const userID = getUserID(state.root.u)
  // email id
  const emailID = getUserEmail(state.root.u)
  // get child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // get goal id
  const goalID = props[GOAL_ENTITIES.GID]
  // goal name
  const goalName = props[GOAL_ENTITIES.NAME]
  // recurring amount
  const recurringAmount = props[GOAL_ENTITIES.RECURRING_AMOUNT]

  let isInvestment = props[INVESTMENT_ENTITIES.IS_INVESTMENT]

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // child id
    childID: childID,
    // goal id
    goalID: goalID,
    // goal name
    goalName: goalName,
    // email id
    emailID,
    // user id
    userID: userID,
    // recurring amount
    recurringAmount,
    isInvestment
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
