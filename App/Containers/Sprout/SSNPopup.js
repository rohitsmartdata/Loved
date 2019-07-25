/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 24/8/18.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect }
  from 'react-redux'
import Screen
  from '../../Components/Sprout/SSNPopup'
import { ChildActions, isCreatingChildAccount, isSSNAdded, getFirstName as getChildsFirstName, isChildSSNRequested }
  from '../../Redux/Reducers/ChildReducer'
import { isUserSSNAdded, getUserID, getFirstName, isStoreUserSSNProcessing, getUserEmail, UserActions }
  from '../../Redux/Reducers/UserReducer'
import { COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import { INVESTMENT_ENTITIES }
  from '../../Utility/Mapper/Investment'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import { GOAL_ENTITIES }
  from '../../Utility/Mapper/Goal'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import {isProcessing as isInvestmentProcessing}
  from '../../Redux/Reducers/InvestmentReducer'
import {isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action
  switch (type) {
    case localActions.SUBMIT_SSN:
      const isModal = action['isModal']
      if (isModal) {
        const pFunc = action['pushFunc']
        dispatch(ChildActions.createChildAccount(
          action[USER_ENTITIES.USER_ID],
          action[CHILD_ENTITIES.CHILD_ID],
          undefined,
          action[CHILD_ENTITIES.SSN],
          undefined,
          false,
          action[COMMON_ENTITIES.NAVIGATOR],
          pFunc))

        // pFunc({[CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID], [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME]})
      } else {
        dispatch(ChildActions.createChildAccount(
          action[USER_ENTITIES.USER_ID],
          action[CHILD_ENTITIES.CHILD_ID],
          undefined,
          action[CHILD_ENTITIES.SSN],
          undefined,
          false,
          action[COMMON_ENTITIES.NAVIGATOR]))
      }
      break

    case localActions.REQUEST_CHILD_SSN:
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
  const ssnAdded = isSSNAdded(state.root.children, childID)

  // get user email
  const email = getUserEmail(state.root.u)
  // is processing
  const isProcessing = isCreatingChildAccount(state.root.children)
  // is child ssn requested
  const isSSNRequested = isChildSSNRequested(state.root.children, childID)
  // user name
  let userName = getFirstName(state.root.u)
  // child name
  let childName = getChildsFirstName(state.root.children, childID)
  // is modal or screen
  let pushFunc = props['pushFunc']
  // is modal
  let isModal = pushFunc !== undefined

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // child id
    childID,

    // email id
    emailID: email,

    // user name
    userName,

    // get child name
    childName,

    // is ssn requested
    isSSNRequested,

    // is ssn added
    ssnAdded,

    // is modal
    isModal,

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
