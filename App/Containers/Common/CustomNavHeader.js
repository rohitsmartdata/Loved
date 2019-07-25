/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 14/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {LeftHeader, RightHeader}
  from '../../Components/Common/CustomNavHeader'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {

    case localActions.TOGGLE_SETTINGS:
      dispatch(SettingActions.showSettings(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.HANDLE_RIGHT_BUTTON:
      dispatch(SettingActions.navigateToProfile(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  TOGGLE_SETTINGS: 'TOGGLE_SETTINGS',
  HANDLE_RIGHT_BUTTON: 'HANDLE_RIGHT_BUTTON'
}

const mapStateToProps = (state, props) => {
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions
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

export const LeftNavHeader = connect(mapStateToProps, mapDispatchToProps)(LeftHeader)
export const RightNavHeader = connect(mapStateToProps, mapDispatchToProps)(RightHeader)
