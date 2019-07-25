/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 3/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change} from 'redux-form'
import Screen
  from '../../Components/Goals/SelectRisk'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {UserActions}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {

    case localActions.UPDATE_RISK:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      dispatch(UserActions.closeArticle(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  // update the risk selected
  // by the user in the form
  UPDATE_RISK: 'UPDATE_RISK'
}

const mapStateToProps = (state, props) => {
  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  let portfolioRisk = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.PORTFOLIO_RISK])

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // current risk index for portfolio
    portfolioRisk: portfolioRisk
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
