/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 25/4/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import moment
  from 'moment'
import Screen
  from '../../Components/Invest/AddInvestment'
import {FORM_TYPES}
  from '../../Config/contants'
import {getChildren, getDOB, getFirstName, getImageUrl, getImage}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, UserActions, getSelectedChild}
  from '../../Redux/Reducers/UserReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {
  InvestmentActions, getProducts, isProcessingProducts, getInvestments
}
  from '../../Redux/Reducers/InvestmentReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type} = action

  switch (type) {
    case localActions.INVESTMENT_SELECTED:
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_RISK_ID, action[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]))
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_NAME, action[INVESTMENT_ENTITIES.INVESTMENT_NAME]))
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_AMOUNT, 20))
      dispatch(InvestmentActions.investmentSelected(
        action[CHILD_ENTITIES.CHILD_ID],
        action[INVESTMENT_ENTITIES.PRODUCT],
        action[COMMON_ENTITIES.NAVIGATOR],
        action[INVESTMENT_ENTITIES.IS_DISPLAY_ONLY],
        action[INVESTMENT_ENTITIES.INVESTMENT_INTERNAL_ID],
        action[INVESTMENT_ENTITIES.INVESTMENT_ID],
        action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
        action[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT],
        action[INVESTMENT_ENTITIES.IS_RECURRENCE_INVESTMENT_EXIST]
    ))
      break
    case localActions.FETCH_PRODUCTS:
      dispatch(InvestmentActions.fetchProducts())
      break
    case localActions.SET_SELECTED_CHILD:
      dispatch(UserActions.setSelectedChild(action[USER_ENTITIES.SELECTED_CHILD]))
      break
    case localActions.SHOW_SETTINGS:
      dispatch(SettingActions.showSettings(action[COMMON_ENTITIES.NAVIGATOR]))
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
  FETCH_PRODUCTS: 'FETCH_PRODUCTS',
  SET_SELECTED_CHILD: 'setSelectedChild',
  SHOW_SETTINGS: 'showSettings'
}

const mapStateToProps = (state, props) => {
  // get user id
  const userID = getUserID(state.root.u)
  // get childID
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // firstname of child
  let firstname = props[CHILD_ENTITIES.FIRST_NAME]
  // can pop the screen
  let popButton = props[COMMON_ENTITIES.CAN_POP]
  // is adding fresh dream
  let isFresh = props['isAddingNewDream'] || false
  // selected child
  let selectedID = getSelectedChild(state.root.u)

  let childArr = {}
  if (childID) {
    // child's firstname
    const firstName = getFirstName(state.root.children, childID)
    const childDOB = getDOB(state.root.children, childID)
    let age = 0
    if (childDOB) {
      let birthDate = moment(childDOB, 'YYYY-MM-DD')
      let currentDate = moment()
      age = currentDate.diff(birthDate, 'y')
    }
    childArr[childID] = {childID: childID, firstname: firstName, age: age}
  } else {
    let children = getChildren(state.root.children)
    let childIDs = (children && Object.keys(children)) || []
    childIDs.map(id => {
      let firstName = getFirstName(state.root.children, id)
      const childDOB = getDOB(state.root.children, id)
      let childImageUrl = getImageUrl(state.root.children, id)
      let childImage = getImage(state.root.children, id)
      let age = 0
      if (childDOB) {
        let birthDate = moment(childDOB, 'YYYY-MM-DD')
        let currentDate = moment()
        age = currentDate.diff(birthDate, 'y')
      }
      childArr[id] = {childID: id, firstname: firstName, age: age, imageUrl: childImageUrl, childImage: childImage}
    })
  }

  // default index the picker will point to
  const defaultIndex = 0

  let childObjects = Object.values(childArr)
  // selected child using default index
  let selectedChild = (selectedID && childArr[selectedID]) || (childObjects && childObjects[defaultIndex])

  // are form values present ?
  let valuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  // goal name
  let investmentName = (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_NAME]))

  // get products
  let products = getProducts(state.root.investments)
  let investments
  try {
    investments = selectedChild && getInvestments(state.root.investments, selectedChild.childID)
  } catch (err) {
    console.log('error while accessing store :: ', err)
  }
  // fetching products
  let processingProducts = isProcessingProducts(state.root.investments)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    // firstname
    firstname,

    // array of child objects {childID, firstName}
    childArr,

    // selected child object
    selectedChild,

    // defaulIndex
    defaultIndex,

    popButton,

    investmentName,

    investments,

    isFresh,

    products,

    processingProducts
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
