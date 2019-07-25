/* eslint-disable no-trailing-spaces,padded-blocks,no-unused-vars */
/**
 * Goal Data Dissector
 * Created by viktor on 1/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {GOAL_ENTITIES, ADD_GOAL_PATH, ADD_GOAL_RESPONSE_PATH, EDIT_GOAL_RESPONSE_PATH}
  from '../Mapper/Goal'
import {assertFlyingData, packFlyingData}
  from '../Utility'
import _ from 'lodash'

// ========================================================
// Dissectors
// ========================================================

export const addGoalDataDissector = payload => {
  if (!payload) {
    throw new Error('payload undefined')
  }

  if (!assertFlyingData(payload, [
    GOAL_ENTITIES.CID,
    GOAL_ENTITIES.GID,
    GOAL_ENTITIES.NAME,
    GOAL_ENTITIES.GOAL_AMOUNT,
    GOAL_ENTITIES.INITIAL_DEPOSIT,
    GOAL_ENTITIES.DUE_DATE], ADD_GOAL_RESPONSE_PATH)) {

    throw new Error('Required values missing')
  }

  return payload
}

export const editGoalDataDissector = payload => {
  if (!payload) {
    throw new Error('payload undefined in editGoalDataDissector')
  }

  if (!assertFlyingData(payload, [
    GOAL_ENTITIES.CID,
    GOAL_ENTITIES.GID,
    GOAL_ENTITIES.NAME,
    GOAL_ENTITIES.GOAL_AMOUNT,
    GOAL_ENTITIES.INITIAL_DEPOSIT,
    GOAL_ENTITIES.DUE_DATE
  ], EDIT_GOAL_RESPONSE_PATH)) {
    throw new Error('Required values missing')
  }

  // return same payload, as of we haven't
  // distinguished between redux store data
  // and response format
  return payload
}
