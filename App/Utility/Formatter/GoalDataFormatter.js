/* eslint-disable no-trailing-spaces,key-spacing,padded-blocks,no-unused-vars,no-multi-spaces */
/**
 * Goal Inspector.
 * This file container functions to
 * generate output in format preferred
 * by the api end points.
 *
 * Created by viktor on 1/6/17.
 */

import {GOAL_ENTITIES, ADD_GOAL_PATH, ADD_GOAL_REQUEST_PATH, EDIT_GOAL_PATH, EDIT_GOAL_REQUEST_PATH}
  from '../Mapper/Goal'
import {assertFlyingData, packFlyingData}
  from '../Utility'
import _ from 'lodash'

/*
  addGoalFormat
  This method is used for returning request payload
  for POST /goal/

  @parameter CID 'child id'
  @parameter name 'name of the goal'
  @parameter totalValue 'total value of goal'
  @parameter initialDeposit 'initial deposit for the goal'
  @parameter dueDate 'due date of the goal'

  @return Object {payload : {...}}
 */
export const addGoalFormat = action => {

  const {CID, name, totalValue, initialDeposit, MM, DD, YYYY} = action

  let dueDate = MM + '/' + DD + '/' + YYYY

  // pack request data
  let requestData = packFlyingData(ADD_GOAL_REQUEST_PATH, [
    {entity: GOAL_ENTITIES.CID,                 value: CID},
    {entity: GOAL_ENTITIES.NAME,                value: name},
    {entity: GOAL_ENTITIES.GOAL_AMOUNT,         value: totalValue},
    {entity: GOAL_ENTITIES.INITIAL_DEPOSIT,     value: initialDeposit},
    {entity: GOAL_ENTITIES.DUE_DATE,            value: dueDate}
  ])

  return requestData
}

export const editGoalFormat = action => {

  const {CID, GID, name, totalValue, initialDeposit, MM, DD, YYYY} = action

  let dueDate = MM + '/' + DD + '/' + YYYY

  // pack request data
  let requestData = packFlyingData(EDIT_GOAL_REQUEST_PATH, [
    {entity: GOAL_ENTITIES.CID,                 value: CID},
    {entity: GOAL_ENTITIES.GID,                 value: GID},
    {entity: GOAL_ENTITIES.NAME,                value: name},
    {entity: GOAL_ENTITIES.GOAL_AMOUNT,         value: totalValue},
    {entity: GOAL_ENTITIES.INITIAL_DEPOSIT,     value: initialDeposit},
    {entity: GOAL_ENTITIES.DUE_DATE,            value: dueDate}
  ])

  return requestData
}
