
// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/ResetBankAccount'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {
  UserActions,
  getUserID,
  getFundingSourceID
}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.RESET_BANK:
      dispatch(UserActions.resetBankAccount(action[USER_ENTITIES.USER_ID], action[USER_ENTITIES.SOURCE_REFERENCE_ID], action['resetLogin'], action[COMMON_ENTITIES.CALLBACK_FUCTION], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.REFRESH_STATE:
      dispatch(UserActions.fetchUser(action[USER_ENTITIES.USER_ID], COMMON_ENTITIES.NAVIGATOR))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  RESET_BANK: 'RESET_BANK',
  REFRESH_STATE: 'REFRESH_STATE'
}

const mapStateToProps = (state) => {
  // user id
  let userID = getUserID(state.root.u)

  // funding source id
  const fundingSourceId = getFundingSourceID(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // funding source id
    fundingSourceId
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
