/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 7/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, Dimensions, TouchableOpacity }
  from 'react-native'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {reduxForm, Field}
  from 'redux-form'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule
  from '../Utility/GravityCapsule'
import LWCustomTextInput
  from '../Utility/LWFormInput'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {validateEmail, validatePassword, validatePasswordSchema}
  from '../../Utility/Transforms/Validator'
import _
  from 'lodash'
import { Icon }
  from 'react-native-elements'
import Colors
  from '../../Themes/Colors'
import Fonts
  from '../../Themes/Fonts'
import { AgeInstruction } from '../../CommonComponents/AgeInstruction'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.AUTH,
  destroyOnUnmount: false,
  enableReinitialize: true
})

// ========================================================
// Core Component
// ========================================================

class Auth extends Component {

  // --------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      _emailError: false,
      showAgeInstruction: false
    }
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  // --------------------------------------------------------
  // Action handlers

  componentWillMount () {
    this.props.initialize()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  hideError () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.HIDE_ERROR})
  }

  markError (inputType, error) {
    switch (inputType) {
      case AUTH_ENTITIES.EMAIL:
        this.setState({_emailError: error})
        break
      default:
        this.setState({ _emailError: false })
    }
  }

  validate (type, val) {
    switch (type) {
      case AUTH_ENTITIES.EMAIL:
        if (validateEmail(val)) {
          this.markError(AUTH_ENTITIES.EMAIL, true)
          return 'Correct Email Needed'
        } else {
          this.markError(AUTH_ENTITIES.EMAIL, false)
          return undefined
        }
    }
  }

  navigateToNext (data) {
    const {localActions, handleLocalAction, handleSubmit, navigator, isProcessing, type} = this.props
    handleLocalAction({
      type: localActions.NAVIGATE,
      [AUTH_ENTITIES.EMAIL]: data[AUTH_ENTITIES.EMAIL],
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  navigateToForgotPassword () {
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({
      type: localActions.FORGOT_PASSWORD,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  toggleAgeInstruction (show) {
    this.setState({showAgeInstruction: show})
  }
  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          Hey there!
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center', marginHorizontal: 20 }}>
          Investing for kids starts with you so your email address please?
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {handleSubmit, type} = this.props
    return (
      <View style={styles.screen.textInput.parentContainerStyle}>
        <Field
          name={AUTH_ENTITIES.EMAIL}
          isLabel
          label='Email'
          whiteBackground
          accessible
          accessibilityLabel={'Email'}
          accessibilityRole={'keyboardkey'}
          returnKeyType='next'
          onSubmitEditing={handleSubmit(data => this.navigateToNext(data))}
          autoCapitalize='none'
          component={LWCustomTextInput}
          leftIcon
          leftIconName='mail-outline'
          placeholderText='Email'
          keyboardType='email-address'
          validate={val => this.validate(AUTH_ENTITIES.EMAIL, val)}
          isError={this.state._emailError} 
          maxLength={39} />
      </View>
    )
  }

  renderAgeInstruction () {
    const isX = this.isX || false
    return (
      <TouchableOpacity
        activeOpacity={1}
        accessible
        accessibilityLabel={'Continue'}
        accessibilityRole={'button'}
        onPress={() => this.toggleAgeInstruction(true)}>
        <Text style={{marginBottom: isX ? 110 : 100, color: Colors.blue, fontSize: 18, lineHeight: 23, fontFamily: Fonts.type.book, textAlign: 'center'}}>
          Are you under the age of 18?
        </Text>
      </TouchableOpacity>
    )
  }
  renderNextButton () {
    const {handleSubmit, type, isProcessing} = this.props
    const isX = this.isX || false

    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          disabled={isProcessing}
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 20 
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNext(data)), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {errorObj, isProcessing, type, navigator} = this.props
    if (errorObj) {
      Alert.alert(errorObj.code,
        errorObj.message,
        [
          {text: 'OK', onPress: () => this.hideError()}
        ],
        { cancelable: false }
      )
    }

    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent customIcon={<Icon name='ios-close' type='ionicon' containerStyle={{left: 10}} color={Colors.white} size={40} />} title={'Sign up'} titlePresent />
        <ProcessingIndicator isProcessing={isProcessing} />
        <KeyboardAwareScrollView
          contentContainerStyle={styles.screen.containers.keyboard}
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderAgeInstruction()}
        {this.renderNextButton()}
        <AgeInstruction showModal={this.state.showAgeInstruction} toggleModal={this.toggleAgeInstruction.bind(this)} />
      </View>
    )
  }

}

Auth.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,

  // type of authentication 'Login' or 'SignUp'
  type: PropTypes.string.isRequired,

  // heading as per signup/login
  heading: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(Auth))

export default Screen
