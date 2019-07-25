
// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/Documents'
import { SettingActions, isProcessing } from '../../Redux/Reducers/SettingReducer'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import { getIDToken } from '../../Redux/Reducers/AuthReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.SHOW_DOCUMENTS:
      dispatch(SettingActions.showDocuments(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_CONFIRMATIONS:
      dispatch(SettingActions.showConfirmations(action[AUTH_ENTITIES.ID_TOKEN], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SHOW_DOCUMENTS: 'SHOW_DOCUMENTS',
  SHOW_CONFIRMATIONS: 'SHOW_CONFIRMATIONS'
}

const mapStateToProps = (state) => {
  // id token
  const idToken = getIDToken(state.auth)
  // is processing
  const processing = isProcessing(state.util)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // id token
    idToken,
    // is processing
    processing
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
