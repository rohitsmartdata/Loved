/* eslint-disable no-multi-spaces,key-spacing,no-trailing-spaces,no-multiple-empty-lines,handle-callback-err */
/**
 * Created by viktor on 16/8/18.
 */

import { createReducer, createActions }
  from 'reduxsauce'
import Immutable
  from 'seamless-immutable'
import {ONBOARDING_ENTITIES, path}
  from '../../Utility/Mapper/Onboard'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {UserTypes}
  from './UserReducer'
import PARAMETERS
  from '../ActionParameters'
import PHANTOM
  from '../../Utility/Phantom'

// ========================================================
// Types & Action Creators
// ========================================================

const {Types, Creators} = createActions({

  // onboarding process started
  onboardingStarted: PARAMETERS.ONBOARDING_STARTED,
  // onboarding process completed
  onboardingCompleted: PARAMETERS.ONBOARDING_COMPLETED,
  // update onboarding status
  updateCurrentOnboarding: PARAMETERS.UPDATE_CURRENT_ONBOARDING,

  // mark current screen on onboarding process
  markCurrentOnboardingScreen: PARAMETERS.MARK_CURRENT_ONBOARDING_SCREEN,

  // simply mark the completion of profile
  markProfileCompletion: PARAMETERS.MARK_PROFILE_COMPLETION,

  // program agreement has been accepted
  programAccepted: PARAMETERS.PROGRAM_ACCEPTED,

  flushOnboarding: null
})

export const OnboardingTypes     = Types
export const OnboardingActions   = Creators

// ========================================================
// Initial State
// ========================================================

export var INITIAL_STATE = Immutable({})

// ========================================================
// Handlers
// ========================================================

const resetStoreHandler = (state) => {
  return INITIAL_STATE
}

// store the next screen type as identifier for the next screen if profile is incomplete
const markCurrentOnboardingScreenHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(ONBOARDING_ENTITIES.CURRENT_PROFILE_SCREEN)(action[USER_ENTITIES.USER_ID]), action[ONBOARDING_ENTITIES.CURRENT_PROFILE_SCREEN])
  s = PHANTOM.setIn(s, path(ONBOARDING_ENTITIES.IS_PROFILE_COMPLETE)(action[USER_ENTITIES.USER_ID]), false)
  s = PHANTOM.setIn(s, path(ONBOARDING_ENTITIES.IS_AGREEMENT_ACCEPTED)(action[USER_ENTITIES.USER_ID]), false)
  s = PHANTOM.setIn(s, path(ONBOARDING_ENTITIES.IS_PUSH_NOTIFICATION_DONE)(action[USER_ENTITIES.USER_ID]), false)
  s = PHANTOM.setIn(s, path(ONBOARDING_ENTITIES.IS_PIN_SET)(action[USER_ENTITIES.USER_ID]), false)
  return s
}

const markProfileCompletionHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(ONBOARDING_ENTITIES.CURRENT_PROFILE_SCREEN)(action[USER_ENTITIES.USER_ID]), undefined)
  s = PHANTOM.setIn(s, path(ONBOARDING_ENTITIES.IS_PROFILE_COMPLETE)(action[USER_ENTITIES.USER_ID]), true)
  return s
}

const programAcceptedHandler = (state, action) => {
  try {
    // store the identity data
    let s = PHANTOM.setIn(state, path(ONBOARDING_ENTITIES.IS_AGREEMENT_ACCEPTED)(action[USER_ENTITIES.USER_ID]), true)
    return s
  } catch (err) {
    return state
  }
}

const flushOnboardingHandler = (state, action) => {
  return {}
}

// ========================================================
// Reducer Formation & Exports
// ========================================================

export const HANDLERS = {
  [UserTypes.RESET_STORE]: resetStoreHandler,
  [Types.MARK_CURRENT_ONBOARDING_SCREEN]: markCurrentOnboardingScreenHandler,
  [Types.MARK_PROFILE_COMPLETION]: markProfileCompletionHandler,
  [Types.PROGRAM_ACCEPTED]: programAcceptedHandler,
  [Types.FLUSH_ONBOARDING]: flushOnboardingHandler
}

export const reducer = createReducer(INITIAL_STATE, HANDLERS)

// ========================================================
// Selectors
// ========================================================

// retrieve current onboarding screen
export const getCurrentOnboardingScreen = (state, userID) => PHANTOM.getIn(state, path(ONBOARDING_ENTITIES.CURRENT_PROFILE_SCREEN)(userID))

export const isProfileCompleted = (state, userID) => PHANTOM.getIn(state, path(ONBOARDING_ENTITIES.IS_PROFILE_COMPLETE)(userID))

export const isAgreementAccepted = (state, userID) => PHANTOM.getIn(state, path(ONBOARDING_ENTITIES.IS_AGREEMENT_ACCEPTED)(userID))

export const getProfileData = (state, userID) => PHANTOM.getIn(state, path(ONBOARDING_ENTITIES.PROFILE_DATA)(userID))

export const canAddChild = (state, userID) => {
  let profileCompleted = PHANTOM.getIn(state, path(ONBOARDING_ENTITIES.IS_PROFILE_COMPLETE)(userID))
  let agreementAccepted = PHANTOM.getIn(state, path(ONBOARDING_ENTITIES.IS_AGREEMENT_ACCEPTED)(userID))
  try {
    return profileCompleted && agreementAccepted
  } catch (err) {
    return false
  }
}
