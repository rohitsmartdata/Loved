/* eslint-disable no-multi-spaces,key-spacing,no-trailing-spaces,no-multiple-empty-lines,handle-callback-err */
/**
 * Created by viktor on 14/7/17.
 */

import { createReducer, createActions }
  from 'reduxsauce'
import Immutable
  from 'seamless-immutable'
import {USER_ENTITIES, path}
  from '../../Utility/Mapper/User'
import PARAMETERS
  from '../ActionParameters'
import PHANTOM
  from '../../Utility/Phantom'

// ========================================================
// Types & Action Creators
// ========================================================

const {Types, Creators} = createActions({

  // add a new child
  fetchUser         : PARAMETERS.FETCH_USER,
  // fetch user successfully
  fetchUserSuccess  : PARAMETERS.FETCH_USER_SUCCESS,
  // fetching user failed
  fetchUserFailure : PARAMETERS.FETCH_USER_FAILURE,

  // fetch user details
  fetchUserDetail   : PARAMETERS.FETCH_USER_DETAIL,
  fetchUserDetailSuccess : PARAMETERS.FETCH_USER_DETAIL_SUCCESS,
  fetchUserDetailFailure : PARAMETERS.FETCH_USER_DETAIL_FAILURE,

  fetchUserInstructions: PARAMETERS.FETCH_USER_INSTRUCTIONS,
  fetchUserInstructionsSuccess: PARAMETERS.FETCH_USER_INSTRUCTIONS_SUCCESS,
  fetchUserInstructionsFailure: PARAMETERS.FETCH_USER_INSTRUCTIONS_FAILURE,

  modifyUserInstruction: PARAMETERS.MODIFY_USER_INSTRUCTION,
  modifyUserInstructionSuccess: PARAMETERS.MODIFY_USER_INSTRUCTION_SUCCESS,
  modifyUserInstructionFailure: PARAMETERS.MODIFY_USER_INSTRUCTION_FAILURE,

  modifyUserRecurringInstruction: PARAMETERS.MODIFY_USER_RECURRING_INSTRUCTION,
  modifyUserRecurringInstructionSuccess: PARAMETERS.MODIFY_USER_RECURRING_INSTRUCTION_SUCCESS,
  modifyUserRecurringInstructionFailure: PARAMETERS.MODIFY_USER_RECURRING_INSTRUCTION_FAILURE,

  // navigate to provided user detail input screen
  // during onboarding process
  navigateUserDetailInput: PARAMETERS.NAVIGATE_USER_DETAIL_INPUT,

  // set user ID
  setUserId         : PARAMETERS.SET_USER_ID,
  setUsername       : PARAMETERS.SET_USERNAME,
  setFirstName       : PARAMETERS.SET_FIRST_NAME,
  setLastName       : PARAMETERS.SET_LAST_NAME,

  setPasscode       : PARAMETERS.SET_PASSCODE,

  setUserImageUrl : PARAMETERS.SET_USER_IMAGE_URL,

  setUserImage : PARAMETERS.SET_USER_IMAGE,

  deleteAccount: PARAMETERS.DELETE_ACCOUNT,
  deleteAccountSuccess: null,

  disconnectBank: PARAMETERS.DISCONNECT_BANK,
  disconnectBankSuccess: PARAMETERS.DISCONNECT_BANK_SUCCESS,
  disconnectBankFailure: null,
  disableShowBankNotification: null,

  updateUserImageProcessing: PARAMETERS.UPDATE_USER_IMAGE_PROCESSING,

  setSelectedChild: PARAMETERS.SET_SELECTED_CHILD,

  // initiate PLAID window
  initiatePlaid     : PARAMETERS.INITIATE_PLAID,
  // dismiss PLAID window
  dismissPlaid      : PARAMETERS.DISMISS_PLAID,
  // plaid linked by widget
  linkFundingSource : PARAMETERS.LINK_FUNDING_SOURCE,
  // plaid linking success response from server
  linkFundingSourceSuccess : PARAMETERS.LINK_FUNDING_SOURCE_SUCCESS,
  // plaid linking failure
  linkFundingSourceFailure : PARAMETERS.LINK_FUNDING_SOURCE_FAILURE,

  resetBankAccount: PARAMETERS.RESET_BANK_ACCOUNT,
  resetBankAccountSuccess: PARAMETERS.RESET_BANK_ACCOUNT_SUCCESS,
  resetBankAccountFailure: PARAMETERS.RESET_BANK_ACCOUNT_FAILURE,

  verifyFundingAmount: PARAMETERS.VERIFY_FUNDING_AMOUNT,
  verifyFundingAmountSuccess: PARAMETERS.VERIFY_FUNDING_AMOUNT_SUCCESS,
  verifyFundingAmountFailure: PARAMETERS.VERIFY_FUNDING_AMOUNT_FAILURE,

  reAuthenticateBankAccount: PARAMETERS.RE_AUTHENTICATE_BANK_ACCOUNT,

  reAuthenticateBankAccountWithAccountId : PARAMETERS.RE_AUTHENTICATE_BANK_ACCOUNT_WITH_ACCOUNT_ID,

  showPendingVerificationAlert: PARAMETERS.SHOW_PENDING_VERIFICATION_ALERT,

  selectBankAccount: PARAMETERS.SELECT_BANK_ACCOUNT,

  navigateTodo: PARAMETERS.NAVIGATE_TODO,

  navigateToAgreement: PARAMETERS.NAVIGATE_TO_AGREEMENT,

  navigateToAmountVerificationScreen: PARAMETERS.NAVIGATE_TO_AMOUNT_VERIFICATION_SCREEN,

  storeUserSsn: PARAMETERS.STORE_USER_SSN,
  storeUserSsnSuccess: PARAMETERS.STORE_USER_SSN_SUCCESS,
  storeUserSsnFailure: PARAMETERS.STORE_USER_SSN_FAILURE,

  storeUserAddress: PARAMETERS.STORE_USER_ADDRESS,

  markSsnRequest: PARAMETERS.MARK_SSN_REQUEST,
  markSsnRequestSuccess: PARAMETERS.MARK_SSN_REQUEST_SUCCESS,
  markSsnRequestFailure: PARAMETERS.MARK_SSN_REQUEST_FAILURE,

  openArticle: PARAMETERS.OPEN_ARTICLE,
  closeArticle: PARAMETERS.CLOSE_ARTICLE,

  internetConnectionFailure: null,
  internetConnectionSuccess: null,

  queryAccountApi: PARAMETERS.QUERY_ACCOUNT_API,
  queryAccountApiSuccess: PARAMETERS.QUERY_ACCOUNT_API_SUCCESS,
  queryAccountApiFailure: PARAMETERS.QUERY_ACCOUNT_API_FAILURE,

  navigateToConnectBank: PARAMETERS.NAVIGATE_TO_CONNECT_BANK,
  connectBank: PARAMETERS.CONNECT_BANK,
  connectBankSuccess: PARAMETERS.CONNECT_BANK_SUCCESS,
  connectBankFailure: PARAMETERS.CONNECT_BANK_FAILURE,

  navigateTc: PARAMETERS.NAVIGATE_TC,
  agreeTc: PARAMETERS.AGREE_TC,
  disagreeTC: PARAMETERS.DISAGREE_TC,
  closeTc: PARAMETERS.NAVIGATE_TC,

  dismissAllModal: PARAMETERS.DISMISS_ALL_MODEL,

  switchOnDebugMode: PARAMETERS.SWITCH_ON_DEBUG_MODE,
  switchOnDebugModeSuccess: PARAMETERS.SWITCH_ON_DEBUG_MODE_SUCCESS,
  switchOffDebugMode: null,

  popScreen: PARAMETERS.POP_SCREEN,

  resetStore: null,
  refreshHealth: null,

  fetchGlossary: PARAMETERS.FETCH_GLOSSARY,
  fetchGlossarySuccess: PARAMETERS.FETCH_GLOSSARY_SUCCESS,
  fetchGlossaryFailure: PARAMETERS.FETCH_GLOSSARY_FAILURE,

  navigateToDebugWindow: PARAMETERS.NAVIGATE_TO_DEBUG_WINDOW,
  navigateToDashboard: PARAMETERS.NAVIGATE_TO_DASHBOARD,

  setNavTab: PARAMETERS.SET_NAV_TAB
})

