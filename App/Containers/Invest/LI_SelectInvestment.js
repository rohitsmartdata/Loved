/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * Created by demon on 15/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change, reset}
  from 'redux-form'
import moment
  from 'moment'
import Screen
  from '../../Components/Invest/LI_SelectInvestment'
import {FORM_TYPES}
  from '../../Config/contants'
import {getChildren, getDOB, getFirstName, isSSNAdded, getAvailableChildID, ChildActions, getImageUrl, getImage}
  from '../../Redux/Reducers/ChildReducer'
import {getIDToken}
  from '../../Redux/Reducers/AuthReducer'
import { getUserID, UserActions, isNavTabGoal, isUserSSNAdded, isStoreUserSSNProcessing, getSelectedChild, getUserEmail }
  from '../../Redux/Reducers/UserReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {GoalActions, getGoals, getProducts as getGoalProducts}
  from '../../Redux/Reducers/GoalReducer'
import {InvestmentActions, getNativeProducts, getProducts, getTypePriority, isProcessingProducts, getInvestments}
  from '../../Redux/Reducers/InvestmentReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, FREQUENCY}
  from '../../Utility/Mapper/Common'
import { analytics }
  from '../../Config/AppConfig'
import {events}
  from '../../Utility/Mapper/Tracking'
import { OnboardingActions }
  from '../../Redux/Reducers/OnboardingReducer'
import { SPROUT }
  from '../../Utility/Mapper/Screens'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type} = action

  switch (type) {
    case localActions.INVESTMENT_SELECTED:
      const isModal = action['isModal']
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_RISK_ID, action[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]))
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_NAME, action[INVESTMENT_ENTITIES.INVESTMENT_NAME]))
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_AMOUNT, 0))
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY, FREQUENCY.ONE_WEEK))
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.PRODUCT_TICKER, action[INVESTMENT_ENTITIES.PRODUCT_TICKER]))
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL, action[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]))

      dispatch(GoalActions.fetchPerformanceData(action[AUTH_ENTITIES.ID_TOKEN], action[INVESTMENT_ENTITIES.PRODUCT_TICKER]))
      dispatch(GoalActions.fetchInvestChartData(action[USER_ENTITIES.EMAIL_ID], action[INVESTMENT_ENTITIES.PRODUCT_TICKER]))

      if (isModal) {
        const pushFunc = action['pushFunc']
        pushFunc()
      } else {
        dispatch(InvestmentActions.showInvestmentDetail(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      }

      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.INVEST_WITH_PORTFOLIO,
        properties: {
          tab_name: action[INVESTMENT_ENTITIES.INVESTMENT_NAME]
        }
      })
      // *********** Log Analytics ***********
      break
    case localActions.FETCH_PRODUCTS:
      dispatch(InvestmentActions.fetchProducts())
      break

    case localActions.GOAL_SELECTED:
      dispatch(reset(FORM_TYPES.ADD_GOAL))
      dispatch(change(FORM_TYPES.ADD_GOAL, GOAL_ENTITIES.NAME, action[GOAL_ENTITIES.NAME]))
      dispatch(GoalActions.selectGoalAmount(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.SHOW_GOAL:
      dispatch(ChildActions.showGoal(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.NAME],
        action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break

    case localActions.SHOW_INVESTMENT:
      dispatch(InvestmentActions.showInvestment(action[CHILD_ENTITIES.CHILD_ID], action[INVESTMENT_ENTITIES.INVESTMENT_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    case localActions.RESET_GOAL_ENABLED:
      dispatch(UserActions.setNavTab(undefined, false))
      break

    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.LI_SELECT_INVESTMENT))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  INVESTMENT_SELECTED: 'investmentSelected',
  GOAL_SELECTED: 'goalSelected',
  FETCH_PRODUCTS: 'FETCH_PRODUCTS',
  SHOW_INVESTMENT: 'SHOW_INVESTMENT',
  SHOW_GOAL: 'SHOW_GOAL',
  UPDATE_CURRENT_ONBOARDING: 'UPDATE_CURRENT_ONBOARDING',
  RESET_GOAL_ENABLED: 'resetGoalEnabled'
}

const mapStateToProps = (state, props) => {
  // get user id
  let userID = getUserID(state.root.u)
  // get user email id
  let emailID = getUserEmail(state.root.u)
  // get childID
  let childID = props[CHILD_ENTITIES.CHILD_ID] || getSelectedChild(state.root.u) || getAvailableChildID(state.root.children)
  // get first name
  let firstName = getFirstName(state.root.children, childID)
  // identity token
  const idToken = getIDToken(state.auth)
  // is user ssn added
  let userSSNAdded = isUserSSNAdded(state.root.u)
  // is store user ssn processing
  let userSSNStoreProcessing = isStoreUserSSNProcessing(state.root.u)
  // is nav tab goal based
  let goalEnabled = isNavTabGoal(state.root.u)

  // is modal or screen
  let pushFunc = props['pushFunc']
  let isModal = pushFunc !== undefined

  let singularList = getNativeProducts(state.root.investments)
  // get products
  let products = getProducts(state.root.investments)
  // get goal products
  let goalProducts = getGoalProducts(state.root.goals)
  // fetching products
  let processingProducts = isProcessingProducts(state.root.investments)

  let combinedGoalProducts = {}
  goalProducts && Object.values(goalProducts).map(value => { combinedGoalProducts = Object.assign({}, value, combinedGoalProducts) })
  products && (products = Object.assign({}, products, {Goals: combinedGoalProducts}))

  let goals = childID && getGoals(state.root.goals, childID)
  let goalNames = []
  goals && goals.map(i => {
    let goalName = i[GOAL_ENTITIES.NAME]
    goalNames.push(goalName)
  })

  // bought investments
  let investments = childID && getInvestments(state.root.investments, childID)
  let tickerIDs = []
  let investmentNames = []
  investments && investments.map(i => {
    let tickerName = i[INVESTMENT_ENTITIES.INVESTMENT_TICKER_NAME]
    let name = i[INVESTMENT_ENTITIES.INVESTMENT_NAME]
    tickerIDs.push(tickerName)
    investmentNames.push(name)
  })

  // is onboarding flow
  let isOnboardingFlow = props[COMMON_ENTITIES.IS_ONBOARDING_FLOW]

  // is ssn added
  const isssnAdded = isSSNAdded(state.root.children, childID)

  // assign priorities
  let productKeys = (products && Object.keys(products)) || []
  let productDummyPriority = 1000
  let productPriority = {}
  productKeys.map(t => {
    let p = getTypePriority(state.root.investments, t)
    productPriority[t] = (p && parseInt(p)) || productDummyPriority++
  })
  let sortedType = []
  for (let p in productPriority) {
    sortedType.push([p, productPriority[p]])
  }
  sortedType.sort(function (a, b) {
    return a[1] - b[1]
  })

  return {
    // send local actions
    localActions: localActions,

    // user id
    userID,

    // email id
    emailID,

    // child id
    childID,

    // goal tab is selected
    goalEnabled,

    // user ssn added
    userSSNAdded,

    // is user ssn addition processing
    userSSNStoreProcessing,

    // firstname
    firstName: firstName,

    // is onboarding flow
    isOnboardingFlow,

    // products
    products,

    // singular list of all products
    singularList,

    // investment names
    investmentNames,

    sortedType,

    // processing products
    processingProducts,

    // id token
    idToken,

    // id's of ticker which are already bought
    tickerIDs,

    // is modal or screen
    isModal,

    // investments
    investments,

    // goals
    goals,

    // is ssn added
    isssnAdded,

    // goal names
    goalNames
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
