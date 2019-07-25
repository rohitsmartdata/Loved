/* eslint-disable no-unused-vars,no-trailing-spaces,padded-blocks */
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
  from '../../Components/Goals/LI_GoalPortfolio'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {getUserID, getRiskScore}
  from '../../Redux/Reducers/UserReducer'
import {getFirstName, getDOB}
  from '../../Redux/Reducers/ChildReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
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
    case localActions.UPDATE_RISK:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break
    case localActions.SELECT_GOAL_FUND:
      dispatch(GoalActions.selectGoalFund(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.GOAL_CREATE_PORTFOLIO,
        properties: {
          goal_name: action[GOAL_ENTITIES.NAME],
          goal_fund: action[GOAL_ENTITIES.GOAL_AMOUNT],
          goal_age: action[GOAL_ENTITIES.GOAL_MATURITY_AGE],
          portfolio_type: action[GOAL_ENTITIES.PORTFOLIO_RISK]
        }
      })
      // *********** Log Analytics ***********
      break
    case localActions.SHOW_DISCLAIMER:
      dispatch(GoalActions.showDisclaimer(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

const portfolioConstant = {
  CASH: '04',
  CONSERVATIVE: '03',
  MODERATE: '02',
  AGGRESSIVE: '01'
}

const computeSuggestedPortfolio = (riskScore, year) => {
  if (riskScore && year) {
    if (year === 1 || year <= 2) {

      return portfolioConstant.CASH

    } else if (year > 2 && year <= 3) {

      if (riskScore === 100) {
        return portfolioConstant.CONSERVATIVE
      } else return portfolioConstant.CASH

    } else if (year > 3 && year <= 5) {

      if (riskScore === 100) {
        return portfolioConstant.MODERATE
      } else if (riskScore > 75) {
        return portfolioConstant.CONSERVATIVE
      } else return portfolioConstant.CASH

    } else if (year > 5 && year <= 7) {

      if (riskScore === 100) {
        return portfolioConstant.AGGRESSIVE
      } else if (riskScore > 7) {
        return portfolioConstant.MODERATE
      } else return portfolioConstant.CONSERVATIVE

    } else if (year > 7 && year <= 10) {

      if (riskScore > 75) {
        return portfolioConstant.AGGRESSIVE
      } else if (riskScore >= 50) {
        return portfolioConstant.MODERATE
      } else return portfolioConstant.CONSERVATIVE

    } else if (year > 10 && year <= 15) {

      if (riskScore >= 50) {
        return portfolioConstant.AGGRESSIVE
      } else return portfolioConstant.MODERATE

    } else if (year > 15 && year <= 21) {
      return portfolioConstant.AGGRESSIVE
    } else return portfolioConstant.CASH
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
  UPDATE_RISK: 'updateRisk',
  // continue
  CONTINUE: 'CONTINUE',
  // select goal fund
  SELECT_GOAL_FUND: 'SELECT_GOAL_FUND',

  SHOW_DISCLAIMER: 'showDisclaimer'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child first name
  let firstname = getFirstName(state.root.children, childID)
  // get child's date of birth
  const childDOB = getDOB(state.root.children, childID)
  let age = 0
  if (childDOB) {
    let birthDate = moment(childDOB).format('YYYY-MM-DD')
    let currentDate = moment()
    age = currentDate.diff(birthDate, 'y')
  }

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal name
  let goalName = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])
  // risk selected
  let portfolioRisk = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.PORTFOLIO_RISK]) || '02'
  // goal amount
  let goalAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT])
  // tentating child target age
  const goalMaturityAge = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_MATURITY_AGE])
  // is modal or screen
  let pushFunc = props['pushFunc']
  // is modal
  let isModal = pushFunc !== undefined
  // get risk score
  let riskScore = getRiskScore(state.root.u) || 75
  riskScore = riskScore === 'NaN' ? 75 : riskScore

  const goalDuration = (goalMaturityAge && (goalMaturityAge - age)) || 0
  const recommended = computeSuggestedPortfolio(riskScore, goalDuration)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // goal name
    goalName,

    // child id
    childID,

    // user id
    userID,

    goalAmount,

    // child name
    firstName: firstname,

    // portfolio risk
    portfolioRisk,

    // is modal
    isModal,

    // risk score
    riskScore,

    // recommended
    recommended,

    // duration
    goalDuration,

    // goal maturity age
    goalMaturityAge
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