export const UserTypes     = Types
export const UserActions   = Creators

// ========================================================
// Initial State
// ========================================================

/*
 Initial State of the Child reducer.

 children : {

 sanity : {
 OK,
 ERROR,
 PROCESSING
 },

 [CHILD_ID] : {
 info : { }
 }

 }

 */
export var INITIAL_STATE = Immutable({})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(USER_ENTITIES.IS_OK)(), true)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(USER_ENTITIES.ERROR)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(USER_ENTITIES.PROCESSING)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(USER_ENTITIES.IS_PLAID_LINKED)(), false)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(USER_ENTITIES.IS_SSN_ADDED)(), false)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(USER_ENTITIES.DEBUG_MODE)(), false)

// ========================================================
// Handlers
// ========================================================

const resetStoreHandler = (state) => {
  return INITIAL_STATE
}

const refreshHealthHandler = (state) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

/*
 Login Handler.
 This function is called when login action is dispatched.

 Store modification :-
 1. Set PROCESSING_LOGIN as true
 */
const fetchUserHandler = (state, action) => {
  return PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_FETCH_USER)
}

const fetchUserSuccessHandler = (state, action) => {
  try {
    let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
    let u = action[USER_ENTITIES.USER_DATA]['user'][0]

    let riskScore = u['risk_score']
    let ssnEntered = u['ssn_entered']
    let bankEntered = u['bank_entered']

    s = PHANTOM.setIn(s, path(USER_ENTITIES.USER_ID)(), action[USER_ENTITIES.USER_ID])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.FIRST_NAME)(), u['first_name'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.MIDDLE_INITIAL)(), u['middle'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.LAST_NAME)(), u['last_name'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.EMAIL_ID)(), u['email'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.IMAGE_URL)(), u['image_url'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.CURRENT_FUNDING_SOURCE_ID)(), u['current_funding_source_id'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.CURRENT_FUNDING_SOURCE_STATUS)(), u['current_funding_source_status'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.CURRENT_FUNDING_SOURCE_ACCOUNT)(), u['current_funding_source_account'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.FUNDING_STATUS)(), u['funding_status'] || 0)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.RISK_SCORE)(), riskScore)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.IS_SSN_ADDED)(), ssnEntered)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.IS_BANK_ADDED)(), bankEntered)

    return s
  } catch (err) {
    return state
  }
}

