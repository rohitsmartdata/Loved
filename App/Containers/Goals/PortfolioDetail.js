/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/PortfolioDetail'
import {GoalActions, getTickerDetail, isPerformanceFetchProcessing, getInvestChartData}
  from '../../Redux/Reducers/GoalReducer'
import {getIDToken}
  from '../../Redux/Reducers/AuthReducer'
import {getFirstName, ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {InvestmentActions, getInvestment}
  from '../../Redux/Reducers/InvestmentReducer'
import {UserActions, getUserID, getLastUpdatedTime}
  from '../../Redux/Reducers/UserReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {FORM_TYPES}
  from '../../Config/contants'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {
    case localActions.ADD_INVESTMENT:
      if (action[CHILD_ENTITIES.CHILD_ID]) {
        dispatch(InvestmentActions.selectInvestmentAmount(action[CHILD_ENTITIES.CHILD_ID], action[INVESTMENT_ENTITIES.INVESTMENT_NAME], action[COMMON_ENTITIES.NAVIGATOR]))
      } else {
        dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR], true, false))
      }
      break
    case localActions.HIDE_RISK:
      dispatch(UserActions.popScreen(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.FETCH_PERFORMANCE_DATA:
      dispatch(GoalActions.fetchPerformanceData(action[AUTH_ENTITIES.ID_TOKEN], action[GOAL_ENTITIES.TICKER_NAME]))
      break

    case localActions.FETCH_INVEST_CHART_DATA:
      dispatch(GoalActions.fetchInvestChartData(action[AUTH_ENTITIES.ID_TOKEN], action[GOAL_ENTITIES.TICKER_NAME]))
      break

    case localActions.INVEST:
      dispatch(GoalActions.investOnGoal(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.NAME],
        action[COMMON_ENTITIES.NAVIGATOR],
        true
      ))
      break

    case localActions.NAVIGATE_TO_WITHDRAW:
      dispatch(GoalActions.navigateToWithdraw(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[CHILD_ENTITIES.FIRST_NAME],
        action[GOAL_ENTITIES.NAME],
        action[GOAL_ENTITIES.BALANCE],
        action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.NAVIGATE_TO_EDIT_RECURRING_AMOUNT:
      dispatch(GoalActions.navigateToEditRecurringAmount(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.NAVIGATE_TO_ADD_RECURRING_AMOUNT:
      dispatch(InvestmentActions.selectInvestmentAmount(action[CHILD_ENTITIES.CHILD_ID], action[INVESTMENT_ENTITIES.INVESTMENT_NAME], action[COMMON_ENTITIES.NAVIGATOR], action[GOAL_ENTITIES.IS_ADD_RECURRING], action[INVESTMENT_ENTITIES.PRODUCT]))
      break

    case localActions.SHOW_URL:
      dispatch(SettingActions.showWebWindow(action[SETTINGS_ENTITIES.URL], action[SETTINGS_ENTITIES.HEADING], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.FETCH_GOAL_DETAIL:
      dispatch(GoalActions.fetchGoalDetail(action[USER_ENTITIES.USER_ID], action[GOAL_ENTITIES.GID]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_INVESTMENT: 'ADD_INVESTMENT',
  HIDE_RISK: 'HIDE_RISK',
  FETCH_PERFORMANCE_DATA: 'FETCH_PERFORMANCE_DATA',
  FETCH_INVEST_CHART_DATA: 'FETCH_INVEST_CHART_DATA',
  INVEST: 'invest',
  NAVIGATE_TO_WITHDRAW: 'navigateToWithdraw',
  NAVIGATE_TO_ADD_RECURRING_AMOUNT: 'NAVIGATE_TO_ADD_RECURRING_AMOUNT',
  NAVIGATE_TO_EDIT_RECURRING_AMOUNT: 'NAVIGATE_TO_EDIT_RECURRING_AMOUNT',
  SHOW_URL: 'showURL',
  FETCH_GOAL_DETAIL: 'fetchGoalDetail'
}

const mapStateToProps = (state, props) => {
  // get user id
  let userID = getUserID(state.root.u)
  // get child ID
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // firstname
  const firstname = getFirstName(state.root.children, childID)
  // goal
  const goalID = props[INVESTMENT_ENTITIES.INVESTMENT_ID]
  // balance
  const balance = props[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]
  // goalname
  const goalName = props[INVESTMENT_ENTITIES.INVESTMENT_NAME]
  // const recurring amount
  const recurringAmount = props[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT] || 0
  // display only
  const isDisplayOnly = props[INVESTMENT_ENTITIES.IS_DISPLAY_ONLY]
  // display only
  const recurrenceExixts = props[INVESTMENT_ENTITIES.IS_RECURRENCE_INVESTMENT_EXIST]
  // product
  const portfolio = props[INVESTMENT_ENTITIES.PRODUCT]
  // identity token
  const idToken = getIDToken(state.auth)
  // investment
  const investment = getInvestment(state.root.investments, goalID)
  const stock = (investment && investment[INVESTMENT_ENTITIES.STOCKS] && investment[INVESTMENT_ENTITIES.STOCKS][0])

  let valuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  let isTickerProcessing = isPerformanceFetchProcessing(state.root.goals)
  let tickerDetail = (portfolio && getTickerDetail(state.root.goals, portfolio[INVESTMENT_ENTITIES.PRODUCT_TICKER])) || undefined

  let lastUpdatedTime = getLastUpdatedTime(state.root.u)
  let chartData = getInvestChartData(state.root.goals) || []

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    portfolio: portfolio,

    // portfolio detail
    portfolioDetail: 'Suited for long term investors that want to take on more risk for the expecttion of greater long term growth.\n\nWhen you’re investing for the long term taking on a little more risk can be a good thing. Be prepared to see it drop occasionally, but be patient and you can expect some strong long term growth from this agressive investment option.',

    childID: childID,

    firstname,

    userID: userID,

    isDisplayOnly,

    recurrenceExixts,

    goalID,

    goalName,

    balance,

    recurringAmount,

    lastUpdatedTime,

    ticker: tickerDetail,

    idToken: idToken,

    chartData,

    stock,

    isTickerProcessing: isTickerProcessing
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
