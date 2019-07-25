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
  from '../../Components/Settings/SelectAccountType'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {UserActions, isFundingSourceLinked, getUserID, getFundingSourceAccount, isFundingSourceGettingLinked}
  from '../../Redux/Reducers/UserReducer'
import { change, reset } from 'redux-form'
import { FORM_TYPES } from '../../Config/contants'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.SELECT_ACCOUNT_TYPE:
      dispatch(change(action['form'], action['field'], action['value']))
      dispatch(UserActions.selectBankAccount(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.RESET_FORM:
      dispatch(reset(FORM_TYPES.BANK_DETAILS))
      dispatch(UserActions.popScreen(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SELECT_ACCOUNT_TYPE: 'SELECT_ACCOUNT_TYPE',
  RESET_FORM: 'resetForm'
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
