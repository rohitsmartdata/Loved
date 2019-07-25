/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 25/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change} from 'redux-form'
import Screen
  from '../../Components/Invest/LI_Buy'
import {GoalActions, isGoalProcessing, getGoalName, getGoalBalance}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestmentName, getInvestmentBalance}
  from '../../Redux/Reducers/InvestmentReducer'
import {getChildren, getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, isUserProcessing, isFundingSourceLinked}
  from '../../Redux/Reducers/UserReducer'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
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
    case localActions.UPDATE_INVESTMENT_AMOUNT:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break

    case localActions.BUY:
      // send transfer instruction first
      dispatch(GoalActions.transfer(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        undefined,
        undefined,
        action[GOAL_ENTITIES.ONE_OFF_INVESTMENT]
      ))

      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.GOAL_TOPUP_INSTRUCTION_CONFIRMED,
        properties: {
          name: action[GOAL_ENTITIES.NAME],
          added_amount: action[GOAL_ENTITIES.ONE_OFF_INVESTMENT]
        }
      })
      // *********** Log Analytics ***********

      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  // update investment amount
  UPDATE_INVESTMENT_AMOUNT: 'updateInvestmentAmount',
  // buy
  BUY: 'BUY'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // get CHILD id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // get first name
  const firstName = getFirstName(state.root.children, childID)
  // get goalID
  const goalID = props[GOAL_ENTITIES.GID]
  // goal name
  const goalName = getGoalName(state.root.goals, goalID) || getInvestmentName(state.root.investments, goalID)

  // is user processing something
  const isProcessing = isGoalProcessing(state.root.goals)

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  let oneOffInvestment = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.ONE_OFF_INVESTMENT]) || 25

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // is processing
    isProcessing: isProcessing,

    // user id
    userID: userID,

    // child id
    childID: childID,

    // first name
    firstName,

    // goal id
    goalID: goalID,

    // goal name
    goalName,

    // one off investment
    oneOffInvestment: oneOffInvestment
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
