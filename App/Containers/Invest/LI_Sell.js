/* eslint-disable no-trailing-spaces */
/**
 * Created by demon on 25/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Invest/LI_Sell'
import {getGoalName, GoalActions, isWithdrawProcessing, getGoalBalance}
  from '../../Redux/Reducers/GoalReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import {getInvestmentName, getInvestmentBalance}
  from '../../Redux/Reducers/InvestmentReducer'
import {change} from 'redux-form'
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
  const {type, payload} = action
  switch (type) {
    case localActions.UPDATE_WITHDRAW_AMOUNT:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break
    case localActions.WITHDRAW:
      dispatch(GoalActions.withdraw(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.WITHDRAW_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.WITHDRAWAL_INSTRUCTION_CONFIRMED,
        properties: {
          name: action[GOAL_ENTITIES.NAME],
          amount: action[GOAL_ENTITIES.WITHDRAW_AMOUNT]
        }
      })
      // *********** Log Analytics ***********
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----, ', action)
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  WITHDRAW: 'withdraw',
  UPDATE_WITHDRAW_AMOUNT: 'UPDATE_WITHDRAW_AMOUNT'
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
  let goalBalance = getGoalBalance(state.root.goals, goalID) || getInvestmentBalance(state.root.investments, goalID)
  // child name
  let childName = getFirstName(state.root.children, childID)
  // is withdraw processing
  let isProcessing = isWithdrawProcessing(state.root.goals)

  let valuesPresent = state.form[FORM_TYPES.WITHDRAW] && state.form[FORM_TYPES.WITHDRAW].values
  let withdrawAmount = (valuesPresent && state.form[FORM_TYPES.WITHDRAW].values[GOAL_ENTITIES.WITHDRAW_AMOUNT]) || 25

  return {
    // send local actions for (presentation <--> container)
    localActions,

    goalID,

    childID,

    userID,

    goalName,

    withdrawAmount,

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
