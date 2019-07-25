/* eslint-disable no-unused-vars,key-spacing,no-multi-spaces,no-trailing-spaces */
/**
 * Created by viktor on 22/6/17.
 */

import { createReducer, createActions }
  from 'reduxsauce'
import Immutable
  from 'seamless-immutable'
import {CHILD_ENTITIES, path}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES, path as UserPath}
  from '../../Utility/Mapper/User'
import {SettingTypes}
  from './SettingReducer'
import {UserTypes}
  from './UserReducer'
import CHILD_PARAMETERS
  from '../ActionParameters'
import PHANTOM
  from '../../Utility/Phantom'
import _
  from 'lodash'
import moment
  from 'moment'

// ========================================================
// Types & Action Creators
// ========================================================

const {Types, Creators} = createActions({

  // navigate to add new child
  navigateToAddChild: CHILD_PARAMETERS.NAVIGATE_TO_ADD_CHILD,

  showGoal          : CHILD_PARAMETERS.SHOW_GOAL,
  hideGoal          : CHILD_PARAMETERS.HIDE_GOAL,

  // add a new child
  addChild          : CHILD_PARAMETERS.ADD_CHILD,
  addChildSuccess   : CHILD_PARAMETERS.ADD_CHILD_SUCCESS,
  addChildFailure   : CHILD_PARAMETERS.ADD_CHILD_FAILURE,

  createChildAccount: CHILD_PARAMETERS.CREATE_CHILD_ACCOUNT,
  createChildAccountSuccess: CHILD_PARAMETERS.CREATE_CHILD_ACCOUNT_SUCCESS,
  createChildAccountFailure: CHILD_PARAMETERS.CREATE_CHILD_ACCOUNT_FAILURE,

  showChild         : CHILD_PARAMETERS.SHOW_CHILD,
  popChildView      : CHILD_PARAMETERS.POP_CHILD_VIEW,

  askSsn: CHILD_PARAMETERS.ASK_SSN,

  fetchChildrenDetails  : CHILD_PARAMETERS.FETCH_CHILDREN_DETAILS,
  fetchChildrenDetailsSuccess: CHILD_PARAMETERS.FETCH_CHILDREN_DETAILS_SUCCESS,
  fetchChildrenDetailsFailure: CHILD_PARAMETERS.FETCH_CHILDREN_DETAILS_FAILURE,

  fetchChildChartData       : CHILD_PARAMETERS.FETCH_CHILD_CHART_DATA,
  fetchChildChartDataSuccess: CHILD_PARAMETERS.FETCH_CHILD_CHART_DATA_SUCCESS,
  fetchChildChartDataFailure: CHILD_PARAMETERS.FETCH_CHILD_CHART_DATA_FAILURE,

  showBrokerDealerChildInfo : CHILD_PARAMETERS.SHOW_BROKER_DEALER_CHILD_INFO,
  showBrokerDealerChildInfoSuccess: CHILD_PARAMETERS.SHOW_BROKER_DEALER_CHILD_INFO_SUCCESS,
  showBrokerDealerChildInfoFailure: CHILD_PARAMETERS.SHOW_BROKER_DEALER_CHILD_INFO_FAILURE,

  navigateToChildSsn: CHILD_PARAMETERS.NAVIGATE_TO_CHILD_SSN,
  confirmChildSsn: CHILD_PARAMETERS.NAVIGATE_TO_CHILD_SSN,

  submitChildSSN    : CHILD_PARAMETERS.SUBMIT_CHILD_SSN,

  submitChildAccount: CHILD_PARAMETERS.SUBMIT_CHILD_ACCOUNT,
  submitChildAccountSuccess: CHILD_PARAMETERS.SUBMIT_CHILD_ACCOUNT_SUCCESS,
  submitChildAccountFailure: CHILD_PARAMETERS.SUBMIT_CHILD_ACCOUNT_FAILURE,

  fetchStockPerformance: CHILD_PARAMETERS.FETCH_STOCK_PERFORMANCE,
  fetchStockPerformanceSuccess: CHILD_PARAMETERS.FETCH_STOCK_PERFORMANCE_SUCCESS,
  fetchStockPerformanceFailure: CHILD_PARAMETERS.FETCH_STOCK_PERFORMANCE_FAILURE,

  setChildSsnAdded: CHILD_PARAMETERS.SET_CHILD_SSN_ADDED,

  // initiate adding a new child
  addNewChild       : CHILD_PARAMETERS.ADD_NEW_CHILD,

  // add child's photo
  addAvatar         : CHILD_PARAMETERS.ADD_AVATAR,

  addNewGoal        : CHILD_PARAMETERS.ADD_NEW_GOAL,

  notifyAgeLimitation: CHILD_PARAMETERS.NOTIFY_AGE_LIMITATION,

  setChildImage: CHILD_PARAMETERS.SET_CHILD_IMAGE,

  autoNavigateOnboarding: CHILD_PARAMETERS.AUTO_NAVIGATE_ONBOARDING,

  updateChildImage: CHILD_PARAMETERS.UPDATE_CHILD_IMAGE,

  logNumberOfChildrenAtStart: CHILD_PARAMETERS.LOG_NUMBER_OF_CHILDREN_AT_START,

  navigateToRequestSsnScreen: CHILD_PARAMETERS.NAVIGATE_TO_REQUEST_SSN_SCREEN,

  navigateToIdentityAddressScreen: CHILD_PARAMETERS.NAVIGATE_TO_IDENTITY_ADDRESS_SCREEN,

  navigateToUserSsnScreen: CHILD_PARAMETERS.NAVIGATE_TO_IDENTITY_ADDRESS_SCREEN,
  navigateToInputManualAddressScreen: CHILD_PARAMETERS.NAVIGATE_TO_INPUT_MANUAL_ADDRESS_SCREEN,

  navigateToChildInvesting: CHILD_PARAMETERS.NAVIGATE_TO_CHILD_INVESTING,

  addChildBirthDate: CHILD_PARAMETERS.ADD_CHILD_BIRTH_DATE
})

