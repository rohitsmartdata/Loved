/* eslint-disable no-trailing-spaces,camelcase */
/**
 * Created by viktor on 17/7/17.
 */
// ========================================================
// Import Packages
// ========================================================

import {Navigation} from 'react-native-navigation'
import { SPROUT } from '../Utility/Mapper/Screens'

// ========================================================
// Import Screens
// ========================================================

import Authentication from '../Containers/Common/Auth'
import AuthSelector from '../Containers/Common/AuthSelector'
import SignUpEmail from '../Containers/Common/SignUpEmail'
import Login from '../Containers/Common/Login'
import PlaidConnect from '../Containers/Common/PlaidConnect'
import LoginPin from '../Containers/Common/LoginPin'
import WebWindow from '../Containers/Common/WebWindow'
import ActionScreen from '../Containers/Common/ActionScreen'

import GrowHomepage from '../Containers/Grow/Homepage'
import Article from '../Containers/Grow/Article'

import SettingPanel from '../Containers/Settings/SettingPanel'
import ChangePassword from '../Containers/Settings/ChangePassword'
import RecurringDetail from '../Containers/Settings/RecurringDetail'
import FAQ from '../Containers/Settings/FAQ'
import AboutUS from '../Containers/Settings/AboutUS'
import Documents from '../Containers/Settings/Documents'
import ViewTransfers from '../Containers/Settings/ViewTransfers'
import ShowConfig from '../Containers/Settings/ShowConfig'
import EditProfile from '../Containers/Settings/EditProfile'
import BankSetup from '../Containers/Settings/BankSetup'
import Statements from '../Containers/Settings/Statements'
import Confirmations from '../Containers/Settings/Confirmations'
import Activity from '../Containers/Settings/Activity'
import BrokerDealerPage from '../Containers/Settings/BrokerDealerPage'
import ChildInfo from '../Containers/Settings/ChildInfo'
import ForgotPassword from '../Containers/Settings/ForgotPassword'
import RegularTransfers from '../Containers/Settings/RegularTransfers'
import ConnectBank from '../Containers/Settings/ConnectBank'
import SelectAccountType from '../Containers/Settings/SelectAccountType'
import AddRoutingNumber from '../Containers/Settings/AddRoutingNumber'
import AddAccountInformation from '../Containers/Settings/AddAccountInformation'
import BankVerification1 from '../Containers/Settings/BankVerification1'
import BankVerification2 from '../Containers/Settings/BankVerification2'
import BankAccountPending from '../Containers/Settings/BankAccountPending'
import DebugLog from '../Containers/Settings/DebugLog'

import Setting from '../Containers/Setting/Setting'
import EditProfileSetting from '../Containers/Setting/EditProfile'
import ReferAFriend from '../Containers/Setting/ReferAFriend'
import ActivitySetting from '../Containers/Setting/Activity'
import DocumentsSetting from '../Containers/Setting/Documents'
import BankSetting from '../Containers/Setting/Bank'
import BankDisconnectNotification from '../Containers/Setting/BankDisconnectNotification'
import ResetBankAccount from '../Containers/Setting/ResetBankAccount'
import FAQSetting from '../Containers/Setting/FAQ'
import AboutSetting from '../Containers/Setting/About'

import HomepageContainer from '../Containers/Sprout/HomepageContainer'
import Homepage from '../Containers/Sprout/Homepage'
import AddChild from '../Containers/Sprout/AddChild'
import AddChildBirthDate from '../Containers/Sprout/AddChildBirthDate'
import ChildSSN from '../Containers/Sprout/ChildSSN'
import CreateChildNotification from '../Containers/Sprout/CreateChildNotification'
import ChildAgeLimitation from '../Containers/Sprout/ChildAgeLimitation'
import SSNConfirm from '../Containers/Sprout/SSNConfirm'
import ChildView from '../Containers/Sprout/ChildView'
import SSNPopup from '../Containers/Sprout/SSNPopup'
import UserSSN from '../Containers/Sprout/UserSSN'
import SSNRequestContact from '../Containers/Sprout/SSNRequestContact'
import ChildInvesting from '../Containers/Sprout/Investing'

import InvestmentHomepage from '../Containers/Invest/Homepage'
import AddInvestment from '../Containers/Invest/AddInvestment'
import InvestAmount from '../Containers/Invest/InvestAmount'
import InvestFrequency from '../Containers/Invest/InvestFrequency'
import LI_SelectInvestment from '../Containers/Invest/LI_SelectInvestment'
import LI_InvestmentDetail from '../Containers/Invest/LI_InvestmentDetail'
import LI_InvestmentFund from '../Containers/Invest/LI_InvestmentFund'
import LI_Sell from '../Containers/Invest/LI_Sell'
import LI_Buy from '../Containers/Invest/LI_Buy'
import LI_EditGoal from '../Containers/Goals/LI_EditGoal'
import LI_EditRecurring from '../Containers/Invest/LI_EditRecurring'

