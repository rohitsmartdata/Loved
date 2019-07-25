/* eslint-disable no-trailing-spaces,padded-blocks,key-spacing,no-multiple-empty-lines,no-unused-vars */
/**
 * Created by victorchoudhary on 15/05/17.
 */

import {put, call}
  from 'redux-saga/effects'
import {reset}
  from 'redux-form'
import {Alert}
  from 'react-native'
import {GoalActions}
  from '../Redux/Reducers/GoalReducer'
import {SettingActions}
  from '../Redux/Reducers/SettingReducer'
import {editGoalDataDissector}
  from '../Utility/Dissector/GoalDataDissector'
import {editGoalFormat}
  from '../Utility/Formatter/GoalDataFormatter'
import PHANTOM from '../Utility/Phantom'
import {GOAL_ENTITIES}
  from '../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../Utility/Mapper/Child'
import {COMMON_ENTITIES, FREQUENCY}
  from '../Utility/Mapper/Common'
import {LW_EVENTS, LW_EVENT_TYPE}
  from '../Utility/Mapper/Screens'
import {SEGMENT_ACTIONS, ANALYTIC_PROPERTIES, FORM_TYPES}
  from '../Config/contants'
import { analytics }
  from '../Config/AppConfig'
import {events, errorKeywords}
  from '../Utility/Mapper/Tracking'
import {Sentry}
  from 'react-native-sentry'
import _ from 'lodash'

/*
  addGoal.

  This saga is used for sending POST request to Goal API Endpoint.
  Execution of this method takes place in 4 steps :-
  STEP 1.
  - formulate body payload
  - if any fields are missing, will throw error
  STEP 2.
  - send api request if payload formulated correctly
  STEP 3.
  - if response OK, then dissects the response data
  - and if data is as per format with required field

  @parameter api 'api service used to send request to Backend'
  @parameter action 'action {type, payload}
 */
export function * addCustomGoal (mutation, action) {
  let response
  var sendError = false

  try {
    PHANTOM.assertActionPayload(action)
    response = yield call(mutation, action)
  } catch (err) {
    console.log('error in calling addChild : ', err)
  }

  if (response && response.data) {
    let data = response.data.createGoal.goal
    let title = action[CHILD_ENTITIES.FIRST_NAME] + '\'s '
    title += data['name'] + ' Fund'

    const riskSelected = action[GOAL_ENTITIES.RISK_SELECTED]
    yield put(GoalActions.addCustomGoalSuccess(
      data.sprout['sprout_id'],
      data['goal_id'],
      data['name'],
      action[COMMON_ENTITIES.NAVIGATOR],
      title,
      action[USER_ENTITIES.USER_ID],
      riskSelected
    ))
  } else {
    // console.log('inside error : ', response)
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'testing error',
      message: 'no message yet'
    }
    yield put(GoalActions.addCustomGoalFailure(error))
  }

}

export function * makeGoal (mutation, action) {
  let response
  var sendError = false

  try {
    response = yield call(mutation, action)
  } catch (err) {
    let responseApiIssue = errorKeywords.ADD_DESIRE_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response && response.data) {
      const goalData = response.data['create_goal']['goal']
      const goalID = goalData['goal_id']

      // send goal success event
      yield put(GoalActions.addGoalSuccess(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], goalID, goalData))

      const isPlaidLinked = action[USER_ENTITIES.IS_PLAID_LINKED]

      // dispatching transfer action
      yield put(GoalActions.transfer(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], goalID, action[GOAL_ENTITIES.RECURRING_AMOUNT], action[GOAL_ENTITIES.RECURRING_FREQUENCY]))

      const navigator = action[COMMON_ENTITIES.NAVIGATOR]
      if (isPlaidLinked) {
        // navigating to transfer screen
        navigator && (yield put(GoalActions.navigateToTransferScreen(action[CHILD_ENTITIES.CHILD_ID], goalID, action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR])))
      } else {
        navigator && (yield put(GoalActions.confirmBankConnection(action[CHILD_ENTITIES.CHILD_ID], goalID, action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR])))
        navigator && (yield put(reset(FORM_TYPES.ADD_GOAL))) // clear out goal form
      }

      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.GOAL_CREATION_CONFIRMED,
        properties: {
          goal_id: goalID,
          goal_name: action[GOAL_ENTITIES.NAME],
          goal_fund: action[GOAL_ENTITIES.GOAL_AMOUNT],
          goal_age: action[GOAL_ENTITIES.DURATION],
          portfolio_type: action[GOAL_ENTITIES.PORTFOLIO_RISK],
          recurring: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
          amount: action[GOAL_ENTITIES.RECURRING_AMOUNT]
        }
      })
      // *********** Log Analytics ***********
      // *********** Log Analytics ***********
      // analytics.track({
      //   userId: action[USER_ENTITIES.USER_ID],
      //   event: events.DESIRE_CREATED,
      //   properties: {
      //     childID: action[CHILD_ENTITIES.CHILD_ID],
      //     goalID: goalID,
      //     desire: goalData['name'],
      //     target: goalData['target'],
      //     endDate: goalData['end_date'],
      //     portfolioID: goalData['current_portfolio_id']
      //   }
      // })
      // *********** Log Analytics ***********

    } else {
      sendError = true
    }
  } catch (err) {
    console.log('error thrown and caught in goal saga response --> ', response)
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let addDesireErrorMessage = errorKeywords.ADD_DESIRE_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(addDesireErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'testing error',
      message: 'no message yet'
    }
    Alert.alert('We\'re having some down time.', 'Our service is unavailable at present.\nPlease try again shortly.')
    yield put(GoalActions.addGoalFailure(error))
  }
}

