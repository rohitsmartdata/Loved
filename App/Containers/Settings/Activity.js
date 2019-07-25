/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 5/2/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/Activity'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {getChildren}
  from '../../Redux/Reducers/ChildReducer'
import {getGoals}
  from '../../Redux/Reducers/GoalReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
}

const mapStateToProps = (state, props) => {
  // children objects
  let children = getChildren(state.root.children)
  // child id array
  let childIDs = (children && Object.keys(children)) || []
  // user unique id
  let userID = getUserID(state.root.u)

  let transferObj = {}
  let isTransferPresent = true

  Object.values(children).map(child => {
    let goals = getGoals(state.root.goals, child[CHILD_ENTITIES.CHILD_ID])
    let obj = {}
    obj[CHILD_ENTITIES.FIRST_NAME] = child[CHILD_ENTITIES.FIRST_NAME]
    obj['goals'] = goals
    transferObj[child[CHILD_ENTITIES.CHILD_ID]] = obj
  })

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // transfer object
    transferObject: transferObj,
    // children object
    children: children,
    // child id array
    childIDs: childIDs,
    // user id
    userID: userID
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
