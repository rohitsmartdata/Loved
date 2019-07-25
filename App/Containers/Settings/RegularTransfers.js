/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 28/5/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/RegularTransfers'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {getChildren}
  from '../../Redux/Reducers/ChildReducer'
import {getGoals}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestments}
  from '../../Redux/Reducers/InvestmentReducer'
import {
  UserActions,
  getDebugMode,
  getUserID,
  isModifyUserInstructionProcessing,
  isUserInstructionFetchProcessing,
  isFundingSourceLinked
}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.MODIFY:
      dispatch(UserActions.modifyUserInstruction(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.INSTRUCTION_ID],
        action[GOAL_ENTITIES.INSTRUCTION_ACTION]
      ))
      break

    case localActions.REFRESH_INSTRUCTION:
      dispatch(UserActions.fetchUserInstructions(action[USER_ENTITIES.USER_ID]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  MODIFY: 'modify',
  REFRESH_INSTRUCTION: 'refreshInstruction'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // childrens
  const children = getChildren(state.root.children)
  // is processing or not
  const isProcessing = isUserInstructionFetchProcessing(state.root.u) || isModifyUserInstructionProcessing(state.root.u)
  // debug mode
  const isDebugMode = getDebugMode(state.root.u)

  const isPlaidLinked = isFundingSourceLinked(state.root.u)

  let regularTransfers = []
  // let boostTransfer = []
  // let boostWithdrawals = []

  Object.values(children).map(child => {
    let goals = getGoals(state.root.goals, child[CHILD_ENTITIES.CHILD_ID])
    goals.map(goal => {
      let obj = {}
      obj[CHILD_ENTITIES.FIRST_NAME] = child[CHILD_ENTITIES.FIRST_NAME]
      obj[CHILD_ENTITIES.CHILD_ID] = child[CHILD_ENTITIES.CHILD_ID]
      obj[GOAL_ENTITIES.GID] = goal[GOAL_ENTITIES.GID]
      obj[GOAL_ENTITIES.NAME] = goal[GOAL_ENTITIES.NAME]
      obj[GOAL_ENTITIES.GOAL_RECURRING_ID] = goal[GOAL_ENTITIES.GOAL_RECURRING_ID]
      obj[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT] = goal[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT]
      obj[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY] = goal[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY]
      obj[GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE] = goal[GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE]
      obj[GOAL_ENTITIES.GOAL_RECURRING_STATUS] = goal[GOAL_ENTITIES.GOAL_RECURRING_STATUS]
      if (obj[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT]) {
        regularTransfers.push(obj)
      }
      // let instructions = goal[GOAL_ENTITIES.INSTRUCTIONS]
      // let arr = (instructions && Object.values(instructions)) || []
      // arr.map(o => {
      //   let type = o[GOAL_ENTITIES.INSTRUCTION_TYPE]
      //   let freq = o[GOAL_ENTITIES.INSTRUCTION_FREQUENCY]
      //   let amt = o[GOAL_ENTITIES.INSTRUCTION_AMOUNT]
      //   if (freq === 'once') {
      //     obj[GOAL_ENTITIES.INSTRUCTION_TYPE] = type
      //     obj[GOAL_ENTITIES.INSTRUCTION_FREQUENCY] = freq
      //     obj[GOAL_ENTITIES.INSTRUCTION_AMOUNT] = amt
      //     if (type === 'withdrawal') {
      //       boostWithdrawals.push(obj)
      //     } else {
      //       boostTransfer.push(obj)
      //     }
      //   }
      // })
    })

    let investments = getInvestments(state.root.investments, child[CHILD_ENTITIES.CHILD_ID])
    investments.map(i => {
      let obj = {}
      obj[CHILD_ENTITIES.FIRST_NAME] = child[CHILD_ENTITIES.FIRST_NAME]
      obj[CHILD_ENTITIES.CHILD_ID] = child[CHILD_ENTITIES.CHILD_ID]
      obj[GOAL_ENTITIES.GID] = i[INVESTMENT_ENTITIES.INVESTMENT_ID]
      obj[GOAL_ENTITIES.NAME] = i[INVESTMENT_ENTITIES.INVESTMENT_NAME]
      obj[GOAL_ENTITIES.GOAL_RECURRING_ID] = i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_ID]
      obj[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT] = i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT]
      obj[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY] = i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]
      obj[GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE] = i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_NEXT_DATE]
      obj[GOAL_ENTITIES.GOAL_RECURRING_STATUS] = i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_STATUS]
      if (obj[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT]) {
        regularTransfers.push(obj)
      }
      // let instructions = i[INVESTMENT_ENTITIES.INSTRUCTIONS]
      // let arr = (instructions && Object.values(instructions)) || []
      // arr.map(a => {
      //   let type = a[INVESTMENT_ENTITIES.INSTRUCTION_TYPE]
      //   let freq = a[INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY]
      //   let amt = a[INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT]
      //   if (freq === 'once') {
      //     obj[GOAL_ENTITIES.INSTRUCTION_TYPE] = type
      //     obj[GOAL_ENTITIES.INSTRUCTION_FREQUENCY] = freq
      //     obj[GOAL_ENTITIES.INSTRUCTION_AMOUNT] = amt
      //     if (type === 'withdrawal') {
      //       boostWithdrawals.push(obj)
      //     } else {
      //       boostTransfer.push(obj)
      //     }
      //   }
      // })
    })
  })

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    // regular transfers
    regularTransfers,

    // // boost transfers
    // boostTransfer,
    //
    // // boost withdrawal
    // boostWithdrawals,

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
