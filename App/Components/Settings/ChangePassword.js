/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 17/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {reduxForm, Field}
  from 'redux-form'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import globalStyle
  from '../../Themes/ApplicationStyles'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import GravityCapsule
  from '../Utility/GravityCapsule'
import LWTextInput
  from '../Utility/LWFormInput'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {validatePassword}
  from '../../Utility/Transforms/Validator'
import _ from 'lodash'
import Colors from '../../Themes/Colors'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.RESET_PASSWORD,
  destroyOnUnmount: false
})

let PASSWORD_FIELD: {
  CURRENT: 'current',
  NEW_1: 'new1',
  NEW_2: 'new2'
}

// ========================================================
// Core Component
// ========================================================

class ResetPassword extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showCurrentPassword: false,
      showNewPassword1: false,
      showNewPassword2: false,
      _currentPasswordError: false,
      _newPasswordError: false,
      _confirmNewPasswordError: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  // -------------------------------------------------------
  // Action Handlers

  toggleCurrentPassword1Visibility (field) {
    this.setState(prevstate => {
      return {showCurrentPassword: !prevstate.showCurrentPassword}
    })
  }

  toggleNewPassword1Visibility (field) {
    this.setState(prevstate => {
      return {showNewPassword1: !prevstate.showNewPassword1}
    })
  }

  toggleConfirmPassword1Visibility (field) {
    this.setState(prevstate => {
      return {showNewPassword2: !prevstate.showNewPassword2}
    })
  }

  hideError () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.HIDE_ERROR})
  }
  markError (inputType, error) {
    switch (inputType) {
      case AUTH_ENTITIES.PASSWORD:
        this.setState({_currentPasswordError: error})
        break
      case AUTH_ENTITIES.NEW_PASSWORD:
        this.setState({_newPasswordError: error})
        break
      case AUTH_ENTITIES.CONFIRM_NEW_PASSWORD:
        this.setState({_confirmNewPasswordError: error})
        break
      default:
        this.setState({
          _currentPasswordError: false,
          _newPasswordError: false,
          _confirmNewPasswordError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case AUTH_ENTITIES.PASSWORD:
        if (validatePassword(val)) {
          this.markError(AUTH_ENTITIES.PASSWORD, true)
          return 'MIN 6 Char pass needed'
        } else {
          this.markError(AUTH_ENTITIES.PASSWORD, false)
          return undefined
        }
      case AUTH_ENTITIES.NEW_PASSWORD:
        if (validatePassword(val)) {
          this.markError(AUTH_ENTITIES.NEW_PASSWORD, true)
          return 'MIN 6 Char pass needed'
        } else {
          this.markError(AUTH_ENTITIES.NEW_PASSWORD, false)
          return undefined
        }
      case AUTH_ENTITIES.CONFIRM_NEW_PASSWORD:
        if (validatePassword(val)) {
          this.markError(AUTH_ENTITIES.CONFIRM_NEW_PASSWORD, true)
          return 'MIN 6 Char pass needed'
        } else {
          this.markError(AUTH_ENTITIES.CONFIRM_NEW_PASSWORD, false)
          return undefined
        }
    }
  }

  next (data) {
    const {localActions, handleLocalAction, navigator, isProcessing, email} = this.props
    if (data[AUTH_ENTITIES.NEW_PASSWORD] !== data[AUTH_ENTITIES.CONFIRM_NEW_PASSWORD]) {
      Alert.alert('Password Mismatch',
        'Password does not match the confirm password.',
        [
          {text: 'OK', onPress: () => this.hideError()}
        ],
        { cancelable: false }
      )
    } else {
      handleLocalAction({
        type: localActions.INITIATE_CHANGE_PASSWORD,
        [AUTH_ENTITIES.EMAIL]: email,
        [AUTH_ENTITIES.NEW_PASSWORD]: data[AUTH_ENTITIES.NEW_PASSWORD],
        [AUTH_ENTITIES.PASSWORD]: data[AUTH_ENTITIES.PASSWORD],
        [COMMON_ENTITIES.NAVIGATOR]: navigator
      })
    }
  }

  // -------------------------------------------------------
  // Render children components

  renderFormContainer () {
    return (
      <View style={{...globalStyle.screen.containers.centeringContainer, marginTop: 30, paddingHorizontal: 20}}>
        <View style={{...globalStyle.screen.textInput.parentContainerStyle, marginTop: 20}}>
          <Field
            name={AUTH_ENTITIES.PASSWORD}
            isLabel
            label='Current password'
            whiteBackground
            accessible
            accessibilityLabel={'Current Password'}
            accessibilityRole={'keyboardkey'}
            component={LWTextInput}
            returnKeyType='next'
            onSubmitEditing={() => this.newpassword.getRenderedComponent().refs.newpassword.focus()}
            showIcon
            maxLength={20}
            iconName={this.state.showCurrentPassword ? 'visibility' : 'visibility-off'}
            iconCallback={() => this.toggleCurrentPassword1Visibility()}
            secureTextEntry={!this.state.showCurrentPassword}
            validate={val => this.validate(AUTH_ENTITIES.PASSWORD, val)}
            isError={this.state._currentPasswordError}
            placeholderText='Current Password' />
        </View>

        <View style={{...globalStyle.screen.textInput.parentContainerStyle, marginTop: 20}}>
          <Field
            name={AUTH_ENTITIES.NEW_PASSWORD}
            isLabel
            label='New password'
            whiteBackground
            accessible
            accessibilityLabel={'New Password'}
            accessibilityRole={'keyboardkey'}
            ref={(el) => { this.newpassword = el }}
            refField='newpassword'
            withRef
            component={LWTextInput}
            returnKeyType='next'
            onSubmitEditing={() => this.confirmnewpassword.getRenderedComponent().refs.confirmnewpassword.focus()}
            showIcon
            maxLength={20}
            iconName={this.state.showNewPassword1 ? 'visibility' : 'visibility-off'}
            iconCallback={() => this.toggleNewPassword1Visibility()}
            secureTextEntry={!this.state.showNewPassword1}
            placeholderText='New Password'
            validate={val => this.validate(AUTH_ENTITIES.NEW_PASSWORD, val)}
            isError={this.state._newPasswordError} />
        </View>

        <View style={{...globalStyle.screen.textInput.parentContainerStyle, marginTop: 20}}>
          <Field
            name={AUTH_ENTITIES.CONFIRM_NEW_PASSWORD}
            isLabel
            label='Confirm new password'
            whiteBackground
            accessible
            accessibilityLabel={'Confirm New Password'}
            accessibilityRole={'keyboardkey'}
            ref={(el) => { this.confirmnewpassword = el }}
            returnKeyType='done'
            refField='confirmnewpassword'
            withRef
            component={LWTextInput}
            showIcon
            maxLength={20}
            iconName={this.state.showNewPassword2 ? 'visibility' : 'visibility-off'}
            iconCallback={() => this.toggleConfirmPassword1Visibility()}
            secureTextEntry={!this.state.showNewPassword2}
            placeholderText='Confirm New Password'
            validate={val => this.validate(AUTH_ENTITIES.CONFIRM_NEW_PASSWORD, val)}
            isError={this.state._confirmNewPasswordError} />
        </View>
      </View>
    )
  }

  renderNextButton () {
    const {handleSubmit, isProcessing} = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Change Password'}
          accessibilityRole={'button'}
          style={{ 
            ...globalStyle.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 20 
          }}
          onPress={handleSubmit((data) => this.next(data))}
        >
          <Text style={globalStyle.bottomNavigator.textStyle}>CHANGE PASSWORD</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  // -------------------------------------------------------
  // render Core component

  render () {
    const {errorObj, navigator} = this.props
    if (errorObj) {
      Alert.alert(errorObj.code,
        'Incorrect password.',
        [
          {text: 'OK', onPress: () => this.hideError()}
        ],
        { cancelable: false }
      )
    }
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Change Password' />
        <ProcessingIndicator isProcessing={this.props.isProcessing} />
        {this.renderFormContainer()}
        {this.renderNextButton()}
      </View>
    )
  }

}

ResetPassword.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,

  email: PropTypes.string.isRequired,

  errorObj: PropTypes.object
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(ResetPassword))

export default Screen
