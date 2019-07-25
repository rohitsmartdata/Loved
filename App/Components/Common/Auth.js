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
import { View, Text, TextInput, Alert, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, Image, ImageBackground, ActivityIndicator, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { reduxForm, Field, change, stopSubmit }
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
import Fonts
  from '../../Themes/Fonts'
import LWTextInput
  from '../Utility/LWFormInput'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {validateEmail, validatePassword, validatePasswordSchema}
  from '../../Utility/Transforms/Validator'
import _
  from 'lodash'
import Colors from '../../Themes/Colors'
import { localActions } from '../../Containers/Common/Auth'
import { Icon } from 'react-native-elements'
import * as Constants from '../../Themes/Constants'
import { AgeInstruction } from '../../CommonComponents/AgeInstruction'
import { events } from '../../Utility/Mapper/Tracking'
import { analytics } from '../../Config/AppConfig'
import UUIDGenerator from 'react-native-uuid-generator'
// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.AUTH,
  destroyOnUnmount: false
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
      showPassword: false,
      _emailError: false,
      _passwordError: false,
      passwordSchema: undefined,
      showError: false,
      showAgeInstruction: false,
      emailEvent: 0,
      passwordEvent: 0
    }
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
    this.uid = 0
  }

  // --------------------------------------------------------
  // Action handlers
  componentWillUnmount () {
    const {localActions, handleLocalAction} = this.props
    handleLocalAction({
      type: localActions.ON_BACK
    })
  }

  componentWillMount () {
    UUIDGenerator.getRandomUUID((uuid) => {
      this.uid = uuid
    })
  }

  closeModal () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.CLOSE_MODAL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  togglePasswordVisibility () {
    this.setState(prevstate => {
      return {showPassword: !prevstate.showPassword}
    })
  }

  toggleAgeInstruction (show) {
    this.setState({showAgeInstruction: show})
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
      case AUTH_ENTITIES.PASSWORD:
        this.setState({_passwordError: error})
        break
      default:
        this.setState({
          _emailError: false,
          _passwordError: false
        })
    }
  }

  markPasswordSchema (val) {
    let schema = validatePasswordSchema(val)
    this.setState({passwordSchema: schema})
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
      case AUTH_ENTITIES.PASSWORD:
        // this.markPasswordSchema(val)
        let passwordError = validatePassword(val)
        if (passwordError) {
          this.markError(AUTH_ENTITIES.PASSWORD, true)
          return passwordError
        } else {
          this.markError(AUTH_ENTITIES.PASSWORD, false)
          return undefined
        }
    }
  }

  navigateToNext (data) {
    const {localActions, handleLocalAction, navigator} = this.props
    this.setState({ showError: true })
    let email = data && data[AUTH_ENTITIES.EMAIL] && data[AUTH_ENTITIES.EMAIL].toLowerCase()
    handleLocalAction({
      type: localActions.SIGNUP,
      [AUTH_ENTITIES.EMAIL]: email,
      [AUTH_ENTITIES.PASSWORD]: data[AUTH_ENTITIES.PASSWORD],
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      'uid': this.uid
    })
  }

  resetEmail () {
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({
      type: localActions.FORGOT_PASSWORD,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, marginTop: 37}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: Colors.white, lineHeight: 28, fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          Hey there!
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: Colors.white, lineHeight: 23, fontSize: 18, textAlign: 'center', marginHorizontal: 10 }}>
          Investing for kids starts with you, the adult, so let’s get started!
        </Text>
      </View>
    )
  }

  clearField (field) {
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({
      type: localActions.REMOVE_VALUE,
      form: FORM_TYPES.AUTH,
      field: field,
      value: ''
    })
  }

  identifyUser () {
    analytics.identify({
      userId: this.uid
    })
  }

  triggerEnterEvent (from) {
    // this.identifyUser()
    // let event = from === 'email' ? events.SIGNUP_EMAIL : events.SIGNUP_PASSWORD
    // // *********** Log Analytics ***********
    // analytics.track({
    //   userId: this.uid,
    //   event: event
    // })
    // // *********** Log Analytics ***********
  }

  renderFormContainer () {
    const {handleSubmit, showPasswordError} = this.props
    const error = (showPasswordError && this.state._passwordError)
    let subtitle = error ? 'Sorry, your password must be at least 8 characters long, contain an uppercase letter and a number.' : 'For security, a minimum of 8 characters, an uppercase letter and a number.'
    return (
      <View>
        <View style={{...styles.screen.textInput.parentContainerStyle, backgroundColor: Colors.white, borderRadius: 5}}>
          <Field
            name={AUTH_ENTITIES.EMAIL}
            isLabel
            label='Email'
            whiteBackground
            accessible
            accessibilityLabel={'Email'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='next'
            onSubmitEditing={() => this.password.getRenderedComponent().refs.password.focus()}
            autoCapitalize='none'
            component={LWTextInput}
            leftIcon
            leftIconName='mail-outline'
            placeholderText='Email'
            keyboardType='email-address'
            validate={val => this.validate(AUTH_ENTITIES.EMAIL, val)}
            isError={this.state._emailError}
            onChange={(text) => {
              // if (text && text.length === 1) {
              //   this.triggerEnterEvent('email')
              // }
            }}
            maxLength={39}
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Age Instruction'}
          accessibilityRole={'button'}
          onPress={() => this.togglePasswordVisibility()}>
          <Text style={{...styles.text.information, alignSelf: 'flex-end', color: Colors.white, marginRight: 10, fontSize: 11, lineHeight: 14}}>
            Show Password
          </Text>
        </TouchableOpacity>
        <View style={{...styles.screen.textInput.parentContainerStyle, marginTop: 5, backgroundColor: Colors.white, borderRadius: 5}}>
          <Field
            name={AUTH_ENTITIES.PASSWORD}
            isLabel
            label='Password'
            whiteBackground
            accessible
            accessibilityLabel={'password'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='done'
            ref={(el) => { this.password = el }}
            withRef
            component={LWTextInput}
            refField='password'
            showIcon={showPasswordError}
            iconName={error ? 'clear' : 'done'}
            iconCallback={() => error && this.clearField(AUTH_ENTITIES.PASSWORD)}
            iconColor={error ? Colors.switchOff : Colors.appColor}
            iconSize={18}
            secureTextEntry={!this.state.showPassword}
            placeholderText='Password'
            validate={val => this.validate(AUTH_ENTITIES.PASSWORD, val)}
            isError={this.state._passwordError}
            extraTextStyle={{fontSize: (this.state.showPassword) ? 16 : 15}}
            extraStyle={{borderColor: error ? Colors.switchOff : Colors.appColor}}
            onChange={(text) => {
              // if (text && text.length === 1) {
              //   this.triggerEnterEvent('password')
              // }
            }} />
          />
        </View>
        <Text style={{ ...styles.text.title, fontFamily: Fonts.type.book, textAlign: 'left', color: (error) ? Colors.switchOff : Colors.fontGray, marginHorizontal: 15, fontSize: 14, lineHeight: 18 }}>
          {subtitle}
        </Text>
      </View>
    )
  }

  renderAgeInstruction () {
    const isX = this.isX || false
    return (
      <TouchableOpacity
        activeOpacity={1}
        accessible
        accessibilityLabel={'Age Instruction'}
        accessibilityRole={'button'}
        onPress={() => this.toggleAgeInstruction(true)}>
        <Text style={{marginBottom: isX ? 110 : 100, color: Colors.white, fontSize: 18, lineHeight: 23, fontFamily: Fonts.type.book, textAlign: 'center'}}>
          Are you under the age of 18?
        </Text>
      </TouchableOpacity>
    )
  }

  renderNextButton () {
    const {handleSubmit, isProcessing} = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          disabled={isProcessing}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 42
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNext(data)), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.darkBlue}}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  renderCloseButton () {
    const isX = this.isX || false
    let topMargin = isX ? 30 : 22
    let headerHeight = isX ? 80 : 70
    const {hideModal} = this.props
    return (
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, paddingLeft: 9, paddingTop: topMargin, height: headerHeight, flexDirection: 'row'}}>
        <TouchableOpacity style={{left: 20, top: 10, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}} onPress={() => hideModal()}>
          <Icon name='ios-close' type='ionicon' color={Colors.white} size={40} />
        </TouchableOpacity>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isProcessing} = this.props
    let email = this.props[AUTH_ENTITIES.EMAIL]
    // if (errorObj) {
    //   Alert.alert(errorObj.code,
    //     errorObj.message,
    //     [
    //       {text: 'OK', onPress: () => this.hideError()}
    //     ],
    //     { cancelable: false }
    //   )
    // }
    //
    const imageMarginTop = (Constants.screen.height * 80) / 812
    const isX = this.isX || false
    let headerHeight = isX ? 80 : 70

    return (
      <ImageBackground style={{...styles.screen.containers.root}} source={require('../../../Img/appBackground.png')}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <KeyboardAwareScrollView
          contentContainerStyle={{...styles.screen.containers.keyboard, backgroundColor: 'transparent', paddingTop: headerHeight}}
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={30}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Image source={require('../../../Img/assets/onboard/appLogo/logo.png')} style={{alignSelf: 'center', marginTop: imageMarginTop}} />
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderAgeInstruction()}
        {this.renderNextButton()}
        <AgeInstruction showModal={this.state.showAgeInstruction} toggleModal={this.toggleAgeInstruction.bind(this)} />
        {this.renderCloseButton()}
      </ImageBackground>
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
  heading: PropTypes.string.isRequired,

  showPasswordError: PropTypes.bool,

  hideModal: PropTypes.func.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(Auth))

export default Screen
