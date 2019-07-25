/* eslint-disable no-trailing-spaces */
/**
 * Created by demon on 16/5/19.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/BankDisconnectNotification'
import {UserActions}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.DISMISS_MODAL:
      dispatch(UserActions.disableShowBankNotification())
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  DISMISS_MODAL: 'dismissModal'
}

const mapStateToProps = (state) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
