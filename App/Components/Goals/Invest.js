/* eslint-disable no-unused-vars,no-trailing-spaces,no-multiple-empty-lines,no-unexpected-multiline,operator-linebreak */
/**
 * Created by viktor on 5/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Dimensions, Modal, TouchableOpacity, ScrollView}
  from 'react-native'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from './Styles/RecurringInvestModal'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, BUTTON_TYPES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import LWButton
  from '../Utility/LWButton'
import Fonts
  from '../../Themes/Fonts'

// ========================================================
// Core Component
// ========================================================

class RecurringInvestModal extends Component {

  // -------------------------------------------------------
  // action handlers

  updateField (action, field, value) {
    const {handleLocalAction} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  invest () {
    var {handleLocalAction, localActions, parentNavigator, userID, isStale, childID, childIDs, goalID, recurringAmount, recurringFrequency} = this.props
    handleLocalAction({type: localActions.SUBMIT_RECURRING_AMOUNT,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [CHILD_ENTITIES.CHILD_IDs]: childIDs,
      [GOAL_ENTITIES.GID]: goalID,
      [COMMON_ENTITIES.NAVIGATOR]: parentNavigator,     // pass parent navigator instead of current navigator
      [COMMON_ENTITIES.IS_STALE]: isStale,
      [USER_ENTITIES.USER_ID]: userID,
      patch: {
        [GOAL_ENTITIES.RECURRING_FREQUENCY]: recurringFrequency,
        [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount
      }
    })
  }

  cancelCallback () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.CANCEL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // -------------------------------------------------------
  // child render methods

  renderDecisionBox () {
    return (
      <View style={styles.decisionBoxStyle}>
        <LWButton title='Cancel' buttonType={BUTTON_TYPES.DECISION_BUTTON} onPress={() => this.cancelCallback()} extraStyle={{width: 150, backgroundColor: 'rgb(230, 230, 230)'}} />
        <LWButton title='Confirm' buttonType={BUTTON_TYPES.DECISION_BUTTON} onPress={() => this.invest()} extraStyle={{width: 150, backgroundColor: 'rgb(230, 230, 230)'}} />
      </View>
    )
  }

  renderInnerContainer () {
    const {recurringFrequency, isProcessing} = this.props
    let frequency
    switch (recurringFrequency) {
      case 0: frequency = 'ONE OFF'
        break
      case 1: frequency = 'EVERY WEEK'
        break
      case 2: frequency = 'EVERY TWO WEEK'
        break
      default: frequency = 'EVERY WEEK'
    }
    return (
      <View style={styles.innerContainer}>

        <View style={styles.headingContainer}>
          <Text style={{fontFamily: Fonts.type.semibold, fontSize: Fonts.size.h2, color: '#FFF'}}>
            Confirm Investment
          </Text>
        </View>

        <View style={{...styles.amountHeaderContainer, marginTop: 30, marginBottom: 30}}>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 23, color: '#FFF'}}>
            ${this.props.recurringAmount}
          </Text>
        </View>

        {this.renderDecisionBox()}

      </View>
    )
  }

  // -------------------------------------------------------
  // main render methods

  render () {
    let {width} = Dimensions.get('window')
    return (
      <View style={{...styles.container, width: width - 16}}>
        {this.renderInnerContainer()}
      </View>
    )
  }
}

RecurringInvestModal.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  parentNavigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,

  // recurring amount of the goal
  recurringAmount: PropTypes.number,
  recurringFrequency: PropTypes.string,
  userID: PropTypes.string.isRequired,
  childID: PropTypes.string.isRequired,
  childIDs: PropTypes.array.isRequired,
  goalID: PropTypes.string.isRequired,
  isStale: PropTypes.bool.isRequired
}

RecurringInvestModal.defaultProps = {
}

// ========================================================
// Export
// ========================================================

export default RecurringInvestModal
