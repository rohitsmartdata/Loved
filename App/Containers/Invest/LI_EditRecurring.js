/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 31/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change} from 'redux-form'
import Screen
  from '../../Components/Invest/LI_EditRecurring'
import {GoalActions, isGoalProcessing, getGoal, getGoalName, getGoalBalance}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestmentName, isProcessing as isInvestmentProcessing, getInvestment, getInvestmentBalance}
  from '../../Redux/Reducers/InvestmentReducer'
import {getChildren, getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {UserActions, getUserID, isModifyUserInstructionProcessing, isUserProcessing, isFundingSourceLinked}
  from '../../Redux/Reducers/UserReducer'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {
    case localActions.UPDATE_RECURRING_AMOUNT:
      dispatch(change(FORM_TYPES.EDIT_RECURRING, GOAL_ENTITIES.RECURRING_AMOUNT, action[GOAL_ENTITIES.RECURRING_AMOUNT]))
      break
    case localActions.UPDATE_RECURRING_FREQUENCY:
      dispatch(change(FORM_TYPES.EDIT_RECURRING, GOAL_ENTITIES.RECURRING_FREQUENCY, action[GOAL_ENTITIES.RECURRING_FREQUENCY]))
      break
    case localActions.MODIFY_RECURRING_AMOUNT:
      dispatch(UserActions.modifyUserRecurringInstruction(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.INSTRUCTION_ID],
        action[GOAL_ENTITIES.RECURRING_AMOUNT],
        action[GOAL_ENTITIES.RECURRING_FREQUENCY]
      ))
      break
    case localActions.CANCEL_USER_INSTRUCTION:
      dispatch(UserActions.modifyUserInstruction(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.INSTRUCTION_ID],
        action[GOAL_ENTITIES.INSTRUCTION_ACTION],
        action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  MODIFY_RECURRING_AMOUNT: 'modifyRecurringAmount',
  CANCEL_USER_INSTRUCTION: 'cancelUserInstruction',
  UPDATE_RECURRING_FREQUENCY: 'updateRecurringFrequency',
  UPDATE_RECURRING_AMOUNT: 'updateRecurringAmount'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // get CHILD id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // child name
  const firstName = childID && getFirstName(state.root.children, childID)
  // goal id
  const goalID = props[GOAL_ENTITIES.GID]
  // goal name
  const goalName = getGoalName(state.root.goals, goalID) || getInvestmentName(state.root.investments, goalID)
  // is processing or not
  let isProcessing = isModifyUserInstructionProcessing(state.root.u)

  let currentRecurringAmount
  let currentRecurringFrequency
  let recurringID
  let status
  let type

  // goal
  let goal = getInvestment(state.root.investments, goalID)
  if (goal) {
    currentRecurringAmount = goal[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT]
    currentRecurringFrequency = goal[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]
    recurringID = goal[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_ID]
    status = goal[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_STATUS]
    type = goal[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_TYPE]
  } else {
    goal = getGoal(state.root.goals, goalID)
    currentRecurringAmount = goal[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT]
    currentRecurringFrequency = goal[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY]
    recurringID = goal[GOAL_ENTITIES.GOAL_RECURRING_ID]
    status = goal[GOAL_ENTITIES.GOAL_RECURRING_STATUS]
  }

  let valuesPresent = state.form[FORM_TYPES.EDIT_RECURRING] && state.form[FORM_TYPES.EDIT_RECURRING].values
  let recurringAmount = (valuesPresent && state.form[FORM_TYPES.EDIT_RECURRING].values[GOAL_ENTITIES.RECURRING_AMOUNT])
  let recurringFrequency = (valuesPresent && state.form[FORM_TYPES.EDIT_RECURRING].values[GOAL_ENTITIES.RECURRING_FREQUENCY])

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    // child id
    childID: childID,

    // child name
    firstName,

    // goal id
    goalID,

    // goal name
    goalName,

    // current recurring amount
    currentRecurringAmount,

    // current recurring frequency
    currentRecurringFrequency,

    // recurring id
    recurringID,

    // status
    status,

    // is processing
    isProcessing,

    // recurring amount
    recurringAmount,

    // recurring frequency
    recurringFrequency
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
