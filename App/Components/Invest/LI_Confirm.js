/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * Created by demon on 26/10/18.
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
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION, getFrequencyShortTitle}
  from '../../Utility/Mapper/Common'
import _
  from 'lodash'
import { CachedImage }
  from 'react-native-cached-image'
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
import Animation
  from 'lottie-react-native'
import rocket
  from '../../../assets/animationFiles/data.json'
import * as Constants from '../../Themes/Constants'
import Colors from '../../Themes/Colors'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { GOAL_ENTITIES } from '../../Utility/Mapper/Goal'
import { INVESTMENT_ENTITIES } from '../../Utility/Mapper/Investment'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class LI_Confirm extends Component {

  constructor (props) {
    super(props)
    const {width, height} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.state = {
      screen: props.setScreen || 0
    }
    if (props.setScreen && props.setScreen === 1) {
      this.initiating()
    }
  }

  // --------------------------------------------------------
  // Action handlers

  refreshState () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({type: localActions.REFRESH_STATE, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  navigateConnectBank () {
    const {handleLocalAction, localActions, navigator, userID, childID, goalID, goalName, investmentAmount} = this.props
    handleLocalAction({
      type: localActions.BANK_CONNECT,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [INVESTMENT_ENTITIES.INVESTMENT_NAME]: goalName,
      [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: investmentAmount,
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  initiating () {
    this.setState({screen: 1})
    setTimeout(() => this.confirmed(), 4000)
  }

  confirmed () {
    this.setState({screen: 2})
  }

  dismissModal () {
    const {handleLocalAction, localActions, navigator, isOnboardingFlow, isModal} = this.props
    handleLocalAction({type: localActions.DISMISS_MODAL, [COMMON_ENTITIES.NAVIGATOR]: navigator, 'IS_MODEL': isModal})
  }

  confirmInvestment () {
    const {confirmFunc, dismissConfirm, isModal} = this.props
    if (isModal) {
      this.initiating()
      confirmFunc()
    } else {
      confirmFunc()
      dismissConfirm()
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderConfirmPage () {
    return (
      <View style={{backgroundColor: '#FFF', flex: 1, borderRadius: 10, shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5}}}>
        <View style={{flex: 7, backgroundColor: 'transparent'}}>
          {this.renderConfirmBody()}
        </View>
        <View style={{flex: 3, justifyContent: 'center'}}>
          {this.renderConfirmButton()}
        </View>
        <View style={{position: 'absolute', top: 20, left: 0, right: 20, alignItems: 'flex-end'}}>
          <Icon name='close' size={32} onPress={() => this.props.dismissConfirm(false)} />
        </View>
      </View>
    )
  }

  renderConfirmBody () {
    const {investmentAmount, investmentFrequency, isWithdraw, goalName, backdropURL} = this.props
    const freqTitle = investmentFrequency && getFrequencyShortTitle(investmentFrequency)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32}}>
        <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, textAlign: 'center'}}>
          Can you confirm your {investmentAmount && formatFloatPrice(investmentAmount)} {investmentFrequency && freqTitle} {isWithdraw ? 'withdrawal' : 'investment'} {isWithdraw ? 'from' : 'into'} {goalName}?
        </Text>
        {
          backdropURL && <CachedImage source={{uri: backdropURL}} style={{height: 125, width: 125, borderRadius: 60, marginTop: 20}} />
        }
      </View>
    )
  }

  renderConfirmButton () {
    const { handleSubmit, dismissConfirm, confirmFunc } = this.props
    const isX = this.isX || false
    return (
      <View style={{paddingHorizontal: 30}}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Confirm'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 20
          }}
          onPress={_.debounce(_.bind(() => this.confirmInvestment(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>
            Confirm
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderInitiatePage () {
    const {isScreen} = this.props
    return (
      <View style={{backgroundColor: '#FFF', flex: 1, borderRadius: 10, shadowOpacity: isScreen ? 0 : 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5}}}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.renderInitateBody()}
        </View>
      </View>
    )
  }

  renderInitateBody () {
    const {isWithdraw, goalName, investmentAmount, firstname} = this.props
    const {width} = Dimensions.get('window')
    const windowWidth = width - 100
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32}}>
        <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, textAlign: 'center'}}>
          Order initiating
        </Text>
        <View style={{marginVertical: 32}}>
          <Animation
            ref={animation => (animation && animation.play())}
            style={{
              width: 190,
              height: 200
            }}
            loop={false}
            source={rocket}
          />
        </View>
        <Text style={{fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center'}}>
          We're {isWithdraw ? 'withdrawing' : 'investing'} {investmentAmount && formatPrice(investmentAmount)} {isWithdraw ? 'from' : 'into'} {firstname}'s {goalName}.
        </Text>
      </View>
    )
  }

  renderConfirmedPage () {
    const {isScreen} = this.props
    return (
      <View style={{backgroundColor: '#FFF', flex: 1, borderRadius: 10, shadowOpacity: isScreen ? 0 : 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5}}}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.renderConfirmedBody()}
        </View>
        {this.renderConfirmed()}
      </View>
    )
  }

  renderConfirmedBody () {
    const {isWithdraw, goalName, investmentAmount, firstname, nextTransferDate} = this.props
    return (
      <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 32, justifyContent: 'center'}}>
        <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, textAlign: 'center'}}>
          Order confirmed
        </Text>
        <Image source={require('../../../Img/assets/goal/orderConfirming/orderConfirming.png')} style={{marginVertical: 32, height: 190, width: 180}} />
        <Text style={{fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center'}}>
          {/* {firstname}'s {isWithdraw ? 'withdrawal' : 'investment'} is scheduled for {moment(nextTransferDate).format('MMMM DD, YYYY')}. */}
          {isWithdraw ? 'Your investments will be sold and then paid to your bank after a 3 business day settlement period.' : 'Your investments will be placed after your funds clear in about 3 business days.'}
        </Text>
      </View>
    )
  }

  renderConfirmed () {
    const { handleSubmit, dismissConfirm, confirmFunc, isScreen } = this.props
    const isX = this.isX || false
    return (
      <View style={{position: 'absolute', bottom: Constants.screen.height * 0.05, left: 0, right: 0, paddingHorizontal: 30}}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Ok'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 20
          }}
          onPress={_.debounce(_.bind(() => { this.refreshState(); isScreen ? this.navigateConnectBank() : this.dismissModal() }, this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>
            OK
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  currentScreen () {
    const {screen} = this.state
    switch (screen) {
      case 0: return this.renderConfirmPage()
      case 1: return this.renderInitiatePage()
      case 2: return this.renderConfirmedPage()
      default: return this.renderConfirmPage()
    }
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {width, height} = Dimensions.get('window')
    const {isScreen} = this.props
    let windowHeight = height - 200
    let windowWidth = width - 60
    return (
      <View style={isScreen ? {justifyContent: 'flex-end', marginVertical: 100, marginHorizontal: 32, flex: 1} : { height: height * 0.754, width: width * 0.84 }}>
        {this.currentScreen()}
      </View>
    )
  }

}

LI_Confirm.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // dismiss parent modal
  dismissConfirm: PropTypes.bool,

  // confirmation function
  confirmFunc: PropTypes.func,

  // is processing
  isProcessing: PropTypes.bool,

  // user id
  userID: PropTypes.string,
  // goal id
  goalID: PropTypes.string,
  // child id
  childID: PropTypes.string,
  // investment amount
  investmentAmount: PropTypes.number,
  // investment frequency
  investmentFrequency: PropTypes.string,
  // child's firstname
  firstname: PropTypes.string,
  // goal name
  goalName: PropTypes.string,
  // is withdraw
  isWithdraw: PropTypes.bool.isRequired,
  // next transfer object
  nextTransferDate: PropTypes.string,
  // backdrop url
  backdropURL: PropTypes.string,
  // is modal
  isModal: PropTypes.bool,

  isScreen: PropTypes.bool
}

LI_Confirm.defaultProps = {
  isWithdraw: false
}

// ========================================================
// Export
// ========================================================

export default LI_Confirm
