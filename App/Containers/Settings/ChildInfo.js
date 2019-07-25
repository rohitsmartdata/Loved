/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 29/3/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/ChildInfo'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {isProcessing, getBrokerDealerData}
  from '../../Redux/Reducers/ChildReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'

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
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // is processing
  const processing = isProcessing(state.root.children)
  // broker dealer
  const brokerDealerData = getBrokerDealerData(state.root.children, childID)

  console.log('broker dealer data -> ', brokerDealerData)

  return {
    // send local actions for (presentation <--> container)
    localActions,
    // user id
    userID,
    // child id
    childID,
    // processing
    processing,
    // broker dealer data
    brokerDealerData
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
