/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 15/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {reset}
  from 'redux-form'
import Screen
  from '../../Components/Invest/LI_InvestmentBase'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import { ChildActions, getFirstName, isSSNAdded }
  from '../../Redux/Reducers/ChildReducer'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {FORM_TYPES}
  from '../../Config/contants'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.RESET_FORM:
      dispatch(reset(FORM_TYPES.ADD_INVESTMENT))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  RESET_FORM: 'resetForm'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // first name
  const firstName = getFirstName(state.root.children, childID)

  // is ssn added
  const isssnAdded = isSSNAdded(state.root.children, childID)

  let valuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  // investment name
  let investmentName = (valuesPresent && state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_NAME])
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // child id
    childID: childID,

    userID,

    // child name
    firstName: firstName,

    // is ssn added
    isssnAdded,

    // investment name
    investmentName
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
