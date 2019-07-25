/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Root Saga Tester is used to test
 * the functioning of the root saga
 * of the saga module.
 * Created by viktor on 13/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import test from 'ava'
import RootSaga
  from '../../App/Sagas/index'
import {takeLatest, fork}
  from 'redux-saga/effects'

import {GoalTypes}
  from '../../App/Redux/Reducers/GoalReducer'
import {AuthTypes}
  from '../../App/Redux/Reducers/AuthReducer'

import {getAccessToken}
  from '../../App/Sagas/StartupSagas'
import {submitUserInfo}
  from '../../App/Sagas/UserSagas'
import {addGoal, editGoal}
  from '../../App/Sagas/GoalSaga'

// ========================================================
// Test root saga
// ========================================================

/*
  Todo:-
  1. fix root saga testing mechanism
  Currently the problem is in the deepEqual scenario,
  _.isEqual compares function strictly, that means we
  need to get reference of functions passed inside the
  root saga
 */
/*
test('Create Root Saga', t => {
  const gen = RootSaga()
  let k = gen.next().value
  let v = fork(takeLatest, AuthTypes.GET_ACCESS_TOKEN, getAccessToken, require('../../App/Services/AuthApi').authAPI())
  console.log('k : ', k)
  console.log('v : ', v)
  t.deepEqual(k, v, 'GET_ACCESS_TOKEN saga not forking : ')
  // t.pass('GET_ACCESS_TOKEN saga has been forked')

  t.deepEqual(gen.next().value, fork(takeLatest, UserTypes.SUBMIT_USER_INFO, submitUserInfo, require('../../App/Services/UserApi').userAPI()), 'SUBMIT_USER_INFO saga not forking')
  t.pass('SUBMIT_USER_INFO saga has been forked')

  t.deepEqual(gen.next().value, fork(takeLatest, GoalTypes.ADD_GOAL, addGoal, require('../../App/Services/GoalAPI').goalAPI()), 'ADD_GOAL saga not forking')
  t.pass('ADD_GOAL saga has been forked')

  t.deepEqual(gen.next().value, fork(takeLatest, GoalTypes.EDIT_GOAL, editGoal, require('../../App/Services/GoalAPI').goalAPI()), 'EDIT_GOAL saga not forking')
  t.pass('EDIT_GOAL saga has been forked')

})
*/
