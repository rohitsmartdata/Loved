/**
 * Created by viktor on 4/6/17.
 */

// ========================================================
// Import packages
// ========================================================

import Immutable from 'seamless-immutable'
import _ from 'lodash'

// ========================================================
// Functions
// ========================================================

export const packFlyingData = (path, dataArr) => {
  let obj = {}
  dataArr.map((element, index) => {
    element.value && _.set(obj, path[element.entity], element.value)
  })
  return Immutable(obj)
}

export const assertFlyingData = (obj, entities, PATH) => {
  let result = true
  for (var i = 0; i < entities.length && result; i++) {
    result = _.has(obj, PATH[entities[i]])
  }
  return result
}
