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
  from '../../Components/Settings/BrokerDealerPage'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {ChildActions, getChildren}
  from '../../Redux/Reducers/ChildReducer'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.SHOW_BROKER_DEALER_CHILD_INFO:
      dispatch(ChildActions.showBrokerDealerChildInfo(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[CHILD_ENTITIES.BD_ACCOUNT_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SHOW_BROKER_DEALER_CHILD_INFO: 'SHOW_BROKER_DEALER_CHILD_INFO'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // children's of user
  let children = getChildren(state.root.children)
  // child id's
  let childArr = []
  Object.values(children).map(child => childArr.push(child))

  return {
    // send local actions for (presentation <--> container)
    localActions,
    // user id
    userID,
    // children
    children,
    // child id's
    childArr
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
