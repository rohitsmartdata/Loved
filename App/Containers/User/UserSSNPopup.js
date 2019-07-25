/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 1/5/19.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect }
  from 'react-redux'
import Screen
  from '../../Components/User/UserSSNPopup'
import { isUserSSNAdded, getUserID, getFirstName, isStoreUserSSNProcessing, UserActions }
  from '../../Redux/Reducers/UserReducer'
import { COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action
  switch (type) {
    case localActions.SUBMIT_SSN:
      dispatch(UserActions.storeUserSsn(
        action[USER_ENTITIES.USER_ID],
        action[USER_ENTITIES.SSN],
        undefined,
        false
      ))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SUBMIT_SSN: 'SUBMIT_SSN'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // is ssn added
  const ssnAdded = isUserSSNAdded(state.root.u)
  // is processing
  const isProcessing = isStoreUserSSNProcessing(state.root.u)
  // user name
  let userName = getFirstName(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // child id
    childID,

    // user name
    userName,

    // is ssn added
    ssnAdded,

    // is processing
    isProcessing: isProcessing
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleLocalAction: (actionType, navigation) => handleLocalAction(dispatch, actionType, navigation)
  }
}

// ========================================================
// Connect & Export
// ========================================================

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
