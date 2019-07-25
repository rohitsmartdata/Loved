/* eslint-disable camelcase,no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 25/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, StatusBar, Alert, TouchableOpacity, Image, ScrollView, Dimensions, LayoutAnimation, TextInput, ImageBackground, TouchableHighlight }
  from 'react-native'
import { connect }
  from 'react-redux'
import Modal
  from 'react-native-modal'
import CustomNav
  from '../../Containers/Common/CustomNav'
import GravityCapsule
  from '../Utility/GravityCapsule'
import styles
  from '../../Themes/ApplicationStyles'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import { reduxForm, Field, reset }
  from 'redux-form'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import { FORM_TYPES }
  from '../../Config/contants'
import { GOAL_ENTITIES }
  from '../../Utility/Mapper/Goal'
import { COMMON_ENTITIES, CUSTOM_LIST_ENTITIES, DEVICE_LOGICAL_RESOLUTION, BUTTON_TYPES, getPortfolio }
  from '../../Utility/Mapper/Common'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import Fonts
  from '../../Themes/Fonts'
import LWTextInput
  from '../Utility/LWFormInput'
import {Icon}
  from 'react-native-elements'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import { formatPrice }
  from '../../Utility/Transforms/Converter'
import _
  from 'lodash'
import EditableTextInput
  from '../../CommonComponents/editableTextInput'
import LI_Confirm
  from '../../Containers/Invest/LI_Confirm'
import Colors from '../../Themes/Colors'
import * as Constants from '../../Themes/Constants'
import loginPinStyles from '../Common/Styles/LoginPinStyle'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.WITHDRAW,
  destroyOnUnmount: false,
  enableReinitialize: true
})

// ========================================================
// Core Component
// ========================================================

class LI_Sell extends Component {

  // ------------------------------------------------------------
  // Life cycle methods

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.state = {
      showConfirmation: false,
      shadowOpacity: {
        0: 0.16,
        1: 0.16,
        2: 0.16,
        3: 0.16,
        4: 0.16,
        5: 0.16,
        6: 0.16,
        7: 0.16,
        8: 0.16,
        9: 0.16
      },
      amount: props.withdrawAmount
    }
  }

  componentWillMount () {
    const {withdrawAmount} = this.props
    this.updateWithdrawAmount(withdrawAmount)
  }

  // ------------------------------------------------------------
  // Action handler

  _withdraw () {
    let {handleLocalAction, localActions, userID, childID, goalID, navigator, goalName, goalBalance, withdrawAmount} = this.props
    let wAmount = (withdrawAmount && parseFloat(withdrawAmount)) || 0
    let displayAmount = wAmount
    const threshold = 0.95 * goalBalance
    if (wAmount >= threshold) {
      wAmount = -1
    }
    handleLocalAction({
      type: localActions.WITHDRAW,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.NAME]: goalName,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [GOAL_ENTITIES.WITHDRAW_AMOUNT]: wAmount,
      [GOAL_ENTITIES.WITHDRAW_DISPLAY_AMOUNT]: parseFloat(displayAmount)
    })
  }

  toggleConfirmation (visible, close = false) {
    let {goalBalance} = this.props
    let {amount} = this.state
    let wAmount = (amount && parseFloat(amount)) || 0
    if (visible) {
      if (!wAmount || wAmount === 0 || wAmount > goalBalance) {
        Alert.alert('Warning', 'Withdraw amount cannot be greater than available amount.')
        return
      }
    }
    this.onSubmitEditing(parseFloat(wAmount))
    this.setState({
      showConfirmation: visible
    })
    if (close) {
      const {hideModal, navigator} = this.props
      navigator.dismissModal()
      hideModal()
    }
  }

  textChangeListener (text) {
  }

  onSubmitEditing ($) {
    this.updateWithdrawAmount($)
  }

  updateField (action, field, value) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.WITHDRAW, field: field, value: value}})
  }

  updateWithdrawAmount ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_WITHDRAW_AMOUNT, GOAL_ENTITIES.WITHDRAW_AMOUNT, $)
  }

  addAmount ($) {
    let amt = this.state.amount.toString()
    if ($ === '.') {
      if (amt.includes('.')) return
    }

    if ($ === 'back') {
      if (amt.length > 1) {
        amt = amt.slice(0, -1)
      } else {
        amt = 0
      }
    } else {
      if (amt.includes('.') && amt.split('.').pop().length >= 2) {
        return
      }
      amt = amt + $.toString()
    }
    this.setState({amount: amt})
  }

  // ------------------------------------------------------------
  // Internal component

  renderBodyHeader () {
    const {childName, goalName} = this.props
    let top = (Constants.screen.height * 50) / 812
    return (
      <View style={{marginTop: top, marginBottom: 15}}>
        <Text style={{
          ...styles.screen.h2.textStyle,
          textAlign: 'center',
          fontFamily: Fonts.type.bold,
          color: '#FFF',
          fontSize: 22
        }}>
          How much {goalName} are we withdrawing for {childName}?
        </Text>
      </View>
    )
  }

  renderFundAmount () {
    const {withdrawAmount, goalBalance} = this.props
    return (
      <View style={{marginTop: 24, marginHorizontal: 20}}>
        <EditableTextInput
          value={withdrawAmount}
          textChangeListener={(text) => this.textChangeListener(text)}
          onSubmitEditing={(text) => this.onSubmitEditing(text)}
          minimumValue={0}
          formatValue={formatPrice}
          keyboardType='decimal-pad' />
        <View style={{marginTop: 15}}>
          <Text style={{textAlign: 'center', color: '#707070', fontSize: 12, fontFamily: Fonts.type.book}}>
            Available balance {formatPrice(goalBalance)}.
          </Text>
        </View>
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <View style={{flex: 2, justifyContent: 'center'}}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0}
          }}
          onPress={_.debounce(_.bind(() => this.toggleConfirmation(true), this), 500, {
            'leading': true,
            'trailing': false
          })}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderConfirmation () {
    const {showConfirmation} = this.state
    const {navigator, goalID, childID, goalName, withdrawAmount, hideModal} = this.props
    if (!showConfirmation) {
      return null
    } else {
      return (
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', marginVertical: 100, marginHorizontal: 32}}
          backdropColor='black'
          backdropOpacity={0.6}
          isVisible={showConfirmation}>
          <LI_Confirm childID={childID} isModal confirmFunc={this._withdraw.bind(this)} dismissConfirm={this.toggleConfirmation.bind(this)} goalID={goalID} goalName={goalName} recurringAmount={withdrawAmount} navigator={navigator} isWithdraw />
        </Modal>
      )
    }
  }

  renderTextAmount () {
    return (
      <Text style={{fontFamily: Fonts.type.bold, fontSize: 26, lineHeight: 49, textAlign: 'center', color: Colors.buttonYellow}}>
        {formatPrice(this.state.amount)}
      </Text>
    )
  }

  renderPadContainer () {
    return (
      <View style={{flex: 1, justifyContent: 'flex-end', marginTop: 15}}>
        <View style={{...loginPinStyles.horizontalPadContainer}}>
          {this.renderButton(1)}
          {this.renderButton(2)}
          {this.renderButton(3)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer}}>
          {this.renderButton(4)}
          {this.renderButton(5)}
          {this.renderButton(6)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer}}>
          {this.renderButton(7)}
          {this.renderButton(8)}
          {this.renderButton(9)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer}}>
          {this.renderButton('.', true)}
          {this.renderButton(0)}
          {this.renderBackButton()}
        </View>
      </View>
    )
  }

  renderBackButton () {
    let containerSize = 70
    let diameter = Constants.screen.height * 0.0865
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          accessible
          accessibilityLabel={'backspace'}
          accessibilityRole={'button'}
          style={{...loginPinStyles.buttonPadStyle, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => this.addAmount('back')}
          underlayColor={Colors.selectedPinButton}>
          <Icon name='md-backspace' type='ionicon' size={30} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }

  renderButton (title, center) {
    let containerSize = 70
    let diameter = Constants.screen.height * 0.0865
    return (
      <TouchableHighlight onHideUnderlay={() => this.resetShadow(title)} onShowUnderlay={() => this.pressShadow(title)} underlayColor='rgba(78, 194, 209, 0.37)' onPress={() => this.addAmount(title)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: Fonts.type.book, color: 'white', fontSize: 38, bottom: center ? 7 : 0}}>
          {title}
        </Text>
      </TouchableHighlight>
    )
  }

  pressShadow (title) {
    let currentObj = this.state.shadowOpacity
    let modified = {[title]: 0.8}
    let merged = Object.assign({}, currentObj, modified)
    this.setState({
      shadowOpacity: merged
    })
  }

  resetShadow (title) {
    let currentObj = this.state.shadowOpacity
    let modified = {[title]: 0.16}
    let merged = Object.assign({}, currentObj, modified)
    this.setState({
      shadowOpacity: merged
    })
  }

  renderBody () {
    return (
      <View style={{flex: 9.3, marginTop: 10}}>
        {this.renderBodyHeader()}
        {this.renderTextAmount()}
        {this.renderPadContainer()}
      </View>
    )
  }

  // ------------------------------------------------------------
  // Core component

  render () {
    const {navigator, childName, goalName, isProcessing, goalBalance} = this.props
    let title = childName + '\'s ' + goalName
    return (
      <ImageBackground source={require('../../../Img/appBackground.png')} style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <StatusBar barStyle='light-content' />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={title} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderNextButton()}
        </View>
        {this.renderConfirmation()}
      </ImageBackground>
    )
  }

}

LI_Sell.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,
  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,
  // goal ID
  goalID: PropTypes.string.isRequired,
  // child ID
  childID: PropTypes.string.isRequired,
  // user id
  userID: PropTypes.string.isRequired,
  // child name
  childName: PropTypes.string.isRequired,
  // goal name
  goalName: PropTypes.string.isRequired,
  // goal balance
  goalBalance: PropTypes.number.isRequired,
  // is processing
  isProcessing: PropTypes.bool.isRequired,
  // withdraw amount
  withdrawAmount: PropTypes.number.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_Sell))

export default Screen
