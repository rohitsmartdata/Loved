/* eslint-disable no-trailing-spaces,padded-blocks,key-spacing */
/**
 * In reducer testing, we are checking what
 * all changes are getting affected in the
 * state.
 * Not checking whether other entities are
 * getting affected by it or not.
 * Created by viktor on 12/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import test from 'ava'
import Immutable from 'seamless-immutable'
import {GoalTypes, HANDLERS} from '../../App/Redux/Reducers/GoalReducer'
import PHANTOM from '../../App/Utility/Phantom'
import {GOAL_ENTITIES, path} from '../../App/Utility/Mapper/Goal'

// ========================================================
// Initial State
// ========================================================

var INITIAL_STATE = Immutable({})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.CHILD_MAP)(), {})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.IS_OK)(), true)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.ERROR)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.ADD_GOAL_PROCESSING)(), false)

// ========================================================
// Test reducers
// ========================================================

/*
  Test ADD_GOAL Action.

  Output :-
  1. add_goal_processing should be set to true
 */
test('[ADD GOAL]', t => {

  // check the ADD_GOAL_PROCESSING before
  // addGoal action; should be false
  let beforeAddingGoal = PHANTOM.getIn(INITIAL_STATE, path(GOAL_ENTITIES.ADD_GOAL_PROCESSING)())
  t.is(beforeAddingGoal, false, 'initial state add_goal_processing isn\'t false')

  // check the ADD_GOAL_PROCESSING after
  // addGoal action; should be true
  let result = HANDLERS[GoalTypes.ADD_GOAL](INITIAL_STATE, {})
  let afterAddingGoal = PHANTOM.getIn(result, path(GOAL_ENTITIES.ADD_GOAL_PROCESSING)())
  t.is(afterAddingGoal, true, 'after addingGoal, add_goal_processing isn\'t true')

})

/*
  Test Add Goal Success

  Output :-
  1. add_goal_processing should be set to false
  2. ok : true
  3. error : undefined
  4. You will find 'GID'

  Todo :-
  - make changes to test if add_goal_success
  is changed in the reducer
 */
test('[ADD GOAL SUCCESS]', t => {
  let initialState = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.ADD_GOAL_PROCESSING)(), true)

  let action = {
    type: GoalTypes.ADD_GOAL_SUCCESS,
    [GOAL_ENTITIES.CID] : 'CID_1',
    [GOAL_ENTITIES.GID] : 'GID_1',
    [GOAL_ENTITIES.NAME]: 'HOUSING',
    [GOAL_ENTITIES.GOAL_AMOUNT]: 100000,
    [GOAL_ENTITIES.INITIAL_DEPOSIT]: 100,
    [GOAL_ENTITIES.DUE_DATE]: '01/02/1990'
  }
  let expected = {
    [GOAL_ENTITIES.CID] : 'CID_1',
    [GOAL_ENTITIES.GID] : 'GID_1',
    [GOAL_ENTITIES.NAME]: 'HOUSING',
    [GOAL_ENTITIES.GOAL_AMOUNT]: 100000,
    [GOAL_ENTITIES.INITIAL_DEPOSIT]: 100,
    [GOAL_ENTITIES.DUE_DATE]: '01/02/1990'
  }

  // call the handler
  let result = HANDLERS[GoalTypes.ADD_GOAL_SUCCESS](initialState, action)

  // following changes should occur
  t.is(PHANTOM.getIn(result, path(GOAL_ENTITIES.ADD_GOAL_PROCESSING)()), false)
  t.is(PHANTOM.getIn(result, path(GOAL_ENTITIES.IS_OK)()), true)
  t.is(PHANTOM.getIn(result, path(GOAL_ENTITIES.ERROR)()), undefined)
  t.deepEqual(PHANTOM.getIn(result, path(GOAL_ENTITIES.GID_INDEX)(action[GOAL_ENTITIES.GID])), expected)

  let cidIndex = PHANTOM.getIn(result, path(GOAL_ENTITIES.CID_INDEX)(action[GOAL_ENTITIES.CID]))

  t.truthy(cidIndex)
  t.truthy(cidIndex.includes(action[GOAL_ENTITIES.GID]))

})

/*
  Test Add Goal Failure.

  Output :-
  1. Add goal processing should be set to false
  2. ok : false
  3. error : undefined
 */
test('[ADD GOAL FAILURE]', t => {
  let initialState = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.ADD_GOAL_PROCESSING)(), true)

  let action = {
    type: GoalTypes.ADD_GOAL_FAILURE,
    error : {
      status  : 404,
      code    : 'RESOURCE NOT FOUND',
      message : 'resource you are searching, doesn\'t exists'
    }
  }

  let result = HANDLERS[GoalTypes.ADD_GOAL_FAILURE](initialState, action)

  // following changes should occur
  t.is(PHANTOM.getIn(result, path(GOAL_ENTITIES.ADD_GOAL_PROCESSING)()), false)
  t.is(PHANTOM.getIn(result, path(GOAL_ENTITIES.IS_OK)()), false)
  t.deepEqual(PHANTOM.getIn(result, path(GOAL_ENTITIES.ERROR)()), action.error)

})