import SelectGoal from '../Containers/Goals/SelectGoal'
import Disclaimer from '../Containers/Goals/Disclaimer'
import AddGoal from '../Containers/Goals/AddGoal'
import SelectGoalDuration from '../Containers/Goals/GoalDuration'
import GoalDurationSelectionScreen from '../Containers/Goals/GoalDurationSelection'
import SelectGoalRisk from '../Containers/Goals/SelectRisk'
import SelectGoalAmount from '../Containers/Goals/GoalAmount'
import SelectGoalRecurringAmount from '../Containers/Goals/RecurringAmount'
import RecurringInvest from '../Containers/Goals/Invest'
import InvestReady from '../Containers/Goals/InvestReady'
import InvestUnderway from '../Containers/Goals/InvestUnderway'
import SkipConfirm from '../Containers/Goals/SkipConfirm'
import GoalHomepage from '../Containers/Goals/Homepage'
import EditGoal from '../Containers/Goals/EditGoal'
import EditRecurringAmount from '../Containers/Goals/EditRecurringAmount'
import PortfolioDetail from '../Containers/Goals/PortfolioDetail'
import CostExpected from '../Containers/Goals/CostExpected'
import Withdraw from '../Containers/Goals/Withdraw'
import RiskNotification from '../Containers/Goals/RiskNotification'
import GoalBase from '../Containers/Goals/GoalBase'
import LI_SelectGoal from '../Containers/Goals/LI_SelectGoal'
import LI_GoalDetail from '../Containers/Goals/LI_GoalDetail'
import LI_GoalAmount from '../Containers/Goals/LI_GoalAmount'
import LI_GoalDuration from '../Containers/Goals/LI_GoalDuration'
import LI_GoalPortfolio from '../Containers/Goals/LI_GoalPortfolio'
import LI_GoalFund from '../Containers/Goals/LI_GoalFund'
import LI_ConfirmGoal from '../Containers/Goals/LI_GoalConfirm'
import LI_StartInvesting from '../Containers/Goals/LI_StartInvesting'
import LI_PrepareInvestment from '../Containers/Goals/LI_PrepareInvestment'

import ParentDashboard from '../Containers/User/ParentDashboard'
import UserInputDetail_1 from '../Containers/User/InputDetail_1'
import UserInputDetail_2 from '../Containers/User/InputDetail_2'
import UserInputDetail_3 from '../Containers/User/InputDetail_3'
import UserInputManualAddress from '../Containers/User/InputManualAddress'
import UserInputDetail_4 from '../Containers/User/InputDetail_4'
import UserInputDetail_5 from '../Containers/User/InputDetail_5'
import UserInputDetail_6 from '../Containers/User/InputDetail_6'
import UserInputDetail_7 from '../Containers/User/InputDetail_7'
import UserInputDetail_8 from '../Containers/User/InputDetail_8'
import UserInputDetail_9 from '../Containers/User/InputDetail_9'
import UserInputDetail_SSN from '../Containers/User/InputDetail_SSN'
import UserInputPhoneNumber from '../Containers/User/InputPhoneNumber'
import AcceptTermsConditions from '../Containers/User/TermsAccept'
import UserInputCountryBorn from '../Containers/User/InputCountryBorn'
import UserInputCountryCitizenship from '../Containers/User/InputCountryCitizenship'
import UserVisaType from '../Containers/User/InputVisaType'
import UserVisaExpiry from '../Containers/User/InputVisaExpiry'
import OtherResidence from '../Containers/User/OtherResidence'
import ConfirmPushNotification from '../Containers/User/ConfirmPushNotification'
import AgeLimitationNotification from '../Containers/User/AgeLimitationNotification'
import IdentityVerification from '../Containers/User/IdentityVerification'
import ConfirmInvestorProfile from '../Containers/User/ConfirmInvestorProfile'
import UserSSNPopup from '../Containers/User/UserSSNPopup'

import ChatRoom from '../Containers/Academy/ChatRoom'
import LI_Confirm from '../Containers/Invest/LI_Confirm'