export function * updateGoal (mutation, action) {
  let response
  var sendError = false
  try {
    PHANTOM.assertActionPayload(action)
    response = yield call(mutation, action)
  } catch (err) {
    console.log('error in calling addChild : ', err)
  }

  if (response && response.data) {
    let data = response.data['update_goal']
    let goal = data['goal']
    let sproutid = data['sprout_id']
    let goalID = goal['goal_id']
    yield put(GoalActions.editGoalSuccess(data))
    yield put(GoalActions.popScreen(action[COMMON_ENTITIES.NAVIGATOR]))
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'testing error',
      message: 'Edit Goal Failed!'
    }

    Alert.alert('Edit Goal Failed!', 'edit goal failed')
    yield put(GoalActions.editGoalFailure(error))
  }

}

export function * editGoal (api, action) {
  let response
  var sendError = false

  try {
    PHANTOM.assertActionPayload(action)

    // ---- STEP 1 -----
    // formulate payload
    let data = editGoalFormat(action)

    // ---- STEP 2 -----
    // send api request & received response
    response = yield call(api, data)

  } catch (err) {
    // console.log('ERROR in calling SAGA[Goal/EditGoal] :: ', err)
  }

  // if response is ok, send success event
  if (response && response.ok) {
    const {data} = response
    try {

      // ---- STEP 3 -----
      // dissect received data & check for required fields
      let storeData = editGoalDataDissector(data)

      // ---- STEP 4 -----
      // if payload is good, send success event
      yield put(GoalActions.editGoalSuccess(storeData))

    } catch (err) {
      // error can be generated by dissecting function
      // console.log('Error in editGoal response : ', err, data)

      // make sending error as true
      sendError = true
    }
  } else {
    sendError = true
  }

  // ---- STEP 4 -----
  // send failure event in case of error generated
  if (sendError) {
    let error = {
      status  : response && response.status,
      code    : response && response.data && response.data.code,
      message : response && response.data && response.data.message
    }
    yield put(GoalActions.editGoalFailure(error))
  }
}

export function * fetchDetail (query, action) {
  let response
  var sendError = false
  try {
    response = yield call(query, action)
  } catch (err) {
    console.log(' error in goal detail fetch :: ', err)
  }

  if (response) {
    let goalData = response['data']['goal_detail']
    yield put(GoalActions.fetchGoalDetailSuccess(goalData))
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'fetching goal detail error',
      message: 'fetching goal detail error'
    }
    yield put(GoalActions.fetchGoalDetailFailure(error))
  }
}

export function * transfer (query, action) {
  let response
  var sendError = false

  let onceOffInvestment = action[GOAL_ENTITIES.ONE_OFF_INVESTMENT]
  let recurringAmount = action[GOAL_ENTITIES.RECURRING_AMOUNT]

  let obj = {}
  obj[USER_ENTITIES.USER_ID] = action[USER_ENTITIES.USER_ID]
  obj[CHILD_ENTITIES.CHILD_ID] = action[CHILD_ENTITIES.CHILD_ID]
  obj[GOAL_ENTITIES.GID] = action[GOAL_ENTITIES.GID]
  obj[GOAL_ENTITIES.TRANSFER_AMOUNT] = recurringAmount || onceOffInvestment
  obj[GOAL_ENTITIES.RECURRING_FREQUENCY] = recurringAmount ? action[GOAL_ENTITIES.RECURRING_FREQUENCY] : FREQUENCY.ONCE

  try {
    response = yield call(query, obj)
  } catch (err) {
    sendError = true
    console.log(' errr in mutation transfer :: ', err)

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.TRANSFER_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let transferData = response.data.create_transfer
      yield put(GoalActions.transferSuccess(transferData))

      let navigator = action[COMMON_ENTITIES.NAVIGATOR]
      navigator && (yield put(GoalActions.navigateToTransferScreen(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.NAME], obj[GOAL_ENTITIES.TRANSFER_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR])))

      // // *********** Log Analytics ***********
      // analytics.track({
      //   userId: action[USER_ENTITIES.USER_ID],
      //   event: events.BUY,
      //   properties: {
      //     childID: action[CHILD_ENTITIES.CHILD_ID],
      //     goalID: action[GOAL_ENTITIES.GID],
      //     amount: obj[GOAL_ENTITIES.TRANSFER_AMOUNT],
      //     frequency: obj[GOAL_ENTITIES.RECURRING_FREQUENCY],
      //     initialDate: initialDate || 'unknown',
      //     nextTransferDate: nextTransferDate || 'unknown'
      //   }
      // })
      // // *********** Log Analytics ***********

    } else {
      sendError = true
    }
  } catch (err) {
    console.log('error in catching transfer response :: ', response)
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let transferErrorMessage = errorKeywords.TRANSFER_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(transferErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'transfer error',
      message: 'no message yet'
    }
    yield put(GoalActions.transferFailure(error))
  }
}

