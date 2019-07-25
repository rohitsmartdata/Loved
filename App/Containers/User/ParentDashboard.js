/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 7/12/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {AsyncStorage}
  from 'react-native'
import {connect}
  from 'react-redux'
import Screen
  from '../../Components/User/ParentDashboard'
import {
  ChildActions,
  getDOB,
  getFirstName as getChildFirstname,
  getChildren,
  getImageUrl,
  getImage,
  isUpdatingChildImage,
  isFetchingChildStocks,
  isSSNAdded,
  isBankAdded,
  getChildStockPerformance, getChildFundingStatus, getChildAccountStatus
}
  from '../../Redux/Reducers/ChildReducer'
import {
  getSelectedChild,
  getUserID,
  getStocks,
  getDebugMode,
  getTotalContribution,
  getCurrentValue,
  getGrowthPercentage,
  getGrowthValue,
  getAvailableValue,
  getPendingTransferAmount,
  getPendingWithdrawalAmount,
  getLastUpdatedTime,
  isUserDetailProcessing,
  getFirstName,
  UserActions,
  getUserEmail,
  getFundingSourceReferenceID,
  getFundingStatus,
  isUserSSNAdded,
  getUserIsBankAdded
}
  from '../../Redux/Reducers/UserReducer'
import {SettingActions, isProcessing as isSettingProcessing}
  from '../../Redux/Reducers/SettingReducer'
import {InvestmentActions, doWeHaveInvestments}
  from '../../Redux/Reducers/InvestmentReducer'
import {getIDToken}
  from '../../Redux/Reducers/AuthReducer'
import { doWeHaveGoals, GoalActions }
  from '../../Redux/Reducers/GoalReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {LEARN_ENTITIES}
  from '../../Utility/Mapper/Learn'
import moment
  from 'moment'
