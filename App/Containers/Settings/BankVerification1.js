/* eslint-disable no-unused-vars */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/BankVerification1'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import { getUserID, getFundingSourceAccount, UserActions }
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_AMOUNT_VERIFICATION_SCREEN:
      dispatch(UserActions.navigateToAmountVerificationScreen(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_AMOUNT_VERIFICATION_SCREEN: 'NAVIGATE_TO_AMOUNT_VERIFICATION_SCREEN'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  const fundingSourceAccount = getFundingSourceAccount(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    fundingSourceAccount
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