export function * withdraw (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    console.log(' errr in mutation withdraw :: ', err)

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.WITHDRAW_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let withdrawData = response.data.create_withdrawal
      yield put(GoalActions.withdrawSuccess(withdrawData, action[COMMON_ENTITIES.NAVIGATOR]))
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let withdrawErrorMessage = errorKeywords.WITHDRAW_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(withdrawErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'transfer error',
      message: 'no message yet'
    }
    yield put(GoalActions.withdrawFailure(error, action[COMMON_ENTITIES.NAVIGATOR]))
  }
}

export function * fetchChartData (api, action) {
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
    yield put(GoalActions.fetchGoalChartDataSuccess(action[GOAL_ENTITIES.GID], data))
  } else {
    sendError = true
  }

  // ---- STEP 4 -----
  // send failure event in case of error generated
  if (sendError) {
    let error = {
      status  : '401',
      code    : 'fetch goal chart data not good',
      message : 'fetch goal chart data not good'
    }
    yield put(GoalActions.fetchGoalChartDataFailure(error))
  }
}

export function * fetchUserTransfers (query, action) {
  let response
  var sendError = false

  try {
    // ---- STEP 1 -----
    // send api request & received response
    response = yield call(query, action)

  } catch (err) {
    console.log('ERROR in calling SAGA[Goal/user Transfer] :: ', err)
  }

  // if response is ok, send success event
  if (response) {
    yield put(SettingActions.viewTransfersSuccess(response['data']))
  } else {
    console.log('response not ok :: ', response)
    sendError = true
  }

  // ---- STEP 4 -----
  // send failure event in case of error generated
  if (sendError) {
    let error = {
      status  : '401',
      code    : 'User Transfer Error',
      message : 'User Transfer Error'
    }
    yield put(SettingActions.viewTransfersFailure(error))
  }
}

export function * fetchPerformanceData (action) {
  let response
  var sendError = false

  try {
    response = yield call(require('../Services/StatementsAPI').getPerformanceData, action)
  } catch (err) {
    console.log('error in calling fetch statements : ', err)

    // log sentry as an issue
    let responseApiIssue = errorKeywords.PERFORMANCE_DATA_FETCH_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }


  try {
    if (response) {
      yield put(GoalActions.fetchPerformanceDataSuccess(response))
    } else {
      sendError = true
    }
  } catch (err) {
    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let performanceDataErrorMessage = errorKeywords.PERFORMANCE_DATA_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(performanceDataErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(GoalActions.fetchPerformanceDataFailure(error))
  }
}

export function * fetchInvestChartData (action) {
  let response
  var sendError = false
  try {
    response = yield call(require('../Services/StatementsAPI').getChartData, action)
  } catch (err) {
    console.log('error in calling fetch InvestChartData : ', err)
    // log sentry as an issue
    let responseApiIssue = errorKeywords.INVEST_CHART_DATA_FETCH_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }
  try {
    if (response && Array.isArray(response)) {
      let uniqData = _.uniq(response)
      yield put(GoalActions.fetchInvestChartDataSuccess(uniqData, action[GOAL_ENTITIES.TICKER_NAME]))
    } else {
      sendError = true
    }
  } catch (err) {
    // the following parameters are used for
    // sentry message building
    console.log('error in retriving InvestChartData : ', err)

    let errorResponseString = err.message + (response && JSON.stringify(response))
    let performanceDataErrorMessage = errorKeywords.INVEST_CHART_DATA_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(performanceDataErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(GoalActions.fetchInvestChartDataFailure(error, action[GOAL_ENTITIES.TICKER_NAME]))
  }
}
