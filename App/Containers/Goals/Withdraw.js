/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/5/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/Withdraw'
import {getGoalName, GoalActions, isWithdrawProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import {getInvestmentName}
  from '../../Redux/Reducers/InvestmentReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.WITHDRAW:
      dispatch(GoalActions.withdraw(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.WITHDRAW_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(GoalActions.navigateToTransferScreen(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.WITHDRAW_DISPLAY_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR], true))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----, ', action)
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  WITHDRAW: 'withdraw'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // goal id
  let goalID = props[GOAL_ENTITIES.GID]
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // goalName
  let goalName = getGoalName(state.root.goals, goalID) || getInvestmentName(state.root.investments, goalID)
  // goal balance
  let goalBalance = props[GOAL_ENTITIES.BALANCE]
  // child name
  let childName = props[CHILD_ENTITIES.FIRST_NAME]
  // is withdraw processing
  let isProcessing = isWithdrawProcessing(state.root.goals)
  return {
    // send local actions for (presentation <--> container)
    localActions,

    goalID,

    childID,

    userID,

    goalName,

    childName,

    goalBalance,

    isProcessing
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
