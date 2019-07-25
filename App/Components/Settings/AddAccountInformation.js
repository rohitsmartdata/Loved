/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/6/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { Alert, Keyboard, View, Text, Dimensions, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import Options from '../../CommonComponents/Options'
import Colors from '../../Themes/Colors'
import _ from 'lodash'
import { SPROUT } from '../../Utility/Mapper/Screens'
import { Field, reduxForm } from 'redux-form'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import LWFormInput from '../Utility/LWFormInput'
import GravityCapsule from '../Utility/GravityCapsule'
import { FORM_TYPES } from '../../Config/contants'
import connect from 'react-redux/es/connect/connect'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { analytics } from '../../Config/AppConfig'
import {screens, events} from '../../Utility/Mapper/Tracking'

const optionData = [
  {
    detail: 'Checking',
    value: 'checking'
  },
  {
    detail: 'Savings',
    value: 'savings'
  }
]

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

class AddAccountInformation extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selectedIndex: undefined,
      _accountNumberError: false,
      _confirmAccountNumberError: false
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.ENTER_ACCOUNT_NUMBER
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers
  validateAccotunNo (accNo) {
    let regx = /^0+$/g
    return regx.test(accNo)
  }

  navigateToNextScreen (data) {
    const {localActions, handleLocalAction, navigator, formData, userID} = this.props
    if (this.validateAccotunNo(data[USER_ENTITIES.BANK_ACCOUNT_NUMBER]) || this.validateAccotunNo(data[USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER])) {
      Alert.alert('Enter Valid Account Number.')
    } else if (data[USER_ENTITIES.BANK_ACCOUNT_NUMBER] !== data[USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER]) {
      Alert.alert('not matched')
    } else {
      Keyboard.dismiss()
      handleLocalAction({
        type: localActions.SETUP_BANK_ACCOUNT,
        [COMMON_ENTITIES.SCREEN_TYPE]: undefined,
        [USER_ENTITIES.USER_ID]: userID,
        [USER_ENTITIES.BANK_ACCOUNT_TYPE]: data[USER_ENTITIES.BANK_ACCOUNT_TYPE],
        [USER_ENTITIES.BANK_ROUTING_NUMBER]: data[USER_ENTITIES.BANK_ROUTING_NUMBER],
        [USER_ENTITIES.BANK_ACCOUNT_NUMBER]: data[USER_ENTITIES.BANK_ACCOUNT_NUMBER],
        [COMMON_ENTITIES.NAVIGATOR]: navigator
      })
    }
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.BANK_ACCOUNT_NUMBER:
        this.setState({_accountNumberError: error})
        break
      case USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER:
        this.setState({_confirmAccountNumberError: error})
        break
      default:
        this.setState({
          _routingNumberError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.BANK_ACCOUNT_NUMBER:
        if (val && val.trim() && val.trim() !== null) {
          this.markError(USER_ENTITIES.BANK_ACCOUNT_NUMBER, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.BANK_ACCOUNT_NUMBER, true)
          return 'Account Number Required'
        }
      case USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER:
        if (val && val.trim() && val.trim() !== null) {
          this.markError(USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER, true)
          return 'both numbers should match'
        }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center'}}>
        <Text style={{ ...styles.text.mainHeader, marginBottom: 20 }}>
          {'What is your account number?'}
        </Text>
        <Text style={{ ...styles.text.header, alignSelf: 'center', fontWeight: 'normal' }}>
          {'You can find this number on your bank\naccount statement online.'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit } = this.props
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{...styles.screen.textInput.parentContainerStyle, marginBottom: 25}}>
          <Field
            accessible accessibilityLabel={'Bank Account Number'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.BANK_ACCOUNT_NUMBER}
            component={LWFormInput}
            keyboardType='number-pad'
            isLabel
            label='Account Number'
            placeholderText='Account Number'
            returnKeyType='next'
            whiteBackground
            isError={this.state._accountNumberError}
            validate={val => this.validate(USER_ENTITIES.BANK_ACCOUNT_NUMBER, val)}
            maxLength={18}
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))} />
        </View>
        <View style={{...styles.screen.textInput.parentContainerStyle}}>
          <Field
            accessible accessibilityLabel={'Confirm Account Number'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER}
            component={LWFormInput}
            keyboardType='number-pad'
            isLabel
            label='Confirm Account Number'
            placeholderText='Confirm Account Number'
            returnKeyType='next'
            whiteBackground
            isError={this.state._confirmAccountNumberError}
            validate={val => this.validate(USER_ENTITIES.CONFIRM_BANK_ACCOUNT_NUMBER, val)}
            maxLength={18}
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))} />
        </View>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
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
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {isPlaidLinked, navigator, isProcessing} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: Colors.white}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Bank Setup' />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ ...styles.screen.containers.keyboard }}
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

AddAccountInformation.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // is plaid connected
  isPlaidLinked: PropTypes.bool.isRequired,

  // userAccount
  userAccount: PropTypes.string,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  formData: PropTypes.any
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(AddAccountInformation))

export default Screen
