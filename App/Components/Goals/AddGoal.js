/* eslint-disable no-unused-vars,no-multi-spaces,no-trailing-spaces,indent */
/**
 * Created by viktor on 31/5/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TextInput, ActivityIndicator, ScrollView }
  from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import styles
  from '../../Themes/ApplicationStyles'
import {FORM_TYPES}
  from '../../Config/contants'
import { connect }
  from 'react-redux'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, BUTTON_TYPES}
  from '../../Utility/Mapper/Common'
import GravityCapsule
  from '../Utility/GravityCapsule'
import LWButton
  from '../Utility/LWButton'
import LWTextInput
  from '../Utility/LWFormInput'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class AddGoal extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _goalNameError: false
    }
  }

  // --------------------------------------------------------
  // Action handlers

  markError (inputType, error) {
    switch (inputType) {
      case GOAL_ENTITIES.NAME:
        this.setState({_goalNameError: error})
        break
      default:
        this.setState({
          _firstNameError: false,
          _lastNameError: false,
          _DOBError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case GOAL_ENTITIES.NAME:
        if (val) {
          this.markError(GOAL_ENTITIES.NAME, false)
          return undefined
        } else {
          this.markError(GOAL_ENTITIES.NAME, true)
          return 'FIRST NAME REQ'
        }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHorizontalLine () {
    return (
      <View style={styles.screen.horizontalLine.containerStyle}>
        <View style={styles.screen.horizontalLine.lineStyle} />
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={styles.screen.h1.containerStyle}>
        <Text style={styles.screen.h1.textStyle}>
          Set your goal for {this.props.firstName}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    return (
      <View style={{marginTop: 65, paddingLeft: 20, paddingRight: 20}}>
        <View style={styles.screen.textInput.parentContainerStyle}>
          <Field name={GOAL_ENTITIES.NAME} accessible accessibilityLabel={'Goal Name'} accessibilityRole={'keyboardkey'} component={LWTextInput} placeholderText='i.e. Trip to Disneyland' isError={this.state._goalNameError} validate={val => this.validate(GOAL_ENTITIES.NAME, val)} />
        </View>
      </View>
    )
  }

  renderNextButton () {
    const {localActions, handleSubmit, handleLocalAction, userID, firstName, navigator, childID} = this.props
    return (
      <GravityCapsule floatValue={16}>
        <View style={styles.screen.containers.centeringContainer}>
          <LWButton
            title='Next'
            onPress={handleSubmit((data) => {
              handleLocalAction({type: localActions.ADD_GOAL,
                [CHILD_ENTITIES.CHILD_ID]: childID,
                [GOAL_ENTITIES.NAME]: data[GOAL_ENTITIES.NAME],
                [CHILD_ENTITIES.FIRST_NAME]: firstName,
                [COMMON_ENTITIES.NAVIGATOR]: navigator,
                [USER_ENTITIES.USER_ID]: userID
              })
            })}
            buttonType={BUTTON_TYPES.DECISION_BUTTON}
            extraStyle={{width: 300, height: 50, backgroundColor: 'rgb(0, 174, 112)'}}
          />
        </View>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isProcessing} = this.props
    return (
      <ScrollView
        scrollEnabled={false}
        keyboardDismissMode='interactive'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{...styles.screen.containers.root, paddingLeft: 20, paddingRight: 20, backgroundColor: '#FFF'}}
      >
        <ProcessingIndicator isProcessing={isProcessing} />
        {this.renderHeading()}
        {this.renderFormContainer()}
        {this.renderNextButton()}
      </ScrollView>
    )
  }

}

AddGoal.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // childs name
  firstName: PropTypes.string.isRequired,

  childID: PropTypes.string.isRequired,

  userID: PropTypes.string.isRequired,

  isProcessing: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(AddGoal))

export default Screen
