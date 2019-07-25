/* eslint-disable no-trailing-spaces,key-spacing,no-unused-vars,padded-blocks */
/**
 * Created by victorchoudhary on 12/05/17.
 */

import {put, call}
  from 'redux-saga/effects'
import {UserActions}
  from '../Redux/Reducers/UserReducer'
import {ChildActions}
  from '../Redux/Reducers/ChildReducer'
import {SettingActions}
  from '../Redux/Reducers/SettingReducer'
import {Alert}
  from 'react-native'
import {COMMON_ENTITIES}
  from '../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../Utility/Mapper/Child'
import {ONBOARDING_ENTITIES}
  from '../Utility/Mapper/Onboard'
import {LW_EVENTS, LW_EVENT_TYPE}
  from '../Utility/Mapper/Screens'
import {ANALYTIC_PROPERTIES, FORM_TYPES}
  from '../Config/contants'
import { analytics }
  from '../Config/AppConfig'
import {events, errorKeywords}
  from '../Utility/Mapper/Tracking'
import {Sentry}
  from 'react-native-sentry'
import {reset}
  from 'redux-form'
import {requestChildSSNPayload}
  from '../Services/Queries/TPT'
import SendSMS from 'react-native-sms'
import { GoalActions } from '../Redux/Reducers/GoalReducer'
import branch from 'react-native-branch'

export function * submitUserInfo (api, action) {
  const {payload} = action

  let response
  try {
    response = yield call(api.postUserInfo, payload)
  } catch (err) {
    // console.log('error in calling submitUserInfo from saga : ', err)
  }

  if (response.ok) {
    const {data} = response
    yield put(UserActions.userInfoSubmitSuccess(data))
  } else {
    let error = {
      status  : response.status,
      code    : response.data.code,
      message : response.data.message
    }
    yield put(UserActions.userInfoSubmitFailure(error))
  }
}

export function * fetchUser (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    sendError = true

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.USER_FETCH_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response && response.data) {
      let data = response['data']
      let id = data['user'][0]['user_id']
      try {
        yield put(UserActions.fetchUserSuccess(id, data))
      } catch (err) {
        console.log('----errror in user fetch dispatch ----- :: ', err)
      }
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let fetchUserErrorMessage = errorKeywords.USER_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(fetchUserErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Fetch error',
      message: 'User Fetch Error'
    }
    yield put(UserActions.fetchUserFailure(error))
  }
}

export function * storeSSN (query, action) {
  let response
  var sendError = false
  const childID = action[CHILD_ENTITIES.CHILD_ID]

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in storing custodian information : ', err)
  }

  if (response) {
    const ssnSaved = response['data']['store_information']['status']

    if (ssnSaved === 'ssn_saved') {
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.USER_SSN_STORED_SUCCESS
      })
      // *********** Log Analytics ***********
      yield put(reset(FORM_TYPES.ADD_CHILD))

      const isOnboardingFlow = action[COMMON_ENTITIES.IS_ONBOARDING_FLOW] || false
      const x = action[CHILD_ENTITIES.MARK_REQUEST_SSN]
      if (!x) {
        yield put(UserActions.storeUserSsnSuccess(action[COMMON_ENTITIES.NAVIGATOR], childID, isOnboardingFlow))
      } else {

        let tptResponse
        try {
          tptResponse = yield call(requestChildSSNPayload().requestChildSSNPayload, action)
        } catch (err) {
          console.log('error in putting request ssn markup : ', err)
        }

        if (tptResponse) {
          // *********** Log Analytics ***********
          analytics.track({
            userId: action[USER_ENTITIES.USER_ID],
            event: events.SSN_REQUESTED,
            properties: {
              childID: action[CHILD_ENTITIES.CHILD_ID]
            }
          })
          // *********** Log Analytics ***********
        }

        yield put(UserActions.storeUserSsnSuccess(action[COMMON_ENTITIES.NAVIGATOR], childID, isOnboardingFlow))
      }

    } else {
      sendError = true
    }

  } else {
    sendError = true
    let tptResponse
    try {
      tptResponse = yield call(requestChildSSNPayload().requestChildSSNPayload, action)
    } catch (err) {
      console.log('error in putting request ssn markup : ', err)
    }

    if (tptResponse) {
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.SSN_REQUESTED,
        properties: {
          childID: action[CHILD_ENTITIES.CHILD_ID]
        }
      })
      // *********** Log Analytics ***********
    }
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'plaid linking error from server',
      message: 'no message yet'
    }
    yield put(UserActions.storeUserSsnFailure(error))
  }
}