export const ChildTypes     = Types
export const ChildActions   = Creators

// ========================================================
// Initial State
// ========================================================

export var INITIAL_STATE = Immutable({})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(CHILD_ENTITIES.IS_OK)(), true)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(CHILD_ENTITIES.ERROR)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(CHILD_ENTITIES.PROCESSING)(), undefined)

// ========================================================
// Handlers
// ========================================================

const resetStoreHandler = (state) => {
  return INITIAL_STATE
}

const refreshHealthHandler = (state) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  return s
}

const addAvatar = (state, action) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.AVATAR)(action[CHILD_ENTITIES.CHILD_ID]), action[CHILD_ENTITIES.AVATAR])
  return s
}

const setChildImageHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.CHILD_IMAGE)(action[CHILD_ENTITIES.CHILD_ID]), action[CHILD_ENTITIES.CHILD_IMAGE])
  return s
}

const updatingChildImageHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE)(), action[CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE])
  return s
}

/*
  Add Child Handler.
  This function is called when addChild action is dispatched.

  Store modification :-
  1. Set ADD_CHILD_PROCESSING as true
*/
const addChildHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.ADD_CHILD_PROCESSING)

const createChildAccountHandler = (state) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.PROCESSING_CREATE_CHILD_ACCOUNT)

const createChildAccountSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_SSN_ADDED)(action[CHILD_ENTITIES.CHILD_ID]), 1)
  return s
}

const createChildAccountFailureHandler = (state) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), undefined)

const navigateToChildSsnHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.ADD_CHILD_PROCESSING)

const addChildSuccessHandler = (state, action) => {
  try {
    let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.CHILD_ID)(action[CHILD_ENTITIES.CHILD_ID]), action[CHILD_ENTITIES.CHILD_ID])
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.FIRST_NAME)(action[CHILD_ENTITIES.CHILD_ID]), action[CHILD_ENTITIES.FIRST_NAME])
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.LAST_NAME)(action[CHILD_ENTITIES.CHILD_ID]), action[CHILD_ENTITIES.LAST_NAME])
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.DOB)(action[CHILD_ENTITIES.CHILD_ID]), action[CHILD_ENTITIES.DOB])

    return s
  } catch (err) {
    return state
  }
}

const setChildSSNAddedHandler = (state, action) => {
  return PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_SSN_ADDED)(action[CHILD_ENTITIES.CHILD_ID]), 1)
}

const setChildSSNRequested = (state, action) => {
  return PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_SSN_ADDED)(action[CHILD_ENTITIES.CHILD_ID]), 2)
}

const logNumberOfChildrenAtStartHandler = (state, action) => {
  let n = action[CHILD_ENTITIES.NUMBER_OF_CHILDREN_AT_START]
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.NUMBER_OF_CHILDREN_AT_START)(), n)
  return s
}

const addChildFailureHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  return s
}

const fetchUserDetailSuccessHandler = (state, action) => {
  try {
    PHANTOM.assertActionPayload(action)

    // set state of children data as OK
    let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)

    // de-refer 'sproutDetail'
    let sprouts = action[USER_ENTITIES.USER_DETAIL]['sprouts']
    let lastUpdatedTime = action[USER_ENTITIES.USER_DETAIL]['last_updated_time']
    // for each child add it's information
    sprouts.map(sprout => {
      let childID = sprout['sprout_id']
      let availableValue = sprout['available_value'] && parseFloat(sprout['available_value']).toFixed(2)
      let currentValue = sprout['current_value'] && parseFloat(sprout['current_value']).toFixed(2)
      let pendingTransfer = sprout['pending_transfer_amount'] && parseFloat(sprout['pending_transfer_amount']).toFixed(2)
      let pendingWithdrawal = sprout['pending_withdrawal_amount'] && parseFloat(sprout['pending_withdrawal_amount']).toFixed(2)
      let totalContribution = sprout['total_contributions'] && parseFloat(sprout['total_contributions']).toFixed(2)
      let growthValue = sprout['growth_in_value'] && parseFloat(sprout['growth_in_value']).toFixed(2)
      let growthInPercentage = sprout['growth_in_percentage'] && parseFloat(sprout['growth_in_percentage']).toFixed(2)

      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.CHILD_ID)(childID), childID)
      currentValue && (s = PHANTOM.setIn(s, path(CHILD_ENTITIES.CURRENT_VALUE)(childID), currentValue))
      availableValue && (s = PHANTOM.setIn(s, path(CHILD_ENTITIES.AVAILABLE_VALUE)(childID), availableValue))
      pendingTransfer && (s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT)(childID), pendingTransfer))
      pendingWithdrawal && (s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT)(childID), pendingWithdrawal))
      growthInPercentage && (s = PHANTOM.setIn(s, path(CHILD_ENTITIES.GROWTH_IN_PERCENTAGE)(childID), growthInPercentage))
      growthValue && (s = PHANTOM.setIn(s, path(CHILD_ENTITIES.GROWTH_IN_VALUE)(childID), growthValue))
      totalContribution && (s = PHANTOM.setIn(s, path(CHILD_ENTITIES.TOTAL_CONTRIBUTIONS)(childID), totalContribution))
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.LAST_UPDATED_TIME)(childID), lastUpdatedTime)
    })

    return s
  } catch (err) {
    return state
  }
}

const fetchUserSuccessHandler = (state, action) => {
  try {
    // set state of children data as OK
    let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)

    let u = action[USER_ENTITIES.USER_DATA]['user'][0]
    let sprouts = (u && u['sprout']) || []
    sprouts.map(sprout => {
      let childID = sprout['sprout_id']

      let ssnEntered = sprout['ssn_entered']
      let bankEntered = sprout['bank_entered']
      let childImage = getChildImage(state, childID)

      // s = PHANTOM.setIn(s, path(CHILD_ENTITIES.CHILD_ID_INDEX)(childID), childID)
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.CHILD_ID)(childID), childID)
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.FIRST_NAME)(childID), sprout['first_name'])
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.LAST_NAME)(childID), sprout['last_name'])
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.DOB)(childID), sprout['date_of_birth'])
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.IMAGE_URL)(childID), sprout['image_url'])
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.BD_ACCOUNT_ID)(childID), sprout['broker_dealer_account_id'])
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.BD_ACCOUNT_STATUS)(childID), sprout['broker_dealer_account_status'])
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.SPROUT_ACCOUNT_STATUS)(childID), sprout['sprout_account_status'] || 0)
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.SPROUT_FUNDING_STATUS)(childID), sprout['sprout_funding_status'] || 0)
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.IS_SSN_ADDED)(childID), ssnEntered)
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.IS_BANK_ADDED)(childID), bankEntered)
      s = PHANTOM.setIn(s, path(CHILD_ENTITIES.CHILD_IMAGE)(childID), childImage)
    })

    return s
  } catch (err) {
    return state
  }
}

const documentFetchingSuccess = (state, action) => {
  try {
    let d = action[USER_ENTITIES.USER_DATA]['data']
    let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
    for (var i = 0; i < d.length; i++) {
      let ch = d[i]
      let newPath = path(CHILD_ENTITIES.STATEMENTS)(ch['sprout_id'])
      let statement = ch['statements']
      s = PHANTOM.setIn(s, newPath, statement)
    }
    return s
  } catch (err) {
    return state
  }
}

const fetchChildChartDataHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.FETCH_CHART_DATA_PROCESSING)

const fetchChildChartDataSuccessHandler = (state, action) => {
  let childID = action[CHILD_ENTITIES.CHILD_ID]
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.CHART_DATA)(childID), action[CHILD_ENTITIES.CHART_DATA])
  return s
}

const showDocumentsHandler = (state) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.PROCESSING_SHOW_DOCUMENTS)

const showDocumentSuccessHandler = (state, action) => {
  let data = action[USER_ENTITIES.USER_DATA]
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  for (var i = 0; i < data.length; i++) {
    let ch = data[i]
    let newPath = path(CHILD_ENTITIES.STATEMENTS)(ch['sprout_id'])
    let statements = ch['statements'] || []
    var sortedStatements = _.orderBy(statements, ['date'], ['desc'])
    s = PHANTOM.setIn(s, newPath, sortedStatements)
  }
  return s
}

const showConfirmationsHandler = (state) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.PROCESSING_SHOW_CONFIRMATIONS)

const showConfirmationsSuccessHandler = (state, action) => {
  let data = action[USER_ENTITIES.USER_DATA]
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  for (var i = 0; i < data.length; i++) {
    let ch = data[i]
    let newPath = path(CHILD_ENTITIES.CONFIRMATIONS)(ch['sprout_id'])
    let confirmations = ch['confirmations'] || []
    var sortedConfirmations = _.orderBy(confirmations, ['date'], ['desc'])
    s = PHANTOM.setIn(s, newPath, sortedConfirmations)
  }
  return s
}

const showBrokerDealerChildInfoHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.SHOW_BROKER_DEALER_CHILD_INFO)

const showBrokerDealerChildInfoSuccessHandler = (state, action) => {
  try {
    // set state of children data as OK
    let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)

    let childID = action[CHILD_ENTITIES.CHILD_ID]
    let brokerDealerData = action[CHILD_ENTITIES.BROKER_DEALER_DATA]

    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.BROKER_DEALER_DATA)(childID), brokerDealerData)
    return s
  } catch (err) {
    return state
  }
}

const showBrokerDealerChildInfoFailureHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  return s
}

const submitChildAccountHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.PROCESSING_CREATE_CHILD_ACCOUNT)

const submitChildAccountSuccessHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), undefined)

const submitChildAccountFailureHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), undefined)

const fetchStockPerformanceDataHandler = (state, action) => PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), CHILD_ENTITIES.PROCESSING_FETCH_STOCK_PERFORMANCE_DATA)

const fetchStockPerformanceDataSuccessHandler = (state, action) => {
  let data = action[CHILD_ENTITIES.STOCK_PERFORMANCE_DATA]
  let childID = action[CHILD_ENTITIES.CHILD_ID]

  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), undefined)

  data && data.map(datum => {
    let age = datum[0]
    let investedAmount = datum[1]
    let marketValue = datum[2]
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.STOCK_PERFORMANCE_AGE)(childID, age), age)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.STOCK_PERFORMANCE_INVESTED_AMOUNT)(childID, age), investedAmount)
    s = PHANTOM.setIn(s, path(CHILD_ENTITIES.STOCK_PERFORMANCE_MARKET_VALUE)(childID, age), marketValue)
  })

  return s
}

const fetchStockPerformanceDataFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(CHILD_ENTITIES.PROCESSING)(), undefined)
  return s
}

// ========================================================
// Reducer Formation & Exports
// ========================================================

