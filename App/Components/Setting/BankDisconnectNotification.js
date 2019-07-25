/* eslint-disable no-unused-vars */
/**
 * Created by demon on 28/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Alert, LayoutAnimation, Text, Animated, Easing, Dimensions, NativeModules, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, TouchableHighlight, Image, ActivityIndicator }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import {Icon}
  from 'react-native-elements'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import _
  from 'lodash'
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
var Spinner = require('react-native-spinkit')
import { analytics }
  from '../../Config/AppConfig'
import {screens, events}
  from '../../Utility/Mapper/Tracking'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import moment
  from 'moment'
import GravityCapsule from '../Utility/GravityCapsule'
import Colors from '../../Themes/Colors'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class BankDisconnectNotification extends Component {

  constructor (props) {
    super(props)
    const {width, height} = Dimensions.get('window')
    this.height = height
    this.width = width
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  // --------------------------------------------------------
  // Action handlers

  dismissModal () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.DISMISS_MODAL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderConfirmBody () {
    return (
      <View style={{alignSelf: 'center', paddingHorizontal: 32}}>
        <Text style={{...styles.text.mainHeader, fontFamily: Fonts.type.bold}}>
          Your bank link is being disconnected.
        </Text>
        <Image style={{alignSelf: 'center', marginVertical: 20, height: this.height * 0.318, width: this.width * 0.405}} source={require('../../../Img/assets/goal/bankDisconnect/bankDisconnect.png')} />
        <Text style={{ ...styles.text.title, color: Colors.blue, fontFamily: Fonts.type.book, marginVertical: 15 }}>
          We’ll prompt you when it’s time to reconnect your bank.
        </Text>
      </View>
    )
  }

  renderConfirmButton () {
    return (
      <TouchableHighlight
        underlayColor={Colors.buttonYellowUnderlay}
        accessible
        accessibilityLabel={'Ok'}
        accessibilityRole={'button'}
        style={{
          ...styles.bottomNavigator.containerStyle,
          height: this.height * 0.05,
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: {height: 3, width: 0},
          marginHorizontal: 20,
          width: this.width * 0.512,
          marginTop: 10
        }}
        onPress={_.debounce(_.bind(() => this.dismissModal(), this), 500, {'leading': true, 'trailing': false})}
      >
        <Text style={{...styles.bottomNavigator.textStyle, color: '#1A8DFC'}}>Close</Text>
      </TouchableHighlight>
    )
  }

  renderCloseIcon () {
    return (
      <View style={{position: 'absolute', top: 20, right: 10}}>
        <Icon name='clear' size={32} color='rgba(0, 0, 0, 0.6)' onPress={() => this.dismissModal()} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {width, height} = Dimensions.get('window')
    let padding = height * 0.05
    let windowWidth = width - 60
    return (
      <View style={{backgroundColor: '#FFF',
        height: height * 0.758,
        justifyContent: 'space-between',
        paddingBottom: 30,
        paddingTop: 60,
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.16}}>
        {this.renderConfirmBody()}
        {this.renderConfirmButton()}
        {this.renderCloseIcon()}
      </View>
    )
  }

}

BankDisconnectNotification.propTypes = {

  // used for navigation, comes via react-navigation
  toggleModal: PropTypes.func.isRequired
}

// ========================================================
// Export
// ========================================================

export default BankDisconnectNotification
