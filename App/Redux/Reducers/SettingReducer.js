/* eslint-disable key-spacing,no-unused-vars,no-multi-spaces,no-trailing-spaces */
/**
 * Created by viktor on 14/8/17.
 */

import { createReducer, createActions }
  from 'reduxsauce'
import Immutable
  from 'seamless-immutable'
import {SETTINGS_ENTITIES, path}
  from '../../Utility/Mapper/Settings'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import PARAMETERS
  from '../ActionParameters'
import {UserTypes}
  from './UserReducer'
import PHANTOM from '../../Utility/Phantom'

// ========================================================
// Types & Action Creators
// ========================================================

const {Types, Creators} = createActions({
  // navigate to screen
  // (used in deep link)
  navigateTo            : PARAMETERS.NAVIGATE_TO,

  // user to initiate deep
  // link navigation from
  // settings drawer
  navigateDeep          : PARAMETERS.NAVIGATE_TO,

  // show settings panel
  showSettings           : PARAMETERS.SHOW_SETTINGS,
  // hide settings panel
  hideSettings           : PARAMETERS.HIDE_SETTINGS,

  // show settings panel
  openSettings           : PARAMETERS.OPEN_SETTINGS,

  // show academy
  showAcademy           : PARAMETERS.SHOW_ACADEMY,

  navigateToSettingDetailScreen      : PARAMETERS.NAVIGATE_TO_SETTING_DETAIL_SCREEN,
  navigateToProfile      : PARAMETERS.NAVIGATE_TO_PROFILE,

  showRecurringWidget    : PARAMETERS.SHOW_RECURRING_WIDGET,
  showInvestorQuestions  : PARAMETERS.SHOW_INVESTOR_QUESTIONS,

  showRegularTransfers    : PARAMETERS.SHOW_REGULAR_TRANSFERS,

  // reset the password
  changePassword          : PARAMETERS.CHANGE_PASSWORD,
  changePin               : PARAMETERS.CHANGE_PIN,

  processChangePassword   : PARAMETERS.PROCESS_CHANGE_PASSWORD,
  processChangePasswordSuccess : PARAMETERS.PROCESS_CHANGE_PASSWORD_SUCCESS,
  processChangePasswordFailure : PARAMETERS.PROCESS_CHANGE_PASSWORD_FAILURE,

  fetchRecurringData        : PARAMETERS.FETCH_RECURRING_DATA,
  fetchRecurringDataSuccess : PARAMETERS.FETCH_RECURRING_DATA_SUCCESS,
  fetchRecurringDataFailure : PARAMETERS.FETCH_RECURRING_DATA_FAILURE,

  fetchUserTransactions       : PARAMETERS.FETCH_USER_TRANSACTIONS,
  fetchUserTransactionsSuccess: PARAMETERS.FETCH_USER_TRANSACTIONS_SUCCESS,
  fetchUserTransactionsFailure: PARAMETERS.FETCH_USER_TRANSACTIONS_FAILURE,

  showDocuments           : PARAMETERS.SHOW_DOCUMENTS,
  showDocumentsSuccess    : PARAMETERS.SHOW_DOCUMENTS_SUCCESS,
  showDocumentsFailure    : PARAMETERS.SHOW_DOCUMENTS_FAILURE,

  showConfirmations       : PARAMETERS.SHOW_CONFIRMATIONS,
  showConfirmationsSuccess: PARAMETERS.SHOW_CONFIRMATIONS_SUCCESS,
  showConfirmationsFailure: PARAMETERS.SHOW_CONFIRMATIONS_FAILURE,

  showConfig: PARAMETERS.SHOW_CONFIG,

  viewTransfers           : PARAMETERS.VIEW_TRANSFERS,
  viewTransfersSuccess    : PARAMETERS.VIEW_TRANSFERS_SUCCESS,
  viewTransfersFailure    : PARAMETERS.VIEW_TRANSFERS_FAILURE,
  viewActivity            : PARAMETERS.VIEW_ACTIVITY,

  transferNow             : PARAMETERS.TRANSFER_NOW,

  showWebview             : PARAMETERS.SHOW_WEBVIEW,

  showProfile             : PARAMETERS.SHOW_PROFILE,

  navigateToBrokerDealerInfo: PARAMETERS.NAVIGATE_TO_BROKER_DEALER_INFO,
  // forgot password
  forgotPassword          : PARAMETERS.FORGOT_PASSWORD,
  processForgotPassword   : PARAMETERS.PROCESS_FORGOT_PASSWORD,
  processForgotPasswordSuccess : PARAMETERS.PROCESS_FORGOT_PASSWORD_SUCCESS,
  processForgotPasswordFailure : PARAMETERS.PROCESS_FORGOT_PASSWORD_FAILURE,
  resetForgotPasswordEmail : PARAMETERS.RESET_FORGOT_PASSWORD_EMAIL,

  processConfirmPassword   : PARAMETERS.PROCESS_CONFIRM_PASSWORD,
  processConfirmPasswordSuccess : PARAMETERS.PROCESS_CONFIRM_PASSWORD_SUCCESS,
  processConfirmPasswordFailure : PARAMETERS.PROCESS_CONFIRM_PASSWORD_FAILURE,

  // photo feature
  uploadPhoto: PARAMETERS.UPLOAD_PHOTO,
  getPhoto: PARAMETERS.GET_PHOTO,
  uploadPhotoSuccess: PARAMETERS.UPLOAD_PHOTO_SUCCESS,
  setImageMetadata: PARAMETERS.SET_IMAGE_METADATA,
  flushImageMetadata: null,
  disableError: null,

  showAboutUs: PARAMETERS.SHOW_ABOUT_US,

  showWebWindow: PARAMETERS.SHOW_WEB_WINDOW
})

