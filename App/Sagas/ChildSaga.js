/* eslint-disable no-unused-vars,no-trailing-spaces,padded-blocks,key-spacing */
/**
 * Created by viktor on 28/6/17.
 */

// ========================================================
// Import packages
// ========================================================

import {put, call}
  from 'redux-saga/effects'
import {Alert}
  from 'react-native'
import {reset}
  from 'redux-form'
import {ChildActions}
  from '../Redux/Reducers/ChildReducer'
import {UserActions}
  from '../Redux/Reducers/UserReducer'
import {InvestmentActions}
  from '../Redux/Reducers/InvestmentReducer'
import {GoalActions}
  from '../Redux/Reducers/GoalReducer'
import {OnboardingActions}
  from '../Redux/Reducers/OnboardingReducer'
import { SettingActions } from '../Redux/Reducers/SettingReducer'
import {USER_ENTITIES}
  from '../Utility/Mapper/User'
import { SETTINGS_ENTITIES }
  from '../Utility/Mapper/Settings'
import { GOAL_ENTITIES }
  from '../Utility/Mapper/Goal'
import { INVESTMENT_ENTITIES }
  from '../Utility/Mapper/Investment'
import { AUTH_ENTITIES }
  from '../Utility/Mapper/Auth'
import {CHILD_ENTITIES}
  from '../Utility/Mapper/Child'
import {LW_SCREEN, LW_EVENTS, LW_EVENT_TYPE}
  from '../Utility/Mapper/Screens'
import {COMMON_ENTITIES}
  from '../Utility/Mapper/Common'
import {SEGMENT_ACTIONS, FORM_TYPES, ANALYTIC_PROPERTIES}
  from '../Config/contants'
import {foo, createChildAccount} from '../Services/Queries/TPT'
import {events, errorKeywords} from '../Utility/Mapper/Tracking'
import {analytics} from '../Config/AppConfig'
import {Sentry}
  from 'react-native-sentry'

// ========================================================
// Sagas
// ========================================================

/*
  Todo:-
  1. verify outgoing data
  2. verify incoming data
  3. better strategy for formulating query
 */
export function * addChild (mutation, action) {
  let response, tptResponse
  var sendError = false

  try {
    response = yield call(mutation, action)
  } catch (err) {
    sendError = true
    let responseApiIssue = errorKeywords.ADD_CHILD_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response && response.data) {
      let data = response.data.create_sprout.sprout
      let userID = action[USER_ENTITIES.USER_ID]

      // *********** Log Analytics ***********
      analytics.track({
        userId: userID,
        event: events.CHILD_ADDED,
        properties: {
          firstname: data['first_name'],
          lastname: data['last_name'],
          childID: data['sprout_id'],
          date_of_birth: data['date_of_birth']
        }
      })
      analytics.identify({
        userId: userID,
        traits: {
          child_created: true
        }
      })
      // *********** Log Analytics ***********

      // upload photo if with metadata
      if (action[SETTINGS_ENTITIES.IMAGE_METADATA]) {
        yield put(SettingActions.uploadPhoto(
          action[SETTINGS_ENTITIES.IMAGE_METADATA],
          ['USER', 'CHILD'],
          action[USER_ENTITIES.EMAIL_ID],
          action[AUTH_ENTITIES.ID_TOKEN],
          action[USER_ENTITIES.USER_ID],
          data.sprout_id,
          null,
          false,
          action[COMMON_ENTITIES.DISPATCH]
        ))
      }

      yield put(ChildActions.addChildSuccess(
        data['sprout_id'],
        data['first_name'],
        data['last_name'],
        data['date_of_birth'],
        action[COMMON_ENTITIES.NAVIGATOR],
        userID,
        action[CHILD_ENTITIES.IS_ADDING_DREAM],
        action[CHILD_ENTITIES.IS_ADDING_DESIRE],
        action[USER_ENTITIES.IS_SSN_ADDED],
        action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]))
      yield put(reset(FORM_TYPES.ADD_CHILD))
      yield put(OnboardingActions.flushOnboarding())
      yield put(UserActions.fetchUser(userID))

    } else {
      sendError = true
      throw new Error('Add Child Response Error -> ' + (response && JSON.stringify(response)))
    }

  } catch (err) {
    sendError = true

    // the following parameters are used for
    // sentry message building
    // let userIdentityData = action[USER_ENTITIES.IDENTITY_DATA]
    // let isFirstChild = 'First Child : ' + (userIdentityData !== undefined)    // is first child present
    // let tptDataPresent = 'TPT Data Present : ' + (userIdentityData !== undefined)   // is tpt data present
    // let addChildErrorMessage = errorKeywords.ADD_CHILD_ERROR + isFirstChild + ', ' + tptDataPresent + ', [ERROR] -> ' + err.message
    // Sentry.captureMessage(addChildErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'testing error',
      message: 'no message yet'
    }
    Alert.alert('̄Adding Child', 'Currently we are experiencing some issue, please retry again.')
    yield put(ChildActions.addChildFailure(error))
  }
}