export const HANDLERS = {

  [UserTypes.RESET_STORE]: resetStoreHandler,
  [UserTypes.REFRESH_HEALTH]: refreshHealthHandler,

  [Types.ADD_AVATAR]: addAvatar,

  [Types.SET_CHILD_IMAGE]: setChildImageHandler,

  [Types.SET_CHILD_SSN_ADDED]: setChildSSNAddedHandler,

  [Types.UPDATE_CHILD_IMAGE]: updatingChildImageHandler,

  [Types.ADD_CHILD]: addChildHandler,
  [Types.ADD_CHILD_SUCCESS]: addChildSuccessHandler,
  [Types.ADD_CHILD_FAILURE]: addChildFailureHandler,

  [Types.FETCH_STOCK_PERFORMANCE]: fetchStockPerformanceDataHandler,
  [Types.FETCH_STOCK_PERFORMANCE_SUCCESS]: fetchStockPerformanceDataSuccessHandler,
  [Types.FETCH_STOCK_PERFORMANCE_FAILURE]: fetchStockPerformanceDataFailureHandler,

  [Types.CREATE_CHILD_ACCOUNT]: createChildAccountHandler,
  [Types.CREATE_CHILD_ACCOUNT_SUCCESS]: createChildAccountSuccessHandler,
  [Types.CREATE_CHILD_ACCOUNT_FAILURE]: createChildAccountFailureHandler,

  [Types.SUBMIT_CHILD_ACCOUNT]: submitChildAccountHandler,
  [Types.SUBMIT_CHILD_ACCOUNT_SUCCESS]: submitChildAccountSuccessHandler,
  [Types.SUBMIT_CHILD_ACCOUNT_FAILURE]: submitChildAccountFailureHandler,

  [UserTypes.MARK_SSN_REQUEST_SUCCESS]: setChildSSNRequested,

  [Types.SUBMIT_SSN]: navigateToChildSsnHandler,

  [UserTypes.FETCH_USER_SUCCESS]: fetchUserSuccessHandler,
  [UserTypes.FETCH_USER_DETAIL_SUCCESS]: fetchUserDetailSuccessHandler,

  [SettingTypes.SHOW_DOCUMENTS]: showDocumentsHandler,
  [SettingTypes.SHOW_DOCUMENTS_SUCCESS]: showDocumentSuccessHandler,
  [SettingTypes.SHOW_CONFIRMATIONS]: showConfirmationsHandler,
  [SettingTypes.SHOW_CONFIRMATIONS_SUCCESS]: showConfirmationsSuccessHandler,

  [Types.FETCH_CHILD_CHART_DATA]: fetchChildChartDataHandler,
  [Types.FETCH_CHILD_CHART_DATA_SUCCESS]: fetchChildChartDataSuccessHandler,

  [Types.SHOW_BROKER_DEALER_CHILD_INFO]: showBrokerDealerChildInfoHandler,
  [Types.SHOW_BROKER_DEALER_CHILD_INFO_SUCCESS]: showBrokerDealerChildInfoSuccessHandler,
  [Types.SHOW_BROKER_DEALER_CHILD_INFO_FAILURE]: showBrokerDealerChildInfoFailureHandler,

  [Types.LOG_NUMBER_OF_CHILDREN_AT_START]: logNumberOfChildrenAtStartHandler

}

export const reducer = createReducer(INITIAL_STATE, HANDLERS)

// ========================================================
// Selectors
// ========================================================

export const getAvatar = (state, childID) => {
  let avatar = PHANTOM.getIn(state, path(CHILD_ENTITIES.AVATAR)(childID))
  return avatar || PHANTOM.getIn(state, path(CHILD_ENTITIES.AVATAR)(undefined))
}

export const getTotalChildren = (state) => {
  let listObject = (PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)()))
  let arr = (listObject && Object.values(listObject)) || []
  return arr.length
}

export const fetchNumberOfChildrenAtStart = (state) => PHANTOM.getIn(state, path(CHILD_ENTITIES.NUMBER_OF_CHILDREN_AT_START)())

export const isProcessing = (state) => PHANTOM.getIn(state, path(CHILD_ENTITIES.PROCESSING)()) !== undefined

export const isCreatingChildAccount = (state) => PHANTOM.getIn(state, path(CHILD_ENTITIES.PROCESSING)()) === CHILD_ENTITIES.PROCESSING_CREATE_CHILD_ACCOUNT

export const isFetchingChildStocks = (state) => PHANTOM.getIn(state, path(CHILD_ENTITIES.PROCESSING)())

export const isUpdatingChildImage = (state) => PHANTOM.getIn(state, path(CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE)())

export const getFirstName = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.FIRST_NAME)(childID))

export const isSSNAdded = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.IS_SSN_ADDED)(childID))

export const isBankAdded = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.IS_BANK_ADDED)(childID))

export const getImageUrl = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.IMAGE_URL)(childID))

export const getImage = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.CHILD_IMAGE)(childID))

export const getChildImage = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.CHILD_IMAGE)(childID))

export const getDOB = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.DOB)(childID))

export const getChildren = (state) => {
  let result = PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)())
  return result
}

export const isChildSSNAdded = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.IS_SSN_ADDED)(childID)) === 1
export const isChildSSNRequested = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.IS_SSN_ADDED)(childID)) === 2

