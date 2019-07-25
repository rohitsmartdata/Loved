/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 27/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change, reset}
  from 'redux-form'
import Screen
  from '../../Components/Goals/LI_GoalConfirm'
import {UserActions, getGlossary, isFetchingGlossary, getUserID, isFundingSourceLinked}
  from '../../Redux/Reducers/UserReducer'
import {GoalActions, getGoalImage, isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {InvestmentActions, getInvestmentImage}
  from '../../Redux/Reducers/InvestmentReducer'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {FORM_TYPES}
  from '../../Config/contants'
import {COMMON_ENTITIES, FREQUENCY, getPortfolio}
  from '../../Utility/Mapper/Common'
import {events, errorKeywords}
  from '../../Utility/Mapper/Tracking'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {
    case localActions.MAKE_GOAL:
      dispatch(GoalActions.makeGoal(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.NAME],
        action[GOAL_ENTITIES.PORTFOLIO_RISK],
        action[GOAL_ENTITIES.DURATION],
        action[GOAL_ENTITIES.GOAL_AMOUNT],
        action[GOAL_ENTITIES.RECURRING_AMOUNT],
        action[GOAL_ENTITIES.RECURRING_FREQUENCY],
        action[GOAL_ENTITIES.IS_PLAID_LINKED],
        action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.MAKE_INVESTMENT:
      dispatch(InvestmentActions.addInvestment(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
        action[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID],
        '4edb157c-a321-4f77-adfb-544c0f208a43',
        action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
        action[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY],
        action[USER_ENTITIES.IS_PLAID_LINKED],
        action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  // create goal
  MAKE_GOAL: 'MAKE_GOAL',
  // make investment
  MAKE_INVESTMENT: 'MAKE_INVESTMENT'
}

const mapStateToProps = (state, props) => {
  const isInvestment = props[INVESTMENT_ENTITIES.IS_INVESTMENT]
  const payload = props[GOAL_ENTITIES.GOAL_DATA]
  const isPlaidLinked = isFundingSourceLinked(state.root.u)

  // user id
  let userID = getUserID(state.root.u)
  // values present
  let goalValuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal name
  let goalName = (goalValuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])
  // values present

  let investmentValuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  // ticker name
  let tickerName = (investmentValuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.PRODUCT_TICKER])

  // images
  let images = ((goalName && getGoalImage(state.root.goals, goalName)) || (tickerName && getInvestmentImage(state.root.investments, tickerName)))
  let childID = payload && payload[CHILD_ENTITIES.CHILD_ID]
  let firstname = getFirstName(state.root.children, childID)
  // is goal processing
  const isProcessing = isGoalProcessing(state.root.goals)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // is investment
    isInvestment,

    // payload
    payload,

    // user id
    userID,

    // is plaid linked
    isPlaidLinked,

    // first name
    firstname,

    // images
    images,

    // is processing
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
