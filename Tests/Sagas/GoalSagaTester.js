/* eslint-disable no-trailing-spaces,padded-blocks */
/**
 * Created by viktor on 13/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import test
  from 'ava'
import {addGoal}
  from '../../App/Sagas/GoalSaga'
import {call}
  from 'redux-saga/effects'
import {GoalTypes}
  from '../../App/Redux/Reducers/GoalReducer'
import {GOAL_ENTITIES}
  from '../../App/Utility/Mapper/Goal'
import {goalAPI}
  from '../../App/Services/GoalAPI'
import {addGoalFormat}
  from '../../App/Utility/Formatter/GoalDataFormatter'
import PHANTOM
  from '../../App/Utility/Phantom'

// ========================================================
// Goal Saga tester
// ========================================================

test('[ADD_GOAL]', t => {
  let action = {
    type: GoalTypes.ADD_GOAL,
    [GOAL_ENTITIES.CID]: 'CID_1',
    [GOAL_ENTITIES.NAME]: 'Housing',
    [GOAL_ENTITIES.GOAL_AMOUNT]: 100000,
    [GOAL_ENTITIES.INITIAL_DEPOSIT]: 100,
    [GOAL_ENTITIES.MM]: '3',
    [GOAL_ENTITIES.DD]: '10',
    [GOAL_ENTITIES.YYYY]: '1990'
  }

  let api = goalAPI().addGoal

  const gen = addGoal(api, action)

  // first check with correct action
  let payload
  try {
    PHANTOM.assertActionPayload(action)
    payload = addGoalFormat(action)
  } catch (error) {
    t.fail(error.message)
  }

  t.deepEqual(gen.next().value, call(api, payload))

})