export const childrenAvailable = (state) => {
  let childrenObj = (PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)()))
  let childArr = (childrenObj && Object.keys(childrenObj)) || []
  return childArr.length > 0
}

export const getAvailableChildID = (state) => {
  let childrenObj = (PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)()))
  let childArr = (childrenObj && Object.keys(childrenObj)) || []
  if (childArr.length > 0) {
    return childArr[0]
  } else return undefined
}

export const getTotalPortfolioValue = (state) => {
  let children = PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)())

  let totalValue = 0
  if (children) {
    Object.values(children).map(child => {
      let p = child[CHILD_ENTITIES.PORTFOLIO]
      if (p && p[CHILD_ENTITIES.CURRENT_VALUE]) {
        let cValue = p[CHILD_ENTITIES.CURRENT_VALUE]
        cValue && (totalValue += parseFloat(cValue))
      }
    })
  }

  return totalValue
}

export const getTotalContributions = (state) => {
  let children = PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)())

  let totalValue = 0

  if (children) {
    Object.values(children).map(child => {
      let p = child[CHILD_ENTITIES.PORTFOLIO]
      if (p && p[CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]) {
        let cValue = p[CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]
        cValue && (totalValue += parseFloat(cValue))
      }
    })
  }

  return totalValue
}

export const getFamilyGrowth = (state) => {
  let children = PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)())

  let totalValue = 0
  let totalContribution = 0

  if (children) {
    Object.values(children).map(child => {
      let p = child[CHILD_ENTITIES.PORTFOLIO]
      if (p && p[CHILD_ENTITIES.CURRENT_VALUE]) {
        let cValue = p[CHILD_ENTITIES.CURRENT_VALUE]
        cValue && (totalValue += parseFloat(cValue))
      }
      if (p && p[CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]) {
        let cValue = p[CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]
        cValue && (totalContribution += parseFloat(cValue))
      }
    })
  }

  let growthValue = parseFloat(totalValue - totalContribution).toFixed(2)
  let growthPercentage = ((totalContribution !== 0) && parseFloat(((totalValue - totalContribution) / totalContribution) * 100).toFixed(2)) || 0

  return {[CHILD_ENTITIES.GROWTH_IN_VALUE]: growthValue, [CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]: growthPercentage}
}

export const getStatements = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.STATEMENTS)(childID))

export const getConfirmations = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.CONFIRMATIONS)(childID))

export const getPortfolioDetail = (state, childID) => {
  let x = PHANTOM.getIn(state, path(CHILD_ENTITIES.PORTFOLIO)(childID))
  return x
}

export const getBrokerDealerData = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.BROKER_DEALER_DATA)(childID))

export const getChildFundingStatus = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.SPROUT_FUNDING_STATUS)(childID))

export const getChildAccountStatus = (state, childID) => PHANTOM.getIn(state, path(CHILD_ENTITIES.SPROUT_ACCOUNT_STATUS)(childID))

export const getSingularChildID = (state) => {
  let childrenObj = (PHANTOM.getIn(state, path(CHILD_ENTITIES.LIST_INDEX)()))
  let childArr = (childrenObj && Object.keys(childrenObj)) || []
  return childArr[0] || undefined
}

export const getChildStockPerformance = (state, childID) => {
  let performance = PHANTOM.getIn(state, path(CHILD_ENTITIES.STOCK_PERFORMANCE)(childID))
  let arr = []

  // get current balance of the child
  let portfolio = PHANTOM.getIn(state, path(CHILD_ENTITIES.PORTFOLIO)(childID))
  let availableBalance = portfolio && portfolio[CHILD_ENTITIES.AVAILABLE_VALUE] || 0

  // get child's current age
  let childDOB = PHANTOM.getIn(state, path(CHILD_ENTITIES.DOB)(childID))
  let birthDate = moment(childDOB, 'YYYY-MM-DD')
  let currentDate = moment()
  let age = currentDate.diff(birthDate, 'y')

  performance && Object.values(performance).map(p => {
    let pAge = p[CHILD_ENTITIES.STOCK_PERFORMANCE_AGE]
    if (pAge === age) {
      arr.push(parseFloat(availableBalance).toFixed(2))
    } else {
      let marketvalue = p[CHILD_ENTITIES.STOCK_PERFORMANCE_MARKET_VALUE]
      arr.push(marketvalue)
    }
  })
  return arr
}
