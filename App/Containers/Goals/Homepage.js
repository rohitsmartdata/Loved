/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 19/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/Homepage'
import {ChildActions, getFirstName, getDOB}
  from '../../Redux/Reducers/ChildReducer'
import {getGoal, GoalActions, isFetchGoalDetailProcessing, getGrowth, getStocks, getTotalGoalAmount}
  from '../../Redux/Reducers/GoalReducer'
import {
  getDebugMode, getUserID, UserActions
}
  from '../../Redux/Reducers/UserReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES, FREQUENCY}
  from '../../Utility/Mapper/Common'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import moment
  from 'moment'
import _
  from 'lodash'
import {USER_ENTITIES} from '../../Utility/Mapper/User'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
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
    case localActions.EDIT_GOAL:
      dispatch(GoalActions.navigateToEditGoal(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break
    case localActions.NAVIGATE_TO_EDIT_RECURRING_AMOUNT:
      dispatch(GoalActions.navigateToEditRecurringAmount(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.HIDE_GOAL:
      dispatch(ChildActions.hideGoal(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.FETCH_CHART_DATA:
      dispatch(GoalActions.fetchGoalChartData(action[GOAL_ENTITIES.GID]))
      break
    case localActions.FETCH_GOAL_DETAILS:
      dispatch(GoalActions.fetchGoalDetail(action[USER_ENTITIES.USER_ID], action[GOAL_ENTITIES.GID]))
      break
    case localActions.NAVIGATE_TO_EDIT_GOAL:
      dispatch(GoalActions.navigateToEditGoal(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.CLOSE_ARTICLE:
      dispatch(UserActions.closeArticle(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----, ', action)
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  INVEST: 'INVEST',
  HIDE_GOAL: 'HIDE_GOAL',
  CLOSE_ARTICLE: 'CLOSE_ARTICLE',
  FETCH_CHART_DATA: 'FETCH_CHART_DATA',
  FETCH_GOAL_DETAILS: 'FETCH_GOAL_DETAILS',
  NAVIGATE_TO_EDIT_GOAL: 'NAVIGATE_TO_EDIT_GOAL',
  NAVIGATE_TO_WITHDRAW: 'NAVIGATE_TO_WITHDRAW',
  EDIT_GOAL: 'EDIT_GOAL',
  NAVIGATE_TO_EDIT_RECURRING_AMOUNT: 'NAVIGATE_TO_EDIT_RECURRING_AMOUNT'
}

const mapStateToProps = (state, props) => {
  // goal id
  let goalID = props[GOAL_ENTITIES.GID]
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // user id

  let userID = getUserID(state.root.u)
  // child's first name
  let childName = getFirstName(state.root.children, childID)
  // child's DIB
  let childDOB = getDOB(state.root.children, childID)
  // goal's
  let goal = getGoal(state.root.goals, goalID)

  // total goal amount
  let totalGoalAmount = getTotalGoalAmount(state.root.goals, goalID)
  // id detail processing
  let isDetailProcessing = isFetchGoalDetailProcessing(state.root.goals)
  // growth value
  let growth = getGrowth(state.root.goals, goalID)
  // stocks
  let stocks = getStocks(state.root.goals, goalID)
  // debug mode
  let debugMode = getDebugMode(state.root.u)

  // calculate goal age
  let targetAge
  if (goal && goal[GOAL_ENTITIES.END_DATE]) {
    let birthDate = moment(childDOB, 'YYYY-MM-DD')
    let currentDate = moment()
    let childAge = currentDate.diff(birthDate, 'y')
    let goalEndDate = moment(goal[GOAL_ENTITIES.END_DATE], 'YYYY-MM-DD')
    let goalTargetAge = goalEndDate.diff(currentDate, 'y')
    targetAge = childAge + goalTargetAge
  }

  // get recurring payment
  let recurringPayment
  if (goal && goal[GOAL_ENTITIES.INSTRUCTIONS]) {
    let instructions = _.cloneDeep(goal[GOAL_ENTITIES.INSTRUCTIONS])

    instructions && Object.values(instructions).map(i => {
      let frequency = i[GOAL_ENTITIES.INSTRUCTION_FREQUENCY]
      switch (frequency) {
        case FREQUENCY.ONE_WEEK:
          recurringPayment = {
            title: '$' + i[GOAL_ENTITIES.INSTRUCTION_AMOUNT] + ' per week'
          }
          break
        case FREQUENCY.ONE_MONTH:
          recurringPayment = {
            title: '$' + i[GOAL_ENTITIES.INSTRUCTION_AMOUNT] + ' per month'
          }
          break
        case FREQUENCY.FORTNIGHT:
          recurringPayment = {
            title: '$' + i[GOAL_ENTITIES.INSTRUCTION_AMOUNT] + ' per fortnight'
          }
          break
      }
    })
  }

  // get last updated time
  let lastUpdatedTime = goal[GOAL_ENTITIES.LAST_UPDATED_TIME]

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    goalID: goalID,
    childID: childID,
    userID: userID,
    goal: goal,
    childName: childName,
    growth: growth,
    isGoalDetailProcessing: isDetailProcessing,
    stocks: stocks,
    debugMode,
    targetAge,
    recurringPayment,
    lastUpdatedTime,
    totalGoalAmount
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