import {LearnActions, getModules, isFetchLearningModules}
  from '../../Redux/Reducers/LearnReducer'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import { OnboardingActions } from '../../Redux/Reducers/OnboardingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.ADD_NEW_INVESTMENT:
      dispatch(InvestmentActions.addNewInvestment(undefined, action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ADD_NEW_GOAL:
      dispatch(ChildActions.addNewGoal(undefined, action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.NAVIGATE_TODO:
      dispatch(UserActions.navigateTodo(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_SETTINGS:
      dispatch(SettingActions.showSettings(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.OPEN_SETTINGS:
      dispatch(SettingActions.openSettings(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_ACADEMY:
      dispatch(SettingActions.showAcademy(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_DOCUMENTS:
      dispatch(SettingActions.showDocuments(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_CONFIRMATIONS:
      dispatch(SettingActions.showConfirmations(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.VIEW_TRANSFERS:
      dispatch(SettingActions.viewTransfers(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.VIEW_ACTIVITY:
      dispatch(SettingActions.viewActivity(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ADD_ACCOUNT:
      dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.COMPLETE_PROFILE:
      dispatch(UserActions.navigateUserDetailInput(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.REFRESH_STATE:
      dispatch(UserActions.fetchUser(action[USER_ENTITIES.USER_ID], COMMON_ENTITIES.NAVIGATOR))
      break
    case localActions.ADD_NEW_CHILD:
      dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SET_SELECTED_CHILD:
      dispatch(UserActions.setSelectedChild(action[USER_ENTITIES.SELECTED_CHILD]))
      break
    case localActions.FETCH_MODULES:
      dispatch(LearnActions.fetchLearnModules())
      break
    case localActions.OPEN_ARTICLE:
      dispatch(UserActions.openArticle(action[LEARN_ENTITIES.MODULE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.FETCH_GLOSSARY:
      dispatch(UserActions.fetchGlossary())
      break
    case localActions.FETCH_CHILD_STOCK_PERFORMANCE:
      dispatch(ChildActions.fetchStockPerformance(action[CHILD_ENTITIES.CHILD_ID], action[USER_ENTITIES.USER_ID], action[AUTH_ENTITIES.EMAIL], action[SETTINGS_ENTITIES.IMAGE_TYPE]))
      break
    case localActions.UPLOAD_PHOTO:
      dispatch(
        SettingActions.uploadPhoto(
          action[SETTINGS_ENTITIES.IMAGE_METADATA],
          action[SETTINGS_ENTITIES.IMAGE_TYPE],
          action[AUTH_ENTITIES.EMAIL],
          action[AUTH_ENTITIES.ID_TOKEN],
          action[USER_ENTITIES.USER_ID],
          action[CHILD_ENTITIES.CHILD_ID],
          action[GOAL_ENTITIES.GID],
          action[CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE],
          dispatch
        )
      )
      break
    case localActions.VERIFY_BANK_ACCOUNT:
      dispatch(UserActions.navigateToAmountVerificationScreen(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.RE_AUTHENTICATE_BANK_ACCOUNT:
      dispatch(UserActions.reAuthenticateBankAccount(action[USER_ENTITIES.USER_ID], action[USER_ENTITIES.SOURCE_REFERENCE_ID], action[COMMON_ENTITIES.CALLBACK_FUCTION], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.RE_AUTHENTICATE_BANK_ACCOUNT_WITH_ACCOUNT_ID:
      dispatch(UserActions.reAuthenticateBankAccountWithAccountId(action[USER_ENTITIES.USER_ID], action[USER_ENTITIES.PLAID_ACCOUNT_ID], action[USER_ENTITIES.SOURCE_REFERENCE_ID], action[COMMON_ENTITIES.CALLBACK_FUCTION], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.CONNECT_BANK:
      dispatch(UserActions.linkFundingSource(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[USER_ENTITIES.PLAID_ACCOUNT_ID],
        action[USER_ENTITIES.PLAID_PUBLIC_TOKEN],
        undefined, undefined, undefined,
        action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(GoalActions.navigateToTransferScreen(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      break

    case localActions.SHOW_DISCLAIMER:
      dispatch(GoalActions.showDisclaimer(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  OPEN_ARTICLE: 'OPEN_ARTICLE',
  SET_SELECTED_CHILD: 'setSelectedChild',
  NAVIGATE_TODO: 'navigateTodo',
  SHOW_DOCUMENTS: 'SHOW_DOCUMENTS',
  SHOW_CONFIRMATIONS: 'showConfirmations',
  VIEW_TRANSFERS: 'VIEW_TRANSFERS',
  VIEW_ACTIVITY: 'viewActivity',
  ADD_ACCOUNT: 'addAccount',
  COMPLETE_PROFILE: 'COMPLETE_PROFILE',
  REFRESH_STATE: 'refreshState',
  ADD_NEW_GOAL: 'addNewGoal',
  ADD_NEW_INVESTMENT: 'addNewInvestment',
  ADD_NEW_CHILD: 'addNewChild',
  SHOW_SETTINGS: 'showSettings',
  OPEN_SETTINGS: 'openSettings',
  SHOW_ACADEMY: 'showAcademy',
  FETCH_MODULES: 'FETCH_MODULES',
  FETCH_GLOSSARY: 'FETCH_GLOSSARY',
  UPLOAD_PHOTO: 'UPLOAD_PHOTO',
  FETCH_CHILD_STOCK_PERFORMANCE: 'FETCH_CHILD_STOCK_PERFORMANCE',
  VERIFY_BANK_ACCOUNT: 'VERIFY_BANK_ACCOUNT',
  RE_AUTHENTICATE_BANK_ACCOUNT: 'RE_AUTHENTICATE_BANK_ACCOUNT',
  RE_AUTHENTICATE_BANK_ACCOUNT_WITH_ACCOUNT_ID: 'RE_AUTHENTICATE_BANK_ACCOUNT_WITH_ACCOUNT_ID',
  CONNECT_BANK: 'connectBank',
  SHOW_DISCLAIMER: 'showDisclaimer'
}

const mapStateToProps = (state, props) => {
  let shouldRefresh = props[USER_ENTITIES.SHOULD_REFRESH]

  let newChildID = props['newChildID']
  // firstname of the user
  let firstname = getFirstName(state.root.u)
  // have goals
  let haveGoals = doWeHaveGoals(state.root.goals)
  // have investments
  let haveInvestments = doWeHaveInvestments(state.root.investments)
  // get children
  let children = getChildren(state.root.children)
  let childIDs = (children && Object.keys(children)) || []
  // selected child
  let selectedID = getSelectedChild(state.root.u)
  // user id
  const defaultIndex = 0
  if (selectedID) {
    let indexOfSelectedID = childIDs.indexOf(selectedID)
    if (indexOfSelectedID > -1) {
      let id = childIDs.splice(indexOfSelectedID, 1)
      childIDs = id.concat(childIDs)
    }
  }
  let userID = getUserID(state.root.u)

  let userSSNAdded = isUserSSNAdded(state.root.u)

  let userIsBankAdded = getUserIsBankAdded(state.root.u)
  // total portfolio value
  let currentValue = getCurrentValue(state.root.u) || 0 // good
  // available value
  let availableValue = getAvailableValue(state.root.u) || 0
  // let pending withdrawal amount
  let pendingWithdrawalAmount = getPendingWithdrawalAmount(state.root.u) || 0
  // let pending transfer amount
  let pendingTransferAmount = getPendingTransferAmount(state.root.u) || 0
  // total contribution value
  let totalContribution = getTotalContribution(state.root.u) || 0 // good
  // growth value
  let growthValue = getGrowthValue(state.root.u) || 0
  // growth percentage
  let growthPercentage = getGrowthPercentage(state.root.u) || 0
  // last updated time
  let lastUpdatedTime = getLastUpdatedTime(state.root.u)
  // is user detail processing
  let userDetailProcessing = isUserDetailProcessing(state.root.u)

  let childArr = {}
  // if (childIDs.length > 1) {
  //   childArr['all'] = {childID: 'all', firstname: 'All', age: undefined, imageUrl: undefined, childImage: undefined}
  // }
  childIDs && childIDs.map(id => {
    let childFirstname = getChildFirstname(state.root.children, id)
    let childImageUrl = getImageUrl(state.root.children, id)
    let childImage = getImage(state.root.children, id)
    const childDOB = getDOB(state.root.children, id)
    let stockPerformance = getChildStockPerformance(state.root.children, id)

    let age = 0
    if (childDOB) {
      let birthDate = moment(childDOB, 'YYYY-MM-DD')
      let currentDate = moment()
      age = currentDate.diff(birthDate, 'y')
    }

    let childPointer = children[id]
    const portolio = childPointer && childPointer[CHILD_ENTITIES.PORTFOLIO]
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
      childImage}
  })

  // default index the picker will point to

  // selected child using default index
  let childObjects = Object.values(childArr)
  let selectedChild = (selectedID && childArr[selectedID]) || (childObjects && childObjects[defaultIndex])

  // is statements/confirmations fetch processing
  let isFetchProcessing = isSettingProcessing(state.util)

  let isDebugMode = getDebugMode(state.root.u)

  let userFundingStatus = getFundingStatus(state.root.u)

  let stocks = getStocks(state.root.u)

  // modules
  let modules = getModules(state.root.learn)
  let tileOne, tileTwo
  modules && modules.map(m => {
    let one = m[LEARN_ENTITIES.MODULE_TILE_ONE]
    let two = m[LEARN_ENTITIES.MODULE_TILE_TWO]
    if (one) {
      tileOne = m
    }
    if (two) {
      tileTwo = m
    }
  })
  let isLearningProcessing = isFetchLearningModules(state.root.learn)

  // get user email
  const email = getUserEmail(state.root.u)

  // id token
  const token = getIDToken(state.auth)

  const updatingChildImage = isUpdatingChildImage(state.root.children)

  const isFetchingStockPerformance = isFetchingChildStocks(state.root.children)

  const sourceReferenceID = getFundingSourceReferenceID(state.root.user)

  return {
    // send local actions for (presentation <--> container)
    localActions,
    // should refersh
    shouldRefresh,
    // user ssn added or not
    userSSNAdded,

    newChildID,
    // is loading learning modules
    isLearningProcessing,
    // have goals
    haveGoals,
    // have investments
    haveInvestments,
    // learning modules
    learningModules: modules ? modules.slice(0, 2) : [],
    // tile one
    tileOne,
    // tile two
    tileTwo,
    // are children available
    childrenAvailable: childIDs.length > 0,
    // firstname of the user
    firstname,
    // child IDs
    childIDs,
    // user ID
    userID,
    // email ID
    email,
    // IDtoken
    token,
    // total parent portfolio value
    currentValue,
    // available amount
    availableValue,
    // pending transfer amount
    pendingTransferAmount,
    // pending withdrawal amount
    pendingWithdrawalAmount,
    // total parent contribution
    totalContribution,
    // growth value of family portfolio
    growthValue,
    // growth percentage of family portfolio
    growthPercentage,
    // last updated time
    lastUpdatedTime,
    // total montly invested
    monthlyInvestment: 0,
    // is statement/confirmations processing
    isFetchProcessing,
    // user detail processing
    userDetailProcessing,
    // children array
    childArr,
    // default index of child array selected
    defaultIndex,
    // selected child
    selectedChild,
    // is debug mode
    isDebugMode,
    // stock values
    stocks,
    updatingChildImage,
    // fetching stock permormance
    isFetchingStockPerformance,
    // source refernce ID
    sourceReferenceID,
    userFundingStatus,

    // user is bank added
    userIsBankAdded
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
