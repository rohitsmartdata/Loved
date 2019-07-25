/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 1/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {
  getFormValues,
  change
}
  from 'redux-form'
import Screen
  from '../../Components/Sprout/SSNRequestContact'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {isChildSSNRequested}
  from '../../Redux/Reducers/ChildReducer'
import {UserActions, getUserID, getUserEmail, isStoreUserSSNProcessing}
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {FORM_TYPES}
  from '../../Config/contants'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.REQUEST_SSN:
      if (action[USER_ENTITIES.SSN]) {
        dispatch(UserActions.storeUserSsn(
          action[USER_ENTITIES.USER_ID],
          action[USER_ENTITIES.SSN],
          action[COMMON_ENTITIES.NAVIGATOR],
          true,
          action[CHILD_ENTITIES.CHILD_ID],
          action[CHILD_ENTITIES.SSN_REQUEST_PHONE_NUMBER],
          action[CHILD_ENTITIES.UNIQUE_CODE],
          action[USER_ENTITIES.EMAIL_ID],
          action[CHILD_ENTITIES.UNIQUE_URL]
        ))
      } else {
        dispatch(UserActions.markSsnRequest(
          action[USER_ENTITIES.USER_ID],
          action[COMMON_ENTITIES.NAVIGATOR],
          true,
          action[CHILD_ENTITIES.CHILD_ID],
          action[CHILD_ENTITIES.SSN_REQUEST_PHONE_NUMBER],
          action[CHILD_ENTITIES.UNIQUE_CODE],
          action[USER_ENTITIES.EMAIL_ID],
          action[CHILD_ENTITIES.UNIQUE_URL]
        ))
      }

      break
    case localActions.CHANGE_FIELD:
      dispatch(change(action['form'], action['field'], action['value']))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  REQUEST_SSN: 'REQUEST_SSN',
  CHANGE_FIELD: 'CHANGE_FIELD'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  let email = getUserEmail(state.root.u)
  let userSSN = props[USER_ENTITIES.SSN]
  const phoneNumber = state.form[FORM_TYPES.ADD_CHILD] && state.form[FORM_TYPES.ADD_CHILD].values && state.form[FORM_TYPES.ADD_CHILD].values[USER_ENTITIES.PHONE_NUMBER]
  const isProcessing = isStoreUserSSNProcessing(state.root.u)
  const isSSNRequested = isChildSSNRequested(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    userSSN,

    phoneNumber,

    childID,

    email,

    isProcessing,

    isSSNRequested
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
