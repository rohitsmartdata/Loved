/* eslint-disable no-trailing-spaces */
/**
 * Created by demon on 26/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Invest/LI_Confirm'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {
  isTransferProcessing, getGoalImage, isWithdrawProcessing, getLatestTransfer, getGoalName, GoalActions
}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestmentName, getInvestmentImage, InvestmentActions}
  from '../../Redux/Reducers/InvestmentReducer'
import {getUserID, UserActions}
  from '../../Redux/Reducers/UserReducer'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.DISMISS_MODAL:
      dispatch(InvestmentActions.investmentCompleted(action[COMMON_ENTITIES.NAVIGATOR], action['IS_MODEL']))
      break
    case localActions.REFRESH_STATE:
      dispatch(UserActions.fetchUserDetail(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.BANK_CONNECT:
      dispatch(GoalActions.confirmBankConnection(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
        action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
        action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  // dismiss modal
  DISMISS_MODAL: 'dismissModal',
  // refresh user detail
  REFRESH_STATE: 'refreshState',
  // navigate to connect bank screen
  BANK_CONNECT: 'BANK_CONNECT'
}

const mapStateToProps = (state, props) => {
  // is it operationally stale
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // goal id
  const goalID = props[GOAL_ENTITIES.GID]
  // child's firstname
  const firstname = getFirstName(state.root.children, childID)
  // goal name
  const goalName = props[INVESTMENT_ENTITIES.INVESTMENT_NAME] || props['goalName'] || getGoalName(state.root.goals, goalID) || getInvestmentName(state.root.investments, goalID)
  // investment amount
  let investmentAmount = props[GOAL_ENTITIES.RECURRING_AMOUNT]
  // recurring frequency
  let investmentFrequency = props[GOAL_ENTITIES.RECURRING_FREQUENCY]
  // const is withdraw request
  let isWithdraw = props[GOAL_ENTITIES.IS_WITHDRAW]

  // latest transfer object
  let transferObj = getLatestTransfer(state.root.goals)
  let nextTransferDate = transferObj && transferObj['instruction_next_date']

  const isProcessing = isTransferProcessing(state.root.goals) || isWithdrawProcessing(state.root.goals)

  // get ticker name
  let tickerName = props['tickerName']
  // backdrop url
  let images = (getInvestmentImage(state.root.investments, tickerName) || getGoalImage(state.root.goals, tickerName))
  let backdropURL = (images && images[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL])

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // user id
    userID: userID,
    // child id
    childID: childID,
    // firstname
    firstname: firstname,
    // goal name
    goalName: goalName,
    // backdrop url
    backdropURL,
    // is processing
    isProcessing,
    // investment amount
    investmentAmount: investmentAmount && parseFloat(investmentAmount),
    // investment frequency
    investmentFrequency,
    // is withdraw request
    isWithdraw,
    // next transfer object
    nextTransferDate,
    // goal ID
    goalID
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