export const SettingTypes     = Types
export const SettingActions   = Creators

// ========================================================
// Initial State
// ========================================================

export var INITIAL_STATE = Immutable({})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(SETTINGS_ENTITIES.IS_OK)(), true)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(SETTINGS_ENTITIES.ERROR)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(SETTINGS_ENTITIES.VERIFIED)(), false)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(SETTINGS_ENTITIES.VERIFIED_EMAIL)(), undefined)

// ========================================================
// Handlers
// ========================================================

const resetStoreHandler = (state) => {
  return INITIAL_STATE
}

const refreshHealthHandler = (state) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
  return s
}

const setImageMetadata = (state, action) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IMAGE_METADATA)(), action[SETTINGS_ENTITIES.IMAGE_METADATA])

const flushImageMetadataHandler = (state, action) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IMAGE_METADATA)(), undefined)

const changePassword = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.PROCESSING)(), SETTINGS_ENTITIES.PROCESSING_CHANGE_PASSWORD)

const changePasswordSuccess = (state) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
  return s
}

const changePasswordFailure = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), action['error'])
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), true)
  return s
}

const fetchRecurringDataHandler = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.PROCESSING)(), SETTINGS_ENTITIES.PROCESSING_RECURRING_DATA_FETCH)

const fetchRecurringDataSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.RECURRING_DATA)(), action[SETTINGS_ENTITIES.RECURRING_DATA])
  return s
}

const fetchRecurringDataFailureHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), action['error'])
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), true)
  return s
}

const disableErrorHandler = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.SHOW_ERROR)(), undefined)

const showDocumentHandler = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.PROCESSING)(), SETTINGS_ENTITIES.PROCESSING_FETCHING_STATEMENTS)

const showDocumentSuccessHandler = (state, action) => {
  let data = action[USER_ENTITIES.USER_DATA]
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
  return s
}

const showDocumentFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), error)
  return s
}

const showConfirmationsHandler = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.PROCESSING)(), SETTINGS_ENTITIES.PROCESSING_FETCHING_STATEMENTS)

const showConfirmationsSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
  return s
}

const showConfirmationsFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), error)
  return s
}

const forgotPassword = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.PROCESSING)(), SETTINGS_ENTITIES.PROCESSING_FORGOT_PASSWORD)

const forgotPasswordSuccess = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.VERIFIED)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.VERIFIED_EMAIL)(), action['EMAIL'])
  return s
}

const forgotPasswordFailure = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), action['error'])
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.VERIFIED)(), false)
  return s
}

const resetForgotPasswordEmail = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.SHOW_ERROR)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.VERIFIED)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.VERIFIED_EMAIL)(), undefined)
  return s
}

const confirmPassword = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.PROCESSING)(), SETTINGS_ENTITIES.PROCESSING_CONFIRM_PASSWORD)
const confirmPasswordSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  return s
}
const confirmPasswordFailure = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), action['error'])
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  return s
}

