/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 1/12/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/ViewTransfers'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {getChildren, getFirstName, getDOB, getImage, getImageUrl}
  from '../../Redux/Reducers/ChildReducer'
import {getGoals}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestments}
  from '../../Redux/Reducers/InvestmentReducer'
import {getUserID, getDebugMode}
  from '../../Redux/Reducers/UserReducer'
import {SettingActions, isFetchUserTransactionsProcessing}
  from '../../Redux/Reducers/SettingReducer'
import moment
  from 'moment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.FETCH_USER_TRANSACTIONS:
      dispatch(SettingActions.fetchUserTransactions(action[USER_ENTITIES.USER_ID]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  FETCH_USER_TRANSACTIONS: 'fetchUserTransactions'
}

const mapStateToProps = (state, props) => {
  // get children
  const children = getChildren(state.root.children)
  // child id's
  let childIDs = (children && Object.keys(children)) || []
  // user id's
  const userID = getUserID(state.root.u)
  // is user fetch transactions processing
  const isProcessing = isFetchUserTransactionsProcessing(state.root.util)
  // debug mode
  const isDebugMode = getDebugMode(state.root.u)

  let recentTransactions = {}

  Object.values(children).map(child => {
    let childID = child[CHILD_ENTITIES.CHILD_ID]
    let childName = child[CHILD_ENTITIES.FIRST_NAME]
    recentTransactions[childID] = []

    let goals = getGoals(state.root.goals, child[CHILD_ENTITIES.CHILD_ID])
    goals.map(goal => {
      let transactions = goal[GOAL_ENTITIES.TRANSACTIONS]
      transactions && Object.values(transactions).map(t => {
        let obj = {}
        obj[CHILD_ENTITIES.FIRST_NAME] = childName
        obj[CHILD_ENTITIES.CHILD_ID] = childID
        obj[GOAL_ENTITIES.GID] = goal[GOAL_ENTITIES.GID]
        obj[GOAL_ENTITIES.NAME] = goal[GOAL_ENTITIES.NAME]
        obj[GOAL_ENTITIES.TRANSACTION_ID] = t[GOAL_ENTITIES.TRANSACTION_ID]
        obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] = t[GOAL_ENTITIES.TRANSACTION_AMOUNT]
        obj[GOAL_ENTITIES.TRANSACTION_STOCKS] = t[GOAL_ENTITIES.TRANSACTION_STOCKS]
        obj[GOAL_ENTITIES.TRANSACTION_TYPE] = t[GOAL_ENTITIES.TRANSACTION_TYPE]
        obj[GOAL_ENTITIES.TRANSACTION_TIME] = t[GOAL_ENTITIES.TRANSACTION_TIME]
        obj[GOAL_ENTITIES.TRANSACTION_STATUS] = t[GOAL_ENTITIES.TRANSACTION_STATUS]
        obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] && recentTransactions[childID].push(obj)
      })

      let instructions = goal[INVESTMENT_ENTITIES.INSTRUCTIONS]
      instructions && Object.values(instructions).map(a => {
        if (a[INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY] === 'once') {
          let obj = {}
          obj[CHILD_ENTITIES.FIRST_NAME] = childName
          obj[CHILD_ENTITIES.CHILD_ID] = childID
          obj[GOAL_ENTITIES.GID] = goal[INVESTMENT_ENTITIES.INVESTMENT_ID]
          obj[GOAL_ENTITIES.NAME] = goal[INVESTMENT_ENTITIES.INVESTMENT_NAME]
          obj[GOAL_ENTITIES.TRANSACTION_ID] = a[INVESTMENT_ENTITIES.INSTRUCTION_ID]
          obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] = a[INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT]
          obj[GOAL_ENTITIES.TRANSACTION_TYPE] = a[INVESTMENT_ENTITIES.INSTRUCTION_TYPE]
          obj[GOAL_ENTITIES.TRANSACTION_TIME] = a[INVESTMENT_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE]
          obj[GOAL_ENTITIES.TRANSACTION_STATUS] = a[INVESTMENT_ENTITIES.INSTRUCTION_STATUS]
          obj[GOAL_ENTITIES.TRANSACTION_STOCKS] = a[INVESTMENT_ENTITIES.TRANSACTION_STOCKS]
          let index = recentTransactions[childID].findIndex(child => child[INVESTMENT_ENTITIES.INSTRUCTION_ID] === a[INVESTMENT_ENTITIES.INSTRUCTION_ID])
          if (obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] && index < 0) {
            recentTransactions[childID].push(obj)
          }
        }
      })
    })

    let investments = getInvestments(state.root.investments, child[CHILD_ENTITIES.CHILD_ID])
    investments.map(i => {
      let transactions = i[INVESTMENT_ENTITIES.TRANSACTIONS]
      transactions && Object.values(transactions).map(t => {
        let obj = {}
        obj[CHILD_ENTITIES.FIRST_NAME] = childName
        obj[CHILD_ENTITIES.CHILD_ID] = childID
        obj[GOAL_ENTITIES.GID] = i[INVESTMENT_ENTITIES.INVESTMENT_ID]
        obj[GOAL_ENTITIES.NAME] = i[INVESTMENT_ENTITIES.INVESTMENT_NAME]
        obj[GOAL_ENTITIES.TRANSACTION_ID] = t[INVESTMENT_ENTITIES.TRANSACTION_ID]
        obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] = t[INVESTMENT_ENTITIES.TRANSACTION_AMOUNT]
        obj[GOAL_ENTITIES.TRANSACTION_TYPE] = t[INVESTMENT_ENTITIES.TRANSACTION_TYPE]
        obj[GOAL_ENTITIES.TRANSACTION_TIME] = t[INVESTMENT_ENTITIES.TRANSACTION_TIME]
        obj[GOAL_ENTITIES.TRANSACTION_STATUS] = t[INVESTMENT_ENTITIES.TRANSACTION_STATUS]
        obj[GOAL_ENTITIES.TRANSACTION_STOCKS] = t[INVESTMENT_ENTITIES.TRANSACTION_STOCKS]
        obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] && recentTransactions[childID].push(obj)
      })

      let instructions = i[INVESTMENT_ENTITIES.INSTRUCTIONS]
      instructions && Object.values(instructions).map(a => {
        if (a[INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY] === 'once') {
          let obj = {}
          obj[CHILD_ENTITIES.FIRST_NAME] = childName
          obj[CHILD_ENTITIES.CHILD_ID] = childID
          obj[GOAL_ENTITIES.GID] = i[INVESTMENT_ENTITIES.INVESTMENT_ID]
          obj[GOAL_ENTITIES.NAME] = i[INVESTMENT_ENTITIES.INVESTMENT_NAME]
          obj[GOAL_ENTITIES.TRANSACTION_ID] = a[INVESTMENT_ENTITIES.INSTRUCTION_ID]
          obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] = a[INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT]
          obj[GOAL_ENTITIES.TRANSACTION_TYPE] = a[INVESTMENT_ENTITIES.INSTRUCTION_TYPE]
          obj[GOAL_ENTITIES.TRANSACTION_TIME] = a[INVESTMENT_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE]
          obj[GOAL_ENTITIES.TRANSACTION_STATUS] = a[INVESTMENT_ENTITIES.INSTRUCTION_STATUS]
          obj[GOAL_ENTITIES.TRANSACTION_STOCKS] = a[INVESTMENT_ENTITIES.TRANSACTION_STOCKS]
          let index = recentTransactions[childID].findIndex(child => {
            child[INVESTMENT_ENTITIES.INSTRUCTION_ID] === a[INVESTMENT_ENTITIES.INSTRUCTION_ID]
          })
          if (obj[GOAL_ENTITIES.TRANSACTION_AMOUNT] && index < 0) {
            recentTransactions[childID].push(obj)
          }
        }
      })
    })
  })

  let childArr = []
  childIDs.map(id => {
    let childFirstname = getFirstName(state.root.children, id)
    let childImageUrl = getImageUrl(state.root.children, id)
    let childImage = getImage(state.root.children, id)
    const childDOB = getDOB(state.root.children, id)
    let age = 0
    if (childDOB) {
      let birthDate = moment(childDOB, 'YYYY-MM-DD')
      let currentDate = moment()
      age = currentDate.diff(birthDate, 'y')
    }

    let childPointer = children[id]
    const portolio = childPointer && childPointer[CHILD_ENTITIES.PORTFOLIO]
    childArr.push({
      childID: id,
      firstname: childFirstname,
      age: age,
      imageUrl: childImageUrl,
      childImage
    })
  })

  // default index the picker will point to
  const defaultIndex = 0

  // selected child using default index
  let selectedChild = (childArr[defaultIndex])

  return {
    children,
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // user id
    userID,
    // is processing
    isProcessing: isProcessing,
    // recent transactions
    recentTransactions,
    // children array
    childArr,
    // default index of child array selected
    defaultIndex,
    // selected child
    selectedChild,
    // debug mode
    isDebugMode
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
