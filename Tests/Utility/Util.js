/* eslint-disable no-multiple-empty-lines,no-trailing-spaces,padded-blocks */
/**
 * Created by viktor on 4/6/17.
 */

import test from 'ava'
import _ from 'lodash'
import PHANTOM from '../../App/Utility/Phantom'
import {GOAL_ENTITIES} from '../../App/Utility/Mapper/Goal'
import {ERROR_TYPE, InternalError, ObjectPropertyMissing, ParameterNotProvided} from '../../App/Utility/Errors'

test('Testing Assertion of Action payload data', t => {
  // mock action data for ADD_GOAL
  let action = {
    type: 'ADD_GOAL',
    [`${GOAL_ENTITIES.CID}`]: 1243,
    [`${GOAL_ENTITIES.NAME}`]: 'BIRTHDAY',
    [`${GOAL_ENTITIES.GOAL_AMOUNT}`]: 100000,
    [`${GOAL_ENTITIES.INITIAL_DEPOSIT}`]: 200,
    [`${GOAL_ENTITIES.MM}`]: 2,
    [`${GOAL_ENTITIES.DD}`]: 20,
    [`${GOAL_ENTITIES.YYYY}`]: 2017
  }

  t.is(PHANTOM.assertActionPayload(action), true, 'Error occurred when sending complete action')

  // should throw Parameter not provided error no argument provided
  var error = t.throws(() => PHANTOM.assertActionPayload(), ParameterNotProvided)
  t.is(error.name, ERROR_TYPE.PARAMETER_NOT_PROVIDED, 'wrong type of error thrown : ', error)

  // should throw object property missing when any property is missing
  error = t.throws(() => PHANTOM.assertActionPayload({type: action.type}), ObjectPropertyMissing)
  t.is(error.name, ERROR_TYPE.OBJECT_PROPERTY_MISSING, 'wrong type of error thrown : ', error)

  error = t.throws(() => PHANTOM.assertActionPayload({[`${GOAL_ENTITIES.CID}`]: 1243,
    [`${GOAL_ENTITIES.NAME}`]: 'BIRTHDAY',
    [`${GOAL_ENTITIES.GOAL_AMOUNT}`]: 100000,
    [`${GOAL_ENTITIES.INITIAL_DEPOSIT}`]: 200,
    [`${GOAL_ENTITIES.MM}`]: 2,
    [`${GOAL_ENTITIES.DD}`]: 20,
    [`${GOAL_ENTITIES.YYYY}`]: 2017}), ObjectPropertyMissing)
  t.is(error.name, ERROR_TYPE.OBJECT_PROPERTY_MISSING, 'wrong type of error thrown : ', error)

  // should throw internal error when bogus property provided
  error = t.throws(() => PHANTOM.assertActionPayload({type: 'BOGUS'}), InternalError)
  t.is(error.name, ERROR_TYPE.INTERNAL_ERROR, 'wrong type of error thrown : ', error.name)
})

test('Testing Assert & Pack Action payload data', t => {

  let action = {
    type: 'ADD_GOAL',
    [`${GOAL_ENTITIES.CID}`]: 1243,
    [`${GOAL_ENTITIES.NAME}`]: 'BIRTHDAY',
    [`${GOAL_ENTITIES.GOAL_AMOUNT}`]: 100000,
    [`${GOAL_ENTITIES.INITIAL_DEPOSIT}`]: 200,
    [`${GOAL_ENTITIES.MM}`]: 2,
    [`${GOAL_ENTITIES.DD}`]: 20,
    [`${GOAL_ENTITIES.YYYY}`]: 2017
  }

  let expectedPayload = _.pick(action, [[`${GOAL_ENTITIES.CID}`], [`${GOAL_ENTITIES.NAME}`], [`${GOAL_ENTITIES.GOAL_AMOUNT}`], [`${GOAL_ENTITIES.GOAL_AMOUNT}`], [`${GOAL_ENTITIES.INITIAL_DEPOSIT}`],
    [`${GOAL_ENTITIES.MM}`], [`${GOAL_ENTITIES.DD}`], [`${GOAL_ENTITIES.YYYY}`]])

  let result = PHANTOM.assertAndPackActionPayload(action)
  t.deepEqual(result, expectedPayload, 'Result object isn\'t Expected payload ' + JSON.stringify(result) + '\n' + JSON.stringify(expectedPayload))

  // should throw Parameter not provided error no argument provided
  var error = t.throws(() => PHANTOM.assertActionPayload(), ParameterNotProvided)
  t.is(error.name, ERROR_TYPE.PARAMETER_NOT_PROVIDED, 'wrong type of error thrown : ', error)

  // should throw object property missing when any property is missing
  error = t.throws(() => PHANTOM.assertActionPayload({type: action.type}), ObjectPropertyMissing)
  t.is(error.name, ERROR_TYPE.OBJECT_PROPERTY_MISSING, 'wrong type of error thrown : ', error)

  error = t.throws(() => PHANTOM.assertActionPayload({[`${GOAL_ENTITIES.CID}`]: 1243,
    [`${GOAL_ENTITIES.NAME}`]: 'BIRTHDAY',
    [`${GOAL_ENTITIES.GOAL_AMOUNT}`]: 100000,
    [`${GOAL_ENTITIES.INITIAL_DEPOSIT}`]: 200,
    [`${GOAL_ENTITIES.MM}`]: 2,
    [`${GOAL_ENTITIES.DD}`]: 20,
    [`${GOAL_ENTITIES.YYYY}`]: 2017}), ObjectPropertyMissing)
  t.is(error.name, ERROR_TYPE.OBJECT_PROPERTY_MISSING, 'wrong type of error thrown : ', error)

  // should throw internal error when bogus property provided
  error = t.throws(() => PHANTOM.assertActionPayload({type: 'BOGUS'}), InternalError)
  t.is(error.name, ERROR_TYPE.INTERNAL_ERROR, 'wrong type of error thrown : ', error.name)
})