const fetchUserTransactionsHandler = (state) => PHANTOM.setIn(state, path(SETTINGS_ENTITIES.PROCESSING)(), SETTINGS_ENTITIES.PROCESSING_FETCH_USER_TRANSACTIONS)
const fetchUserTransactionsSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  return s
}
const fetchUserTransactionsFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(SETTINGS_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.ERROR)(), error)
  s = PHANTOM.setIn(s, path(SETTINGS_ENTITIES.PROCESSING)(), undefined)
  return s
}

// ========================================================
// Reducer Formation & Exports
// ========================================================

export const HANDLERS = {

  [UserTypes.RESET_STORE]: resetStoreHandler,
  [UserTypes.REFRESH_HEALTH]: refreshHealthHandler,

  [Types.PROCESS_CHANGE_PASSWORD]: changePassword,
  [Types.PROCESS_CHANGE_PASSWORD_SUCCESS]: changePasswordSuccess,
  [Types.PROCESS_CHANGE_PASSWORD_FAILURE]: changePasswordFailure,

  [Types.FETCH_RECURRING_DATA]: fetchRecurringDataHandler,
  [Types.FETCH_RECURRING_DATA_SUCCESS]: fetchRecurringDataSuccessHandler,
  [Types.FETCH_RECURRING_DATA_FAILURE]: fetchRecurringDataFailureHandler,

  [Types.DISABLE_ERROR]: disableErrorHandler,

  [Types.SHOW_DOCUMENTS_SUCCESS]: showDocumentSuccessHandler,
  [Types.SHOW_DOCUMENTS_FAILURE]: showDocumentFailureHandler,
  [Types.SHOW_DOCUMENTS]: showDocumentHandler,

  [Types.SHOW_CONFIRMATIONS]: showConfirmationsHandler,
  [Types.SHOW_CONFIRMATIONS_SUCCESS]: showConfirmationsSuccessHandler,
  [Types.SHOW_CONFIRMATIONS_FAILURE]: showConfirmationsFailureHandler,

  [Types.FETCH_USER_TRANSACTIONS]: fetchUserTransactionsHandler,
  [Types.FETCH_USER_TRANSACTIONS_SUCCESS]: fetchUserTransactionsSuccessHandler,
  [Types.FETCH_USER_TRANSACTIONS_FAILURE]: fetchUserTransactionsFailureHandler,

  [Types.PROCESS_FORGOT_PASSWORD]: forgotPassword,
  [Types.PROCESS_FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.PROCESS_FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,
  [Types.RESET_FORGOT_PASSWORD_EMAIL]: resetForgotPasswordEmail,

  [Types.PROCESS_CONFIRM_PASSWORD]: confirmPassword,
  [Types.PROCESS_CONFIRM_PASSWORD_SUCCESS]: confirmPasswordSuccessHandler,
  [Types.PROCESS_CONFIRM_PASSWORD_FAILURE]: confirmPasswordFailure,

  [Types.SET_IMAGE_METADATA]: setImageMetadata,
  [Types.FLUSH_IMAGE_METADATA]: flushImageMetadataHandler
}

export const reducer = createReducer(INITIAL_STATE, HANDLERS)

// ========================================================
// Selectors
// ========================================================

export const getRootNavigator = (state) => PHANTOM.getIn(state, path(SETTINGS_ENTITIES.ROOT_NAVIGATOR)())

export const isProcessing = (state) => PHANTOM.getIn(state, path(SETTINGS_ENTITIES.PROCESSING)()) !== undefined

export const isFetchUserTransactionsProcessing = (state) => {
  const r = PHANTOM.getIn(state, path(SETTINGS_ENTITIES.PROCESSING)())
  return r === SETTINGS_ENTITIES.PROCESSING_FETCH_USER_TRANSACTIONS
}

export const getError = (state) => PHANTOM.getIn(state, path(SETTINGS_ENTITIES.SHOW_ERROR)()) ? PHANTOM.getIn(state, path(SETTINGS_ENTITIES.ERROR)()) : undefined

export const getRecurringData = (state) => PHANTOM.getIn(state, path(SETTINGS_ENTITIES.RECURRING_DATA)())

export const isEmailVerified = (state) => PHANTOM.getIn(state, path(SETTINGS_ENTITIES.VERIFIED)())

export const getVerifiedEmail = (state) => PHANTOM.getIn(state, path(SETTINGS_ENTITIES.VERIFIED_EMAIL)())

export const getImageMetadata = (state) => PHANTOM.getIn(state, path(SETTINGS_ENTITIES.IMAGE_METADATA)())