export function * storeUserAddress (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in storing custodian information : ', err)
  }

  if (response) {
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'plaid linking error from server',
      message: 'no message yet'
    }
    console.log(' [[[ error ]]]] ')
  }
}

export function * markSSNRequest (mutation, action) {
  let response
  var sendError = false

  let tptResponse
  try {
    tptResponse = yield call(mutation, action)
  } catch (err) {
    sendError = true
    console.log('error in putting request ssn markup : ', err)
  }

  if (tptResponse) {
    const nav = action[COMMON_ENTITIES.NAVIGATOR]
    nav && (yield put(UserActions.markSsnRequestSuccess(action[COMMON_ENTITIES.NAVIGATOR], action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.IS_ONBOARDING_FLOW])))
    // *********** Log Analytics ***********
    analytics.track({
      userId: action[USER_ENTITIES.USER_ID],
      event: events.SSN_REQUESTED,
      properties: {
        childID: action[CHILD_ENTITIES.CHILD_ID]
      }
    })
    // *********** Log Analytics ***********
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'plaid linking error from server',
      message: 'no message yet'
    }
    yield put(UserActions.markSsnRequestFailure(error))
  }
}

export function * storeCustodianInformation (query, action) {
  let response
  var sendError = false
  try {
    let userID = action[USER_ENTITIES.USER_ID]
    let emailID = action[USER_ENTITIES.EMAIL_ID]
    let identityData = action[ONBOARDING_ENTITIES.PROFILE_DATA]
    let actionObject = Object.assign({userID: userID, emailID: emailID}, identityData)

    response = yield call(query, actionObject)
  } catch (err) {
    console.log('error in storing custodian information : ', err)
  }

  if (response) {
    // console.log('******** response received in custodian information ******** :: ', response)
    // *********** Log Analytics ***********
    analytics.track({
      userId: action[USER_ENTITIES.USER_ID],
      event: events.CUSTODIAN_INFORMATION_STORED
    })
    // *********** Log Analytics ***********
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'plaid linking error from server',
      message: 'no message yet'
    }
  }
}

export function * queryAccountAPI (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in calling fetchUser : ', err)
  }

  if (response && response.data) {
    let account = response.data.account
    yield put(ChildActions.showBrokerDealerChildInfoSuccess(action[CHILD_ENTITIES.CHILD_ID], account))
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Fetch error',
      message: 'User Fetch Error'
    }
    yield put(ChildActions.showBrokerDealerChildInfoFailure(error))
  }
}

export function * linkPlaid (query, action) {
  let response
  var sendError = false
  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in plaid linking : ', err)

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.PLAID_LINK_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  if (response && response.data) {
    if (action[USER_ENTITIES.PLAID_PUBLIC_TOKEN]) {
      yield put(UserActions.linkFundingSourceSuccess())
      //
    } else {
      let sourceRefId = response.data.create_funding_source && response.data.create_funding_source.source_reference_id || null
      yield put(UserActions.showPendingVerificationAlert(action[COMMON_ENTITIES.NAVIGATOR]))
      yield put(UserActions.linkFundingSourceSuccess(sourceRefId))
      yield put(reset(FORM_TYPES.BANK_DETAILS))
    }

    if (action['fetchUserDetails']) {
      yield put(UserActions.fetchUser(action[USER_ENTITIES.USER_ID]))
    }
    // *********** Log Analytics ***********
    analytics.track({
      userId: action[USER_ENTITIES.USER_ID],
      event: events.FUNDING_SOURCE_LINKED,
      properties: {
        childID: action[CHILD_ENTITIES.CHILD_ID]
      }
    })
    branch.userCompletedAction('link_plaid')
    // *********** Log Analytics ***********

  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'plaid linking error from server',
      message: 'no message yet'
    }
    yield put(UserActions.linkFundingSourceFailure(error))
  }
}

