/* eslint-disable no-unused-vars,no-trailing-spaces */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Alert, StatusBar, Text, Animated, Easing, TouchableHighlight, Dimensions, NativeModules, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import { Field, reduxForm }
  from 'redux-form'
import { connect }
  from 'react-redux'
import Colors
  from '../../Themes/Colors'
import CustomNav
  from '../../Containers/Common/CustomNav'
import styles
  from '../../Themes/ApplicationStyles'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import LWFormInput
  from '../Utility/LWFormInput'
import { FORM_TYPES }
  from '../../Config/contants'
import ShadowedContainer
  from '../../CommonComponents/ShadowedContainer'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import GravityCapsule
  from '../Utility/GravityCapsule'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import { SPROUT } from '../../Utility/Mapper/Screens'
import BankDisconnectNotification
  from '../../Containers/Setting/BankDisconnectNotification'
var PlaidBridgeModule = NativeModules.PlaidBridgeModule

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.BANK_DETAILS,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class Bank extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _showPlaid: !props.isPlaidLinked,
      doneLinking: false
    }
    this._isPlaidVisible = false
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  // --------------------------------------------------------
  // Action handlers

  plaidConnectSuccess (accountID, publicToken) {
    const {handleLocalAction, localActions, userID, navigator} = this.props
    handleLocalAction({type: localActions.LINK_PLAID,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.PLAID_PUBLIC_TOKEN]: publicToken,
      [USER_ENTITIES.PLAID_ACCOUNT_ID]: accountID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      'fetchUserDetails': true
    })
    this.setState({
      _showPlaid: false
    })
    this._isPlaidVisible = false
  }

  addMicroDeposit () {
    const {handleLocalAction, localActions, userID, navigator} = this.props
    handleLocalAction({type: localActions.SELECT_ACCOUNT_TYPE,
      [COMMON_ENTITIES.SCREEN_TYPE]: SPROUT.SELECT_ACCOUNT_TYPE,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
    this.setState({
      _showPlaid: false
    })
    this._isPlaidVisible = false
  }

  disconnectBank () {
    const {handleLocalAction, localActions, userID, navigator} = this.props
    handleLocalAction({type: localActions.DISCONNECT_BANK, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // Show Plaid View with custom configurration. This can be used without initializing the plaid api
  _showPlaidView () {
    PlaidBridgeModule.showPlaidViewController((error, token, metadata) => {
      const requestID = metadata.require_id
      const status = metadata.status
      if (error) {
        this._isPlaidVisible = false
      } else if (token) {
        let metadataObject = JSON.parse(metadata)
        this.plaidConnectSuccess(metadataObject.account_id, token)
      } else if (status && status === 'institution_not_found') {
        this.addMicroDeposit()
      }
    })
  }

  refreshStore () {
    const {handleLocalAction, localActions, userID, navigator} = this.props
    handleLocalAction({type: localActions.REFRESH_STATE, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.isPlaidLinked) {
      this.refreshStore()
    }
  }

  toggleAddAccount (visibility) {
    this.setState({ addAccount: visibility })
  }

  navigateToNextScreen (data) {
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.BANK_PIN:
        this.setState({ _bankPINError: error })
        break
      default:
        this.setState({
          _bankPINError: false
        })
    }
  }

  renderDisconnectBank () {
    const {isProcessing} = this.props
    return (
      <TouchableOpacity disabled={isProcessing} onPress={() => this.disconnectBank()} style={{marginTop: 30, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'rgba(0, 0, 0, 0.5)', fontSize: 18, fontFamily: Fonts.type.book}}>
          Remove Bank Account
        </Text>
      </TouchableOpacity>
    )
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.BANK_PIN:
        if (val && val.trim() !== '' && val.trim() === val) {
          this.markError(USER_ENTITIES.BANK_PIN, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.BANK_PIN, true)
          return 'BANK PIN REQ'
        }
    }
  }

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, marginTop: 27 }}>
        <Text style={{ ...styles.text.mainHeader, alignSelf: 'center', marginBottom: 7, fontFamily: Fonts.type.bold }}>
          Bank Connection
        </Text>
        <Text style={{ ...styles.text.subTitle, color: Colors.blue, alignSelf: 'center', fontWeight: 'normal', fontFamily: Fonts.type.book }}>
          {'We transfer funds to and from this\naccount as you direct.'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit } = this.props
    return (
      <View style={{ marginTop: 32 }}>
        <Text
          style={{ ...styles.text.information, alignSelf: 'flex-end', fontSize: 11, color: Colors.fontGray, textDecorationLine: 'underline', marginBottom: 7, fontFamily: Fonts.type.book }}
          onPress={() => console.log('update account')}>
          Update account?
        </Text>
        <View style={{...styles.screen.textInput.parentContainerStyle}}>
          <Field
            name={USER_ENTITIES.BANK_PIN}
            accessible
            accessibilityLabel={'BANK OF AMERICA'}
            accessibilityRole={'keyboardkey'}
            isLabel
            label='BANK OF AMERICA'
            component={LWFormInput}
            focusSmoothly
            whiteBackground
            keyboardType='number-pad'
            returnKeyType='next'
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))}
            focus
            isError={this.state._bankPINError}
            placeholderText='BANK OF AMERICA'
            validate={val => this.validate(USER_ENTITIES.BANK_PIN, val)
            }
          />
        </View>
        <Text
          style={{ ...styles.text.information, fontSize: 11, color: Colors.fontGray, textDecorationLine: 'underline', marginTop: 7, fontFamily: Fonts.type.book }}
          onPress={() => this.toggleAddAccount(false)}>
          Remove account?
        </Text>
      </View>
    )
  }
  renderAddAccount () {
    return (
      <ShadowedContainer style={{ marginTop: 20, width: 150, height: 36, alignSelf: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#707070' }}>
        <TouchableHighlight
          style={{ flex: 1, justifyContent: 'center' }}
          onPress={() => this._showPlaidView()}
          accessible
          accessibilityLabel={'Add new bank account'}
          accessibilityRole={'button'}
          underlayColor={Colors.transparent}>
          <Text style={{ ...styles.text.description, fontSize: 11, color: Colors.blue, alignSelf: 'center', fontWeight: 'normal' }}>
            + Add new account
          </Text>
        </TouchableHighlight>
      </ShadowedContainer>
    )
  }
  renderBanks () {
    const { userAccount, userAccountStatus, bankAdded, isPlaidLinked } = this.props
    if (bankAdded !== 1 && bankAdded !== 2) {
      return this.renderAddAccount()
    } else {
      if (userAccount) {
        return (
          <View>
            <Text style={{fontSize: 22, fontFamily: Fonts.type.book, color: Colors.blue}}>
              {userAccount}
            </Text>
            <Text style={{marginVertical: 10, fontSize: 12, fontFamily: Fonts.type.medium, color: Colors.gray}}>{userAccountStatus}</Text>
            <View style={{height: 1, marginTop: 5, backgroundColor: Colors.lightGrayBG}} />
          </View>
        )
      } else if (isPlaidLinked && !userAccount) {
        return (
          <Text style={{fontSize: 16, fontFamily: Fonts.type.book, color: Colors.blue, textAlign: 'center'}}>
            Account connection in process
          </Text>
        )
      }
    }
  }

  // --------------------------------------------------------
  // Top level render methods

  // status code : 0, 4, 5
  renderAddBankAccountScreen () {
    const { navigator, isProcessing } = this.props
    const {height, width} = Dimensions.get('window')
    return (
      <View style={{flex: 1}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Bank' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <StatusBar barStyle='dark-content' />
        <View style={{flex: 1, paddingHorizontal: 32, paddingTop: 28}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', textAlign: 'center', fontSize: 22, alignSelf: 'center', marginBottom: 20}}>
            Add Bank Account.
          </Text>
          {this.renderAddAccount()}
        </View>
      </View>
    )
  }

  // status code : 2
  renderBankAccountInProgressScreen () {
    const { navigator, isProcessing } = this.props
    const {height, width} = Dimensions.get('window')
    return (
      <View style={{flex: 1}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Bank' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <StatusBar barStyle='dark-content' />
        <View style={{flex: 1, paddingHorizontal: 32, paddingTop: 28}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', textAlign: 'center', fontSize: 22, alignSelf: 'center', marginBottom: 20}}>
            Bank account is getting connected.
          </Text>
          {this.renderDisconnectBank()}
        </View>
      </View>
    )
  }

  // status code : 3
  renderBankAccountScreen () {
    const { userAccount, userAccountStatus, navigator, isProcessing } = this.props
    const {height, width} = Dimensions.get('window')
    return (
      <View style={{flex: 1}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Bank' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <StatusBar barStyle='dark-content' />
        <View style={{flex: 1, paddingHorizontal: 32, paddingTop: 28}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', textAlign: 'center', fontSize: 22, alignSelf: 'center', marginBottom: 20}}>
            Your bank account is linked to Loved Investing.
          </Text>
          <Text
            style={{fontSize: 22, marginTop: 20, fontFamily: Fonts.type.book, color: Colors.blue}}>
            {userAccount}
          </Text>
          <Text style={{marginVertical: 10, fontSize: 12, fontFamily: Fonts.type.medium, color: Colors.gray}}>{userAccountStatus}</Text>
          <View style={{height: 1, marginTop: 5, backgroundColor: Colors.lightGrayBG}} />
          {this.renderDisconnectBank()}
        </View>
      </View>
    )
  }

  // status code : 7
  renderBankDisconnectInProgressScreen () {
    const { navigator, isProcessing } = this.props
    const {height, width} = Dimensions.get('window')
    return (
      <View style={{flex: 1}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Bank' />
        <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 30, marginBottom: 50}}>
          <Text style={{...styles.text.mainHeader, fontFamily: Fonts.type.bold}}>
            Your bank link is being disconnected.
          </Text>
          <Image style={{alignSelf: 'center', marginVertical: 40, height: height * 0.318, width: width * 0.405}} source={require('../../../Img/assets/goal/bankDisconnect/bankDisconnect.png')} />
          <Text style={{ ...styles.text.title, color: Colors.blue, fontFamily: Fonts.type.book, marginVertical: 15 }}>
            We’ll prompt you when it’s time to reconnect your bank.
          </Text>
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // Main render method

  render () {
    const { navigator, isProcessing, bankNotificationVisible, fundingStatus, userAccount, bankAdded } = this.props
    const {height, width} = Dimensions.get('window')

    if (bankAdded === 0 || bankAdded === 4 || bankAdded === 5) {
      return this.renderAddBankAccountScreen()
    } else if (bankAdded === 3) {
      return this.renderBankAccountScreen()
    } else if (bankAdded === 7) {
      return this.renderBankDisconnectInProgressScreen()
    } else if (bankAdded === 2 && userAccount) {
      return this.renderBankAccountScreen()
    } else if (bankAdded === 2 && !userAccount) {
      return this.renderBankAccountInProgressScreen()
    } else {
      return this.renderBankAccountScreen()
    }
  }

}

Bank.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // user id
  userID: PropTypes.string,

  // show bank notification
  bankNotificationVisible: PropTypes.bool,

  // user account
  userAccount: PropTypes.string,

  // is processing
  isProcessing: PropTypes.bool,

  // funding status
  fundingStatus: PropTypes.number,

  // bank added
  bankAdded: PropTypes.number,

  // user account status
  userAccountStatus: PropTypes.string,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(Bank))

export default Screen