const fetchUserFailureHandler = (state, error) => {
  try {
    let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), error)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
    return s
  } catch (err) {
    return state
  }
}

const fetchUserDetailHandler = (state, action) => {
  let userID = action[USER_ENTITIES.USER_ID]
  let value = PHANTOM.getIn(state, path(USER_ENTITIES.LATEST_USER_DETAIL_ID)())

  if (value) {
    return PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_USER_DETAIL_FETCH)
  } else {
    let s = PHANTOM.setIn(state, path(USER_ENTITIES.LATEST_USER_DETAIL_ID)(), userID)
    s =  PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_USER_DETAIL_FETCH)
    return s
  }
}

const fetchUserDetailSuccessHandler = (state, action) => {
  try {
    let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
    let user = action[USER_ENTITIES.USER_DETAIL]['user']
    let userID = action[USER_ENTITIES.USER_DETAIL]['user_id']
    let lastUpdatedTime = action[USER_ENTITIES.USER_DETAIL]['last_updated_time']

    if (user) {
      let availableValue = user['available_value']
      let currentValue = user['current_value']
      let pendingTransfer = user['pending_transfer_amount']
      let pendingWithdrawal = user['pending_withdrawal_amount']
      let totalContribution = user['total_contributions']
      let growthValue = user['growth_in_value']
      let growthPercentage = user['growth_in_percentage']

      s = PHANTOM.setIn(s, path(USER_ENTITIES.USER_ID)(), userID)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.CURRENT_VALUE)(), (currentValue && parseFloat(currentValue).toFixed(2)) || 0)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.AVAILABLE_VALUE)(), (availableValue && parseFloat(availableValue).toFixed(2)) || 0)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.PENDING_TRANSFER_AMOUNT)(), (pendingTransfer && parseFloat(pendingTransfer).toFixed(2)) || 0)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.PENDING_WITHDRAWAL_AMOUNT)(), (pendingWithdrawal && parseFloat(pendingWithdrawal).toFixed(2)) || 0)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.TOTAL_CONTRIBUTIONS)(), (totalContribution && parseFloat(totalContribution).toFixed(2)) || 0)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.GROWTH_IN_VALUE)(), (growthValue && parseFloat(growthValue).toFixed(2)) || 0)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.GROWTH_IN_PERCENTAGE)(), (growthPercentage && parseFloat(growthPercentage).toFixed(2)) || 0)
      s = PHANTOM.setIn(s, path(USER_ENTITIES.LAST_UPDATED_TIME)(), lastUpdatedTime)
    }

    return s
  } catch (err) {
    return state
  }
}

