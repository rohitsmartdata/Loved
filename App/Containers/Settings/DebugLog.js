/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 23/6/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/DebugLog'
import {getUserID, getLatestUserDetailID}
  from '../../Redux/Reducers/UserReducer'
import {fetchNumberOfChildrenAtStart}
  from '../../Redux/Reducers/ChildReducer'

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
  // user id
  const userID = getUserID(state.root.u)
  // latest user detail id
  const detailID = getLatestUserDetailID(state.root.u)
  // number of children
  const numberOfChildrenAtStart = fetchNumberOfChildrenAtStart(state.root.children)
  return {
    // send local actions for (presentation <--> container)
    localActions,
    // user id
    userID,
    // detail id
    detailID,
    // number of children
    numberOfChildrenAtStart
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
