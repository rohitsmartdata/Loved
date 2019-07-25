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
import { View, Alert, Text, Animated, Easing, Dimensions, NativeModules, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import GravityCapsule
  from '../Utility/GravityCapsule'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import { SPROUT } from '../../Utility/Mapper/Screens'
var PlaidBridgeModule = NativeModules.PlaidBridgeModule

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class ConnectBank extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _showPlaid: !props.isPlaidLinked
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
      [COMMON_ENTITIES.NAVIGATOR]: navigator
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

  setPlaidVisible (visible) {
    this._isPlaidVisible = visible
  }

  // --------------------------------------------------------
  // Child Components

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

  renderConnected () {
    return (
      <View style={{flex: 1}}>
        {this.renderHeading('Funds are transferred to and from this account as directed by you')}
        {this.renderAccountDetails()}
      </View>
    )
  }

  renderUnconnected () {
    return (
      <View style={{flex: 1}}>
        {this.renderHeading('Connect your bank account to start building wealth for your children')}
        {this.renderNextButton()}
      </View>
    )
  }

  renderHeading (heading) {
    return (
      <View style={{marginTop: 32, paddingHorizontal: 16}}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000', fontSize: 20}}>
          {heading}
        </Text>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
          <Image source={require('../../../Img/newIcons/bankIcon.png')} />
        </View>
      </View>
    )
  }

  renderAccountDetails () {
    const {userAccount} = this.props
    if (userAccount) {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 32, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#D7D7D7', marginTop: 40, paddingHorizontal: 16}}>
          <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16}}>
            {userAccount}
          </Text>
        </View>
      )
    } else {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 32, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#D7D7D7', marginTop: 40, paddingHorizontal: 16}}>
          <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16}}>
            Bank connection in-progress.
          </Text>
        </View>
      )
    }
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Connect Bank'}
          accessibilityRole={'button'}
          style={{...styles.bottomNavigator.containerStyle, marginHorizontal: 20}}
          onPress={() => this._showPlaidView()}>
          <Text style={styles.bottomNavigator.textStyle}>CONNECT BANK</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {isPlaidLinked, navigator, isProcessing} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Connect Bank' />
        <ProcessingIndicator isProcessing={isProcessing} />
        {
          isPlaidLinked ? this.renderConnected() : this.renderUnconnected()
        }
      </View>
    )
  }

}

ConnectBank.propTypes = {
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
  isProcessing: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default ConnectBank
