/* eslint-disable no-unused-vars */
/**
 * Created by demon on 8/8/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/RiskNotification'
import {GoalActions, isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {isChildSSNAdded, ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {
    case localActions.ADD_GOAL:
      const isSSNAdded = action[CHILD_ENTITIES.IS_SSN_ADDED]
      if (isSSNAdded) {
        dispatch(GoalActions.addGoal(
          action[USER_ENTITIES.USER_ID],
          action[CHILD_ENTITIES.CHILD_ID],
          action[GOAL_ENTITIES.NAME],
          action[GOAL_ENTITIES.PORTFOLIO_RISK],
          action[GOAL_ENTITIES.DURATION],
          action[GOAL_ENTITIES.GOAL_AMOUNT],
          action[GOAL_ENTITIES.RECURRING_AMOUNT],
          action[GOAL_ENTITIES.RECURRING_FREQUENCY],
          action[USER_ENTITIES.IS_PLAID_LINKED],
          action[COMMON_ENTITIES.NAVIGATOR]))
      } else {
        dispatch(ChildActions.askSsn(
          action[CHILD_ENTITIES.CHILD_ID],
          {
            [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
            [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
            [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME],
            [GOAL_ENTITIES.PORTFOLIO_RISK]: action[GOAL_ENTITIES.PORTFOLIO_RISK],
            [GOAL_ENTITIES.DURATION]: action[GOAL_ENTITIES.DURATION],
            [GOAL_ENTITIES.GOAL_AMOUNT]: action[GOAL_ENTITIES.GOAL_AMOUNT],
            [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
            [GOAL_ENTITIES.RECURRING_FREQUENCY]: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
            [USER_ENTITIES.IS_PLAID_LINKED]: action[USER_ENTITIES.IS_PLAID_LINKED]
          },
          false, // is investment
          action[COMMON_ENTITIES.NAVIGATOR]
        ))
      }
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_GOAL: 'addGoal'
}

const mapStateToProps = (state, props) => {
  // get user id
  let userID = getUserID(state.root.u)
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  let goalName = props[GOAL_ENTITIES.NAME]
  let portfolioRisk = props[GOAL_ENTITIES.PORTFOLIO_RISK]
  let duration = props[GOAL_ENTITIES.DURATION]
  let goalAmount = props[GOAL_ENTITIES.GOAL_AMOUNT]
  let recurringAmount = props[GOAL_ENTITIES.RECURRING_AMOUNT]
  let recurringFrequency = props[GOAL_ENTITIES.RECURRING_FREQUENCY]
  let isPlaidLinked = props[USER_ENTITIES.IS_PLAID_LINKED]
  let suggestedRisk = props[GOAL_ENTITIES.SUGGESTED_RISK]
  let childSSNAdded = isChildSSNAdded(state.root.children, childID)
  const isProcessing = isGoalProcessing(state.root.goals)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // user id
    userID: userID,
    // child id
    childID,
    // goal name
    goalName,
    // portfolio Risk
    portfolioRisk,
    // duration
    duration,
    // goal amount
    goalAmount,
    // recurring amount
    recurringAmount,
    // recurring frequency
    recurringFrequency,
    // plaid linked
    isPlaidLinked,
    // suggested risk
    suggestedRisk,
    // is processing
    isProcessing,
    // child ssn added or not
    isChildSSNAdded: childSSNAdded
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
