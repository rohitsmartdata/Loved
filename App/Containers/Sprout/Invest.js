/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 10/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Sprout/Invest'
import {ChildActions, getChildren, getTotalPortfolioValue, getFamilyGrowth}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.ADD_NEW_GOAL:
      dispatch(ChildActions.addNewGoal(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_NEW_GOAL: 'addNewChild'
}

const mapStateToProps = (state, props) => {
  // user ID
  let userID = getUserID(state.root.u)
  // children's of user
  let children = getChildren(state.root.children)
  // total portfolio value
  let totalPortfolioValue = getTotalPortfolioValue(state.root.children)
  // family growth values
  let familyGrowth = getFamilyGrowth(state.root.children)

  let childArr = []
  Object.values(children).map(child => childArr.push(child))

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // children object
    childArr: childArr,
    // total portfolio value
    totalPortfolioValue: totalPortfolioValue,
    // growth value of family
    growthValue: (familyGrowth && familyGrowth[CHILD_ENTITIES.GROWTH_IN_VALUE]) || 0,
    // growth percentage of family
    growthPercentage: (familyGrowth && familyGrowth[CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]) || 0,
    // user id
    userID: userID
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
