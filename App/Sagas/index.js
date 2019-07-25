/* eslint-disable no-trailing-spaces,no-unused-vars,padded-blocks */

import { takeLatest, fork, all } from 'redux-saga/effects'
import {GoalTypes} from '../Redux/Reducers/GoalReducer'
import {InvestmentTypes} from '../Redux/Reducers/InvestmentReducer'
import {ChildTypes} from '../Redux/Reducers/ChildReducer'
import {AuthTypes} from '../Redux/Reducers/AuthReducer'
import {UserTypes, UserActions} from '../Redux/Reducers/UserReducer'
import {SettingTypes} from '../Redux/Reducers/SettingReducer'
import {OnboardingTypes} from '../Redux/Reducers/OnboardingReducer'
import {LearnTypes} from '../Redux/Reducers/LearnReducer'

/* ------------- Sagas ------------- */

import {getAccessToken, restoreIdentityData} from './StartupSagas'
import {
  submitUserInfo, storeCustodianInformation, storeSSN, storeUserAddress, markSSNRequest, fetchUser,
  fetchUserInformationGlossary, fetchUserDetail, linkPlaid, verifyPlaid, reAuthenticateBankAccount, queryAccountAPI,
  modifyUserInstruction, fetchUserInstructions, modifyRecurringAmount, fetchUserTransactions, fetchDebugData, resetBank
} from './UserSagas'
import {addCustomGoal, updateGoal, makeGoal, transfer, withdraw, fetchDetail, fetchChartData, fetchUserTransfers, fetchPerformanceData, fetchInvestChartData} from './GoalSaga'
import {addInvestment, fetchProducts} from './InvestmentSaga'
import {addChild, fetchChildChartData, createChildAccountSaga, submitChildAccount, fetchStockPerformance} from './ChildSaga'
import {fetchLearnModules} from './LearnSaga'
import {fetchRecurringData, fetchStatements, disconnectBank, fetchConfirmations, transferNow} from './SettingsSaga'
import {login, signup, registerPIN, onBoardingCompleted, onBoardingStarted, updateCurrentOnboarding, changePassword, logout, logoutSuccess, passcodeLogin, forgotPassword, confirmPassword, uploadPhoto, getPhoto} from './AuthSaga'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {

  // ------------------------------------------------------------
  // Learning section

  yield fork(takeLatest, LearnTypes.FETCH_LEARN_MODULES, fetchLearnModules, require('../Services/Queries/Learn').fetchLearningModules().fetchLearningModules)

  // ------------------------------------------------------------
  // add a new child; uses graphql
  yield fork(takeLatest, ChildTypes.ADD_CHILD, addChild, require('../Services/Queries/Child').childQuery().addChild)

  //
  yield fork(takeLatest, ChildTypes.CREATE_CHILD_ACCOUNT, createChildAccountSaga, require('../Services/Queries/Child').childQuery().addChild)

  yield fork(takeLatest, ChildTypes.SUBMIT_CHILD_ACCOUNT, submitChildAccount, require('../Services/Queries/Child').childQuery().addChild)

  // fetch user data from read api; uses graphql
  yield fork(takeLatest, UserTypes.FETCH_USER, fetchUser, require('../Services/Queries/User').userQuery().fetchUser)
  yield fork(takeLatest, UserTypes.FETCH_USER_DETAIL, fetchUser, require('../Services/Queries/User').userQuery().fetchUser)

  // fetch user detail from detail api; uses graphql
  yield fork(takeLatest, UserTypes.FETCH_USER, fetchUserDetail, require('../Services/Queries/Child').fetchChildDetail().fetchChildDetail)
  yield fork(takeLatest, UserTypes.FETCH_USER_DETAIL, fetchUserDetail, require('../Services/Queries/Child').fetchChildDetail().fetchChildDetail)

  // fetch user instructions for goals; uses graphql
  yield fork(takeLatest, UserTypes.FETCH_USER_INSTRUCTIONS, fetchUserInstructions, require('../Services/Queries/User').userInstructions().fetchUserInstructions)

  // modify a user instruction; uses graphql
  yield fork(takeLatest, UserTypes.MODIFY_USER_INSTRUCTION, modifyUserInstruction, require('../Services/Queries/User').modifyUserInstruction().modifyUserInstruction)

  // modify user recurring instruction
  yield fork(takeLatest, UserTypes.MODIFY_USER_RECURRING_INSTRUCTION, modifyRecurringAmount, require('../Services/Queries/User').modifyRecurringAmount().modifyRecurringAmount)

  // fetch recent transactions; uses graphql
  yield fork(takeLatest, SettingTypes.FETCH_USER_TRANSACTIONS, fetchUserTransactions, require('../Services/Queries/User').userTransactions().fetchUserTransactions)

  // fetches stock data for debug mode; uses graphql
  yield fork(takeLatest, UserTypes.SWITCH_ON_DEBUG_MODE, fetchDebugData, require('../Services/Queries/User').fetchDebugData().fetchDebugData)

  // add a custom goal; uses graphql
  yield fork(takeLatest, GoalTypes.ADD_CUSTOM_GOAL, addCustomGoal, require('../Services/Queries/Goal').goalQuery().addCustomGoal)

  // add a predefined goal; uses graphql; main func; uses graphql
  yield fork(takeLatest, GoalTypes.MAKE_GOAL, makeGoal, require('../Services/Queries/Goal').makeGoalQuery().makeGoal)

  // edit a existing goal detail; main func; uses graphql
  yield fork(takeLatest, GoalTypes.EDIT_GOAL, updateGoal, require('../Services/Queries/Goal').updateNameTargetGoalQuery().updateGoal)

  // update goal with complete detail; not used currently; uses graphql
  yield fork(takeLatest, GoalTypes.UPDATE_COMPLETE_GOAL, updateGoal, require('../Services/Queries/Goal').updateCompleteGoalQuery().updateGoal)

  // update goal with partial detail; not used currently; uses graphql
  yield fork(takeLatest, GoalTypes.UPDATE_PARTIAL_GOAL, updateGoal, require('../Services/Queries/Goal').updatePartialGoalQuery().updateGoal)

  // link funding source; uses graphql
  yield fork(takeLatest, UserTypes.LINK_FUNDING_SOURCE, linkPlaid, require('../Services/Queries/TPT').linkPlaidQuery().linkPlaid)

  // verify funding amount; uses graphql
  yield fork(takeLatest, UserTypes.VERIFY_FUNDING_AMOUNT, verifyPlaid, require('../Services/Queries/TPT').verifyPlaidAmount().verifyPlaid)

  // reset bank account;  uses graphql
  yield fork(takeLatest, UserTypes.RESET_BANK_ACCOUNT, resetBank, require('../Services/Queries/TPT').resetBankAccountQuery().resetBankAccount)

  // verify funding amount; uses graphql
  yield fork(takeLatest, UserTypes.RE_AUTHENTICATE_BANK_ACCOUNT, reAuthenticateBankAccount, require('../Services/Queries/TPT').plaidUpdateModeQuery().plaidUpdateMode)

  yield fork(takeLatest, UserTypes.RE_AUTHENTICATE_BANK_ACCOUNT_WITH_ACCOUNT_ID, reAuthenticateBankAccount, require('../Services/Queries/TPT').plaidUpdateModeQueryForAccountId().plaidUpdateMode)

  // do transfers; uses graphql
  yield fork(takeLatest, GoalTypes.TRANSFER, transfer, require('../Services/Queries/TPT').initiateTransfer().doTransfer)

  // do withdraw; uses graphql
  yield fork(takeLatest, GoalTypes.WITHDRAW, withdraw, require('../Services/Queries/TPT').initiateWithdraw().doWithdraw)

  // add a new investment; uses graphql
  yield fork(takeLatest, InvestmentTypes.ADD_INVESTMENT, addInvestment, require('../Services/Queries/Goal').makeGoalQuery().makeGoal)

  // add a new investment; uses graphql
  yield fork(takeLatest, OnboardingTypes.PROGRAM_ACCEPTED, storeCustodianInformation, require('../Services/Queries/TPT').storeInformation().storeInformation)

  yield fork(takeLatest, UserTypes.STORE_USER_SSN, storeSSN, require('../Services/Queries/TPT').storeUserSSN().storeInformation)

  yield fork(takeLatest, UserTypes.STORE_USER_ADDRESS, storeUserAddress, require('../Services/Queries/TPT').storeAddressDetail().storeAddressDetail)

  yield fork(takeLatest, UserTypes.MARK_SSN_REQUEST, markSSNRequest, require('../Services/Queries/TPT').requestChildSSNPayload().requestChildSSNPayload)

    // fetch all investments; uses API
  yield fork(takeLatest, InvestmentTypes.FETCH_PRODUCTS, fetchProducts)

  // fetch user statements; uses API
  yield fork(takeLatest, SettingTypes.SHOW_DOCUMENTS, fetchStatements)

  // delete account
  yield fork(takeLatest, UserTypes.DISCONNECT_BANK, disconnectBank)

  // fetch user trade confirmations; uses API
  yield fork(takeLatest, SettingTypes.SHOW_CONFIRMATIONS, fetchConfirmations)
  // internal method to process transfer automatically; uses API
  yield fork(takeLatest, SettingTypes.TRANSFER_NOW, transferNow)

  // intenral onboarding method; doesn't interact with outside world
  yield fork(takeLatest, OnboardingTypes.ONBOARDING_STARTED, onBoardingStarted)
  // intenral onboarding method; doesn't interact with outside world
  yield fork(takeLatest, OnboardingTypes.ONBOARDING_COMPLETED, onBoardingCompleted)
  // intenral onboarding method; doesn't interact with outside world
  yield fork(takeLatest, OnboardingTypes.UPDATE_CURRENT_ONBOARDING, updateCurrentOnboarding)

  // fetch goal detail; uses graphql;
  yield fork(takeLatest, GoalTypes.FETCH_GOAL_DETAIL, fetchDetail, require('../Services/Queries/Goal').fetchGoalDetail().fetchGoalDetail)

  // fetch performance data
  yield fork(takeLatest, GoalTypes.FETCH_PERFORMANCE_DATA, fetchPerformanceData)

  // fetch Investment chart data
  yield fork(takeLatest, GoalTypes.FETCH_INVEST_CHART_DATA, fetchInvestChartData)

  yield fork(takeLatest, ChildTypes.FETCH_STOCK_PERFORMANCE, fetchStockPerformance, require('../Services/GoalAPI').childStockPerformance)
  // yield fork(takeLatest, GoalTypes.FETCH_GOAL_CHART_DATA, fetchChartData, require('../Services/GoalAPI').goalChart().fetchChart)
  // yield fork(takeLatest, ChildTypes.FETCH_CHILD_CHART_DATA, fetchChildChartData, require('../Services/GoalAPI').goalChart().fetchChart)

  yield fork(takeLatest, ChildTypes.SHOW_BROKER_DEALER_CHILD_INFO, queryAccountAPI, require('../Services/Queries/TPT').queryAccountAPI().queryAccountAPI)

  yield fork(takeLatest, UserTypes.FETCH_GLOSSARY, fetchUserInformationGlossary, require('../Services/Queries/Learn').fetchGlossary().fetchGlossary)

  // on login action; uses aws api's
  yield fork(takeLatest, AuthTypes.LOGIN, login)
  yield fork(takeLatest, AuthTypes.SIGNUP, signup)
  yield fork(takeLatest, AuthTypes.REGISTER_PIN, registerPIN)
  yield fork(takeLatest, AuthTypes.LOGOUT, logout)
  yield fork(takeLatest, AuthTypes.LOGOUT_SUCCESS, logoutSuccess)
  yield fork(takeLatest, SettingTypes.PROCESS_CHANGE_PASSWORD, changePassword)
  yield fork(takeLatest, AuthTypes.PASSCODE_LOGIN, passcodeLogin)
  yield fork(takeLatest, SettingTypes.PROCESS_FORGOT_PASSWORD, forgotPassword)
  yield fork(takeLatest, SettingTypes.PROCESS_CONFIRM_PASSWORD, confirmPassword)
  yield fork(takeLatest, SettingTypes.UPLOAD_PHOTO, uploadPhoto)
  yield fork(takeLatest, SettingTypes.GET_PHOTO, getPhoto)

  // settings action
  // yield fork(takeLatest, SettingTypes.FETCH_RECURRING_DATA, fetchRecurringData, require('../Services/Queries/Goal').fetchRecurringInvestmentData().fetchData)
}
