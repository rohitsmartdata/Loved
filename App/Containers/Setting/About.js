
// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/About'
import { getUserID } from '../../Redux/Reducers/UserReducer'
import { SettingActions } from '../../Redux/Reducers/SettingReducer'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.SHOW_URL:
      dispatch(SettingActions.showWebWindow(action[SETTINGS_ENTITIES.URL], action[SETTINGS_ENTITIES.HEADING], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SHOW_URL: 'SHOW_URL'
}

const mapStateToProps = (state) => {
  // user id
  let userID = getUserID(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    userID
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
