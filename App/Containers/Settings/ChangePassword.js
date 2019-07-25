/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 17/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React from 'react'
import {Alert} from 'react-native'
import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/ChangePassword'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {SettingActions, getError, isProcessing}
  from '../../Redux/Reducers/SettingReducer'
import {getUserEmail}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.INITIATE_CHANGE_PASSWORD:
      dispatch(SettingActions.processChangePassword(action[AUTH_ENTITIES.EMAIL], action[AUTH_ENTITIES.PASSWORD], action[AUTH_ENTITIES.NEW_PASSWORD], action[COMMON_ENTITIES.NAVIGATOR], dispatch))
      break

    case localActions.HIDE_ERROR:
      dispatch(SettingActions.disableError())
      break

    default:
    // console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  HIDE_ERROR: 'HIDE_ERROR'
}

// Todo:-
// get authentication 'type' via props via navigation stack
const mapStateToProps = (state, props) => {
  let email = getUserEmail(state.root.u)
  const isChangePasswordProcessing = isProcessing(state.util)
  const error = getError(state.util)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    email: email,

    isProcessing: isChangePasswordProcessing,

    errorObj: error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLocalAction: (actionType, navigation) => handleLocalAction(dispatch, actionType, navigation)
  }
}

// ========================================================
// Connect & Export
// ========================================================

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
