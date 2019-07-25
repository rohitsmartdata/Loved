/* eslint-disable no-trailing-spaces,no-multiple-empty-lines,key-spacing,padded-blocks */
/**
 * Created by viktor on 7/6/17.
 */
// ========================================================
// Import Packages
// ========================================================

import P from '../Redux/ActionParameters'
import _ from 'lodash'
import Immutable from 'seamless-immutable'
import {ObjectPropertyMissing, ParameterNotProvided, InternalError} from './Errors'

// ========================================================
// Export Phantom
// ========================================================

export default {

  /*
    Assert Action Payload :-
    This function asserts the payload the action type
    is suppose to carry.
    ACTION_TYPE are unique among all the reducers.
    We map these ACTION_TYPE in single file, and pick
    the parameters of concerned ACTION_TYPE from the
    common file.

    - If all the object values mentioned with ACTION_TYPE
    are present in the action object, then we simply exit
    the function
    - If any value is missing, we throw Error with message.

    @parameter action, {type: action_type, ...payload}
    @throws error
   */
  assertActionPayload : (action) => {

    // throw error if action is undefined
    if (!action) {
      throw new ParameterNotProvided('Action or type is undefined : ', action)
    }
    // throw error if type parameter isn't mentioned
    if (!action.type) {
      throw new ObjectPropertyMissing('Type of action is undefined: ', action.type)
    }

    let params = P[action.type]
    if (!params) {
      throw new InternalError('Parameters of type ' + action.type + ' is undefined : ', params)
    }

    params.forEach((e, i, a) => {
      if (!(_.has(action, e) && action[e] !== undefined)) {
        throw new ObjectPropertyMissing(e + ' is either not present or undefined ' + JSON.stringify(action))
      }
    })

    return true
  },

  /*
    Assert and pack Action payload into a single object.
    throws error if assertion doesn't pass
   */
  assertAndPackActionPayload: (action) => {


    // throw error if action is undefined
    if (!action) {
      throw new ParameterNotProvided('Action or type is undefined : ', action)
    }
    // throw error if type parameter isn't mentioned
    if (!action.type) {
      throw new ObjectPropertyMissing('Type of action is undefined: ', action.type)
    }

    let params = P[action.type]
    if (!params) {
      throw new InternalError('Parameters of type ' + action.type + ' is undefined : ', params)
    }

    params.forEach((e, i, a) => {
      if (!(_.has(action, e) && action[e] !== undefined)) {
        throw new ObjectPropertyMissing(e + ' is either not present or undefined ' + JSON.stringify(action))
      }
    })



    let payload = {}
    P[action.type].forEach((e, i, a) => {
      payload[e] = action[e]
    })
    return payload
  },

  /*
    Set In.
    Simply sets the value at path in the state.
   */
  setIn : (state, path, value) => Immutable.setIn(state, path, value),

  /*
    Get In.
    Simply gets the value at path in the state.
   */
  getIn : (state, path) => Immutable.getIn(state, path)

}
