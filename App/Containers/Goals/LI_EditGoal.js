/* eslint-disable no-trailing-spaces,no-unused-vars */
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
  from '../../Components/Goals/LI_EditGoal'
import {GoalActions, isGoalProcessing, getGoal, getGoalName, getGoalBalance}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestmentName, getInvestment, getInvestmentBalance}
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
    case localActions.UPDATE_GOAL_NAME:
    case localActions.UPDATE_GOAL_AMOUNT:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break
    case localActions.EDIT_GOAL:
      dispatch(GoalActions.editGoal(action[USER_ENTITIES.USER_ID], action[GOAL_ENTITIES.GID],
        action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.NAME],
        action[GOAL_ENTITIES.GOAL_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]
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
  EDIT_GOAL: 'EDIT_GOAL',
  UPDATE_GOAL_AMOUNT: 'UPDATE_GOAL_AMOUNT',
  UPDATE_GOAL_NAME: 'UPDATE_GOAL_NAME'
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
  const goalName = getGoalName(state.root.goals, goalID)
  // goal's
  let goal = getGoal(state.root.goals, goalID)

  let valuesPresent = state.form[FORM_TYPES.EDIT_GOAL] && state.form[FORM_TYPES.EDIT_GOAL].values
  // goal name
  let modifiedName = (valuesPresent && state.form[FORM_TYPES.EDIT_GOAL].values[GOAL_ENTITIES.NAME]) || ''
  // goal amount
  let modifiedAmount = (valuesPresent && state.form[FORM_TYPES.EDIT_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT]) || 0

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

    // goal
    goal,

    modifiedAmount,

    modifiedName
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