export function * verifyPlaid (query, action) {
  let response
  var sendError = false
  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in verify funding amount : ', err)
    // catch error & log in sentry
    let responseApiIssue = errorKeywords.VERIFY_FUNDING_AMOUNT + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }
  if (response && response.data) {
    let status = response.data.verify_funding_source && response.data.verify_funding_source.status

    // yield put(action[COMMON_ENTITIES.NAVIGATOR].dismissAllModals())
    if (status === 'verified') {
      yield put(GoalActions.navigateToHomepage(action[COMMON_ENTITIES.NAVIGATOR], action[CHILD_ENTITIES.CHILD_ID]))
      yield put(UserActions.dismissAllModal(action[COMMON_ENTITIES.NAVIGATOR]))
      yield put(UserActions.verifyFundingAmountSuccess(action[CHILD_ENTITIES.CHILD_ID]))
      yield put(reset(FORM_TYPES.BANK_DETAILS))
    } else {
      yield put(UserActions.verifyFundingAmountFailure())
      Alert.alert('Micro deposit amount entered do not match.', 'Please try with the amounts as shown in your bank transaction.')
    }

    // if (response) {
    //   alert('Bank Account Pending Pop up')
    // }
    // yield put(UserActions.linkFundingSourceSuccess())

    // *********** Log Analytics ***********
    analytics.track({
      userId: action[USER_ENTITIES.USER_ID],
      event: events.FUNDING_AMOUNT_VERIFY,
      properties: {
        childID: action[CHILD_ENTITIES.CHILD_ID]
      }
    })
    // *********** Log Analytics ***********

  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'verify funding amount error from server',
      message: 'no message yet'
    }
    // yield put(UserActions.linkFundingSourceFailure(error))
    yield put(UserActions.verifyFundingAmountFailure(error))
  }
}

export function * reAuthenticateBankAccount (query, action) {
  let response
  var sendError = false
  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in Re-Authenticate Bank Account : ', err)
    // catch error & log in sentry
    let responseApiIssue = errorKeywords.RE_AUTHENTICATE_BANK_ACCOUNT + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }
  if (response && response.data) {
    let cb = action[COMMON_ENTITIES.CALLBACK_FUCTION]
    if (response.data.reset_login.status === 'ok') {
      cb(response.data.reset_login.plaid_public_token)
    } else if (response.data.reset_login.status === 'checked') {
      cb(response.data.reset_login.status === 'checked')
    }
    yield put(UserActions.fetchUser(action[USER_ENTITIES.USER_ID]))
    // *********** Log Analytics ***********
    analytics.track({
      userId: action[USER_ENTITIES.USER_ID],
      event: events.RE_AUTHENTICATE_BANK_ACCOUNT
    })
    // *********** Log Analytics ***********

  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Re-Authenticate Bank Account error from server',
      message: 'no message yet'
    }
    // yield put(UserActions.verifyFundingAmountFailure(error))
  }
}

export function * resetBank (query, action) {
  let response
  var sendError = false
  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in Reset Bank Account : ', err)
    // catch error & log in sentry
    let responseApiIssue = 'Reset Bank Account Error :  [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }
  if (response && response.data) {
    let cb = action[COMMON_ENTITIES.CALLBACK_FUCTION]
    if (response.data.reset_login.status === 'reset_login') {
      cb(true)
    }
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Reset Bank Account error from server',
      message: 'no message yet'
    }
    // yield put(UserActions.verifyFundingAmountFailure(error))
  }
}

export function * fetchUserDetail (query, action) {
  let response
  var sendError = false

  // go and populate user instructions again

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in fetch detail : ', err)
    sendError = true

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.DETAIL_FETCH_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let userDetail = response['data']['user_detail']
      yield put(UserActions.fetchUserDetailSuccess(action[USER_ENTITIES.USER_ID], userDetail))
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true
    console.log('[USER DETAIL FETCH] --> caught error while accessing response')

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let detailFetchErrorMessage = errorKeywords.DETAIL_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(detailFetchErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Detail Fetch error',
      message: 'User Detail Fetch Error'
    }
    Alert.alert('We\'re having some down time.', 'Our service is unavailable at present.\nPlease try again shortly.')
    yield put(UserActions.fetchUserDetailFailure(error, action[COMMON_ENTITIES.NAVIGATOR]))
  }
}