const fetchUserDetailFailureHandler = (state, action) => {
  try {
    let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), action['error'])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
    return s
  } catch (err) {
    return state
  }
}

const loginHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_FETCH_USER)
const loginFailureHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), undefined)
// const loginSuccessHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.SELECTED_CHILD)(), undefined)

const setUserID = (state, action) => {
  try {
    PHANTOM.assertActionPayload(action)
    let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)

    s = PHANTOM.setIn(s, path(USER_ENTITIES.USER_ID)(), action[USER_ENTITIES.USER_ID])
    s = PHANTOM.setIn(s, path(USER_ENTITIES.EMAIL_ID)(), action[USER_ENTITIES.EMAIL_ID])
    return s
  } catch (err) {
    return state
  }
}

const setFirstName = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.FIRST_NAME)(), action[USER_ENTITIES.FIRST_NAME])

const setLastName = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.LAST_NAME)(), action[USER_ENTITIES.LAST_NAME])

const setUsernameHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.EMAIL_ID)(), action[USER_ENTITIES.EMAIL_ID])

const linkFundingSourceHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_LINK_FUNDING_SOURCE)

const linkFundingSourceSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.IS_PLAID_LINKED)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.SOURCE_REFERENCE_ID)(), action[USER_ENTITIES.SOURCE_REFERENCE_ID])
  return s
}

const linkFundingSourceFailureHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), 'plaid linking error')
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.IS_PLAID_LINKED)(), false)
  return s
}

const verifyFundingAmountHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_VERIFY_FUNDING_SOURCE)

const verifyFundingAmountSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const verifyFundingAmountFailureHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), 'verify funding amount error')
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const transferSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const transferFailureHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), 'transfer failure error')
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const switchOnDebugModeHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.DEBUG_MODE)(), true)

const switchOffDebugModeHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.DEBUG_MODE)(), false)

const handleInternetConnectionFailure = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.INTERNET_CONNECTED)(), false)
const handleInternetConnectionSuccess = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.INTERNET_CONNECTED)(), true)

const setUserImageUrlHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.IMAGE_URL)(), action[USER_ENTITIES.IMAGE_URL])

const setUserImageHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.USER_IMAGE)(), action[USER_ENTITIES.USER_IMAGE])

const updateUserImageProcessingHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.UPDATE_USER_IMAGE_PROCESSING)(), action[USER_ENTITIES.UPDATE_USER_IMAGE_PROCESSING])

const fetchUserInstructionsHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_FETCH_USER_INSTRUCTIONS)

const fetchUserInstructionsSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const fetchUserInstructionsFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), error)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const modifyUserInstructionHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_MODIFY_USER_INSTRUCTION)

const modifyRecurringAmountHandler = (state, action) => {
  return PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_MODIFY_USER_INSTRUCTION)
}

const modifyUserInstructionSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const modifyUserInstructionFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), error)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const switchOnDebugModeSuccessHandler = (state, action) => {
  let userDetail = action[USER_ENTITIES.USER_DETAIL]
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.STOCKS)(), userDetail['stocks'])
  return s
}

const setSelectedChildHandler = (state, action) => {
  let selectedChild = action[USER_ENTITIES.SELECTED_CHILD]
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.SELECTED_CHILD)(), selectedChild)
  return s
}

const fetchGlossaryHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_USER_GLOSSARY)

const fetchGlossarySuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  let glossary = action[USER_ENTITIES.GLOSSARY]
  glossary && glossary.map(g => {
    let header = g['infoHeader']
    let body = g['infoBody']
    try {
      let obj = {
        [USER_ENTITIES.GLOSSARY_HEADER]: header,
        [USER_ENTITIES.GLOSSARY_BODY]: body
      }
      header && (s = PHANTOM.setIn(s, path(header)(), obj))
    } catch (err) {
      console.log('[[ERROR WHILE SETTING HEADER]] --> ', err)
    }
  })
  return s
}

const fetchGlossaryFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), error)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  return s
}

const storeUserSSNHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_STORE_USER_SSN)

const storeUserSSNSuccessHandler = (state) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.IS_SSN_ADDED)(), 1)
  return s
}

const storeUserSSNFailureHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), undefined)

const markSsnRequestHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_STORE_USER_SSN)

const markSsnRequestSuccessHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), undefined)

const markSsnRequestFailureHandler = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), undefined)

const markCrossedChildSSN = (state, action) => PHANTOM.setIn(state, path(USER_ENTITIES.CROSSED_CHILD_SSN)(), true)

const deleteAccountHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_DELETE_ACCOUNT)
const deleteAccountSuccessHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), undefined)

const disconnectBankHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), USER_ENTITIES.PROCESSING_DISCONNECT_BANK)
const disconnectBankSuccessHandler = (state) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(USER_ENTITIES.SHOW_BANK_DISCONNECT_NOTIFICATION)(), true)
  return s
}
const disableShowBankNotificationHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.SHOW_BANK_DISCONNECT_NOTIFICATION)(), false)
const disconnectBankFailureHandler = (state) => PHANTOM.setIn(state, path(USER_ENTITIES.PROCESSING)(), undefined)

const setNavTabHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(USER_ENTITIES.TAB)(), action[USER_ENTITIES.TAB])
  action[USER_ENTITIES.TAB_IS_GOAL] !== undefined && (s = PHANTOM.setIn(s, path(USER_ENTITIES.TAB_IS_GOAL)(), action[USER_ENTITIES.TAB_IS_GOAL]))
  return s
}

// ========================================================
// Reducer Formation & Exports
// ========================================================

