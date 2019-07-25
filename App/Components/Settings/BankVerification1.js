/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import { reduxForm, Field, reset }
  from 'redux-form'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, BUTTON_TYPES, DEVICE_LOGICAL_RESOLUTION }
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import LWButton
  from '../Utility/LWButton'
import CustomNav from '../../Containers/Common/CustomNav'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import Toast from '../Common/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LWFormInput from '../Utility/LWFormInput'
import GravityCapsule from '../Utility/GravityCapsule'
import _ from 'lodash'
import { SPROUT } from '../../Utility/Mapper/Screens'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.BANK_DETAILS,
  destroyOnUnmount: false
})

class BankVerification1 extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _firstAmountError: false,
      _secondAmountError: false
    }
  }
  // --------------------------------------------------------
  // Action handlers

  navigateToNextScreen (data) {
    const { localActions, handleLocalAction, navigator } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_AMOUNT_VERIFICATION_SCREEN,
      [COMMON_ENTITIES.SCREEN_TYPE]: SPROUT.BANK_VERIFICATION_2,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.FIRST_AMOUNT:
        this.setState({ _firstAmountError: error })
        break
      case USER_ENTITIES.SECOND_AMOUNT:
        this.setState({ _secondAmountError: error })
        break
      default:
        this.setState({
          _firstAmountError: false,
          _secondAmountError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.FIRST_AMOUNT:
        if (val && val.trim() !== '' && val.trim() === val && !isNaN(parseFloat(val))) {
          this.markError(USER_ENTITIES.FIRST_AMOUNT, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.FIRST_AMOUNT, true)
          return 'FIRST AMOUNT REQ'
        }
      case USER_ENTITIES.SECOND_AMOUNT:
        if (val && val.trim() !== '' && val.trim() === val && !isNaN(parseFloat(val))) {
          this.markError(USER_ENTITIES.SECOND_AMOUNT, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.SECOND_AMOUNT, true)
          return 'SECOND AMOUNT REQ'
        }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const { fundingSourceAccount } = this.props
    return (
      <View style={{ ...styles.screen.h2.containerStyle }}>
        <Text style={{ ...styles.text.mainHeader, alignSelf: 'center', marginBottom: 20 }}>
          Verify Amounts Received
        </Text>
        <Text style={{ ...styles.text.header, alignSelf: 'center', fontWeight: 'normal' }}>
          {`Please Verify the amounts deposited\ninto your account ending in  ${fundingSourceAccount.slice(-4)}`}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit } = this.props
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{...styles.screen.textInput.parentContainerStyle}}>
          <Field
            name={USER_ENTITIES.FIRST_AMOUNT}
            accessible
            isLabel
            label='First amount in cent'
            accessibilityLabel={'First Amount'}
            accessibilityRole={'keyboardkey'}
            component={LWFormInput}
            focusSmoothly
            whiteBackground
            keyboardType='decimal-pad'
            returnKeyType='next'
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))}
            focus
            isError={this.state._firstAmountError}
            placeholderText='First amount in cent'
            validate={val => this.validate(USER_ENTITIES.FIRST_AMOUNT, val)}
          />
        </View>
        <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 15 }}>
          <Field
            name={USER_ENTITIES.SECOND_AMOUNT}
            component={LWFormInput}
            accessible
            isLabel
            label='Second amount in cent'
            whiteBackground
            accessibilityLabel={'Second Amount'}
            accessibilityRole={'keyboardkey'}
            keyboardType='decimal-pad'
            returnKeyType='next'
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))}
            isError={this.state._secondAmountError}
            placeholderText='Second amount in cent'
            validate={val => this.validate(USER_ENTITIES.SECOND_AMOUNT, val)}
          />
        </View>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 20 
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data)), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const { navigator } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Bank Verification' />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={120}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 0 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
      </View>
    )
  }

}

BankVerification1.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  userID: PropTypes.string.isRequired,

  fundingSourceAccount: PropTypes.string
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(BankVerification1))

export default Screen
