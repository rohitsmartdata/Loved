/* eslint-disable no-unused-vars,no-trailing-spaces,block-spacing,spaced-comment */
/**
 * Created by viktor on 5/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Dimensions, Modal, ScrollView, TouchableHighlight, TouchableOpacity}
  from 'react-native'
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
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import LWTextInput
  from '../Utility/LWFormInput'
import GravityCapsule
  from '../Utility/GravityCapsule'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'

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

class RecurringAmount extends Component {

  // --------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      investOpen: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
    const isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.isNormaliPhone = isNormaliPhone
    this.state = {
      inputWidth: 80
    }
  }

  componentWillMount () {
    this.updateOneOffInvestment(20)
  }

  // -------------------------------------------------------
  // action handlers

  updateField (action, field, value) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  updateOneOffInvestment ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_ONE_OFF_INVESTMENT, GOAL_ENTITIES.ONE_OFF_INVESTMENT, $)
  }

  invest () {
    const {handleLocalAction, localActions, goalName, userID, childIDs, isPlaidLinked, oneOffInvestment, childID, goalID, navigator} = this.props
    if (oneOffInvestment > 0) {
      handleLocalAction({type: localActions.SHOW_INVEST,
        [USER_ENTITIES.USER_ID]: userID,
        [CHILD_ENTITIES.CHILD_ID]: childID,
        [GOAL_ENTITIES.GID]: goalID,
        [COMMON_ENTITIES.NAVIGATOR]: navigator,
        [USER_ENTITIES.PLAID_LINKED]: isPlaidLinked,
        [GOAL_ENTITIES.NAME]: goalName,
        [GOAL_ENTITIES.ONE_OFF_INVESTMENT]: oneOffInvestment,
        [CHILD_ENTITIES.CHILD_IDs]: childIDs
      })
    }
  }

  textChangeListener (amount) {
    this.setState({ inputWidth: amount && amount.toString().length > 0 ? amount.toString().length * 40 : 80 })
  }

  // -------------------------------------------------------
  // child render methods

  renderHeading () {
    const {goalName} = this.props
    return (
      <View style={{marginTop: 32}}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000', fontSize: 20}}>
          How much would you like to invest into {goalName}?
        </Text>
      </View>
    )
  }

  renderRecurringInput () {
    const isNormaliPhone = this.isNormaliPhone || false
    const {inputWidth} = this.state
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: isNormaliPhone ? 60 : 100}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontFamily: Fonts.type.semibold, color: '#10427E', fontSize: 60, height: 100, bottom: 13, marginRight: 5, backgroundColor: 'transparent'}}>
            $
          </Text>
          <View style={{width: inputWidth}}>
            <Field
              whiteBackground
              selectionColor={'transparent'}
              name={GOAL_ENTITIES.ONE_OFF_INVESTMENT}
              autoFocus
              focusSmoothly
              contextMenuHidden
              component={LWTextInput}
              showBorder={false}
              extraTextStyle={{bottom: 5, lineHeight: 65, fontFamily: Fonts.type.semibold, fontSize: 60, color: '#10427E', height: 55, width: inputWidth}}
              maxLength={5}
              accessible
              accessibilityLabel={'Investment Amount'}
              accessibilityRole={'keyboardkey'}
              textChangeListener={this.textChangeListener.bind(this)}
              returnKeyType='next' placeholderText='20' keyboardType='number-pad' />
          </View>
        </View>
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Invest'}
          accessibilityRole={'button'}
          style={{...styles.bottomNavigator.containerStyle, marginHorizontal: 20}} onPress={() => this.invest()}>
          <Text style={styles.bottomNavigator.textStyle}>INVEST</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // -------------------------------------------------------
  // main render methods

  render () {
    const {isPlaidProcessing, recurringFrequency, goalAmount} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={this.props.navigator} leftButtonPresent titlePresent title='CREATE INVESTMENT' />
        <ScrollView
          contentContainerStyle={{...styles.screen.containers.root, paddingLeft: 16, paddingRight: 16}}
          scrollEnabled={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
        >
          <ProcessingIndicator isProcessing={isPlaidProcessing} />
          {this.renderHeading()}
          {this.renderRecurringInput()}
          {this.renderNextButton()}
        </ScrollView>
      </View>
    )
  }
}

RecurringAmount.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  oneOffInvestment: PropTypes.number,
  isPlaidLinked: PropTypes.bool.isRequired,

  userID: PropTypes.string.isRequired,
  childID: PropTypes.string.isRequired,
  goalID: PropTypes.string.isRequired,

  childIDs: PropTypes.array,

  isPlaidProcessing: PropTypes.bool.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(RecurringAmount))

export default Screen
