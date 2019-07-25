/* eslint-disable no-unused-vars,no-trailing-spaces */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/Activity'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {getChildren, ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {getGoals}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestments, isFetchUserInstructionsProcessing}
  from '../../Redux/Reducers/InvestmentReducer'
import {
  UserActions,
  getDebugMode,
  getUserID,
  isFundingSourceLinked
}
  from '../../Redux/Reducers/UserReducer'
import _
  from 'lodash'
import moment
  from 'moment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.FETCH_USER_INSTRUCTIONS:
      dispatch(UserActions.fetchUserInstructions(action[USER_ENTITIES.USER_ID]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================
const getDateString = (date) => {
  return new Date(date).toLocaleString('en-us', { month: 'long' }).toUpperCase() + ' ' + new Date(date).toLocaleString('en-us', { year: 'numeric' }).toUpperCase()
}
export const localActions = {
  FETCH_USER_INSTRUCTIONS: 'fetchUserInstructions'
}

const mapStateToProps = (state) => {
  // user id
  let userID = getUserID(state.root.u)
  // childrens
  const children = getChildren(state.root.children)
  // is processing or not
  const isProcessing = isFetchUserInstructionsProcessing(state.root.investments)
  // debug mode
  const isDebugMode = getDebugMode(state.root.u)

  const isPlaidLinked = isFundingSourceLinked(state.root.u)

  let transfers = {}
  let boostWithdrawals = []
  let boostTransfer = []
  let instructionsArray = []

  Object.values(children).map(child => {
    let goals = getGoals(state.root.goals, child[CHILD_ENTITIES.CHILD_ID])
    goals.map(goal => {
      let obj = {}
      let insObj = {}
      let transactions = goal[GOAL_ENTITIES.TRANSACTIONS]
      let transArr = (transactions && Object.values(transactions)) || []
      let instructions = goal[GOAL_ENTITIES.INSTRUCTIONS]
      let insArr = (instructions && Object.values(instructions)) || []
      insArr.map(o => {
        insObj[CHILD_ENTITIES.FIRST_NAME] = child[CHILD_ENTITIES.FIRST_NAME]
        insObj[CHILD_ENTITIES.CHILD_ID] = child[CHILD_ENTITIES.CHILD_ID]
        insObj[GOAL_ENTITIES.GID] = goal[GOAL_ENTITIES.GID]
        insObj[GOAL_ENTITIES.NAME] = goal[GOAL_ENTITIES.NAME]
        insObj[GOAL_ENTITIES.INSTRUCTION_TYPE] = o[GOAL_ENTITIES.INSTRUCTION_TYPE]
        insObj[GOAL_ENTITIES.INSTRUCTION_FREQUENCY] = o[GOAL_ENTITIES.INSTRUCTION_FREQUENCY]
        insObj[GOAL_ENTITIES.INSTRUCTION_AMOUNT] = o[GOAL_ENTITIES.INSTRUCTION_AMOUNT]
        insObj[GOAL_ENTITIES.INSTRUCTION_STATUS] = o[GOAL_ENTITIES.INSTRUCTION_STATUS]
        insObj[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE] = o[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE]
        let nextDate = insObj[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE]
        let momentNextDate = nextDate && moment(nextDate).format('YYYY-MM-DD')
        let momentCurrentDate = moment().format('YYYY-MM-DD')
        insObj[GOAL_ENTITIES.INSTRUCTION_STATUS] === 'pending' && momentNextDate && (momentCurrentDate === momentNextDate) && instructionsArray.push(insObj)
        insObj = {}
      })
      transArr.map(o => {
        obj[CHILD_ENTITIES.FIRST_NAME] = child[CHILD_ENTITIES.FIRST_NAME]
        obj[CHILD_ENTITIES.CHILD_ID] = child[CHILD_ENTITIES.CHILD_ID]
        obj[GOAL_ENTITIES.GID] = goal[GOAL_ENTITIES.GID]
        obj[GOAL_ENTITIES.NAME] = goal[GOAL_ENTITIES.NAME]
        obj[GOAL_ENTITIES.TRANSACTION_ID] = o[GOAL_ENTITIES.TRANSACTION_ID]
        obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] = o[GOAL_ENTITIES.TRANSACTION_AMOUNT]
        obj[GOAL_ENTITIES.TRANSACTION_STATUS] = o[GOAL_ENTITIES.TRANSACTION_STATUS]
        obj[GOAL_ENTITIES.TRANSACTION_TYPE] = o[GOAL_ENTITIES.TRANSACTION_TYPE]
        obj[GOAL_ENTITIES.TRANSACTION_TIME] = o[GOAL_ENTITIES.TRANSACTION_TIME]
        let transactionTime = getDateString(obj[GOAL_ENTITIES.TRANSACTION_TIME])
        transfers[transactionTime] ? transfers[transactionTime].push(obj) : transfers[transactionTime] = [obj]
        obj = {}
      })
    })

    let investments = getInvestments(state.root.investments, child[CHILD_ENTITIES.CHILD_ID])
    investments.map(i => {
      let obj = {}
      let insObj = {}

      let instructions = i[INVESTMENT_ENTITIES.INSTRUCTIONS]
      let insArr = (instructions && Object.values(instructions)) || []
      let transactions = i[GOAL_ENTITIES.TRANSACTIONS]
      let transArr = (transactions && Object.values(transactions)) || []
      insArr.map(a => {
        insObj[CHILD_ENTITIES.FIRST_NAME] = child[CHILD_ENTITIES.FIRST_NAME]
        insObj[CHILD_ENTITIES.CHILD_ID] = child[CHILD_ENTITIES.CHILD_ID]
        insObj[GOAL_ENTITIES.GID] = i[INVESTMENT_ENTITIES.INVESTMENT_ID]
        insObj[GOAL_ENTITIES.NAME] = i[INVESTMENT_ENTITIES.INVESTMENT_NAME]
        insObj[GOAL_ENTITIES.INSTRUCTION_TYPE] = a[INVESTMENT_ENTITIES.INSTRUCTION_TYPE]
        insObj[GOAL_ENTITIES.INSTRUCTION_FREQUENCY] = a[INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY]
        insObj[GOAL_ENTITIES.INSTRUCTION_AMOUNT] = a[INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT]
        insObj[GOAL_ENTITIES.INSTRUCTION_STATUS] = a[INVESTMENT_ENTITIES.INSTRUCTION_STATUS]
        insObj[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE] = a[INVESTMENT_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE]
        let nextDate = insObj[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE]
        let momentNextDate = nextDate && moment(nextDate).format('YYYY-MM-DD')
        let momentCurrentDate = moment().format('YYYY-MM-DD')
        insObj[GOAL_ENTITIES.INSTRUCTION_STATUS] === 'pending' && momentNextDate && (momentCurrentDate === momentNextDate) && instructionsArray.push(insObj)
        insObj = {}
      })
      transArr.map(o => {
        obj[CHILD_ENTITIES.FIRST_NAME] = child[CHILD_ENTITIES.FIRST_NAME]
        obj[CHILD_ENTITIES.CHILD_ID] = child[CHILD_ENTITIES.CHILD_ID]
        obj[GOAL_ENTITIES.GID] = i[INVESTMENT_ENTITIES.INVESTMENT_ID]
        obj[GOAL_ENTITIES.NAME] = i[INVESTMENT_ENTITIES.INVESTMENT_NAME]
        obj[GOAL_ENTITIES.TRANSACTION_ID] = o[INVESTMENT_ENTITIES.TRANSACTION_ID]
        obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] = o[INVESTMENT_ENTITIES.TRANSACTION_AMOUNT]
        obj[GOAL_ENTITIES.TRANSACTION_STATUS] = o[INVESTMENT_ENTITIES.TRANSACTION_STATUS]
        obj[GOAL_ENTITIES.TRANSACTION_TYPE] = o[INVESTMENT_ENTITIES.TRANSACTION_TYPE]
        obj[GOAL_ENTITIES.TRANSACTION_TIME] = o[INVESTMENT_ENTITIES.TRANSACTION_TIME]
        let transactionTime = getDateString(obj[INVESTMENT_ENTITIES.TRANSACTION_TIME])
        transfers[transactionTime] ? transfers[transactionTime].push(obj) : transfers[transactionTime] = [obj]
        obj = {}
      })
    })
  })

  Object.keys(transfers).map((value) => {
    let activity = []
    activity = _.sortBy(transfers[value], (o) => {
      return o[GOAL_ENTITIES.TRANSACTION_TIME]
    }).reverse()
    transfers[value] = activity
  })

  instructionsArray = instructionsArray && _.sortBy(instructionsArray, (o) => o[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE])

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    // regular transfers
    transfers,

    // instructions array
    instructionsArray,

    // boost transfers
    boostTransfer,

    // boost withdrawal
    boostWithdrawals,

    // is processing
    isProcessing,

    isDebugMode,
    isPlaidLinked
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