export function * fetchUserInstructions (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in fetch user instructions : ', err)
    sendError = true

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.FETCH_USER_INSTRUCTION_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let instructionData = response['data']
      yield put(UserActions.fetchUserInstructionsSuccess(instructionData))
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Detail Fetch error',
      message: 'User Detail Fetch Error'
    }
    Alert.alert('We\'re having some down time.', 'Our service is unavailable at present.\nPlease try again shortly.')
    yield put(UserActions.fetchUserInstructionsFailure(error))
  }
}

export function * fetchUserTransactions (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in fetch user transactions : ', err)
    sendError = true

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.FETCH_USER_TRANSACTIONS_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let userDetail = response['data']['user_detail']
      yield put(SettingActions.fetchUserTransactionsSuccess(userDetail))
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let userTransactionsErrorMessage = errorKeywords.FETCH_USER_TRANSACTIONS_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(userTransactionsErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Detail Fetch error',
      message: 'User Detail Fetch Error'
    }
    Alert.alert('We\'re having some down time.', 'Our service is unavailable at present.\nPlease try again shortly.')
    yield put(SettingActions.fetchUserTransactionsFailure(error))
  }
}

export function * fetchDebugData (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in fetch debug data transactions : ', err)
    sendError = true
  }

  try {
    if (response) {
      let userDetail = response['data']['user_detail']
      yield put(UserActions.switchOnDebugModeSuccess(userDetail))
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Detail Fetch error',
      message: 'User Detail Fetch Error'
    }
    console.log('caught error in debug data fetch --> ', error)
  }
}

export function * modifyUserInstruction (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in user instruction : ', err)
    sendError = true

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.MODIFY_RECURRING_INSTRUCTION + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let instructionData = response.data.update_transfer
      if (instructionData && instructionData.status === 'denied') {
        Alert.alert('Transaction pending.', 'You can edit Auto-Invest once the transaction completes.')
        yield put(UserActions.modifyUserInstructionFailure())
      } else if (instructionData) {
        yield put(UserActions.modifyUserInstructionSuccess(instructionData))
        yield put(GoalActions.navigateToHomepage(action[COMMON_ENTITIES.NAVIGATOR], action[CHILD_ENTITIES.CHILD_ID], false))
      }
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let modifyUserInstructionError = errorKeywords.MODIFY_RECURRING_INSTRUCTION + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(modifyUserInstructionError)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Detail Fetch error',
      message: 'User Detail Fetch Error'
    }
    // Alert.alert('We\'re having some down time.', 'Our service is unavailable at present.\nPlease try again shortly.')
    yield put(UserActions.modifyUserInstructionFailure(error))
  }
}

export function * modifyRecurringAmount (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in user instruction : ', err)
    sendError = true

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.MODIFY_RECURRING_AMOUNT + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let instructionData = response.data.update_transfer
      if (instructionData && instructionData.status === 'denied') {
        Alert.alert('Transaction pending.', 'You can edit Auto-Invest once the transaction completes.')
        yield put(UserActions.modifyUserInstructionFailure())
      } else {
        yield put(UserActions.modifyUserInstructionSuccess(instructionData))
      }
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true
    console.log('error while accessing response in modify user instruction')

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let modifyRecurringAmountError = errorKeywords.MODIFY_RECURRING_AMOUNT + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(modifyRecurringAmountError)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'User Detail Fetch error',
      message: 'User Detail Fetch Error'
    }
    Alert.alert('We\'re having some down time.', 'Our service is unavailable at present.\nPlease try again shortly.')
    yield put(UserActions.modifyUserInstructionFailure(error))
  }
}

export function * fetchUserInformationGlossary (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log('error in calling glossary modules : ', err)
  }

  if (response) {
    let glossary = response['data'] && response['data']['allInformations']
    yield put(UserActions.fetchGlossarySuccess(glossary))
  } else {
    console.log('error in glossary --> ', response)
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(UserActions.fetchGlossaryFailure(error))
  }
}
