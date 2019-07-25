/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 13/7/18.
 */

import {put, call}
  from 'redux-saga/effects'
import {Alert}
  from 'react-native'
import {reset}
  from 'redux-form'
import {LearnActions}
  from '../Redux/Reducers/LearnReducer'
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
import {errorKeywords}
  from '../Utility/Mapper/Tracking'
import {Sentry}
  from 'react-native-sentry'

export function * fetchLearnModules (query, action) {
  let response
  var sendError = false

  try {
    response = yield call(query, action)
  } catch (err) {
    sendError = true
    console.log('error in calling fetch learning modules : ', err)

    // catch error & log in sentry
    let responseApiIssue = errorKeywords.FETCH_LEARNING_ERROR + ' [ERROR] -> ' + err.message
    Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
  }

  try {
    if (response) {
      const content = response['data']['allContents']
      yield put(LearnActions.fetchLearnModulesSuccess(content))
    } else {
      sendError = true
    }
  } catch (err) {
    sendError = true
    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (response && JSON.stringify(response))
    let learningModuleFetchError = errorKeywords.FETCH_LEARNING_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(learningModuleFetchError)   // capture & send message to sentry
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(LearnActions.fetchLearnModulesFailure(error))
  }
}
