/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 17/8/17.
 */

import React from 'react'
import {Alert} from 'react-native'
import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/RecurringDetail'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {SettingActions, isProcessing, getRecurringData}
  from '../../Redux/Reducers/SettingReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.FETCH_RECURRING_DATA:
      dispatch(SettingActions.fetchRecurringData(action[USER_ENTITIES.USER_ID]))
      break

    case localActions.SHOW_RECURRING_WIDGET:
      dispatch(SettingActions.showRecurringWidget(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.RECURRING_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
    // console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  FETCH_RECURRING_DATA: 'FETCH_RECURRING_DATA',
  SHOW_RECURRING_WIDGET: 'SHOW_RECURRING_WIDGET'
}

const mapStateToProps = (state, props) => {
  const userID = getUserID(state.root.u)
  const isRecurringProcessing = isProcessing(state.util)
  const recurringData = getRecurringData(state.util)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    // is recurring investment processing
    isProcessing: isRecurringProcessing,

    recurringData: recurringData
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
