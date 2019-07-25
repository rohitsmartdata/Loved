/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/4/18.
 */

import {put, call}
  from 'redux-saga/effects'
import {Alert}
  from 'react-native'
import {reset}
  from 'redux-form'
import {GoalActions}
  from '../Redux/Reducers/GoalReducer'
import {InvestmentActions}
  from '../Redux/Reducers/InvestmentReducer'
import {INVESTMENT_ENTITIES}
  from '../Utility/Mapper/Investment'
import {USER_ENTITIES}
  from '../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../Utility/Mapper/Common'
import {SEGMENT_ACTIONS, ANALYTIC_PROPERTIES, FORM_TYPES}
  from '../Config/contants'
import { analytics }
  from '../Config/AppConfig'
import {events, errorKeywords}
  from '../Utility/Mapper/Tracking'
import {Sentry}
  from 'react-native-sentry'
import { GOAL_ENTITIES } from '../Utility/Mapper/Goal'

export function * addInvestment (mutation, action) {
  let response
  var sendError = false

  try {
    response = yield call(mutation, action)
  } catch (err) {
    console.log('error in calling addChild : ', err)

    // log sentry as an issue
    let responseApiIssue = errorKeywords.ADD_DREAM_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response && response.data) {
      const goalData = response.data['create_goal']['goal']
      const goalID = goalData['goal_id']

      // send goal success event
      yield put(InvestmentActions.addInvestmentSuccess(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], goalID, goalData))

      // dispatch transfer action
      yield put(GoalActions.transfer(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], goalID, action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT], action[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]))

      const isPlaidLinked = action[USER_ENTITIES.IS_PLAID_LINKED]
      const navigator = action[COMMON_ENTITIES.NAVIGATOR]

      if (isPlaidLinked) {
        navigator && (yield put(GoalActions.navigateToTransferScreen(action[CHILD_ENTITIES.CHILD_ID], goalID, action[INVESTMENT_ENTITIES.INVESTMENT_NAME], action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR])))
      } else {
        // navigator && (yield put(InvestmentActions.investmentConfirm(action[CHILD_ENTITIES.CHILD_ID], goalID, action[INVESTMENT_ENTITIES.INVESTMENT_NAME], action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[GOAL_ENTITIES.RECURRING_FREQUENCY], null, action['tickerName'], action[COMMON_ENTITIES.NAVIGATOR])))
        navigator && (yield put(GoalActions.confirmBankConnection(action[CHILD_ENTITIES.CHILD_ID], goalID, action[INVESTMENT_ENTITIES.INVESTMENT_NAME], action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR])))
        navigator && (yield put(reset(FORM_TYPES.ADD_INVESTMENT))) // resent form
      }

      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.DREAM_CREATED,
        properties: {
          childID: action[CHILD_ENTITIES.CHILD_ID],
          goalID: goalID,
          dream: action[INVESTMENT_ENTITIES.INVESTMENT_NAME]
        }
      })
      // *********** Log Analytics ***********
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let addDreamErrorMessage = errorKeywords.ADD_DREAM_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(addDreamErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'testing error',
      message: 'no message yet'
    }
    Alert.alert('We\'re having some down time.', 'Our service is unavailable at present.\nPlease try again shortly.')
    yield put(InvestmentActions.addInvestmentFailure(error))
  }
}

export function * fetchProducts (mutation, action) {
  let response
  var sendError = false

  try {
    response = yield call(require('../Services/ProductsAPI').productsAPI, action)
  } catch (err) {
    console.log('error in calling fetch Products : ', err)
    sendError = true

    // log sentry as an issue
    let responseApiIssue = errorKeywords.PRODUCT_FETCH_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      let products = response['tickers']
      let types = response['types']
      yield put(InvestmentActions.fetchProductsSuccess(products, types))
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true

    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let productFetchErrorMessage = errorKeywords.PRODUCT_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(productFetchErrorMessage)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(InvestmentActions.fetchProductsFailure(error))
  }
}
