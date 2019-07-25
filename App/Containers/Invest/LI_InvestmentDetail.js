/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 15/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Invest/LI_InvestmentDetail'
import {FORM_TYPES}
  from '../../Config/contants'
import { getFirstName, isSSNAdded }
  from '../../Redux/Reducers/ChildReducer'
import { getUserID, getLastUpdatedTime, isUserSSNAdded, isStoreUserSSNProcessing, getUserEmail }
  from '../../Redux/Reducers/UserReducer'
import {getIDToken}
  from '../../Redux/Reducers/AuthReducer'
import {InvestmentActions, getStockInfo, getInvestmentImage, getInvestment}
  from '../../Redux/Reducers/InvestmentReducer'
import {GoalActions, getTickerDetail, getInvestChartData, isPerformanceFetchProcessing, isGraphFetchProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {events, errorKeywords}
  from '../../Utility/Mapper/Tracking'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type} = action
  switch (type) {
    case localActions.GET_TICKER_DATA:
      dispatch(GoalActions.fetchPerformanceData(action[AUTH_ENTITIES.ID_TOKEN], action[GOAL_ENTITIES.TICKER_NAME]))
      break
    case localActions.FETCH_INVEST_CHART_DATA:
      dispatch(GoalActions.fetchInvestChartData(action[USER_ENTITIES.EMAIL_ID], action[GOAL_ENTITIES.TICKER_NAME]))
      break
    case localActions.SHOW_INVESTMENT_FUND:
      dispatch(InvestmentActions.showInvestmentFund(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.INVESTMENT_SELECTED,
        properties: {
          name: action[INVESTMENT_ENTITIES.INVESTMENT_NAME]
        }
      })
      // *********** Log Analytics ***********
      break
    case localActions.FETCH_GOAL_DETAIL:
      dispatch(GoalActions.fetchGoalDetail(action[USER_ENTITIES.USER_ID], action[GOAL_ENTITIES.GID]))
      break
    case localActions.SELL_INVESTMENT:
      dispatch(InvestmentActions.sellInvestment(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.BUY_INVESTMENT:
      dispatch(InvestmentActions.buyInvestment(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SET_INVESTMENT:
      dispatch(InvestmentActions.showInvestmentFund(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR], action[GOAL_ENTITIES.GID]))
      break
    case localActions.EDIT_RECURRING:
      dispatch(InvestmentActions.updateRecurring(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.FLUSH_TICKER_DATA:
      dispatch(GoalActions.flushInvestChartData(action[GOAL_ENTITIES.TICKER_NAME]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  GET_TICKER_DATA: 'GET_TICKER_DATA',
  FETCH_INVEST_CHART_DATA: 'FETCH_INVEST_CHART_DATA',
  SHOW_INVESTMENT_FUND: 'SHOW_INVESTMENT_FUND',
  BUY_INVESTMENT: 'BUY_INVESTMENT',
  SET_INVESTMENT: 'SET_INVESTMENT',
  SELL_INVESTMENT: 'SELL_INVESTMENT',
  EDIT_RECURRING: 'EDIT_RECURRING',
  FLUSH_TICKER_DATA: 'FLUSH_TICKER_DATA',
  FETCH_GOAL_DETAIL: 'FETCH_GOAL_DETAIL'
}

const mapStateToProps = (state, props) => {
  // get user id
  let userID = getUserID(state.root.u)
  // get user email id
  const emailID = getUserEmail(state.root.u)
  // get childID
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // get investment id
  let investmentID = props[INVESTMENT_ENTITIES.INVESTMENT_ID]
  // investment
  let investment = investmentID && getInvestment(state.root.investments, investmentID)
  // bought
  let isBought = investmentID !== undefined

  // is user ssn added
  let userSSNAdded = isUserSSNAdded(state.root.u)
  // is store user ssn processing
  let userSSNStoreProcessing = isStoreUserSSNProcessing(state.root.u)

  let firstName = getFirstName(state.root.children, childID)
  // is processing ticker fetching
  let isTickerProcessing = isPerformanceFetchProcessing(state.root.goals)
  // is processing graph fetching
  let isFetchingGraph = isGraphFetchProcessing(state.root.goals)
  // identity token
  const idToken = getIDToken(state.auth)
  // last updated time
  let lastUpdatedTime = getLastUpdatedTime(state.root.u)

  let valuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  // investment name
  let investmentName = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_NAME]) || (valuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_NAME])
  // investment ticker name
  let tickerName = (investment && investment[GOAL_ENTITIES.TICKER_NAME]) || (valuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.PRODUCT_TICKER])
  // backdrop URL
  let backdropImage = (investmentID && getInvestmentImage(state.root.investments, tickerName))
  // backdrop
  let backdropURL = (backdropImage && backdropImage[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]) || (investment && investment[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]) || (valuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL])

  // stock info
  let stockInfo = getStockInfo(state.root.investments, investmentID)

  // ticker detail
  let tickerDetail = (getTickerDetail(state.root.goals, tickerName))

  let investChartData = (getInvestChartData(state.root.goals, tickerName))

  // is modal or screen
  let pushFunc = props['pushFunc']
  let isModal = pushFunc !== undefined

  let currentRecurringAmount
  let currentRecurringFrequency

  if (investmentID) {
    let goal = getInvestment(state.root.investments, investmentID)
    currentRecurringAmount = goal[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT]
    currentRecurringFrequency = goal[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]
  }

  // is ssn added
  const isssnAdded = isSSNAdded(state.root.children, childID)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // user ssn added
    userSSNAdded,

    // is user ssn addition processing
    userSSNStoreProcessing,

    // email id
    emailID,

    // child id
    childID,

    // investment id
    investmentID,

    // investment
    investment,

    // is modal
    isModal,

    // is investment already bought
    isBought,

    // first name
    firstName,

    // stock info
    stockInfo,

    // is ticker processing
    isTickerProcessing,

    // is graph fetch processing
    isFetchingGraph,

    // investment name
    investmentName,

    // ticker name
    tickerName,

    // ticker detail
    tickerDetail,

    investChartData,

    // backdrop url
    backdropURL,

    // last updated time
    lastUpdatedTime,

    // is loading graph data
    isLoadingGraphData: isFetchingGraph,

    // id token
    idToken,
    currentRecurringAmount,
    currentRecurringFrequency,
    isssnAdded
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
