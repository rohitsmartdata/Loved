/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces,no-undef */
/**
 * Created by demon on 14/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  StatusBar,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  LayoutAnimation
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION, COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import { FormInput, Icon, Slider }
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import HTML
  from 'react-native-render-html'
import CustomNav
  from '../../Containers/Common/CustomNav'
import _
  from 'lodash'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import {reduxForm, Field}
  from 'redux-form'
import Colors
  from '../../Themes/Colors'
import ShadowedContainer
  from '../../CommonComponents/ShadowedContainer'
import EditableTextInput
  from '../../CommonComponents/editableTextInput'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

const PROGRESS_BAR_CAP = [1, 2, 3, 4]

// ========================================================
// Core Component
// ========================================================

class LI_GoalAmount extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    const {goalAmount} = this.props
    this.updateGoalAmount(goalAmount)
  }

  // --------------------------------------------------------
  // Action handlers

  updateField (action, field, value) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  updateGoalAmount ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_GOAL_AMOUNT, GOAL_ENTITIES.GOAL_AMOUNT, Math.floor($))
  }

  pushHandler () {
    const {handleLocalAction, localActions, navigator, pushFunc} = this.props
    handleLocalAction({type: localActions.PUSH, 'pushFunc': pushFunc})
  }

  popHandler () {
    const {handleLocalAction, localActions, popFunc} = this.props
    handleLocalAction({type: localActions.POP, 'popFunc': popFunc})
  }

  continueHandler () {
    const {handleLocalAction, localActions, pushFunc, childID, goalName} = this.props
    handleLocalAction({type: localActions.CONTINUE, 'pushFunc': pushFunc, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.NAME]: goalName})
  }

  onTextChange (text) {
  }

  selectGoalDuration () {
    const {handleLocalAction, localActions, navigator, childID, userID, goalAmount, goalName} = this.props
    handleLocalAction({type: localActions.SELECT_GOAL_DURATION,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderBodyHeader () {
    const {firstName, goalName} = this.props
    return (
      <View style={{alignItems: 'center', marginTop: 32}}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#1C3C70', fontSize: 17 }}>
          Your plan for {firstName || ''}'s
        </Text>
        <Text style={{...styles.screen.h2.textStyle, marginTop: 18, fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 27}}>
          {goalName} Fund
        </Text>
      </View>
    )
  }

  textChangeListener (text) {
  }

  onSubmitEditing (text) {
    this.updateGoalAmount(text)
  }

  renderAmountDisplay () {
    const {goalAmount} = this.props
    return (
      <View style={{marginTop: 18, marginHorizontal: 20}}>
        <Text style={{...styles.screen.h2.textStyle, marginBottom: 5, textAlign: 'center', fontFamily: Fonts.type.semibold, color: '#1C3C70', fontSize: 17}}>
          To Reach
        </Text>
        <EditableTextInput
          value={goalAmount}
          textChangeListener={(text) => this.textChangeListener(text)}
          onSubmitEditing={(text) => this.onSubmitEditing(text)}
          minimumValue={1000}
          formatValue={formatPrice} />
      </View>
    )
  }

  renderAmountSlider () {
    const {goalAmount} = this.props
    const minValue = 1000
    const maxValue = 99999
    const step = 1000

    return (
      <View style={{marginTop: 16}}>
        <Slider
          accessible
          accessibilityLabel={'Set Amount'}
          accessibilityRole={'adjustable'}
          minimumValue={minValue}
          maximumTrackTintColor='rgba(0, 0, 0, 0.2)'
          minimumTrackTintColor='#397BDF'
          maximumValue={maxValue}
          step={step}
          value={goalAmount}
          trackStyle={{
            height: 10,
            backgroundColor: '#FFF',
            borderColor: '#397BDF',
            borderWidth: 1,
            borderRadius: 20
          }}
          thumbStyle={{
            width: 20,
            height: 20,
            top: 25,
            borderRadius: 50,
            borderWidth: 0,
            backgroundColor: '#FDB614',
            shadowOpacity: 1,
            shadowColor: '#FDB614',
            shadowOffset: {width: 0, height: 0},
            shadowRadius: 8
          }}
          style={{width: '100%'}}
          onValueChange={$ => requestAnimationFrame(() => this.updateGoalAmount($))} />

        <View style={{flexDirection: 'row', height: 10, marginTop: 5, justifyContent: 'space-between'}}>
          {
            arr.map(i => <View style={{width: 1, height: 10, backgroundColor: '#9FB0C5'}} />)
          }
        </View>

      </View>
    )
  }

  renderBodyFooter () {
    return (
      <View style={{marginTop: 20, marginHorizontal: 20}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.semibold, color: '#1C3C70', fontSize: 18}}>
          Choose an amount you wish to achieve, even if it’s beyond your wildest dreams.
        </Text>
      </View>
    )
  }

  renderBody () {
    return (
      <View style={{flex: 8}}>
        {this.renderBodyHeader()}
        {this.renderAmountDisplay()}
        {this.renderAmountSlider()}
        {this.renderBodyFooter()}
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <View style={{flex: 2, justifyContent: 'center'}}>
        {this.renderProgressBar()}
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
          onPress={_.debounce(_.bind(() => this.selectGoalDuration(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderProgressCell (enabled) {
    return (
      <View style={{height: 10, flex: 1, marginHorizontal: 3, borderRadius: 3, borderWidth: enabled ? 0 : 1, borderColor: '#707070', backgroundColor: enabled ? '#397BDF' : '#FFF'}} />
    )
  }

  renderProgressBar () {
    return (
      <View style={{position: 'absolute', top: 10, left: 0, right: 0}}>
        <View style={{flexDirection: 'row'}}>
          {PROGRESS_BAR_CAP.map(index => {
            return this.renderProgressCell(index <= 1)
          })}
        </View>
      </View>
    )
  }

// --------------------------------------------------------
// Core render method

  render () {
    const {isVisible, code, isModal, navigator, pushFunc, popFunc, firstName, goalName} = this.props
    let heading = firstName + '\'s ' + goalName + ' Fund'
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <StatusBar barStyle='light-content' />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={goalName} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderNextButton()}
        </View>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_GoalAmount.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // is modal visible
  isVisible: PropTypes.bool.isRequired,

  // binded modal hide func
  foo: PropTypes.func.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // pop function
  popFunc: PropTypes.func.isRequired,

  // forward function
  pushFunc: PropTypes.func.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // child name
  firstName: PropTypes.string.isRequired,

  // is modal
  isModal: PropTypes.bool.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // goal amount
  goalAmount: PropTypes.number.isRequired
}

LI_GoalAmount.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_GoalAmount))

export default Screen
