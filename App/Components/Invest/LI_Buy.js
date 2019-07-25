/* eslint-disable no-unused-vars,no-trailing-spaces,camelcase */
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
import {View, Text, StatusBar, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity, Alert, ImageBackground}
  from 'react-native'
import Modal
  from 'react-native-modal'
import {reduxForm, Field}
  from 'redux-form'
import CustomNav
  from '../../Containers/Common/CustomNav'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import {Icon}
  from 'react-native-elements'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import LWTextInput
  from '../Utility/LWFormInput'
import GravityCapsule
  from '../Utility/GravityCapsule'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {formatPrice, formatFloatPrice}
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
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class LI_Buy extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
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
      amount: props.oneOffInvestment
    }
  }

  componentWillMount () {
    const {oneOffInvestment} = this.props
    this.updateOneOffInvestment(oneOffInvestment)
  }

  // -------------------------------------------------------
  // action handlers

  toggleConfirmation (visible, close = false) {
    if (parseFloat(this.state.amount) < 5) {
      Alert.alert('Investment Error', 'Minimum Invest of $5 is Required.')
      return
    }
    this.onSubmitEditing(parseFloat(this.state.amount))

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
    this.updateOneOffInvestment($)
  }

  updateField (action, field, value) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  updateOneOffInvestment ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_INVESTMENT_AMOUNT, GOAL_ENTITIES.ONE_OFF_INVESTMENT, $)
  }

  invest () {
    const {handleLocalAction, localActions, goalName, userID, childIDs, isPlaidLinked, oneOffInvestment, childID, goalID, navigator} = this.props
    if (oneOffInvestment > 0) {
      handleLocalAction({type: localActions.BUY,
        [USER_ENTITIES.USER_ID]: userID,
        [CHILD_ENTITIES.CHILD_ID]: childID,
        [GOAL_ENTITIES.GID]: goalID,
        [COMMON_ENTITIES.NAVIGATOR]: navigator,
        [GOAL_ENTITIES.NAME]: goalName,
        [GOAL_ENTITIES.ONE_OFF_INVESTMENT]: parseFloat(oneOffInvestment)
      })
    }
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

  // -------------------------------------------------------
  // child render methods

  renderBodyHeader () {
    const {firstName, goalName} = this.props
    let top = (Constants.screen.height * 50) / 812
    return (
      <View style={{marginTop: top, marginBottom: 15}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: '#FFF', fontSize: 22}}>
          How much {goalName} are we buying for {firstName}?
        </Text>
      </View>
    )
  }

  renderFundAmount () {
    const {oneOffInvestment} = this.props
    return (
      <View style={{marginTop: 24, marginHorizontal: 20}}>
        <EditableTextInput
          value={oneOffInvestment}
          textChangeListener={(text) => this.textChangeListener(text)}
          onSubmitEditing={(text) => this.onSubmitEditing(text)}
          minimumValue={1}
          formatValue={formatPrice}
          keyboardType='decimal-pad' />
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
          onPress={_.debounce(_.bind(() => this.toggleConfirmation(true), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderConfirmation () {
    const {showConfirmation} = this.state
    const {navigator, goalID, childID, goalName, oneOffInvestment, hideModal} = this.props
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
          <LI_Confirm childID={childID} isModal confirmFunc={this.invest.bind(this)} dismissConfirm={this.toggleConfirmation.bind(this)} goalID={goalID} goalName={goalName} recurringAmount={oneOffInvestment} navigator={navigator} isWithdraw={false} />
        </Modal>
      )
    }
  }

  renderNewBodyHeader () {
    const {firstName, investmentName} = this.props
    let top = (Constants.screen.height * 50) / 812
    return (
      <View style={{marginTop: top, marginBottom: 15}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: Colors.white, fontSize: 22, lineHeight: 28}}>
          How much {investmentName} are we buying for {firstName}?
        </Text>
      </View>
    )
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

  // -------------------------------------------------------
  // main render methods

  render () {
    const {isPlaidProcessing, recurringFrequency, goalAmount, navigator} = this.props
    let popFunction = () => this.props.popFunc()
    return (
      <ImageBackground source={require('../../../Img/appBackground.png')} style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={this.props.goalName} />
        <StatusBar barStyle='light-content' />
        <ProcessingIndicator isProcessing={isPlaidProcessing} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderNextButton()}
        </View>
        {this.renderConfirmation()}
      </ImageBackground>
    )
  }
}

LI_Buy.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // hide the modal
  hideModal: PropTypes.func.isRequired,

  // one off investment
  oneOffInvestment: PropTypes.number,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // first name
  firstName: PropTypes.string.isRequired,

  // goal id
  goalID: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_Buy))

export default Screen
