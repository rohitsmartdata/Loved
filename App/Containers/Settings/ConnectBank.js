/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/6/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/ConnectBank'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {UserActions, isFundingSourceLinked, getUserID, getFundingSourceAccount, isFundingSourceGettingLinked}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.LINK_PLAID:
      dispatch(UserActions.linkFundingSource(action[USER_ENTITIES.USER_ID], undefined, undefined, action[USER_ENTITIES.PLAID_ACCOUNT_ID], action[USER_ENTITIES.PLAID_PUBLIC_TOKEN], undefined, undefined, undefined, action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SELECT_ACCOUNT_TYPE:
      dispatch(UserActions.selectBankAccount(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  LINK_PLAID: 'linkPlaid',
  SELECT_ACCOUNT_TYPE: 'SELECT_ACCOUNT_TYPE'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // is plaid already linked
  const isPlaidLinked = isFundingSourceLinked(state.root.u)
  // account
  const userAccount = getFundingSourceAccount(state.root.u)
  // is processing
  const isProcessing = isFundingSourceGettingLinked(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // is plaid linked
    isPlaidLinked,

    // user account
    userAccount,

    // is processing
    isProcessing
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
