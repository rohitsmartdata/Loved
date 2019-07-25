/* eslint-disable no-unused-vars,no-trailing-spaces,no-multi-spaces,operator-linebreak */
/**
 * Created by viktor on 19/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, LayoutAnimation, TextInput }
  from 'react-native'
import { reduxForm, Field }
  from 'redux-form'
import { connect }
  from 'react-redux'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import Fonts
  from '../../Themes/Fonts'
import { FORM_TYPES }
  from '../../Config/contants'
import LWTextInput
  from '../Utility/LWFormInput'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import styles
  from '../../Themes/ApplicationStyles'
import GravityCapsule
  from '../Utility/GravityCapsule'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.EDIT_GOAL,
  destroyOnUnmount: false,
  enableReinitialize: true
})

// ========================================================
// Core Component
// ========================================================

class EditGoal extends Component {

  // ------------------------------------------------------------
  // Life cycle methods

  constructor (props) {
    super(props)
    const { goal } = props
    this.state = {
      nameValue: goal && goal[GOAL_ENTITIES.NAME],
      targetValue: goal && parseInt(goal[GOAL_ENTITIES.GOAL_AMOUNT], 10).toFixed(2).toString(),
      _goalAmountError: false
    }
  }
  componentWillMount () {
    this.props.initialize()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  validate (val) {
    if (val <= 0) {
      this.setState({
        _goalAmountError: true
      })
    } else {
      this.setState({
        _goalAmountError: false
      })
    }
  }
  // ------------------------------------------------------------
  // Core component

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle }}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20}}>
          Edit goal information ?
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {nameValue, targetValue} = this.state
    return (
      <View style={{ marginTop: 30 }}>
        <View>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 12, color: '#000'}}>
            Goal Name
          </Text>
          <View style={{...styles.screen.textInput.parentContainerStyle}}>
            <Field
              name={GOAL_ENTITIES.NAME}
              accessible
              whiteBackground
              accessibilityLabel={'Goal Name'}
              accessibilityRole={'keyboardkey'}
              returnKeyType='next'
              component={LWTextInput}
              focusSmoothly
              placeholderText={nameValue}
              extraStyle={{ marginRight: 4 }}
            />
          </View>
        </View>

        <View style={{marginTop: 50}}>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 12, color: '#000'}}>
            Goal Target
          </Text>
          <View style={{...styles.screen.textInput.parentContainerStyle}}>
            <Field
              name={GOAL_ENTITIES.GOAL_AMOUNT}
              maxLength={6}
              accessible
              whiteBackground
              validate={val => this.validate(val)}
              accessibilityLabel={'Goal Amount'}
              accessibilityRole={'keyboardkey'}
              component={LWTextInput}
              returnKeyType='next'
              placeholderText={targetValue}
              isError={this.state._goalAmountError}
              keyboardType='number-pad'
              onDemandError
            />
          </View>
        </View>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Confirm'}
          accessibilityRole={'button'}
          style={styles.bottomNavigator.containerStyle}
          onPress={handleSubmit(data => this._updateGoal(data))}
          disabled={this.state._goalAmountError}
        >
          <Text style={styles.bottomNavigator.textStyle}>Confirm</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

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

  render () {
    const {isProcessing, firstname, goalname} = this.props
    let title = firstname + '\'s ' + goalname
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <CustomNav navigator={this.props.navigator} leftButtonPresent titlePresent title={title} />
        <View style={{flex: 1, paddingHorizontal: 16}}>
          {this.renderHeading()}
          {this.renderFormContainer()}
          {this.renderNextButton()}
        </View>
      </View>
    )
  }

}

EditGoal.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // goal ID
  goalID: PropTypes.string.isRequired,
  // child ID
  childID: PropTypes.string.isRequired,

  firstname: PropTypes.string,
  goalname: PropTypes.string

}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(EditGoal))

export default Screen