export const HANDLERS = {

  [Types.RESET_STORE]: resetStoreHandler,
  [Types.REFRESH_HEALTH]: refreshHealthHandler,

  [Types.SET_NAV_TAB]: setNavTabHandler,

  [Types.DELETE_ACCOUNT]: deleteAccountHandler,
  [Types.DELETE_ACCOUNT_SUCCESS]: deleteAccountSuccessHandler,

  [Types.DISCONNECT_BANK]: disconnectBankHandler,
  [Types.DISCONNECT_BANK_SUCCESS]: disconnectBankSuccessHandler,
  [Types.DISCONNECT_BANK_FAILURE]: disconnectBankFailureHandler,
  [Types.DISABLE_SHOW_BANK_NOTIFICATION]: disableShowBankNotificationHandler,

  [Types.FETCH_USER]: fetchUserHandler,
  [Types.FETCH_USER_SUCCESS]: fetchUserSuccessHandler,
  [Types.FETCH_USER_FAILURE]: fetchUserFailureHandler,

  [Types.FETCH_GLOSSARY]: fetchGlossaryHandler,
  [Types.FETCH_GLOSSARY_SUCCESS]: fetchGlossarySuccessHandler,
  [Types.FETCH_GLOSSARY_FAILURE]: fetchGlossaryFailureHandler,

  [Types.STORE_USER_SSN]: storeUserSSNHandler,
  [Types.STORE_USER_SSN_SUCCESS]: storeUserSSNSuccessHandler,
  [Types.STORE_USER_SSN_FAILURE]: storeUserSSNFailureHandler,

  [Types.MARK_SSN_REQUEST]: markSsnRequestHandler,
  [Types.MARK_SSN_REQUEST_SUCCESS]: markSsnRequestSuccessHandler,
  [Types.MARK_SSN_REQUEST_FAILURE]: markSsnRequestFailureHandler,

  [Types.FETCH_USER_DETAIL]: fetchUserDetailHandler,
  [Types.FETCH_USER_DETAIL_SUCCESS]: fetchUserDetailSuccessHandler,
  [Types.FETCH_USER_DETAIL_FAILURE]: fetchUserDetailFailureHandler,

  [Types.FETCH_USER_INSTRUCTIONS]: fetchUserInstructionsHandler,
  [Types.FETCH_USER_INSTRUCTIONS_SUCCESS]: fetchUserInstructionsSuccessHandler,
  [Types.FETCH_USER_INSTRUCTIONS_FAILURE]: fetchUserInstructionsFailureHandler,

  [Types.MODIFY_USER_INSTRUCTION]: modifyUserInstructionHandler,
  [Types.MODIFY_USER_INSTRUCTION_SUCCESS]: modifyUserInstructionSuccessHandler,
  [Types.MODIFY_USER_INSTRUCTION_FAILURE]: modifyUserInstructionFailureHandler,

  [Types.MODIFY_USER_RECURRING_INSTRUCTION]: modifyRecurringAmountHandler,

  'SIGNUP_SUCCESS': setUserID,
  'SHOW_INVEST': transferSuccessHandler,
  'TRANSFER_SUCCESS': transferSuccessHandler,
  'TRANSFER_FAILURE': transferFailureHandler,

  'AUTO_NAVIGATE_ONBOARDING': markCrossedChildSSN,
  'SUBMIT_CHILD_ACCOUNT_SUCCESS': markCrossedChildSSN,

  [Types.SET_USER_ID]: setUserID,
  [Types.SET_USERNAME]: setUsernameHandler,
  [Types.SET_FIRST_NAME]: setFirstName,
  [Types.SET_LAST_NAME]: setLastName,

  [Types.LINK_FUNDING_SOURCE]: linkFundingSourceHandler,
  [Types.LINK_FUNDING_SOURCE_SUCCESS]: linkFundingSourceSuccessHandler,
  [Types.LINK_FUNDING_SOURCE_FAILURE]: linkFundingSourceFailureHandler,

  [Types.VERIFY_FUNDING_AMOUNT]: verifyFundingAmountHandler,
  [Types.VERIFY_FUNDING_AMOUNT_SUCCESS]: verifyFundingAmountSuccessHandler,
  [Types.VERIFY_FUNDING_AMOUNT_FAILURE]: verifyFundingAmountFailureHandler,

  [Types.SWITCH_ON_DEBUG_MODE]: switchOnDebugModeHandler,
  [Types.SWITCH_ON_DEBUG_MODE_SUCCESS]: switchOnDebugModeSuccessHandler,
  [Types.SWITCH_OFF_DEBUG_MODE]: switchOffDebugModeHandler,

  [Types.SET_USER_IMAGE]: setUserImageHandler,

  [Types.UPDATE_USER_IMAGE_PROCESSING]: updateUserImageProcessingHandler,

  [Types.SET_USER_IMAGE_URL]: setUserImageUrlHandler,


  [Types.SET_SELECTED_CHILD]: setSelectedChildHandler,

  [Types.INTERNET_CONNECTION_FAILURE]: handleInternetConnectionFailure,
  [Types.INTERNET_CONNECTION_SUCCESS]: handleInternetConnectionSuccess,

  'LOGIN': loginHandler,
  'LOGIN_FAILURE': loginFailureHandler
  // 'LOGIN_SUCCESS': loginSuccessHandler
}

export const reducer = createReducer(INITIAL_STATE, HANDLERS)

// ========================================================
// Selectors
// ========================================================

export const isDeletingAccount = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_DELETE_ACCOUNT

export const isDisconnectingBank = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_DISCONNECT_BANK

export const showBankNotification = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.SHOW_BANK_DISCONNECT_NOTIFICATION)())

export const getGlossary = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.GLOSSARY)())

export const isFetchingGlossary = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_USER_GLOSSARY

export const getSelectedChild = (state) => {
  let child = PHANTOM.getIn(state, path(USER_ENTITIES.SELECTED_CHILD)())
  return (child && child['childID']) || undefined
}

export const getNavTab = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.TAB)())

export const isNavTabGoal = (state) => {
  let g = PHANTOM.getIn(state, path(USER_ENTITIES.TAB_IS_GOAL)()) || false
  return g
}

export const isUserProcessing = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) !== undefined
}

export const isStoreUserSSNProcessing = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_STORE_USER_SSN

export const isVerifyFundingProcessing = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_VERIFY_FUNDING_SOURCE