export function registerScreens (store, Provider) {
  Navigation.registerComponent(SPROUT.AUTH_SELECTOR_SCREEN, () => AuthSelector, store, Provider)
  Navigation.registerComponent(SPROUT.SIGNUP_EMAIL, () => SignUpEmail, store, Provider)
  Navigation.registerComponent(SPROUT.AUTHENTICATION_SCREEN, () => Authentication, store, Provider)
  Navigation.registerComponent(SPROUT.LOGIN, () => Login, store, Provider)
  Navigation.registerComponent(SPROUT.LOGIN_PIN, () => LoginPin, store, Provider)
  Navigation.registerComponent(SPROUT.WEB_WINDOW, () => WebWindow, store, Provider)
  Navigation.registerComponent(SPROUT.ACTION_SCREEN, () => ActionScreen, store, Provider)

  Navigation.registerComponent(SPROUT.GROW_HOMEPAGE, () => GrowHomepage, store, Provider)
  Navigation.registerComponent(SPROUT.ARTICLE, () => Article, store, Provider)

  Navigation.registerComponent(SPROUT.SETTINGS_PANEL, () => SettingPanel, store, Provider)
  Navigation.registerComponent(SPROUT.CHANGE_PASSWORD, () => ChangePassword, store, Provider)
  Navigation.registerComponent(SPROUT.RECURRING_DETAIL, () => RecurringDetail, store, Provider)
  Navigation.registerComponent(SPROUT.FAQ, () => FAQ, store, Provider)
  Navigation.registerComponent(SPROUT.ABOUT_US, () => AboutUS, store, Provider)
  Navigation.registerComponent(SPROUT.DOCUMENTS, () => Documents, store, Provider)
  Navigation.registerComponent(SPROUT.VIEW_TRANSFERS, () => ViewTransfers, store, Provider)
  Navigation.registerComponent(SPROUT.SHOW_CONFIG, () => ShowConfig, store, Provider)
  Navigation.registerComponent(SPROUT.EDIT_PROFILE, () => EditProfile, store, Provider)
  Navigation.registerComponent(SPROUT.BANK_SETUP, () => BankSetup, store, Provider)
  Navigation.registerComponent(SPROUT.STATEMENTS, () => Statements, store, Provider)
  Navigation.registerComponent(SPROUT.CONFIRMATIONS, () => Confirmations, store, Provider)
  Navigation.registerComponent(SPROUT.REGULAR_TRANSFERS, () => RegularTransfers, store, Provider)
  Navigation.registerComponent(SPROUT.ACTIVITY, () => Activity, store, Provider)
  Navigation.registerComponent(SPROUT.BROKER_DEALER_PAGE, () => BrokerDealerPage, store, Provider)
  Navigation.registerComponent(SPROUT.CHILD_INFO_PAGE, () => ChildInfo, store, Provider)
  Navigation.registerComponent(SPROUT.FORGOT_PASSWORD, () => ForgotPassword, store, Provider)
  Navigation.registerComponent(SPROUT.CONNECT_BANK, () => ConnectBank, store, Provider)
  Navigation.registerComponent(SPROUT.SELECT_ACCOUNT_TYPE, () => SelectAccountType, store, Provider)
  Navigation.registerComponent(SPROUT.ADD_ROUTING_NUMBER, () => AddRoutingNumber, store, Provider)
  Navigation.registerComponent(SPROUT.ADD_ACCOUNT_INFORMATION, () => AddAccountInformation, store, Provider)
  Navigation.registerComponent(SPROUT.BANK_VERIFICATION_1, () => BankVerification1, store, Provider)
  Navigation.registerComponent(SPROUT.BANK_VERIFICATION_2, () => BankVerification2, store, Provider)
  Navigation.registerComponent(SPROUT.BANK_ACCOUNT_PENDING, () => BankAccountPending, store, Provider)
  Navigation.registerComponent(SPROUT.DEBUG_LOG, () => DebugLog, store, Provider)

  Navigation.registerComponent(SPROUT.CHILD_HOMEPAGE_CONTAINER_SCREEN, () => HomepageContainer, store, Provider)
  Navigation.registerComponent(SPROUT.CHILD_HOMEPAGE_SCREEN, () => Homepage, store, Provider)
  Navigation.registerComponent(SPROUT.ADD_CHILD_SCREEN, () => AddChild, store, Provider)
  Navigation.registerComponent(SPROUT.ADD_CHILD_BIRTH_DATE, () => AddChildBirthDate, store, Provider)
  Navigation.registerComponent(SPROUT.CHILD_SSN_SCREEN, () => ChildSSN, store, Provider)
  Navigation.registerComponent(SPROUT.CREATE_CHILD_NOTIFICATION, () => CreateChildNotification, store, Provider)
  Navigation.registerComponent(SPROUT.CHILD_AGE_LIMITATION, () => ChildAgeLimitation, store, Provider)
  Navigation.registerComponent(SPROUT.SSN_CONFIRM, () => SSNConfirm, store, Provider)
  Navigation.registerComponent(SPROUT.CHILD_VIEW_SCREEN, () => ChildView, store, Provider)
  Navigation.registerComponent(SPROUT.SSN_POPUP, () => SSNPopup, store, Provider)
  Navigation.registerComponent(SPROUT.USER_SSN, () => UserSSN, store, Provider)
  Navigation.registerComponent(SPROUT.SSN_REQUEST_CONTACT, () => SSNRequestContact, store, Provider)
  Navigation.registerComponent(SPROUT.CHILD_INVESTING, () => ChildInvesting, store, Provider)

  Navigation.registerComponent(SPROUT.INVEST_HOMEPAGE, () => InvestmentHomepage, store, Provider)
  Navigation.registerComponent(SPROUT.ADD_INVESTMENT, () => AddInvestment, store, Provider)
  Navigation.registerComponent(SPROUT.INVEST_AMOUNT, () => InvestAmount, store, Provider)
  Navigation.registerComponent(SPROUT.INVEST_FREQUENCY, () => InvestFrequency, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SELECT_INVESTMENT, () => LI_SelectInvestment, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SHOW_INVESTMENT_DETAIL, () => LI_InvestmentDetail, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SHOW_INVESTMENT_FUND, () => LI_InvestmentFund, store, Provider)
  Navigation.registerComponent(SPROUT.LI_BUY, () => LI_Buy, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SELL, () => LI_Sell, store, Provider)
  Navigation.registerComponent(SPROUT.LI_EDIT_RECURRING, () => LI_EditRecurring, store, Provider)
  Navigation.registerComponent(SPROUT.LI_EDIT_GOAL, () => LI_EditGoal, store, Provider)
  Navigation.registerComponent(SPROUT.LI_CONFIRM, () => LI_Confirm, store, Provider)

  Navigation.registerComponent(SPROUT.SELECT_GOAL_SCREEN, () => SelectGoal, store, Provider)
  Navigation.registerComponent(SPROUT.ADD_GOAL_SCREEN, () => AddGoal, store, Provider)
  Navigation.registerComponent(SPROUT.GOAL_DURATION_SCREEN, () => SelectGoalDuration, store, Provider)
  Navigation.registerComponent(SPROUT.GOAL_DURATION_SELECTION_SCREEN, () => GoalDurationSelectionScreen, store, Provider)
  Navigation.registerComponent(SPROUT.SELECT_RISK_SCREEN, () => SelectGoalRisk, store, Provider)
  Navigation.registerComponent(SPROUT.GOAL_AMOUNT_SCREEN, () => SelectGoalAmount, store, Provider)
  Navigation.registerComponent(SPROUT.RECURRING_AMOUNT_SCREEN, () => SelectGoalRecurringAmount, store, Provider)
  Navigation.registerComponent(SPROUT.INVEST, () => RecurringInvest, store, Provider)
  Navigation.registerComponent(SPROUT.INVEST_READY, () => InvestReady, store, Provider)
  Navigation.registerComponent(SPROUT.INVEST_UNDERWAY, () => InvestUnderway, store, Provider)
  Navigation.registerComponent(SPROUT.SKIP_CONFIRM, () => SkipConfirm, store, Provider)
  Navigation.registerComponent(SPROUT.GOAL_HOMEPAGE_SCREEN, () => GoalHomepage, store, Provider)
  Navigation.registerComponent(SPROUT.NAVIGATE_TO_EDIT_GOAL, () => EditGoal, store, Provider)
  Navigation.registerComponent(SPROUT.EDIT_RECURRING_AMOUNT, () => EditRecurringAmount, store, Provider)
  Navigation.registerComponent(SPROUT.PORTFOLIO_DETAIL, () => PortfolioDetail, store, Provider)
  Navigation.registerComponent(SPROUT.COST_EXPECTED, () => CostExpected, store, Provider)
  Navigation.registerComponent(SPROUT.WITHDRAW, () => Withdraw, store, Provider)
  Navigation.registerComponent(SPROUT.DISCLAIMER, () => Disclaimer, store, Provider)
  Navigation.registerComponent(SPROUT.RISK_NOTIFICATION, () => RiskNotification, store, Provider)
  Navigation.registerComponent(SPROUT.GOAL_BASE, () => GoalBase, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SELECT_GOAL, () => LI_SelectGoal, store, Provider)
  Navigation.registerComponent(SPROUT.LI_GOAL_DETAIL, () => LI_GoalDetail, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SELECT_GOAL_AMOUNT, () => LI_GoalAmount, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SELECT_GOAL_DURATION, () => LI_GoalDuration, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SELECT_GOAL_PORTFOLIO, () => LI_GoalPortfolio, store, Provider)
  Navigation.registerComponent(SPROUT.LI_SELECT_GOAL_FUND, () => LI_GoalFund, store, Provider)
  Navigation.registerComponent(SPROUT.LI_CONFIRM_GOAL, () => LI_ConfirmGoal, store, Provider)
  Navigation.registerComponent(SPROUT.LI_START_INVESTING, () => LI_StartInvesting, store, Provider)
  Navigation.registerComponent(SPROUT.LI_PREPARE_INVESTMENT, () => LI_PrepareInvestment, store, Provider)

  Navigation.registerComponent(SPROUT.PARENT_DASHBOARD, () => ParentDashboard, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_1, () => UserInputDetail_1, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_2, () => UserInputDetail_2, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_3, () => UserInputDetail_3, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_MANUAL_ADDRESS, () => UserInputManualAddress, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_4, () => UserInputDetail_4, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_5, () => UserInputDetail_5, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_6, () => UserInputDetail_6, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_7, () => UserInputDetail_7, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_8, () => UserInputDetail_8, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_9, () => UserInputDetail_9, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_DETAIL_SSN, () => UserInputDetail_SSN, store, Provider)
  Navigation.registerComponent(SPROUT.USER_INPUT_PHONE_NUMBER, () => UserInputPhoneNumber, store, Provider)
  Navigation.registerComponent(SPROUT.USER_COUNTRY_BORN, () => UserInputCountryBorn, store, Provider)
  Navigation.registerComponent(SPROUT.USER_COUNTRY_CITIZENSHIP, () => UserInputCountryCitizenship, store, Provider)
  Navigation.registerComponent(SPROUT.ACCEPT_TERMS_CONDITIONS, () => AcceptTermsConditions, store, Provider)
  Navigation.registerComponent(SPROUT.USER_VISA_TYPE, () => UserVisaType, store, Provider)
  Navigation.registerComponent(SPROUT.USER_VISA_EXPIRY, () => UserVisaExpiry, store, Provider)
  Navigation.registerComponent(SPROUT.OTHER_RESIDENCE, () => OtherResidence, store, Provider)
  Navigation.registerComponent(SPROUT.CONFIRM_PUSH_NOTIFICATION, () => ConfirmPushNotification, store, Provider)
  Navigation.registerComponent(SPROUT.AGE_LIMITATION_NOTIFICATION, () => AgeLimitationNotification, store, Provider)
  Navigation.registerComponent(SPROUT.IDENTITY_VERIFICATION, () => IdentityVerification, store, Provider)
  Navigation.registerComponent(SPROUT.CONFIRM_INVESTOR_PROFILE, () => ConfirmInvestorProfile, store, Provider)
  Navigation.registerComponent(SPROUT.USER_SSN_POPUP, () => UserSSNPopup, store, Provider)

  Navigation.registerComponent(SPROUT.PLAID_CONNECT, () => PlaidConnect, store, Provider)

  Navigation.registerComponent(SPROUT.SETTING, () => Setting, store, Provider)
  Navigation.registerComponent(SPROUT.EDIT_PROFILE_SETTING, () => EditProfileSetting, store, Provider)
  Navigation.registerComponent(SPROUT.REFER_A_FRIEND, () => ReferAFriend, store, Provider)
  Navigation.registerComponent(SPROUT.ACTIVITY_SETTING, () => ActivitySetting, store, Provider)
  Navigation.registerComponent(SPROUT.DOCUMENTS_SETTING, () => DocumentsSetting, store, Provider)
  Navigation.registerComponent(SPROUT.BANK_SETTING, () => BankSetting, store, Provider)
  Navigation.registerComponent(SPROUT.BANK_DISCONNECT_NOTIFICATION, () => BankDisconnectNotification, store, Provider)
  Navigation.registerComponent(SPROUT.RESET_BANK_ACCOUNT, () => ResetBankAccount, store, Provider)
  Navigation.registerComponent(SPROUT.FAQ_SETTING, () => FAQSetting, store, Provider)
  Navigation.registerComponent(SPROUT.ABOUT_SETTING, () => AboutSetting, store, Provider)

  Navigation.registerComponent(SPROUT.CHAT_ROOM, () => ChatRoom, store, Provider)
}
