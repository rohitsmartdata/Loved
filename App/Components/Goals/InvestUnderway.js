/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/1/18.
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
var Spinner = require('react-native-spinkit')
import { analytics }
  from '../../Config/AppConfig'
import {screens, events}
  from '../../Utility/Mapper/Tracking'
import moment
  from 'moment'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
import Animation
  from 'lottie-react-native'
import rocket
  from '../../../assets/animationFiles/data.json'
import * as Constants from '../../Themes/Constants'
import Colors from '../../Themes/Colors'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class InvestReady extends Component {

  constructor (props) {
    super(props)
    const {width, height} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    const showBankLinked = props['showBankLinked']
    this.state = {
      screen: showBankLinked ? 0 : 1
    }
  }

  componentDidMount () {
    setTimeout(() => this.initiating(), 1000)
  }

  // --------------------------------------------------------
  // Action handlers

  refreshState () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({type: localActions.REFRESH_STATE, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  initiating () {
    this.setState({screen: 1})
    setTimeout(() => this.confirmed(), 4000)
  }

  confirmed () {
    this.setState({screen: 2})
  }

  dismissModal () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.DISMISS_MODAL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  resetDashboard () {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_HOMEPAGE, [COMMON_ENTITIES.NAVIGATOR]: navigator, [CHILD_ENTITIES.CHILD_ID]: childID})
  }

  // --------------------------------------------------------
  // Child Components

  renderConfirmPage () {
    return (
      <View style={{backgroundColor: '#FFF', flex: 1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
          {this.renderConfirmBody()}
        </View>
      </View>
    )
  }

  renderConfirmBody () {
    const {investmentAmount, isWithdraw, goalName} = this.props
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
        <Image source={require('../../../Img/assets/dashboard/plaidSuccess/plaidSuccess.png')} />
        <Text style={{marginTop: 32, fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, textAlign: 'center'}}>
          Your bank was successfully linked!
        </Text>
      </View>
    )
  }

  renderInitiatePage () {
    return (
      <View style={{backgroundColor: '#FFF', flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {this.renderInitateBody()}
        </View>
      </View>
    )
  }

  renderInitateBody () {
    const {isWithdraw, goalName, investmentAmount, firstname} = this.props
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
    return (
      <View style={{backgroundColor: '#FFF', flex: 1}}>
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32}}>
        <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, textAlign: 'center'}}>
          Order confirmed
        </Text>
        <Image source={require('../../../Img/assets/goal/orderConfirming/orderConfirming.png')} style={{marginVertical: 32, height: 190, width: 180}} />
        <Text style={{fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center'}}>
          {/* {firstname}'s {isWithdraw ? 'withdrawal' : 'investment'} is scheduled for {moment(nextTransferDate).format('MMMM DD, YYYY')}. */}
          {
            isWithdraw ? 'Your investments will be sold and then paid to your bank after a 3 business day settlement period.' : 'Your investments will be placed after your funds clear in about 3 business days.'
          }
        </Text>
      </View>
    )
  }

  renderConfirmed () {
    const { handleSubmit, dismissConfirm, confirmFunc } = this.props
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
          onPress={_.debounce(_.bind(() => { this.resetDashboard() }, this), 500, {'leading': true, 'trailing': false})}
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
    return (
      <View style={{flex: 1, paddingHorizontal: Constants.screen.width * 0.086, paddingVertical: Constants.screen.height * 0.124}}>
        {this.currentScreen()}
      </View>
    )
  }

}

InvestReady.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string,
  // child id
  childID: PropTypes.string,
  // goal id
  goalID: PropTypes.string,
  // investment amount
  investmentAmount: PropTypes.number,
  // child's firstname
  firstname: PropTypes.string,
  // is withdraw
  isWithdraw: PropTypes.bool.isRequired,
  // show bank linked
  showBankLinked: PropTypes.bool.isRequired,
  // next transfer object
  nextTransferDate: PropTypes.string
}

InvestReady.defaultProps = {
  isWithdraw: false
}

// ========================================================
// Export
// ========================================================

export default InvestReady
