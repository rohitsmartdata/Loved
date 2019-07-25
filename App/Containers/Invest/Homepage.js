/* eslint-disable no-trailing-spaces */
/**
 * Created by demon on 29/4/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Invest/Homepage'
import {ChildActions, getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestment, getInvestmentGrowth}
  from '../../Redux/Reducers/InvestmentReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, FREQUENCY}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.INVEST:
      dispatch(GoalActions.investOnGoal(
        action[CHILD_ENTITIES.CHILD_ID],
        action[INVESTMENT_ENTITIES.INVESTMENT_ID],
        action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
        action[COMMON_ENTITIES.NAVIGATOR],
        true
      ))
      break
    case localActions.HIDE_GOAL:
      dispatch(ChildActions.hideGoal(action[COMMON_ENTITIES.NAVIGATOR]))
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
  FETCH_CHART_DATA: 'FETCH_CHART_DATA',
  NAVIGATE_TO_EDIT_GOAL: 'NAVIGATE_TO_EDIT_GOAL'
}

const mapStateToProps = (state, props) => {
  // goal id
  let investmentID = props[INVESTMENT_ENTITIES.INVESTMENT_ID]
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child's first name
  let childName = getFirstName(state.root.children, childID)
  // goal's
  let investment = getInvestment(state.root.investments, investmentID)
  // growth value
  let growth = getInvestmentGrowth(state.root.investments, investmentID)

  // get recurring payment
  let recurringPayment
  let instructions = investment[INVESTMENT_ENTITIES.INVESTMENT_INSTRUCTIONS]
  if (instructions) {
    instructions.map(i => {
      let frequency = i[INVESTMENT_ENTITIES.INVESTMENT_INSTRUCTION_FREQUENCY]
      switch (frequency) {
        case FREQUENCY.ONE_WEEK:
          recurringPayment = {
            title: '$' + i[INVESTMENT_ENTITIES.INVESTMENT_INSTRUCTION_AMOUNT] + ' per week'
          }
          break
        case FREQUENCY.ONE_MONTH:
          recurringPayment = {
            title: '$' + i[INVESTMENT_ENTITIES.INVESTMENT_INSTRUCTION_AMOUNT] + ' per week'
          }
          break
        case FREQUENCY.FORTNIGHT:
          recurringPayment = {
            title: '$' + i[INVESTMENT_ENTITIES.INVESTMENT_INSTRUCTION_AMOUNT] + ' per week'
          }
          break
      }
    })
  }

  // get last updated time
  let lastUpdatedTime = investment[INVESTMENT_ENTITIES.LAST_UPDATED_TIME]

  return {
    // send local actions for (presentation <--> container)
    localActions,
    // investment id
    investmentID,
    // child id
    childID,
    // child name
    childName,
    // investment
    investment,
    // growth
    growth,
    // recurrring payment
    recurringPayment,
    // last updated time
    lastUpdatedTime
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
