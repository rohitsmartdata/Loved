/* eslint-disable no-unused-vars,no-trailing-spaces,no-multiple-empty-lines */
/**
 * Created by demon on 26/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/InvestUnderway'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {GoalActions, getLatestTransfer, getGoalName}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestmentName}
  from '../../Redux/Reducers/InvestmentReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_HOMEPAGE:
      // dispatch(GoalActions.navigateToHomepage(action[COMMON_ENTITIES.NAVIGATOR], action[CHILD_ENTITIES.CHILD_ID]))
      dispatch(GoalActions.navigateToActionScreen(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.DISMISS_MODAL:
      dispatch(SettingActions.hideSettings(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_HOMEPAGE: 'NAVIGATE_TO_HOMEPAGE',
  DISMISS_MODAL: 'dismissModal'
}

const mapStateToProps = (state, props) => {
  // is it operationally stale
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // goal id
  const goalID = props[GOAL_ENTITIES.GID]
  // show bank linked
  const showBankLinked = props[COMMON_ENTITIES.SHOW_BANK_LINKED]
  // child's firstname
  const firstname = getFirstName(state.root.children, childID)
  // goal name
  const goalName = props[INVESTMENT_ENTITIES.INVESTMENT_NAME] || getGoalName(state.root.goals, goalID) || getInvestmentName(state.root.investments, goalID)
  // investment amount
  let investmentAmount = props[GOAL_ENTITIES.RECURRING_AMOUNT]
  // const is withdraw request
  let isWithdraw = props[GOAL_ENTITIES.IS_WITHDRAW]

  // latest transfer object
  let transferObj = getLatestTransfer(state.root.goals)
  let nextTransferDate = transferObj && transferObj['instruction_next_date']

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // user id
    userID: userID,
    // child id
    childID: childID,
    // goal id
    goalID,
    // firstname
    firstname: firstname,
    // goal name
    goalName: goalName,
    // investment amount
    investmentAmount: investmentAmount && parseFloat(investmentAmount),
    // is withdraw request
    isWithdraw,
    // next transfer object
    nextTransferDate,
    // show bank linked
    showBankLinked
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
