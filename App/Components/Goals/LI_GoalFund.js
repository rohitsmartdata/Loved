/* eslint-disable no-unused-vars,no-trailing-spaces,camelcase */
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
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  TouchableHighlight
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION, getPortfolio, COMMON_ENTITIES, FREQUENCY }
  from '../../Utility/Mapper/Common'
import {Icon, Slider}
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
import {FORM_TYPES}
  from '../../Config/contants'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
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
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
import { connect }
  from 'react-redux'
import {reduxForm, Field}
  from 'redux-form'
import Colors
  from '../../Themes/Colors'
import * as Constants
  from '../../Themes/Constants'
import ButtonGroup
  from '../../CommonComponents/ButtonGroup'
import IconF
  from 'react-native-vector-icons/FontAwesome'
import MultiSwitch
  from '../../CommonComponents/SwitchButton/MultiSwitch'
import EditableTextInput
  from '../../CommonComponents/editableTextInput'
import CustomGraph
  from '../../CommonComponents/CustomGraph/CustomGraph'
const jsonData = require('../Sprout/data.json')
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================
const AnimatedIcon = Animated.createAnimatedComponent(IconF)

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

const PROGRESS_BAR_CAP = [1, 2, 3, 4]

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class LI_GoalFund extends Component {

  constructor (props) {
    super(props)
    this.state = {
      lessInvestment: false
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    const {recurringAmount, recurringFrequency} = this.props
    this.updateRecurringAmount(recurringAmount)
    this.updateRecurringFrequency(recurringFrequency)
  }

  // --------------------------------------------------------
  // Action handlers

  generateData () {
    const {age, goalMaturityAge, portfolioRisk, recurringAmount, recurringFrequency} = this.props
    let portfolio = getPortfolio(portfolioRisk)
    let growth = portfolio.GROWTH
    let arr = []

    let duration
    switch (recurringFrequency) {
      case FREQUENCY.ONE_WEEK:
        duration = 52
        break
      case FREQUENCY.ONE_MONTH:
        duration = 12
        break
      default: duration = 52
    }

    let r = growth && parseFloat(growth)

    for (let j = 0; j < age; j++) {
      arr.push(0)
    }

    for (let i = age, n = 1; i <= 21; i++, n++) {
      let x = (1 + r / duration)
      let y = (n * duration)
      let z = Math.pow(x, y) - 1
      let z1 = z / (r / duration)
      let value = (recurringAmount * z1)
      arr.push(parseInt(value))
    }
    return arr
  }

  confirmGoal () {
    if (this.state.lessInvestment) { return }
    const {handleLocalAction, localActions, userID, isPlaidLinked, navigator, childID, goalName, portfolioRisk, goalMaturityAge, goalAmount, recurringFrequency, recurringAmount} = this.props
    handleLocalAction({
      type: localActions.CONFIRM_GOAL,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.PORTFOLIO_RISK]: portfolioRisk,
      [GOAL_ENTITIES.DURATION]: goalMaturityAge,
      [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [GOAL_ENTITIES.RECURRING_FREQUENCY]: recurringFrequency,
      [GOAL_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
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

  showDisclaimer () {
    const {handleLocalAction, localActions, navigator, isModal, showDisclaimer} = this.props
    if (isModal) {
      showDisclaimer && showDisclaimer(true)
    } else {
      handleLocalAction({type: localActions.SHOW_DISCLAIMER, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    }
  }

  updateField (action, field, value) {
    const {handleLocalAction} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  updateRecurringAmount ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_FUND_AMOUNT, GOAL_ENTITIES.RECURRING_AMOUNT, $)
  }

  updateRecurringFrequency (f) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_FUND_FREQUENCY, GOAL_ENTITIES.RECURRING_FREQUENCY, f)
    this.updateSuggestedRecurringAmount(f)
  }

  updateSuggestedRecurringAmount (f) {
    const {portfolioRisk, goalMaturityAge, age, recurringFrequency, goalAmount} = this.props
    let portfolio = getPortfolio(portfolioRisk)
    let growth = portfolio.GROWTH
    let r = growth && parseFloat(growth)
    let n = goalMaturityAge - age
    let duration
    let selectedFrequency = f || recurringFrequency
    switch (selectedFrequency) {
      case FREQUENCY.ONE_WEEK:
        duration = 52
        break
      case FREQUENCY.ONE_MONTH:
        duration = 12
        break
      default: duration = 52
    }

    let x = goalAmount * (r / duration)
    let y1 = (1 + (r / duration))
    let y2 = n * duration
    let y3 = Math.pow(y1, y2)
    let y4 = y3 - 1
    let z = x / y4
    let recurringAmount = Math.ceil(z)
    this.updateRecurringAmount(recurringAmount)
  }

  updateIndex (index) {
    let frequency
    switch (index) {
      case 0: {
        frequency = FREQUENCY.ONCE
      }
        break
      case 1: {
        frequency = FREQUENCY.ONE_WEEK
      }
        break
      case 2: {
        frequency = FREQUENCY.ONE_MONTH
      }
        break
      default: frequency = FREQUENCY.ONE_WEEK
    }
    this.updateRecurringFrequency(frequency)
  }

  textChangeListener (text) {
  }

  onSubmitEditing ($) {
    this.updateRecurringAmount($)
    if (parseInt($) < 5) {
      this.setState({
        lessInvestment: true
      })
    } else {
      this.setState({
        lessInvestment: false
      })
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderBodyHeader () {
    const {firstName} = this.props
    return (
      <View style={{marginTop: 0, paddingHorizontal: 20}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22}}>
          This is what we suggest you set aside for {firstName}.
        </Text>
      </View>
    )
  }

  renderFundAmount () {
    const {recurringAmount} = this.props
    const {lessInvestment} = this.state

    return (
      <View style={{marginTop: 24, marginHorizontal: 40}}>
        <EditableTextInput
          value={recurringAmount}
          style={{borderColor: lessInvestment && 'red' || '#9FB0C5'}}
          textChangeListener={(text) => this.textChangeListener(text)}
          onSubmitEditing={(text) => this.onSubmitEditing(text)}
          formatValue={formatPrice} />
        {
          lessInvestment &&
          <Text style={{
            fontFamily: Fonts.type.book,
            color: Colors.switchOff,
            fontSize: 11,
            marginHorizontal: 15,
            marginTop: 5,
            textAlign: 'center'
          }}>
            Minimum investment $5
          </Text>
        }
      </View>
    )
  }

  renderFundFrequency () {
    const {recurringFrequency} = this.props
    const buttons = ['Once', 'Weekly', 'Monthly']
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
      <View style={{ marginTop: 42, paddingHorizontal: 20, marginBottom: 32 }}>
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

  renderBody () {
    return (
      <View style={{flex: 8, marginTop: 15}}>
        {this.renderBodyHeader()}
        {this.renderFundAmount()}
        {this.renderFundFrequency()}
        {this.renderChildInformation()}
      </View>
    )
  }

  renderChildInformation () {
    const {goalName, firstName, goalAmount, goalMaturityAge} = this.props
    const marginTop = (Constants.screen.height * 25) / 812
    return (
      <View style={{flex: 1, backgroundColor: Colors.blue}}>
        { this.renderGraphComponent() }
        <View style={{marginTop}}>
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, textAlign: 'center', color: '#FFF'}}>
            {firstName && firstName.toUpperCase()}'s FORECAST
          </Text>
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 29, textAlign: 'center', color: '#FFF'}}>
            {goalName && formatFloatPrice(goalAmount)} at age {goalMaturityAge}
          </Text>
          <TouchableOpacity onPress={this.showDisclaimer.bind(this)}>
            <Text style={{fontFamily: Fonts.type.medium, textDecorationLine: 'underline', fontSize: 10, textAlign: 'center', color: '#FFF'}}>
              DISCLAIMER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <View style={{flex: 2, justifyContent: 'center', paddingHorizontal: 20}}>
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
          onPress={_.debounce(_.bind(() => this.confirmGoal(), this), 500, {'leading': true, 'trailing': false})}
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
      <View style={{position: 'absolute', top: 10, left: 20, right: 20}}>
        <View style={{flexDirection: 'row'}}>
          {PROGRESS_BAR_CAP.map(index => {
            return this.renderProgressCell(index <= 4)
          })}
        </View>
      </View>
    )
  }

  renderGraphComponent () {
    const {age, goalMaturityAge, recurringAmount} = this.props
    const d = this.generateData()
    return (
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <CustomGraph
          data={d}
          height={200}
          itemIndex={goalMaturityAge}
          fillColorB='rgb(248, 248, 248)'
          sphereBorderWidth={20}
          sphereBorderColor='rgba(253, 182, 20, 0.5)'
          sphereBackGroundColor='rgba(253, 182, 20, 1)'
          backgroundDivdePros={age}
          readonly
          onChange={(age, y) => {
            this.setState({ age })
            this.setState({ y })
          }}
          onMoving={(moving) => {
            this.setState({moving})
          }}
        />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isModal, initialRecurringAmount, recurringAmount, firstName, goalName, navigator} = this.props
    if (isNaN(initialRecurringAmount)) {
      this.updateRecurringAmount(recurringAmount)
    }
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={goalName} />
        <View style={{flex: 1}}>
          {this.renderBody()}
          {
            !isModal && this.renderNextButton()
          }
        </View>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_GoalFund.propTypes = {
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

  // user id
  userID: PropTypes.string.isRequired,

  // is plaid linked
  isPlaidLinked: PropTypes.bool.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // age
  age: PropTypes.number.isRequired,

  // first name of child
  firstName: PropTypes.string.isRequired,

  // is modal
  isModal: PropTypes.bool.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // goal maturity age
  goalMaturityAge: PropTypes.number.isRequired,

  // goal amount
  goalAmount: PropTypes.number.isRequired,

  // portfolio risk
  portfolioRisk: PropTypes.string.isRequired,

  // portfolio risk
  recurringAmount: PropTypes.number.isRequired,

  // initial recurring amount
  initialRecurringAmount: PropTypes.number.isRequired,

  // portfolio frequency
  recurringFrequency: PropTypes.string.isRequired
}

LI_GoalFund.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_GoalFund))

export default Screen
