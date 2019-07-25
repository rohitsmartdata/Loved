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
  from '../../Components/Settings/AddAccountInformation'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {UserActions, isFundingSourceLinked, getUserID, getFundingSourceAccount, isFundingSourceGettingLinked}
  from '../../Redux/Reducers/UserReducer'
import { FORM_TYPES } from '../../Config/contants'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.SETUP_BANK_ACCOUNT:
      dispatch(UserActions.linkFundingSource(action[USER_ENTITIES.USER_ID], undefined, undefined, undefined, undefined, action[USER_ENTITIES.BANK_ACCOUNT_TYPE], action[USER_ENTITIES.BANK_ROUTING_NUMBER], action[USER_ENTITIES.BANK_ACCOUNT_NUMBER], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SETUP_BANK_ACCOUNT: 'SETUP_BANK_ACCOUNT'
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
  let formData = (state.form[FORM_TYPES.BANK_DETAILS] && state.form[FORM_TYPES.BANK_DETAILS]['values'])

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
    isProcessing,

    formData
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
