/* eslint-disable no-trailing-spaces,no-undef,no-unused-vars */
/**
 * Created by viktor on 17/8/17.
 */

import {Alert}
  from 'react-native'
import {put, call}
  from 'redux-saga/effects'
import {SettingActions}
  from '../Redux/Reducers/SettingReducer'
import {UserActions}
  from '../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../Utility/Mapper/User'
import PHANTOM
  from '../Utility/Phantom'
import {AUTH_ENTITIES} from '../Utility/Mapper/Auth'

export function * fetchRecurringData (query, action) {
  let response
  var sendError = false

  try {
    PHANTOM.assertActionPayload(action)
    response = yield call(query, action)
  } catch (err) {
    // console.log('error in calling addChild : ', err)
  }

  if (response && response.data) {
    let data = response['data']
    let sprouts = data['user'][0]['sprout']
    yield put(SettingActions.fetchRecurringDataSuccess(sprouts))
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(SettingActions.fetchRecurringDataFailure(error))
  }
}

export function * fetchStatements (action) {
  let response
  var sendError = false

  try {
    response = yield call(require('../Services/StatementsAPI').settingsAPI, action)
  } catch (err) {
    console.log('error in calling fetch statements : ', err)
  }
  if (response) {
    const {data} = response
    yield put(SettingActions.showDocumentsSuccess(data, action[COMMON_ENTITIES.NAVIGATOR]))
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(SettingActions.fetchRecurringDataFailure(error))
  }
}

export function * fetchConfirmations (action) {
  let response
  var sendError = false
  try {
    response = yield call(require('../Services/StatementsAPI').confirmationAPI, action)
  } catch (err) {
    console.log('error in calling confirmation fetch statements : ', err)
  }

  if (response && response.data) {
    const {data} = response
    yield put(SettingActions.showConfirmationsSuccess(data, action[COMMON_ENTITIES.NAVIGATOR]))
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(SettingActions.showConfirmationsFailure(error))
  }
}

export function * disconnectBank (action) {
  let response
  var sendError = false

  try {
    response = yield call(require('../Services/StatementsAPI').disconnectBankAPI, action)
  } catch (err) {
    console.log('error in calling confirmation fetch statements : ', err)
  }

  if (response) {
    try {
      let status = response['status']
      if (status === 'submitted') {
        yield put(UserActions.fetchUser(action[USER_ENTITIES.USER_ID]))
        yield put(UserActions.disconnectBankSuccess(action[COMMON_ENTITIES.NAVIGATOR]))
      } else throw Error('disconnect not working properly')
    } catch (err) {
      sendError = true
    }
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    yield put(UserActions.disconnectBankFailure())
  }
}

export function * transferNow (action) {
  let response
  var sendError = false

  try {
    response = yield call(require('../Services/StatementsAPI').doTransactionNow, action)
  } catch (err) {
    console.log('error in calling transfer now : ', err)
  }

  if (response) {
    const {data} = response
    Alert.alert('Transfer request was successfully placed', 'please check your updated balance in a while')
  } else {
    sendError = true
  }

  if (sendError) {
    let error = {
      status: '402',
      code: 'Recurring Data Fetch Error',
      message: 'no message yet'
    }
    Alert.alert('Transfer not OK')
  }
}
