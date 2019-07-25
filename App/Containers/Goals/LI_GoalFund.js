/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 14/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change, reset}
  from 'redux-form'
import Screen
  from '../../Components/Goals/LI_GoalFund'
import {UserActions, getGlossary, isFundingSourceLinked, getUserID, isFetchingGlossary}
  from '../../Redux/Reducers/UserReducer'
import {getFirstName, getDOB}
  from '../../Redux/Reducers/ChildReducer'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {FORM_TYPES}
  from '../../Config/contants'
import {COMMON_ENTITIES, FREQUENCY, getPortfolio}
  from '../../Utility/Mapper/Common'
import moment
  from 'moment'
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
    case localActions.CONTINUE:
      const pFunc = action['pushFunc']
      pFunc({[CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID], [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME]})
      break
    case localActions.POP:
      const popFunc = action['popFunc']
      popFunc()
      break
    case localActions.PUSH:
      const pushFunc = action['pushFunc']
      pushFunc()
      break
    case localActions.SHOW_DISCLAIMER:
      dispatch(GoalActions.showDisclaimer(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.UPDATE_FUND_AMOUNT:
    case localActions.UPDATE_FUND_FREQUENCY:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break
    case localActions.CONFIRM_GOAL:
      dispatch(GoalActions.confirmGoal(false, {
        [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
        [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
        [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME],
        [GOAL_ENTITIES.PORTFOLIO_RISK]: action[GOAL_ENTITIES.PORTFOLIO_RISK],
        [GOAL_ENTITIES.DURATION]: action[GOAL_ENTITIES.DURATION],
        [GOAL_ENTITIES.GOAL_AMOUNT]: action[GOAL_ENTITIES.GOAL_AMOUNT],
        [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
        [GOAL_ENTITIES.RECURRING_FREQUENCY]: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
        [GOAL_ENTITIES.IS_PLAID_LINKED]: action[GOAL_ENTITIES.IS_PLAID_LINKED]
      }, action[COMMON_ENTITIES.NAVIGATOR]))

      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.GOAL_CREATE_TOPUP,
        properties: {
          goal_name: action[GOAL_ENTITIES.NAME],
          goal_fund: action[GOAL_ENTITIES.GOAL_AMOUNT],
          goal_age: action[GOAL_ENTITIES.GOAL_MATURITY_AGE],
          portfolio_type: action[GOAL_ENTITIES.PORTFOLIO_RISK],
          recurring: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
          amount: action[GOAL_ENTITIES.RECURRING_AMOUNT]
        }
      })
      // *********** Log Analytics ***********
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  // pop
  POP: 'pop',
  // push
  PUSH: 'push',
  // update risk
  UPDATE_FUND_AMOUNT: 'updateFundAmount',
  // update fund frequency
  UPDATE_FUND_FREQUENCY: 'updateFundFrequency',
  // continue
  CONTINUE: 'CONTINUE',
  // create goal
  CONFIRM_GOAL: 'CONFIRM_GOAL',

  SHOW_DISCLAIMER: 'SHOW_DISCLAIMER'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // is plaid linked
  const isPlaidLinked = isFundingSourceLinked(state.root.u)
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child DOB
  let childDOB = getDOB(state.root.children, childID)
  let birthDate = moment(childDOB, 'YYYY-MM-DD')
  let currentDate = moment()
  let age = currentDate.diff(birthDate, 'y')

  // child first name
  let firstname = getFirstName(state.root.children, childID)

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal name
  let goalName = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])
  // goal amount
  let goalAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT])
  // tentating child target age
  const goalMaturityAge = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_MATURITY_AGE])
  // risk selected
  let portfolioRisk = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.PORTFOLIO_RISK])
  // recurring amount
  let recurringAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.RECURRING_AMOUNT])
  let initialRecurringAmount = recurringAmount
  // recurring frequency
  let recurringFrequency = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.RECURRING_FREQUENCY]) || FREQUENCY.ONE_WEEK
  // is modal or screen
  let pushFunc = props['pushFunc']
  // is modal
  let isModal = pushFunc !== undefined

  if (!recurringAmount) {
    let portfolio = getPortfolio(portfolioRisk)
    let growth = portfolio.GROWTH
    let r = growth && parseFloat(growth)
    let n = goalMaturityAge - age
    let duration
    switch (recurringFrequency) {
      case FREQUENCY.ONE_WEEK:
        duration = 52
        break
      case FREQUENCY.ONE_MONTH:
        duration = 12
        break
      default: duration = 52
    }

    let x = goalAmount * (r / duration)
    let y1 = (1 + (r / duration))
    let y2 = n * duration
    let y3 = Math.pow(y1, y2)
    let y4 = y3 - 1
    let z = x / y4
    recurringAmount = Math.ceil(z)
  }

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // goal name
    goalName,

    // is plaid linked
    isPlaidLinked,

    // child id
    childID,

    // age
    age,

    // is modal
    isModal,

    // goal amount
    goalAmount,

    // goal maturity age
    goalMaturityAge,

    // initial rec freq
    initialRecurringAmount,

    // portfolio risk
    portfolioRisk,

    // child name
    firstName: firstname,

    // recurring amount
    recurringAmount,

    // recurring frequency
    recurringFrequency
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