export function * submitChildAccount (mutation, action) {
  let response
  var sendError = false

  let userID = action[USER_ENTITIES.USER_ID]
  let childID = action[CHILD_ENTITIES.CHILD_ID]
  let userSSN = action[USER_ENTITIES.SSN]
  let childSSN = action[CHILD_ENTITIES.SSN]
  try {
    let tptCall = createChildAccount().createChildAccount
    response = yield call(tptCall, userID, childID, userSSN, childSSN)
  } catch (err) {
    console.log(' errr in create child account --> :: ', err)
  }
  try {
    if (response && response.data) {
      yield put(reset(FORM_TYPES.ADD_CHILD))
      yield put(ChildActions.submitChildAccountSuccess(childID, action[CHILD_ENTITIES.IS_ADDING_DREAM], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[COMMON_ENTITIES.NAVIGATOR], action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]))
      yield put(ChildActions.setChildSsnAdded(childID))
      // // *********** Log Analytics ***********
      // analytics.track({
      //   userId: userID,
      //   event: events.SSN_INFORMATION_ADDED,
      //   properties: {
      //     childID: childID,
      //     userSSNPresent: userSSN !== undefined
      //   }
      // })
      // // *********** Log Analytics ***********
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true
    console.log('error in [ create child account ] --> ', err)
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'transfer error',
      message: 'no message yet'
    }
    yield put(ChildActions.submitChildAccountFailure(error))
    Alert.alert('̄Adding SSN', 'Currently we are experiencing some issue, please retry again.')
  }
}

export function * createChildAccountSaga (mutation, action) {
  let response
  var sendError = false

  let userID = action[USER_ENTITIES.USER_ID]
  let childID = action[CHILD_ENTITIES.CHILD_ID]
  let userSSN = action[USER_ENTITIES.SSN]
  let childSSN = action[CHILD_ENTITIES.SSN]
  try {
    let tptCall = createChildAccount().createChildAccount
    response = yield call(tptCall, userID, childID, userSSN, childSSN)
  } catch (err) {
    console.log(' errr in create child account --> :: ', err)
  }

  try {
    if (response && response.data) {
      yield put(ChildActions.createChildAccountSuccess(childID))
      yield put(reset(FORM_TYPES.ADD_CHILD))
      yield put(UserActions.fetchUserDetail(userID, action[COMMON_ENTITIES.NAVIGATOR]))
      if (action[COMMON_ENTITIES.P_FUNC]) {
        let func = action[COMMON_ENTITIES.P_FUNC]
        func({[CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID], [GOAL_ENTITIES.NAME]: 'SSN_ADDED'})
      }
      // *********** Log Analytics ***********
      analytics.track({
        userId: userID,
        event: events.SSN_INFORMATION_ADDED,
        properties: {
          childID: childID,
          userSSNPresent: userSSN !== undefined
        }
      })
      // *********** Log Analytics ***********

    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true
    console.log('error in [ create child account ] --> ', err)
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'transfer error',
      message: 'no message yet'
    }
    yield put(ChildActions.createChildAccountFailure(error))
    Alert.alert('̄Adding SSN', 'Currently we are experiencing some issue, please retry again.')
  }
}

export function * fetchChildChartData (api, action) {
  let response
  var sendError = false

  try {
    // ---- STEP 1 -----
    // send api request & received response
    response = yield call(api, action)

  } catch (err) {
    // console.log('ERROR in calling SAGA[Goal/EditGoal] :: ', err)
  }

  // if response is ok, send success event
  if (response && response.ok) {
    let data = response['data']
    yield put(ChildActions.fetchChildChartDataSuccess(action[CHILD_ENTITIES.CHILD_ID], data))
  } else {
    sendError = true
  }

  // ---- STEP 4 -----
  // send failure event in case of error generated
  if (sendError) {
    let error = {
      status  : '401',
      code    : 'fetch child chart data not good',
      message : 'fetch child chart data not good'
    }
    yield put(CHILD_ENTITIES.fetchChildChartDataFailure(error))
  }
}

export function * fetchStockPerformance (api, action) {
  let response
  var sendError = false

  try {
    // ---- STEP 1 -----
    // send api request & received response
    response = yield call(api, action)

  } catch (err) {
    console.log('ERROR in calling SAGA[Child/Performance data] :: ', err)
  }

  // if response is ok, send success event
  if (response) {
    yield put(ChildActions.fetchStockPerformanceSuccess(action[CHILD_ENTITIES.CHILD_ID], response))
  } else {
    sendError = true
  }

  // ---- STEP 4 -----
  // send failure event in case of error generated
  if (sendError) {
    let error = {
      status  : '401',
      code    : 'fetch child chart data not good',
      message : 'fetch child chart data not good'
    }
    yield put(ChildActions.fetchStockPerformanceFailure(error))
  }
}
