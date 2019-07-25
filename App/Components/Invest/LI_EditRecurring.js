/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces,operator-linebreak */
/**
 * Created by demon on 31/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, StatusBar, Dimensions, ScrollView, TouchableHighlight, TouchableOpacity, Image, ImageBackground, Alert}
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
import {COMMON_ENTITIES, FREQUENCY, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
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
import MultiSwitch
  from '../../CommonComponents/SwitchButton/MultiSwitch'
import Colors from '../../Themes/Colors'
import * as Constants from '../../Themes/Constants'
import loginPinStyles from '../Common/Styles/LoginPinStyle'
import {Icon}
  from 'react-native-elements'
// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.EDIT_RECURRING,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class LI_EditRecurring extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.state = {
      showConfirmation: false,
      isClick: false,
      ShowScreen: false,
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
      amount: props.currentRecurringAmount,
      investmentType: props.currentRecurringFrequency === '1M' ? 'Monthly' : 'Weekly'
    }
  }

  componentWillMount () {
    const {currentRecurringAmount} = this.props
    this.updateRecurringAmount(currentRecurringAmount || 5)
  }

  componentDidMount () {
    const {currentRecurringFrequency} = this.props
    this.updateRecurringFrequency(currentRecurringFrequency || FREQUENCY.ONCE)
  }

  // -------------------------------------------------------
  // action handlers

  cancelRecurringInstruction () {
    const {handleLocalAction, localActions, userID, navigator, childID, goalID, recurringID} = this.props
    handleLocalAction({
      type: localActions.CANCEL_USER_INSTRUCTION,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.INSTRUCTION_ID]: recurringID,
      [GOAL_ENTITIES.INSTRUCTION_ACTION]: 'stop',
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  updateRecurringAmount ($) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.UPDATE_RECURRING_AMOUNT, [GOAL_ENTITIES.RECURRING_AMOUNT]: $})
  }

  updateRecurringFrequency (f) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.UPDATE_RECURRING_FREQUENCY, [GOAL_ENTITIES.RECURRING_FREQUENCY]: f})
  }

  update () {
    const {handleLocalAction, localActions, navigator, childID, userID, goalID, recurringID, recurringFrequency, recurringAmount} = this.props
    handleLocalAction({
      type: localActions.MODIFY_RECURRING_AMOUNT,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.INSTRUCTION_ID]: recurringID,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [GOAL_ENTITIES.RECURRING_FREQUENCY]: recurringFrequency
    })
  }

  onContinuePress () {
    if (parseFloat(this.state.amount) < 5) {
      Alert.alert('Investment Error', 'Minimum Invest of $5 is Required.')
      return
    }
    this.setState({ShowScreen: false})
  }

  toggleConfirmation (visible, close = false) {
    if (visible) {
      if (parseFloat(this.state.amount) < 5) {
        Alert.alert('Investment Error', 'Minimum Invest of $5 is Required.')
        return
      }
      this.updateRecurringAmount(this.state.amount)
    }

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
    this.updateRecurringAmount($)
  }

  updateIndex (index) {
    let frequency
    switch (index) {
      case 0: {
        frequency = FREQUENCY.ONE_WEEK
      }
        break
      case 1: {
        frequency = FREQUENCY.ONE_MONTH
      }
        break
      default: frequency = FREQUENCY.ONE_WEEK
    }
    this.updateRecurringFrequency(frequency)
  }

  // -------------------------------------------------------
  // child render methods

  // renderBodyHeader () {
  //   const {firstName, goalName} = this.props
  //   return (
  //     <View style={{marginTop: 20}}>
  //       <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22}}>
  //         Change {firstName}'s investment into {goalName}?
  //       </Text>
  //     </View>
  //   )
  // }

  renderFundAmount () {
    const {recurringAmount, currentRecurringAmount} = this.props
    return (
      <View style={{marginTop: 24, marginHorizontal: 20}}>
        <EditableTextInput
          value={recurringAmount}
          textChangeListener={(text) => this.textChangeListener(text)}
          onSubmitEditing={(text) => this.onSubmitEditing(text)}
          minimumValue={1}
          formatValue={formatPrice} />
        {
          currentRecurringAmount
          &&
          <View style={{marginTop: 5}}>
            <Text style={{textAlign: 'center', fontFamily: Fonts.type.medium, fontSize: 12, color: '#707070'}}>
              Current {formatPrice(currentRecurringAmount)}
            </Text>
          </View>
        }
      </View>
    )
  }

  renderFundFrequency () {
    let {recurringFrequency} = this.props
    let selectedIndex
    switch (recurringFrequency) {
      case FREQUENCY.ONCE: {
        selectedIndex = 0
      }
        break
      case FREQUENCY.ONE_WEEK: {
        selectedIndex = 1
      }
        break
      case FREQUENCY.ONE_MONTH: {
        selectedIndex = 2
      }
        break
      default: selectedIndex = 1
    }
    return (
      <View style={{marginTop: 20}}>
        <MultiSwitch
          currentStatus={'Open'}
          disableScroll={value => {
          }}
          isParentScrollEnabled={false}
          onStatusChanged={text => {
          }}
          selectedIndex={selectedIndex}
          updateIndex={this.updateIndex.bind(this)}
        />
      </View>
    )
  }

  renderMainComponent () {
    const {amount, investmentType} = this.state
    const {investmentFrequency} = this.props

    return (
      <View style={{backgroundColor: '#DEDEDE', width: 96, borderRadius: 6, alignSelf: 'center', marginVertical: 73, paddingVertical: 5}}>
        {this.renderInvestmentTypeButton('Weekly')}
        {this.renderInvestmentTypeButton('Monthly')}
      </View>
    )
  }

  investmentTypeButton (title) {
    this.setState({investmentType: title})

    switch (title) {
      case 'Weekly':
        this.updateIndex(0)
        break
      case 'Monthly':
        this.updateIndex(1)
        break
      default:
        break
    }
  }

  renderInvestmentTypeButton (text) {
    const isX = this.isX || false

    if (this.state.investmentType === text) {
      return (

        <TouchableOpacity
          accessible
          accessibilityLabel={'selected-frequency'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            shadowOpacity: 0.16,
            shadowRadius: 6,
            shadowOffset: {x: 0, y: 3},
            width: '85%',
            alignSelf: 'center'
          }}
          onPress={_.debounce(_.bind(() => this.investmentTypeButton(text), this), 500, {
            'leading': true,
            'trailing': false
          })}
        >
          <Text style={{...styles.text.title,
            color: Colors.blue}}>{text}</Text>
        </TouchableOpacity>
      )
    } else {
      return (

        <TouchableOpacity
          accessible
          accessibilityLabel={'unselected-frequency'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            backgroundColor: 'transparent'
          }}
          onPress={_.debounce(_.bind(() => this.investmentTypeButton(text), this), 500, {
            'leading': true,
            'trailing': false
          })}
        >
          <Text style={{...styles.text.title, color: Colors.blue, opacity: 0.5}}>{text}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderBody () {
    const {ShowScreen} = this.state
    return (
      <View style={{flex: 9.3}}>
        {this.renderBodyHeader()}
        {this.renderTextAmount()}
        {!ShowScreen && this.renderMainComponent() || this.renderPadContainer()}

      </View>
    )
  }

  renderBodyHeader () {
    const {firstName, goalName} = this.props
    let top = (Constants.screen.height * 50) / 812
    return (
      <View style={{marginTop: top, marginBottom: 15}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: Colors.white, fontSize: 22, lineHeight: 28}}>
          Change {firstName}'s investment into {goalName}?
        </Text>
      </View>
    )
  }

  renderButton (title, center) {
    let containerSize = 70
    let diameter = Constants.screen.height * 0.0850
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

  renderTextAmount () {
    const {currentRecurringAmount, currentRecurringFrequency} = this.props
    let frequency = ''

    switch (currentRecurringFrequency) {
      case FREQUENCY.ONE_WEEK:
        frequency = 'Weekly'
        break

      case FREQUENCY.ONE_MONTH:
        frequency = 'Monthly'
        break
    }

    return (
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => this.setState({ShowScreen: true})}
        >
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 30, lineHeight: 49, textAlign: 'center', color: Colors.buttonYellow}}>
            {formatFloatPrice(this.state.amount)}
          </Text>
        </TouchableOpacity>
        )

        {
          currentRecurringAmount
          &&
          <View style={{marginTop: 10}}>
            <TouchableOpacity
              onPress={() => this.setState({ShowScreen: false})}
            >
              <Text style={{textAlign: 'center', fontFamily: Fonts.type.helvetica, fontSize: 12, color: '#fff'}}>
                Currently {formatPrice(currentRecurringAmount)} {frequency}
              </Text>
            </TouchableOpacity>
          </View>
        }
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

  renderNextButton () {
    const isX = this.isX || false
    const { ShowScreen } = this.state
    return (
      <View style={{flex: 2, justifyContent: 'center', marginHorizontal: 20}}>
        {
            !ShowScreen ? <View><TouchableHighlight
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
              <Text style={[styles.bottomNavigator.textStyle, {color: Colors.darkBlue}]}>Confirm Investment</Text>

            </TouchableHighlight>
              <TouchableOpacity onPress={() => this.cancelRecurringInstruction()} style={{alignItems: 'center', paddingTop: 15}}>
                <Text style={{fontFamily: Fonts.type.book, color: Colors.white, fontSize: 18, opacity: 0.5}}>Cancel Recurring Investment</Text>
              </TouchableOpacity>
            </View> : <TouchableHighlight
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
              onPress={() => this.onContinuePress()}
            >
              <Text style={[styles.bottomNavigator.textStyle, {color: Colors.darkBlue}]}>Continue</Text>
            </TouchableHighlight>
        }

      </View>
    )
  }

  renderConfirmation () {
    const {showConfirmation} = this.state
    const {navigator, goalID, childID, goalName, recurringAmount, hideModal} = this.props
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
          <LI_Confirm childID={childID} isModal confirmFunc={this.update.bind(this)} dismissConfirm={this.toggleConfirmation.bind(this)} goalID={goalID} goalName={goalName} recurringAmount={recurringAmount} navigator={navigator} isWithdraw={false} />
        </Modal>
      )
    }
  }

  // -------------------------------------------------------
  // main render methods

  render () {
    const {isProcessing, goalName, navigator} = this.props
    const {ShowScreen} = this.state
    let popFunction = () => this.props.popFunc()
    return (
      <ImageBackground source={require('../../../Img/appBackground.png')} style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent gradientBackdrop titlePresent title={ShowScreen && goalName || 'Auto-Invest'} />
        <StatusBar barStyle='light-content' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderNextButton()}
        </View>
        {this.renderConfirmation()}
      </ImageBackground>
    )
  }
}

LI_EditRecurring.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // goal id
  goalID: PropTypes.string.isRequired,

  // first name
  firstName: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // current recurring amount
  currentRecurringAmount: PropTypes.number.isRequired,

  // current recurring frequency
  currentRecurringFrequency: PropTypes.string.isRequired,

  // hide the modal
  hideModal: PropTypes.func.isRequired,

  // recurring id
  recurringID: PropTypes.string.isRequired,

  // status
  status: PropTypes.string.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // recurring amount
  recurringAmount: PropTypes.number.isRequired,

  // recurring frequency
  recurringFrequency: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_EditRecurring))

export default Screen
