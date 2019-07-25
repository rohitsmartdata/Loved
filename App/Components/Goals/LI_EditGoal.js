/* eslint-disable no-trailing-spaces,no-unused-vars,camelcase */
/**
 * Created by demon on 31/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, StatusBar, Text, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity}
  from 'react-native'
import Modal
  from 'react-native-modal'
import {reduxForm, Field}
  from 'redux-form'
import CustomNav
  from '../../Containers/Common/CustomNav'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, FREQUENCY, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import LWTextInput
  from '../Utility/LWFormInput'
import GravityCapsule
  from '../Utility/GravityCapsule'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
import _
  from 'lodash'
import EditableTextInput
  from '../../CommonComponents/editableTextInput'
import LI_Confirm
  from '../../Containers/Invest/LI_Confirm'
import MultiSwitch
  from '../../CommonComponents/SwitchButton/MultiSwitch'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.EDIT_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class LI_EditGoal extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.state = {
      showConfirmation: false
    }
  }

  componentWillMount () {
    const {goalName, goal} = this.props
    let amount = parseInt(goal[GOAL_ENTITIES.GOAL_AMOUNT], 10)
    this.updateGoalAmount(amount)
    this.updateGoalName(goalName)
  }

  // -------------------------------------------------------
  // action handlers

  _updateGoal (data) {
    const {handleLocalAction, localActions, navigator, goal, userID, childID} = this.props
    const nameValue = data[GOAL_ENTITIES.NAME] || goal[GOAL_ENTITIES.NAME]
    const targetValue = data[GOAL_ENTITIES.GOAL_AMOUNT] || goal[GOAL_ENTITIES.GOAL_AMOUNT]

    handleLocalAction({type: localActions.EDIT_GOAL,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goal[GOAL_ENTITIES.GID],
      [GOAL_ENTITIES.NAME]: nameValue,
      [GOAL_ENTITIES.GOAL_AMOUNT]: targetValue,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  updateField (action, field, value) {
    const {handleLocalAction} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.EDIT_GOAL, field: field, value: value}})
  }

  updateGoalAmount ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_GOAL_AMOUNT, GOAL_ENTITIES.GOAL_AMOUNT, Math.floor($))
  }

  updateGoalName (name) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_GOAL_NAME, GOAL_ENTITIES.NAME, name)
  }

  // -------------------------------------------------------
  // child render methods

  renderBodyHeader () {
    const {firstName, goalName} = this.props
    return (
      <View style={{marginTop: 20}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22}}>
          Change {firstName}'s investment into {goalName}?
        </Text>
      </View>
    )
  }

  textChangeListener ($) {
  }

  onSubmitEditing (text) {
    this.updateGoalAmount(text)
  }

  onNameEditing (name) {
    this.updateGoalName(name)
  }

  renderNameDisplay () {
    const {modifiedName} = this.props
    return (
      <View style={{
        marginTop: 18,
        marginHorizontal: 20,
        height: 54,
        borderWidth: 1,
        borderColor: '#9FB0C5',
        borderRadius: 50,
        paddingHorizontal: 10,
        justifyContent: 'center'
      }}>
        <Text
          style={{
            color: '#1C3C70',
            bottom: 0,
            fontFamily: Fonts.type.bold,
            fontSize: 27,
            width: '100%',
            textAlign: 'center'
          }}>{modifiedName}</Text>
      </View>
    )
  }

  renderAmountDisplay () {
    const {modifiedAmount} = this.props
    return (
      <View style={{marginTop: 18, marginHorizontal: 20}}>
        <Text style={{
          ...styles.screen.h2.textStyle,
          marginBottom: 5,
          textAlign: 'center',
          fontFamily: Fonts.type.semibold,
          color: '#1C3C70',
          fontSize: 17
        }}>
          To Reach
        </Text>
        <EditableTextInput
          value={modifiedAmount}
          textChangeListener={(text) => this.textChangeListener(text)}
          onSubmitEditing={(text) => this.onSubmitEditing(text)}
          minimumValue={1000}
          formatValue={formatPrice} />
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    return (
      <View style={{flex: 2, justifyContent: 'center'}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0}
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this._updateGoal(data)), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // -------------------------------------------------------
  // main render methods

  render () {
    const {isPlaidProcessing, goalName, navigator} = this.props
    let popFunction = () => this.props.popFunc()
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent gradientBackdrop titlePresent title={goalName} />
        <ProcessingIndicator isProcessing={isPlaidProcessing} />
        <StatusBar barStyle='light-content' />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <View style={{flex: 8}}>
            {this.renderNameDisplay()}
            {this.renderAmountDisplay()}
          </View>
          {this.renderNextButton()}
        </View>
      </View>
    )
  }
}

LI_EditGoal.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // pop function
  popFunc: PropTypes.func.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // goal id
  goalID: PropTypes.string.isRequired,

  // first name
  firstName: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // goal
  goal: PropTypes.object.isRequired,

  // modified name
  modifiedName: PropTypes.string.isRequired,

  // modified amount
  modifiedAmount: PropTypes.number.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_EditGoal))

export default Screen
