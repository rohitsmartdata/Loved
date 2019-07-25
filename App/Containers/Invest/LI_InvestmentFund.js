/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 15/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import Screen
  from '../../Components/Invest/LI_InvestmentFund'
import {FORM_TYPES}
  from '../../Config/contants'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, isFundingSourceLinked}
  from '../../Redux/Reducers/UserReducer'
import {InvestmentActions, isProcessing, getInvestmentName}
  from '../../Redux/Reducers/InvestmentReducer'
import {GoalActions, getGoalName, isTransferProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type} = action

  switch (type) {
    case localActions.UPDATE_INVESTMENT_AMOUNT:
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_AMOUNT, action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]))
      break
    case localActions.UPDATE_INVESTMENT_FREQUENCY:
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY, action[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]))
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
    case localActions.CONFIRM_INVESTMENT:
      dispatch(GoalActions.confirmGoal(true, {
        [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
        [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
        [INVESTMENT_ENTITIES.INVESTMENT_NAME]: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
        [INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]: action[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID],
        [INVESTMENT_ENTITIES.INVESTMENT_PATH_ID]: '4edb157c-a321-4f77-adfb-544c0f208a43',
        [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
        [INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]: action[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY],
        [USER_ENTITIES.IS_PLAID_LINKED]: action[USER_ENTITIES.IS_PLAID_LINKED],
        [COMMON_ENTITIES.NAVIGATOR]: action[COMMON_ENTITIES.NAVIGATOR]
      }, action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.BUY_ONCE_OFF:
      // send transfer instruction first
      dispatch(GoalActions.transfer(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        undefined,
        undefined,
        action[GOAL_ENTITIES.ONE_OFF_INVESTMENT],
        action[GOAL_ENTITIES.NAME],
        action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break
    case localActions.SET_RECURRING:
      // send transfer instruction first
      dispatch(GoalActions.transfer(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.RECURRING_AMOUNT],
        action[GOAL_ENTITIES.RECURRING_FREQUENCY],
        undefined,
        action[GOAL_ENTITIES.NAME],
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
  UPDATE_INVESTMENT_AMOUNT: 'updateInvestmentAmount',
  UPDATE_INVESTMENT_FREQUENCY: 'updateInvestmentFrequency',
  MAKE_INVESTMENT: 'makeInvestment',
  CONFIRM_INVESTMENT: 'confirmInvestment',
  BUY_ONCE_OFF: 'buyOnceOff',
  SET_RECURRING: 'setRecurring'
}

const mapStateToProps = (state, props) => {
  // get user id
  let userID = getUserID(state.root.u)
  // get childID
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // goal id : would only be provided in case it's top up screen
  let goalID = props[GOAL_ENTITIES.GID] || undefined

  // child's firstname
  let firstName = getFirstName(state.root.children, childID)
  // is add investment processing
  const processing = isProcessing(state.root.investments) || isTransferProcessing(state.root.goals)

  let valuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  // investment name
  let investmentName = (valuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_NAME]) || (goalID && (getInvestmentName(state.root.investments, goalID) || getGoalName(state.root.goals, goalID)))
  // investment recurring amount
  let investmentAmount = (valuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]) || 0
  // investment recurring frequency
  let investmentFrequency = (valuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY])
  // portfolio id
  let investmentPortfolioID = (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]))
  // product ticker
  let tickerName = (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.PRODUCT_TICKER]))
  // is plaid linked
  let isPlaidLinked = isFundingSourceLinked(state.root.u)

  // is modal or screen
  let pushFunc = props['pushFunc']
  let isModal = pushFunc !== undefined

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // child id
    childID,

    // goal id : would only be provided in case it's top up screen
    goalID,

    // processing
    isProcessing: processing,

    // is modal
    isModal,

    // firstname
    firstName,

    // investment name
    investmentName,

    // investment amount
    investmentAmount,

    // investment frequency
    investmentFrequency,

    // ticker name
    tickerName,

    // investment risk id
    investmentPortfolioID,

    // is funding source linked
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
