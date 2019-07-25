/* eslint-disable no-unused-vars,no-multi-spaces,no-trailing-spaces,key-spacing */
/**
 * Created by viktor on 31/5/17.
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
  from '../../Components/Goals/SelectInvestment'
import {GoalActions, getProducts, getGoals}
  from '../../Redux/Reducers/GoalReducer'
import {UserActions, getSelectedChild, getUserID}
  from '../../Redux/Reducers/UserReducer'
import {FORM_TYPES}
  from '../../Config/contants'
import {ChildActions, getChildren, getDOB, getFirstName, getImage, getImageUrl}
  from '../../Redux/Reducers/ChildReducer'
import {InvestmentActions, isProcessingProducts}
  from '../../Redux/Reducers/InvestmentReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type, payload} = action

  switch (type) {

    case localActions.SELECT_GOAL:
      dispatch(change(action['form'], GOAL_ENTITIES.PORTFOLIO_RISK, '02'))
      dispatch(change(action['form'], GOAL_ENTITIES.NAME, action[GOAL_ENTITIES.NAME]))
      if (action[CHILD_ENTITIES.CHILD_ID]) {
        dispatch(GoalActions.goalSelected(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.NAME], action[COMMON_ENTITIES.NAVIGATOR]))
      } else {
        dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR], false, true))
      }
      break

    case localActions.SELECT_CUSTOM_GOAL:
      dispatch(change(action['form'], GOAL_ENTITIES.PORTFOLIO_RISK, '02'))
      if (action[CHILD_ENTITIES.CHILD_ID]) {
        dispatch(GoalActions.goalSelected(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.NAME], action[COMMON_ENTITIES.NAVIGATOR]))
      } else {
        dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR], false, true))
      }
      break
    case localActions.SET_SELECTED_CHILD:
      dispatch(UserActions.setSelectedChild(action[USER_ENTITIES.SELECTED_CHILD]))
      break
    case localActions.FETCH_PRODUCTS:
      dispatch(InvestmentActions.fetchProducts())
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
  // fetch products
  FETCH_PRODUCTS: 'FETCH_PRODUCTS',

  // used for selecting goal type
  SELECT_GOAL : 'SELECT_GOAL',

  // select custom goal for user
  SELECT_CUSTOM_GOAL : 'SELECT_CUSTOM_GOAL',

  // set selected child
  SET_SELECTED_CHILD: 'setSelectedChild',

  // show settings
  SHOW_SETTINGS: 'showSettings'
}

const mapStateToProps = (state, props) => {
  // get user id
  const userID = getUserID(state.root.u)
  // get childID
  let childID = props[CHILD_ENTITIES.CHILD_ID]
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
  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal name
  let goalName = (valuesPresent && (state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME]))

  let products = getProducts(state.root.goals)

  let isFetchingProducts = isProcessingProducts(state.root.investments)
  let goals
  try {
    goals = selectedChild && getGoals(state.root.goals, selectedChild.childID)
  } catch (err) {
    console.log('error while accessing store :: ', err)
  }

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    // array of child objects {childID, firstName}
    childArr,

    // selected child object
    selectedChild,

    // defaulIndex
    defaultIndex,

    products,

    goalName: goalName,

    goals,

    isFetchingProducts,

    popButton: props[COMMON_ENTITIES.CAN_POP]
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
