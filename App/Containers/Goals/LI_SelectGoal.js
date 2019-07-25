/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 14/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {InvestmentActions, isProcessingProducts}
  from '../../Redux/Reducers/InvestmentReducer'
import {GoalActions, getProducts, getGoals}
  from '../../Redux/Reducers/GoalReducer'
import {getUserID, isUserSSNAdded, isStoreUserSSNProcessing}
  from '../../Redux/Reducers/UserReducer'
import { ChildActions, getFirstName, isSSNAdded }
  from '../../Redux/Reducers/ChildReducer'
import Screen
  from '../../Components/Goals/LI_SelectGoal'
import {events, errorKeywords}
  from '../../Utility/Mapper/Tracking'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.SELECT_GOAL: {
      dispatch(change(action['form'], GOAL_ENTITIES.NAME, action[GOAL_ENTITIES.NAME]))
      const isModal = action['isModal']
      if (isModal) {
        const pFunc = action['pushFunc']
        pFunc({[CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID], [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME]})
      } else {
        dispatch(GoalActions.selectGoalAmount(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      }
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.GOAL_CREATE_START,
        properties: {
          goal_name: action[GOAL_ENTITIES.NAME]
        }
      })
      // *********** Log Analytics ***********
    }
      break
    case localActions.POP:
      const popFunc = action['popFunc']
      popFunc()
      break
    case localActions.PUSH:
      const pushFunc = action['pushFunc']
      pushFunc()
      break
    case localActions.FETCH_PRODUCTS:
      dispatch(InvestmentActions.fetchProducts())
      break

    case localActions.SHOW_GOAL:
      dispatch(ChildActions.showGoal(
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        action[GOAL_ENTITIES.NAME],
        action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SELECT_GOAL: 'selectGoal',
  POP: 'pop',
  PUSH: 'push',
  FETCH_PRODUCTS: 'fetchProducts',
  SHOW_GOAL: 'SHOW_GOAL'
}

const mapStateToProps = (state, props) => {
  // products
  let products = getProducts(state.root.goals)
  // is fetching product
  let isFetchingProducts = isProcessingProducts(state.root.investments)

  // user id
  let userID = getUserID(state.root.u)
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child first name
  let firstname = getFirstName(state.root.children, childID)
  // is modal or screen
  let pushFunc = props['pushFunc']
  // is modal
  let isModal = pushFunc !== undefined
  // is user ssn added
  let userSSNAdded = isUserSSNAdded(state.root.u)
  // is store user ssn processing
  let userSSNStoreProcessing = isStoreUserSSNProcessing(state.root.u)

  let goals = childID && getGoals(state.root.goals, childID)
  let goalNames = []
  goals && goals.map(i => {
    let goalName = i[GOAL_ENTITIES.NAME]
    goalNames.push(goalName)
  })

  // is ssn added
  const isssnAdded = isSSNAdded(state.root.children, childID)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // user ssn added
    userSSNAdded,

    // is user ssn addition processing
    userSSNStoreProcessing,

    // child id
    childID: childID,

    // child's name
    firstName: firstname,

    // products
    products,

    // is fetching products.
    isFetchingProducts,

    // is modal
    isModal,

    // goal names
    goalNames,

    // is ssn added
    isssnAdded,
    goals
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
