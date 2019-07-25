/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 24/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Sprout/ChildView'
import {ChildActions, getChildren, getImage, getImageUrl}
  from '../../Redux/Reducers/ChildReducer'
import {getGoals, GoalActions, getGoalImage}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestments, getInvestmentImage, InvestmentActions}
  from '../../Redux/Reducers/InvestmentReducer'
import {getUserID, UserActions, getDebugMode, getLastUpdatedTime}
  from '../../Redux/Reducers/UserReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.ADD_NEW_GOAL:
      // dispatch(ChildActions.addNewGoal(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(UserActions.setNavTab('invest', true))
      break

    case localActions.ADD_NEW_INVESTMENT:
      // dispatch(InvestmentActions.addNewInvestment(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(UserActions.setNavTab('invest', false))
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

    case localActions.SHOW_PORTFOLIO_DETAIL:
      dispatch(InvestmentActions.investmentSelected(
        action[CHILD_ENTITIES.CHILD_ID],
        {
          [INVESTMENT_ENTITIES.PRODUCT_NAME]: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
          [INVESTMENT_ENTITIES.PRODUCT_TICKER]: action[INVESTMENT_ENTITIES.INVESTMENT_TICKER_NAME],
          [INVESTMENT_ENTITIES.PRODUCT_PORTFOLIO_ID]: action[INVESTMENT_ENTITIES.PRODUCT_PORTFOLIO_ID],
          [INVESTMENT_ENTITIES.PRODUCT_BOOST_AMOUNT]: action[INVESTMENT_ENTITIES.PRODUCT_BOOST_AMOUNT]
        },
        action[COMMON_ENTITIES.NAVIGATOR],
        true,
        action[INVESTMENT_ENTITIES.INVESTMENT_INTERNAL_ID],
        action[INVESTMENT_ENTITIES.INVESTMENT_ID],
        action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
        action[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT],
        action[INVESTMENT_ENTITIES.IS_RECURRENCE_INVESTMENT_EXIST]
      ))
      break

    case localActions.NAVIGATE_TO_EDIT_RECURRING_AMOUNT:
      dispatch(GoalActions.navigateToEditRecurringAmount(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.EDIT_GOAL:
      dispatch(GoalActions.navigateToEditGoal(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break

    case localActions.SHOW_GOAL:
      dispatch(ChildActions.showGoal(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.NAME],
        action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break

    case localActions.SHOW_INVESTMENT:
      dispatch(InvestmentActions.showInvestment(action[CHILD_ENTITIES.CHILD_ID], action[INVESTMENT_ENTITIES.INVESTMENT_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.NAVIGATE_TO_CHILD_INVESTING:
      dispatch(ChildActions.navigateToChildInvesting(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_NEW_GOAL: 'ADD_NEW_GOAL',
  ADD_NEW_INVESTMENT: 'ADD_NEW_INVESTMENT',
  SHOW_GOAL: 'SHOW_GOAL',
  SHOW_INVESTMENT: 'SHOW_INVESTMENT',
  POPUP: 'popup',
  INVEST: 'invest',
  EDIT_GOAL: 'editGoal',
  NAVIGATE_TO_CHILD_INVESTING: 'NAVIGATE_TO_CHILD_INVESTING',
  NAVIGATE_TO_WITHDRAW: 'navigateToWithdraw',
  NAVIGATE_TO_EDIT_RECURRING_AMOUNT: 'NAVIGATE_TO_EDIT_RECURRING_AMOUNT',
  SHOW_PORTFOLIO_DETAIL: 'showPortfolioDetail'
}

const mapStateToProps = (state, props) => {
  // user ID
  let userID = getUserID(state.root.u)
  // last updated time
  let lastUpdatedTime = getLastUpdatedTime(state.root.u)
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  let goals, investments, children, child, debugMode, childImageUrl, childImage, investmentImages, goalImages
  try {
    goals = childID && getGoals(state.root.goals, childID)
    // investments
    investments = childID && getInvestments(state.root.investments, childID)
    // target child
    children = getChildren(state.root.children)
    child = childID && children[childID]
    // debug mode
    debugMode = getDebugMode(state.root.u)

    childImageUrl = childID && getImageUrl(state.root.children, childID)
    childImage = childID && getImage(state.root.children, childID)

    investmentImages = {}
    investments && Object.values(investments).map(i => {
      let tickerName = i['tickerName']
      let images = (tickerName && getInvestmentImage(state.root.investments, tickerName))
      investmentImages[tickerName] = images
    })
    goalImages = {}
    goals && Object.values(goals).map(goal => {
      let goalName = goal[GOAL_ENTITIES.NAME]
      let images = goal && getGoalImage(state.root.goals, goalName)
      goalImages[goalName] = images
    })
  } catch (err) {
    console.log('error while accessing store :: ', err)
  }

  let goalsPresent = (goals && goals.length > 0) || false
  let investmentPresent = (investments && investments.length > 0) || false

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // first name
    firstName: child && child[CHILD_ENTITIES.FIRST_NAME],
    // user id
    userID: userID,
    // goal object
    goals: goals,
    // investments
    investments,
    // child ID
    childID: childID,
    // child
    child: child,
    // investment images
    investmentImages,
    // goal images
    goalImages,
    // debug mode
    debugMode,
    // child image url
    childImageUrl: childImageUrl,
    // child image
    childImage: childImage,
    // last updated time
    lastUpdatedTime,
    // goals present
    goalsPresent,
    // investment present
    investmentPresent
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
