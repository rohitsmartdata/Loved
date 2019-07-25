/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import Screen
  from '../../Components/Goals/LI_GoalDetail'
import {FORM_TYPES}
  from '../../Config/contants'
import {getChildren, getDOB, getFirstName, getImageUrl, getImage}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, UserActions, getLastUpdatedTime}
  from '../../Redux/Reducers/UserReducer'
import {getIDToken}
  from '../../Redux/Reducers/AuthReducer'
import {InvestmentActions, isProcessing, getInvestment}
  from '../../Redux/Reducers/InvestmentReducer'
import {GoalActions, getTickerDetail, getGoalImage, getGoal, isPerformanceFetchProcessing}
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

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type} = action
  switch (type) {
    case localActions.SELL_INVESTMENT:
      dispatch(InvestmentActions.sellInvestment(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SET_INVESTMENT:
      dispatch(InvestmentActions.showInvestmentFund(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR], action[GOAL_ENTITIES.GID]))
      break
    case localActions.BUY_INVESTMENT:
      dispatch(InvestmentActions.buyInvestment(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.EDIT_RECURRING:
      dispatch(InvestmentActions.updateRecurring(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.EDIT_GOAL:
      dispatch(InvestmentActions.updateGoal(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  BUY_INVESTMENT: 'BUY_INVESTMENT',
  SET_INVESTMENT: 'SET_INVESTMENT',
  SELL_INVESTMENT: 'SELL_INVESTMENT',
  EDIT_RECURRING: 'EDIT_RECURRING',
  EDIT_GOAL: 'EDIT_GOAL'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // get childID
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // get investment id
  let goalID = props[GOAL_ENTITIES.GID]
  // investment
  let goal = goalID && getGoal(state.root.goals, goalID)
  // let goal name
  let goalName = (goal && goal[GOAL_ENTITIES.NAME])
  // let goal image
  let goalImages = (goalName && getGoalImage(state.root.goals, goalName))
  // let backdrop url
  let backdropURL = (goalImages && goalImages[GOAL_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL])
  // child's firstname
  let firstName = getFirstName(state.root.children, childID)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // child id
    childID,

    // first name
    firstName,

    // goal id
    goalID,

    // goal
    goal,

    // backdrop url
    backdropURL
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
