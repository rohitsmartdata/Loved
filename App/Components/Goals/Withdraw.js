/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/5/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, TouchableOpacity, Image, ScrollView, Dimensions, LayoutAnimation, TextInput }
  from 'react-native'
import { connect }
  from 'react-redux'
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
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, CUSTOM_LIST_ENTITIES, DEVICE_LOGICAL_RESOLUTION, BUTTON_TYPES, getPortfolio}
  from '../../Utility/Mapper/Common'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import Fonts
  from '../../Themes/Fonts'
import LWTextInput
  from '../Utility/LWFormInput'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {formatPrice}
  from '../../Utility/Transforms/Converter'

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

class Withdraw extends Component {

  // ------------------------------------------------------------
  // Life cycle methods

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.state = {
      inputWidth: 25
    }
  }

  componentWillMount () {
    this.props.initialize()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  // ------------------------------------------------------------
  // Action handler

  _withdraw (data) {
    const {handleLocalAction, localActions, userID, childID, goalID, navigator, goalName, goalBalance} = this.props
    let withdrawAmount = data[GOAL_ENTITIES.WITHDRAW_AMOUNT] && parseFloat(data[GOAL_ENTITIES.WITHDRAW_AMOUNT])
    let displayAmount = withdrawAmount
    const threshold = 0.95 * goalBalance
    if (!withdrawAmount || withdrawAmount === 0 || withdrawAmount > goalBalance) {
      Alert.alert('Warning', 'Withdraw amount cannot be greater than available amount.')
    } else {
      if (withdrawAmount >= threshold) {
        withdrawAmount = -1
      }
      handleLocalAction({type: localActions.WITHDRAW, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [GOAL_ENTITIES.NAME]: goalName, [COMMON_ENTITIES.NAVIGATOR]: navigator, [GOAL_ENTITIES.WITHDRAW_AMOUNT]: withdrawAmount, [GOAL_ENTITIES.WITHDRAW_DISPLAY_AMOUNT]: displayAmount})
    }
  }

  textChangeListener (amount) {
    this.setState({ inputWidth: amount && amount.toString().length > 0 ? amount.toString().length * 25 : 25 })
  }

  // ------------------------------------------------------------
  // Internal component

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle}}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20}}>
          How much are we withdrawing?
        </Text>
      </View>
    )
  }

  renderSubheading () {
    const {goalBalance} = this.props
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
        <Text style={{color: '#000', fontSize: 14, fontFamily: Fonts.type.bold, backgroundColor: 'transparent'}}>
          Available
        </Text>
        <Text style={{color: '#000', fontSize: 20, marginTop: 10, fontFamily: Fonts.type.regular, backgroundColor: 'transparent'}}>
          {formatPrice(goalBalance)}
        </Text>
      </View>
    )
  }

  renderForm () {
    const {inputWidth} = this.state
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
        <Text style={{color: '#000', fontSize: 14, fontFamily: Fonts.type.bold, backgroundColor: 'transparent'}}>
          Withdrawal
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
          <Text style={{fontFamily: Fonts.type.semibold, color: '#10427E', fontSize: 40, bottom: 5, marginRight: 5, backgroundColor: 'transparent'}}>
            $
          </Text>
          <View style={{width: inputWidth}}>
            <Field
              whiteBackground
              selectionColor={'transparent'}
              name={GOAL_ENTITIES.WITHDRAW_AMOUNT}
              autoFocus
              contextMenuHidden
              component={LWTextInput}
              showBorder={false}
              extraTextStyle={{bottom: 5, fontFamily: Fonts.type.semibold, fontSize: 40, color: '#10427E', width: inputWidth}}
              maxLength={5}
              accessible
              accessibilityLabel={'Withdraw Amount'}
              accessibilityRole={'keyboardkey'}
              textChangeListener={this.textChangeListener.bind(this)}
              returnKeyType='next' placeholderText='0' keyboardType='decimal-pad' />
          </View>
        </View>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Confirm'}
          accessibilityRole={'button'}
          style={{ ...styles.bottomNavigator.containerStyle }}
          onPress={handleSubmit(data => this._withdraw(data))}
        >
          <Text style={styles.bottomNavigator.textStyle}>Confirm</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // ------------------------------------------------------------
  // Core component

  render () {
    const {navigator, childName, goalName, isProcessing, goalBalance} = this.props
    let title = childName + '\'s ' + goalName
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title={title} />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ ...styles.screen.containers.keyboard, paddingHorizontal: 30, paddingTop: 30 }}
        >
          {this.renderHeading()}
          {this.renderSubheading()}
          {this.renderForm()}
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
      </View>
    )
  }

}

Withdraw.propTypes = {
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
  isProcessing: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(Withdraw))

export default Screen
