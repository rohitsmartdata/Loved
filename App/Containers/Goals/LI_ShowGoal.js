/* eslint-disable no-unused-vars */
/**
 * Created by demon on 26/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {reset}
  from 'redux-form'
import Screen
  from '../../Components/Goals/LI_ShowGoal'
import {UserActions, getGlossary, isFetchingGlossary}
  from '../../Redux/Reducers/UserReducer'
import {ChildActions, getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {FORM_TYPES}
  from '../../Config/contants'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.RESET_FORM:
      // dispatch(reset(FORM_TYPES.ADD_GOAL))
      // dispatch(reset(FORM_TYPES.WITHDRAW))
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
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // first name
  const firstName = getFirstName(state.root.children, childID)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // child id
    childID: childID,

    // child name
    firstName: firstName
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
