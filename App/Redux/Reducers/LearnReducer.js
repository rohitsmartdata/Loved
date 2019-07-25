/* eslint-disable no-multi-spaces,no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 13/7/18.
 */

// ========================================================
// Import packages
// ========================================================

import { createReducer, createActions }
  from 'reduxsauce'
import Immutable
  from 'seamless-immutable'
import {LEARN_ENTITIES, path}
  from '../../Utility/Mapper/Learn'
import PARAMETERS
  from '../ActionParameters'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {UserTypes}
  from './UserReducer'
import PHANTOM
  from '../../Utility/Phantom'
import _
  from 'lodash'

// ========================================================
// Types & Action Creators
// ========================================================

const {Types, Creators} = createActions({
  fetchLearnModules: null,
  fetchLearnModulesSuccess: PARAMETERS.FETCH_LEARN_MODULES_SUCCESS,
  fetchLearnModulesFailure: ['error']
})

export const LearnTypes      = Types
export const LearnActions    = Creators

// ========================================================
// Initial State
// ========================================================

export var INITIAL_STATE = Immutable({})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(LEARN_ENTITIES.IS_OK)(), true)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(LEARN_ENTITIES.ERROR)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(LEARN_ENTITIES.PROCESSING)(), undefined)

// ========================================================
// Handler Functions
// ========================================================

const fetchLearnModulesHandler = (state) => PHANTOM.setIn(state, path(LEARN_ENTITIES.PROCESSING)(), LEARN_ENTITIES.PROCESSING_FETCH_MODULES)

const fetchLearnModulesSuccessHandler = (state, action) => {
  let content = action[LEARN_ENTITIES.CONTENT]
  let s = PHANTOM.setIn(state, path(LEARN_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(LEARN_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(LEARN_ENTITIES.PROCESSING)(), undefined)

  content.map(c => {
    let id = c['id']
    let name = c['name']
    let backdropImage = c['imagepreview'] && c['imagepreview']['url']
    let image = c['contentheroimage'] && c['contentheroimage']['url']
    let description = c['descriptionofcontent']
    let contentText = c['maincontent']
    let updateAt = c['updatedAt']
    let isTileOne = (c['tileOneDashboard'] || false)
    let isTileTwo = (c['tileTwoDashboard'] || false)

    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_ID)(id), id)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_NAME)(id), name)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_DESCRIPTION)(id), description)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_CONTENT)(id), contentText)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_BACKDROP)(id), backdropImage)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_IMAGE)(id), image)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_UPDATED_AT)(id), updateAt)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_UPDATED_AT)(id), updateAt)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_TILE_ONE)(id), isTileOne)
    s = PHANTOM.setIn(s, path(LEARN_ENTITIES.MODULE_TILE_TWO)(id), isTileTwo)
  })

  return s
}

const fetchLearnModulesFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(LEARN_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(LEARN_ENTITIES.ERROR)(), error)
  s = PHANTOM.setIn(s, path(LEARN_ENTITIES.PROCESSING)(), undefined)
  return s
}

// ========================================================
// Reducer Formation & Exports
// ========================================================

export const HANDLERS = {
  [Types.FETCH_LEARN_MODULES]: fetchLearnModulesHandler,
  [Types.FETCH_LEARN_MODULES_SUCCESS]: fetchLearnModulesSuccessHandler,
  [Types.FETCH_LEARN_MODULES_FAILURE]: fetchLearnModulesFailureHandler
}

export const reducer = createReducer(INITIAL_STATE, HANDLERS)

// ========================================================
// Selectors
// ========================================================

export const getModules = (state) => {
  let value = PHANTOM.getIn(state, path(LEARN_ENTITIES.CONTENT)())
  if (value) {
    return Object.values(value)
  } else {
    return undefined
  }
}

export const isFetchLearningModules = (state) => PHANTOM.getIn(state, path(LEARN_ENTITIES.PROCESSING)()) === LEARN_ENTITIES.PROCESSING_FETCH_MODULES
