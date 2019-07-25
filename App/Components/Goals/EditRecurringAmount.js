/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 29/5/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, ActionSheetIOS, Text, Dimensions, Modal, ScrollView, TouchableHighlight, TouchableOpacity}
  from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
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
import {FREQUENCY, getFrequencyTitle, getFrequencyShortTitle, DEVICE_LOGICAL_RESOLUTION}
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
import _
  from 'lodash'

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

class EditRecurringAmount extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      investOpen: false,
      inputWidth: 50
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentWillMount () {
    const {currentRecurringFrequency, currentRecurringAmount} = this.props
    this.updateRecurringAmount(currentRecurringAmount)
    this.updateRecurringFrequency(currentRecurringFrequency)
  }

  // -------------------------------------------------------
  // action handlers

  showRecurringActionSheet () {
    const {recurringFrequency} = this.props
    const arr = ['Cancel', recurringFrequency === FREQUENCY.ONE_WEEK ? 'Keep as weekly' : 'Set to weekly', recurringFrequency === FREQUENCY.FORTNIGHT ? 'Keep as 2-weekly' : 'Set to 2-weekly', recurringFrequency === FREQUENCY.ONE_MONTH ? 'Keep as monthly' : 'Set to monthly']
    ActionSheetIOS.showActionSheetWithOptions({
      options: arr,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          this.updateRecurringFrequency(FREQUENCY.ONE_WEEK)
          break
        case 2:
          this.updateRecurringFrequency(FREQUENCY.FORTNIGHT)
          break
        case 3:
          this.updateRecurringFrequency(FREQUENCY.ONE_MONTH)
          break
      }
    })
  }

  pause () {
    const {handleLocalAction, localActions, navigator, childID, userID, goalID, recurringID} = this.props
    handleLocalAction({
      type: localActions.MODIFY,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.INSTRUCTION_ID]: recurringID,
      [GOAL_ENTITIES.INSTRUCTION_ACTION]: 'stop'
    })
  }

  cancel () {
    const {handleLocalAction, localActions, navigator, childID, userID, goalID, recurringID} = this.props
    handleLocalAction({
      type: localActions.MODIFY,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.INSTRUCTION_ID]: recurringID,
      [GOAL_ENTITIES.INSTRUCTION_ACTION]: 'stop'
    })
  }

  resume () {
    const {handleLocalAction, localActions, navigator, childID, userID, goalID, recurringID} = this.props
    handleLocalAction({
      type: localActions.MODIFY,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.INSTRUCTION_ID]: recurringID,
      [GOAL_ENTITIES.INSTRUCTION_ACTION]: 'resume'
    })
  }

  updateRecurringAmount ($) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.UPDATE_RECURRING_AMOUNT, [GOAL_ENTITIES.RECURRING_AMOUNT]: $})
    this.textChangeListener($)
  }

  updateRecurringFrequency (f) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.UPDATE_RECURRING_FREQUENCY, [GOAL_ENTITIES.RECURRING_FREQUENCY]: f})
  }

  modifyRecurringAmount () {
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

  textChangeListener (amount) {
    this.setState({ inputWidth: amount && amount.toString().length > 0 ? amount.toString().trim().length * 25 : 25 })
  }

  // -------------------------------------------------------
  // child render methods

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle}}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20}}>
          Edit regular investment?
        </Text>
      </View>
    )
  }
  normalizeAmount = (value, previousValue) => {
    // return (parseInt(value)).toLocaleString('en-US', {style: 'decimal', currency: 'USD', minimumFractionDigits: 0})

    if (!value) {
      return value
    }
    // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    const onlyNums = value.replace(/[^\d]/g, '')
    if (!previousValue || value.length > previousValue.length) {
      // typing forward
      if (onlyNums.length === 4) {
        return onlyNums.slice(0, 1) + ',' + onlyNums.slice(1)
      }
      if (onlyNums.length === 5) {
        return onlyNums.slice(0, 2) + ',' + onlyNums.slice(2)
      }
    }
    if (onlyNums.length === 4) {
      return onlyNums.slice(0, 1) + ',' + onlyNums.slice(1)
    }
    if (onlyNums.length <= 3) {
      return onlyNums
    }
    return onlyNums + ' '
  }

  renderRecurringInput () {
    const {recurringAmount, recurringFrequency} = this.props
    const {inputWidth} = this.state
    const isNormaliPhone = this.isNormaliPhone || false
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: isNormaliPhone ? 25 : 50}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontFamily: Fonts.type.semibold, color: '#000', fontSize: 40, bottom: 5, backgroundColor: 'transparent'}}>
            $
          </Text>
          <View style={{width: inputWidth}}>
            <Field
              whiteBackground
              selectionColor={'transparent'}
              name={GOAL_ENTITIES.RECURRING_AMOUNT}
              autoFocus
              focusSmoothly
              contextMenuHidden
              component={LWTextInput}
              showBorder={false}
              extraTextStyle={{bottom: 5, fontFamily: Fonts.type.semibold, fontSize: 40, color: '#000', width: inputWidth}}
              normalize={this.normalizeAmount}
              maxLength={6}
              accessible
              accessibilityLabel={'Investment Amount'}
              accessibilityRole={'keyboardkey'}
              textChangeListener={this.textChangeListener.bind(this)}
              returnKeyType='next' placeholderText='0' keyboardType='number-pad' />
          </View>
        </View>
        <Text style={{fontFamily: Fonts.type.semibold, textAlign: 'center', color: '#000', fontSize: 16, bottom: 0, backgroundColor: 'transparent'}}>
          {recurringFrequency && getFrequencyTitle(recurringFrequency)}
        </Text>
        {this.renderNextButton()}
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    const {status, recurringFrequency} = this.props
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 20}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Show recurring action sheet'}
          accessibilityRole={'button'}
          onPress={() => this.showRecurringActionSheet()}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#10427E', backgroundColor: 'transparent'}}>
            Edit {recurringFrequency && getFrequencyShortTitle(recurringFrequency)} frequency
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={status === 'stopped' ? 'Resume recurring investment' : 'Pause recurring investment'}
          accessibilityRole={'button'}
          onPress={() => { status === 'stopped' ? this.resume() : this.pause() }} style={{marginTop: 32}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#10427E', backgroundColor: 'transparent'}}>
            {status === 'stopped' ? 'Resume recurring investment' : 'Pause recurring investment'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Cancel recurring investment'}
          accessibilityRole={'button'}
          style={{marginTop: 32}} onPress={() => this.cancel()}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#10427E', backgroundColor: 'transparent'}}>
            Cancel recurring investment
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderDecisionButton () {
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Confirm'}
          accessibilityRole={'button'}
          style={{...styles.bottomNavigator.containerStyle, marginHorizontal: 20}} onPress={_.debounce(_.bind(() => this.modifyRecurringAmount(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Confirm</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // -------------------------------------------------------
  // main render methods

  render () {
    const {navigator, isProcessing, childName, goalName} = this.props
    let heading = (childName && goalName && (childName + '\' ' + goalName)) || 'Edit Recurring Amount'
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title={heading} />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={250}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{...styles.screen.containers.keyboard, paddingHorizontal: 16}}
        >
          <ProcessingIndicator isProcessing={isProcessing} />
          {this.renderHeading()}
          {this.renderRecurringInput()}
          {this.renderNextButton()}
        </KeyboardAwareScrollView>
        {this.renderDecisionButton()}
      </View>
    )
  }
}

EditRecurringAmount.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  userID: PropTypes.string.isRequired,
  childID: PropTypes.string.isRequired,
  goalID: PropTypes.string.isRequired,
  goalName: PropTypes.string.isRequired,
  childName: PropTypes.string.isRequired,

  recurringAmount: PropTypes.number.isRequired,
  recurringFrequency: PropTypes.string.isRequired,

  currentRecurringAmount: PropTypes.number.isRequired,
  currentRecurringFrequency: PropTypes.number.isRequired,

  recurringID: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(EditRecurringAmount))

export default Screen
