/* eslint-disable no-unused-vars */
/**
 * Created by viktor on 4/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/Setting'
import { SettingActions, isProcessing } from '../../Redux/Reducers/SettingReducer'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { getFirstName, getImageUrl, getLastName, getUserID, getUserImage, getDebugMode, UserActions } from '../../Redux/Reducers/UserReducer'
import { getIDToken } from '../../Redux/Reducers/AuthReducer'
import {
  ChildActions,
  getDOB,
  getFirstName as getChildFirstname,
  getChildren,
  getImage,
  isUpdatingChildImage,
  isFetchingChildStocks,
  isSSNAdded,
  isBankAdded,
  getChildStockPerformance, getChildFundingStatus, getChildAccountStatus

}
  from '../../Redux/Reducers/ChildReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import moment
  from 'moment'
import {getGoals}
  from '../../Redux/Reducers/GoalReducer'
import {getInvestments}
  from '../../Redux/Reducers/InvestmentReducer'
import { INVESTMENT_ENTITIES } from '../../Utility/Mapper/Investment'
import { GOAL_ENTITIES } from '../../Utility/Mapper/Goal'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action
  switch (type) {
    case localActions.HIDE_SETTINGS:
      dispatch(SettingActions.hideSettings(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.NAVIGATE_TO_SETTING_DETAIL_SCREEN:
      dispatch(SettingActions.navigateToSettingDetailScreen(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_DOCUMENTS:
      dispatch(SettingActions.showDocuments(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.DELETE_ACCOUNT:
      dispatch(UserActions.deleteAccount(action[USER_ENTITIES.USER_ID]))
      break
    case localActions.SHOW_CONFIRMATIONS:
      dispatch(SettingActions.showConfirmations(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ADD_NEW_CHILD:
      dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  HIDE_SETTINGS: 'HIDE_SETTINGS',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  NAVIGATE_TO_SETTING_DETAIL_SCREEN: 'NAVIGATE_TO_SETTING_DETAIL_SCREEN',
  SHOW_DOCUMENTS: 'SHOW_DOCUMENTS',
  SHOW_CONFIRMATIONS: 'SHOW_CONFIRMATIONS',
  ADD_NEW_CHILD: 'addNewChild'
}

const mapStateToProps = (state) => {
  // first name
  let firstName = getFirstName(state.root.u) || ''
  // last name
  let lastName = getLastName(state.root.u) || ''
  const userID = getUserID(state.root.u)
  const imageUrl = getImageUrl(state.root.u)
  const userImage = getUserImage(state.root.u)
  let debugMode = getDebugMode(state.root.u)
  // id token
  const idToken = getIDToken(state.auth)
  // is processing
  const processing = isProcessing(state.util)

  // get children
  let children = getChildren(state.root.children)
  let childIDs = (children && Object.keys(children)) || []

  let childArr = {}
  let totalBalance = 0
  childIDs && childIDs.map(id => {
    let childFirstname = getChildFirstname(state.root.children, id)
    let childImageUrl = getImageUrl(state.root.children, id)
    let childImage = getImage(state.root.children, id)
    const childDOB = getDOB(state.root.children, id)
    let stockPerformance = getChildStockPerformance(state.root.children, id)
    let childTotalBalance = 0
    // goals
    let goals = getGoals(state.root.goals, id)
    // investments
    let investments = getInvestments(state.root.investments, id)
    goals && goals.map((goal, index) => {
      childTotalBalance += parseFloat(goal[GOAL_ENTITIES.BALANCE])
    })

    investments && investments.map((investment, index) => {
      childTotalBalance += parseFloat(investment[INVESTMENT_ENTITIES.INVESTMENT_BALANCE])
    })
    let age = 0
    if (childDOB) {
      let birthDate = moment(childDOB, 'YYYY-MM-DD')
      let currentDate = moment()
      age = currentDate.diff(birthDate, 'y')
    }

    let childPointer = children[id]
    const portolio = childPointer && childPointer[CHILD_ENTITIES.PORTFOLIO]
    totalBalance += portolio && portolio[CHILD_ENTITIES.AVAILABLE_VALUE] ? parseFloat(portolio[CHILD_ENTITIES.AVAILABLE_VALUE]) : 0
    childArr[id] = {
      childID: id,
      firstname: childFirstname,
      age: age,
      childFundingStatus: getChildFundingStatus(state.root.children, id),
      childAccountStatus: getChildAccountStatus(state.root.children, id),
      [CHILD_ENTITIES.STOCK_PERFORMANCE_DATA]: stockPerformance,
      [CHILD_ENTITIES.IS_SSN_ADDED]: isSSNAdded(state.root.children, id),
      [CHILD_ENTITIES.IS_BANK_ADDED]: isBankAdded(state.root.children, id),
      [CHILD_ENTITIES.GROWTH_IN_VALUE]: (portolio && portolio[CHILD_ENTITIES.GROWTH_IN_VALUE]) || 0,
      [CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]: (portolio && portolio[CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]) || 0,
      [CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]: (portolio && portolio[CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]) || 0,
      [CHILD_ENTITIES.CURRENT_VALUE]: (portolio && portolio[CHILD_ENTITIES.CURRENT_VALUE]) || 0,
      [CHILD_ENTITIES.AVAILABLE_VALUE]: (portolio && portolio[CHILD_ENTITIES.AVAILABLE_VALUE]) || 0,
      [CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT]: (portolio && portolio[CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT]) || 0,
      [CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]: (portolio && portolio[CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]) || 0,
      imageUrl: childImageUrl,
      childImage,
      childTotalBalance
    }
  })

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    firstName,
    lastName,
    userID,
    imageUrl,
    userImage,
    debugMode,
    idToken,
    processing,
    childArr,
    totalBalance
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
