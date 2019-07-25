/* eslint-disable no-trailing-spaces */
/**
 * Created by demon on 29/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/LI_StartInvesting'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
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
    case localActions.CONTINUE:
      dispatch(GoalActions.selectGoalAmount(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  // continue
  CONTINUE: 'CONTINUE'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child first name
  let firstname = getFirstName(state.root.children, childID)

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal name
  let goalName = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // goal name
    goalName,

    // child id
    childID,

    // child name
    firstName: firstname
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
