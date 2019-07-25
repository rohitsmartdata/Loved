/* eslint-disable no-trailing-spaces */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Setting/Bank'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {
  UserActions,
  isFundingSourceLinked,
  getUserID,
  getFundingSourceAccount,
  isFundingSourceGettingLinked,
  getFundingSourceStatus,
  isDisconnectingBank,
  getFundingStatus,
  getUserIsBankAdded,
  showBankNotification
}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.LINK_PLAID:
      dispatch(UserActions.linkFundingSource(action[USER_ENTITIES.USER_ID], undefined, undefined, action[USER_ENTITIES.PLAID_ACCOUNT_ID], action[USER_ENTITIES.PLAID_PUBLIC_TOKEN], undefined, undefined, undefined, action[COMMON_ENTITIES.NAVIGATOR], action['fetchUserDetails']))
      break
    case localActions.SELECT_ACCOUNT_TYPE:
      dispatch(UserActions.selectBankAccount(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.REFRESH_STATE:
      dispatch(UserActions.fetchUser(action[USER_ENTITIES.USER_ID], COMMON_ENTITIES.NAVIGATOR))
      break
    case localActions.DISCONNECT_BANK:
      dispatch(UserActions.disconnectBank(action[COMMON_ENTITIES.NAVIGATOR], action[USER_ENTITIES.USER_ID]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  LINK_PLAID: 'linkPlaid',
  SELECT_ACCOUNT_TYPE: 'SELECT_ACCOUNT_TYPE',
  REFRESH_STATE: 'REFRESH_STATE',
  DISCONNECT_BANK: 'DISCONNECT_BANK'
}

const mapStateToProps = (state) => {
  // user id
  let userID = getUserID(state.root.u)
  // is plaid already linked
  const isPlaidLinked = isFundingSourceLinked(state.root.u)
  // account number
  const userAccount = getFundingSourceAccount(state.root.u)
  // account status
  const userAccountStatus = getFundingSourceStatus(state.root.u)
  // is processing
  const isProcessing = isFundingSourceGettingLinked(state.root.u)
  // disconnecting bank
  const disconnectingBank = isDisconnectingBank(state.root.u)
  // show bank notification
  const bankNotificationVisible = showBankNotification(state.root.u)
  // funding status
  const fundingStatus = getFundingStatus(state.root.u)
  // bank added
  const bankAdded = getUserIsBankAdded(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // is plaid linked
    isPlaidLinked,

    // user account
    userAccount,

    // funding status,
    fundingStatus,

    // bank added
    bankAdded,

    // user account status
    userAccountStatus,

    // show bank notification
    bankNotificationVisible,

    // is processing
    isProcessing: isProcessing || disconnectingBank
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
