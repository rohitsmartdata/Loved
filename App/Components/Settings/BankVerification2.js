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
import { Alert, View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
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
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import Modal from 'react-native-modal'

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

class BankVerification2 extends Component {

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
    const { localActions, handleLocalAction, navigator, userID, selectedChild, fundingSourceReferenceID } = this.props
    let amount1 = parseFloat(data[USER_ENTITIES.FIRST_AMOUNT]).toFixed(3)
    let amount2 = parseFloat(data[USER_ENTITIES.SECOND_AMOUNT]).toFixed(3)
    let amount1Next = parseFloat(data[USER_ENTITIES.FIRST_AMOUNT_NEXT]).toFixed(3)
    let amount2Next = parseFloat(data[USER_ENTITIES.SECOND_AMOUNT_NEXT]).toFixed(3)
    if ((amount1 === amount1Next) && (amount2 === amount2Next)) {
      handleLocalAction({
        type: localActions.VERIFY_FUNDING_AMOUNT,
        [USER_ENTITIES.USER_ID]: userID,
        [CHILD_ENTITIES.CHILD_ID]: selectedChild && selectedChild[CHILD_ENTITIES.CHILD_ID] || undefined,
        [USER_ENTITIES.SOURCE_REFERENCE_ID]: fundingSourceReferenceID,
        [USER_ENTITIES.FIRST_AMOUNT]: parseFloat(amount1),
        [USER_ENTITIES.SECOND_AMOUNT]: parseFloat(amount2),
        [COMMON_ENTITIES.NAVIGATOR]: navigator
      })
    } else {
      Alert.alert('please match both amounts')
    }
  }

  hideModel () {
    const {hideModal} = this.props
    hideModal && hideModal(false, undefined)
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.FIRST_AMOUNT_NEXT:
        this.setState({ _firstAmountError: error })
        break
      case USER_ENTITIES.SECOND_AMOUNT_NEXT:
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
      case USER_ENTITIES.FIRST_AMOUNT_NEXT:
        if (val && val.trim() !== '' && val.trim() === val && !isNaN(parseFloat(val))) {
          this.markError(USER_ENTITIES.FIRST_AMOUNT_NEXT, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.FIRST_AMOUNT_NEXT, true)
          return 'FIRST AMOUNT REQ'
        }
      case USER_ENTITIES.SECOND_AMOUNT_NEXT:
        if (val && val.trim() !== '' && val.trim() === val && !isNaN(parseFloat(val))) {
          this.markError(USER_ENTITIES.SECOND_AMOUNT_NEXT, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.SECOND_AMOUNT_NEXT, true)
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
          Verify Next Amounts Received
        </Text>
        <Text style={{ ...styles.text.header, alignSelf: 'center', fontWeight: 'normal' }}>
          {`Please Verify the next two amounts deposited into your account ending in ${fundingSourceAccount.slice(-4)}`}
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
            name={USER_ENTITIES.FIRST_AMOUNT_NEXT}
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
            validate={val => this.validate(USER_ENTITIES.FIRST_AMOUNT_NEXT, val)}
          />
        </View>
        <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 15 }}>
          <Field
            name={USER_ENTITIES.SECOND_AMOUNT_NEXT}
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
            validate={val => this.validate(USER_ENTITIES.SECOND_AMOUNT_NEXT, val)}
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
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data), this)), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  renderMainComponent () {
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

  render () {
    const {isVisible} = this.props
    return (
      <View>
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', marginTop: 40, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onBackdropPress={() => this.hideModel()}
          onSwipe={() => this.hideModel()}
          swipeDirection='down'
          hideModalContentWhileAnimating
          scrollOffsetMax={300} // content height - ScrollView height
          isVisible={isVisible}>
          {this.renderMainComponent()}
        </Modal>
      </View>
    )
  }

}

BankVerification2.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  userID: PropTypes.string.isRequired,

  selectedChild: PropTypes.object,

  fundingSourceReferenceID: PropTypes.string,

  fundingSourceAccount: PropTypes.string
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(BankVerification2))

export default Screen