export const getLatestUserDetailID = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.LATEST_USER_DETAIL_ID)())
}

export const getUserID = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.USER_ID)())
}

export const getUserIsBankAdded = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.IS_BANK_ADDED)())
}

export const getTotalContribution = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.TOTAL_CONTRIBUTIONS)())
}
export const getCurrentValue = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.CURRENT_VALUE)())
}
export const getAvailableValue = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.AVAILABLE_VALUE)())
}
export const getPendingTransferAmount = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.PENDING_TRANSFER_AMOUNT)())
}
export const getPendingWithdrawalAmount = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.PENDING_WITHDRAWAL_AMOUNT)())
}
export const getGrowthValue = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.GROWTH_IN_VALUE)())
}
export const getGrowthPercentage = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.GROWTH_IN_PERCENTAGE)())
}
export const getLastUpdatedTime = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.LAST_UPDATED_TIME)())
}
export const getCrossedChildSSN = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.CROSSED_CHILD_SSN)())

export const getRiskScore = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.RISK_SCORE)())

export const getFirstName = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.FIRST_NAME)())
}

export const getLastName = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.LAST_NAME)())
}

export const getUserEmail = (state) => {
  let r = PHANTOM.getIn(state, path(USER_ENTITIES.EMAIL_ID)())
  return r
}

export const getUserPhoneNumber = (state) => {
  let r = PHANTOM.getIn(state, path(USER_ENTITIES.PHONE_NUMBER)())
  return r
}

export const isFundingSourceLinked = (state) => {
  const srcId = PHANTOM.getIn(state, path(USER_ENTITIES.CURRENT_FUNDING_SOURCE_ID)())
  let a = !!srcId
  let b
  if (!a) {
    b = PHANTOM.getIn(state, path(USER_ENTITIES.IS_PLAID_LINKED)())
    return b
  } else {
    return a
  }
}

export const getFundingSourceReferenceID = (state) => {
  return PHANTOM.getIn(state, path(USER_ENTITIES.SOURCE_REFERENCE_ID)())
}

export const isUserSSNAdded = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.IS_SSN_ADDED)())

export const getFundingSourceID = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.CURRENT_FUNDING_SOURCE_ID)())

export const getFundingSourceStatus = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.CURRENT_FUNDING_SOURCE_STATUS)())

export const getFundingSourceAccount = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.CURRENT_FUNDING_SOURCE_ACCOUNT)())

export const getFundingStatus = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.FUNDING_STATUS)())

export const getTodoList = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.TODO_LIST)())

export const isProfileComplete = (state) => !!(PHANTOM.getIn(state, path(USER_ENTITIES.INPUT_USER_DETAIL_SCREEN)()) === 'USER_INPUT_DETAIL_9')

export const getUserDetailScreen = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.INPUT_USER_DETAIL_SCREEN)())

export const getDebugMode = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.DEBUG_MODE)())

export const getStocks = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.STOCKS)())

export const getImageUrl = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.IMAGE_URL)())

export const getUserImage =  (state) => PHANTOM.getIn(state, path(USER_ENTITIES.USER_IMAGE)())

export const getUserImageProcessing =  (state) => PHANTOM.getIn(state, path(USER_ENTITIES.UPDATE_USER_IMAGE_PROCESSING)())

export const isUserDetailProcessing = (state) => {
  let userDetail = PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_USER_DETAIL_FETCH
  let userFetch = PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_FETCH_USER
  return (userDetail || userFetch)
}

export const isInternetConnected = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.INTERNET_CONNECTED)())

export const isFundingSourceGettingLinked = (state) => {
  const r = PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)())
  return r === USER_ENTITIES.PROCESSING_LINK_FUNDING_SOURCE
}

export const isUserInstructionFetchProcessing = (state) => {
  let p = PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)())
  return (p === USER_ENTITIES.PROCESSING_FETCH_USER_INSTRUCTIONS) || (p === USER_ENTITIES.PROCESSING_USER_DETAIL_FETCH)
}

export const isModifyUserInstructionProcessing = (state) => PHANTOM.getIn(state, path(USER_ENTITIES.PROCESSING)()) === USER_ENTITIES.PROCESSING_MODIFY_USER_INSTRUCTION
