/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 13/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/GoalBase'
import {UserActions, getUserID, isFundingSourceLinked, isFetchingGlossary}
  from '../../Redux/Reducers/UserReducer'
import { getFirstName, isSSNAdded }
  from '../../Redux/Reducers/ChildReducer'
import {GoalActions, isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
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
    case localActions.ADD_GOAL:
      dispatch(GoalActions.addGoal(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.NAME],
        action[GOAL_ENTITIES.PORTFOLIO_RISK],
        action[GOAL_ENTITIES.DURATION],
        action[GOAL_ENTITIES.GOAL_AMOUNT],
        action[GOAL_ENTITIES.RECURRING_AMOUNT],
        action[GOAL_ENTITIES.RECURRING_FREQUENCY],
        action[GOAL_ENTITIES.IS_PLAID_LINKED],
        undefined))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_GOAL: 'ADD_GOAL'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child first name
  // is ssn added
  const isssnAdded = isSSNAdded(state.root.children, childID)

  let firstname = getFirstName(state.root.children, childID)
  // is goal processing
  const isProcessing = isGoalProcessing(state.root.goals)

  // values present
  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal amount
  let goalName = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])
  // goal amount
  let goalAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT])
  // tentating child target age
  const goalMaturityAge = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_MATURITY_AGE])
  // risk selected
  let portfolioRisk = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.PORTFOLIO_RISK])
  // recurring amount
  let recurringAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.RECURRING_AMOUNT])
  // recurring frequency
  let recurringFrequency = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.RECURRING_FREQUENCY])
  // is plaid already linked
  const isPlaidLinked = isFundingSourceLinked(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    // child id
    childID: childID,

    // ssn added
    isssnAdded,

    // child name
    firstName: firstname,

    // is processing
    isProcessing,

    // goal name
    goalName,

    // goal amount
    goalAmount,

    // goal maturity age
    goalMaturityAge,

    // portfolio risk
    portfolioRisk,

    // recurring amount
    recurringAmount,

    // recurring frequency
    recurringFrequency,

    // is plaid linked
    isPlaidLinked
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
