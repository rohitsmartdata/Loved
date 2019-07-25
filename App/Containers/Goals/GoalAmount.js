/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 3/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change, reset}
  from 'redux-form'
import Screen
  from '../../Components/Goals/GoalAmount'
import {GoalActions, getGoalName, isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {getDOB, getFirstName, isChildSSNAdded, ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {FORM_TYPES, ANALYTIC_PROPERTIES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, FREQUENCY, getPortfolio}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import {getUserID, isFundingSourceLinked, getRiskScore}
  from '../../Redux/Reducers/UserReducer'
import moment
  from 'moment'
import {LW_EVENT_TYPE, LW_SCREEN, LW_EVENTS}
  from '../../Utility/Mapper/Screens'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {

    case localActions.UPDATE_RECURRING_AMOUNT:
    case localActions.UPDATE_RECURRING_TYPE:
    case localActions.UPDATE_GOAL_AMOUNT:
    case localActions.UPDATE_GOAL_DURATION:
    case localActions.UPDATE_GOAL_MATURITY_AGE:
    case localActions.UPDATE_RETURNS:
    case localActions.UPDATE_GOAL_AMOUNT_FORECAST:
    case localActions.UPDATE_RISK:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break

    case localActions.CUSTOMIZE_PORTFOLIO:
      dispatch(GoalActions.customizePortfolio(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.SKIP:
      dispatch(reset(FORM_TYPES.ADD_GOAL))
      dispatch(GoalActions.skipGoal(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.ADD_GOAL:
      let selectedRisk = action[GOAL_ENTITIES.PORTFOLIO_RISK]
      let suggestedRisk = action[GOAL_ENTITIES.SUGGESTED_RISK]
      let isChildSSNAdded = action[CHILD_ENTITIES.IS_SSN_ADDED]

      if (selectedRisk === suggestedRisk) {
        if (isChildSSNAdded) {
          dispatch(GoalActions.addGoal(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.PORTFOLIO_RISK], action[GOAL_ENTITIES.DURATION], action[GOAL_ENTITIES.GOAL_AMOUNT], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[GOAL_ENTITIES.RECURRING_FREQUENCY], action[USER_ENTITIES.IS_PLAID_LINKED], action[COMMON_ENTITIES.NAVIGATOR]))
        } else {
          dispatch(ChildActions.askSsn(
            action[CHILD_ENTITIES.CHILD_ID],
            {
              [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
              [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
              [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME],
              [GOAL_ENTITIES.PORTFOLIO_RISK]: action[GOAL_ENTITIES.PORTFOLIO_RISK],
              [GOAL_ENTITIES.DURATION]: action[GOAL_ENTITIES.DURATION],
              [GOAL_ENTITIES.GOAL_AMOUNT]: action[GOAL_ENTITIES.GOAL_AMOUNT],
              [GOAL_ENTITIES.RECURRING_AMOUNT]: action[GOAL_ENTITIES.RECURRING_AMOUNT],
              [GOAL_ENTITIES.RECURRING_FREQUENCY]: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
              [USER_ENTITIES.IS_PLAID_LINKED]: action[USER_ENTITIES.IS_PLAID_LINKED]
            },
            false, // is investment
            action[COMMON_ENTITIES.NAVIGATOR]
          ))
        }
      } else {
        dispatch(GoalActions.notifyRiskAssessment(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.PORTFOLIO_RISK], action[GOAL_ENTITIES.DURATION], action[GOAL_ENTITIES.GOAL_AMOUNT], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[GOAL_ENTITIES.RECURRING_FREQUENCY], action[USER_ENTITIES.IS_PLAID_LINKED], action[GOAL_ENTITIES.SUGGESTED_RISK], action[COMMON_ENTITIES.NAVIGATOR]))
      }
      break

    case localActions.SHOW_DISCLAIMER:
      dispatch(GoalActions.showDisclaimer(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {

  // update goal amount
  UPDATE_GOAL_AMOUNT: 'UPDATE_GOAL_AMOUNT',

  // update returns
  UPDATE_RETURNS: 'UPDATE_RETURNS',

  // update the recurring amount selected by user
  UPDATE_RECURRING_AMOUNT: 'UPDATE_RECURRING_AMOUNT',

  // update goal duration
  UPDATE_GOAL_DURATION: 'UPDATE_GOAL_DURATION',

  // customize portfolio
  CUSTOMIZE_PORTFOLIO: 'CUSTOMIZE_PORTFOLIO',

  // update the type of recurring frequency
  UPDATE_RECURRING_TYPE: 'UPDATE_RECURRING_TYPE',

  // update goal maturity age
  UPDATE_GOAL_MATURITY_AGE: 'UPDATE_GOAL_MATURITY_AGE',

  // update goal Amount forecast
  UPDATE_GOAL_AMOUNT_FORECAST: 'UPDATE_GOAL_AMOUNT_FORECAST',

  // submit the goal information to server
  SET_GOAL_AMOUNT: 'SET_GOAL_AMOUNT',

  // update portfolio risk
  UPDATE_RISK: 'UPDATE_RISK',

  SKIP: 'SKIP',

  ADD_GOAL: 'ADD_GOAL',

  SHOW_DISCLAIMER: 'showDisclaimer',

  NOTIFY_RISK_ASSESSMENT: 'notifyRiskAssessment'
}

const mapStateToProps = (state, props) => {
  // get user id
  let userID = getUserID(state.root.u)
  // get child ID
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // child's first name
  const firstname = getFirstName(state.root.children, childID)
  // get goalID
  const goalID = props[GOAL_ENTITIES.GID]
  // get child's date of birth
  const childDOB = getDOB(state.root.children, childID)
  // is plaid already linked
  const isPlaidLinked = isFundingSourceLinked(state.root.u)
  // is goal processing
  const isProcessing = isGoalProcessing(state.root.goals)
  // get risk score
  const riskScore = getRiskScore(state.root.u)

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal amount
  let goalAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT]) || 0
  // recurring amount
  let recurringAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.RECURRING_AMOUNT]) || 20
  // recurring frequency
  let recurringFrequency = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.RECURRING_FREQUENCY]) || FREQUENCY.ONE_WEEK
  // goal duration
  let duration = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.DURATION])
  // risk selected
  let portfolioRisk = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.PORTFOLIO_RISK])
  // goal name
  const goalName = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])
  // tentating child target age
  const goalMaturityAge = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_MATURITY_AGE]) || 18
  // goal amount forecast
  const goalAmountForecast = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT_FORECAST]) || 0

  let age = 0
  if (childDOB) {
    let birthDate = moment(childDOB).format('YYYY-MM-DD')
    let currentDate = moment()
    age = currentDate.diff(birthDate, 'y')
  }

  let portfolio = getPortfolio(portfolioRisk)
  let rate = portfolio.GROWTH

  let growthRate
  switch (recurringFrequency) {
    case FREQUENCY.ONE_WEEK:
      growthRate = rate / 52
      break
    case FREQUENCY.FORTNIGHT:
      growthRate = rate / 26
      break
    case FREQUENCY.ONE_MONTH:
      growthRate = rate / 12
      break
    default:
      growthRate = rate / 52
      break
  }

  // is child ssn added
  let childSSNAdded = isChildSSNAdded(state.root.children, childID)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // user id
    userID: userID,
    // child id
    childID: childID,
    // goal id
    goalID: goalID,
    // is plaid linked already ?
    isPlaidLinked: isPlaidLinked,
    // child date of birth
    childDOB: childDOB,
    // child age
    age: age,
    // rate
    rate: rate,
    // goal amount
    goalAmount: parseInt(goalAmount),
    // recurring amount
    recurringAmount: recurringAmount,
    // recurring frequency
    recurringFrequency: recurringFrequency,
    // portfolio risk
    portfolioRisk: portfolioRisk,
    // growth rate
    growthRate: growthRate,
    // duration
    duration: parseInt(duration),
    // goal name
    goalName: goalName,
    // first name
    firstname: firstname,
    // navigator title
    navigatorTitle: props[COMMON_ENTITIES.NAVIGATOR_TITLE],
    // is goal processing
    isProcessing: isProcessing,
    // goal maturity age
    goalMaturityAge,
    // goal amount forecast
    goalAmountForecast,
    // risk score
    riskScore: riskScore || 0,

    isChildSSNAdded: childSSNAdded,

    popButton: props[COMMON_ENTITIES.CAN_POP]
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
