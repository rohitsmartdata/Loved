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
  LayoutAnimation,
  TouchableHighlight
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION, COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import {reduxForm, Field}
  from 'redux-form'
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
import _
  from 'lodash'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'
import moment from 'moment'
import Colors from '../../Themes/Colors'

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

class LI_GoalDuration extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.state = {
      showPrepareInvestment: false
    }
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    const {goalMaturityAge} = this.props
    this.updateGoalMaturityAge(goalMaturityAge)
  }

  // --------------------------------------------------------
  // Action handlers

  updateField (action, field, value) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  updateGoalMaturityAge (age) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_GOAL_MATURITY_AGE, GOAL_ENTITIES.GOAL_MATURITY_AGE, age)
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

  selectGoalPortfolio () {
    this.setState({showPrepareInvestment: true}, () => {
      setTimeout(() => {
        this.onNext()
        const {handleLocalAction, localActions, userID, navigator, goalAmount, goalName, goalMaturityAge, childID} = this.props
        handleLocalAction({type: localActions.CONTINUE_PREPAREATION,
          [CHILD_ENTITIES.CHILD_ID]: childID,
          [GOAL_ENTITIES.NAME]: goalName,
          [USER_ENTITIES.USER_ID]: userID,
          [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount,
          [GOAL_ENTITIES.GOAL_MATURITY_AGE]: goalMaturityAge,
          [COMMON_ENTITIES.NAVIGATOR]: navigator})
      }, 2000)
    })
    // const {handleLocalAction, localActions, navigator, childID} = this.props
    // handleLocalAction({type: localActions.SELECT_GOAL_PORTFOLIO, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  onNext () {
    this.setState({showPrepareInvestment: false})
  }
  // --------------------------------------------------------
  // Child Components

  renderBodyHeader () {
    const {firstName, goalName, goalAmount} = this.props
    return (
      <View style={{alignItems: 'center', marginTop: 32}}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#1C3C70', fontSize: 17 }}>
          Your plan for {firstName}'s
        </Text>
        <Text style={{...styles.screen.h2.textStyle, marginTop: 18, fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 27}}>
          {goalName} Fund
        </Text>
        <Text style={{ ...styles.screen.h2.textStyle, marginTop: 18, fontFamily: Fonts.type.semibold, color: '#1C3C70', fontSize: 17 }}>
          To Reach
        </Text>
        <Text style={{...styles.screen.h2.textStyle, marginTop: 18, fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 27}}>
          {formatPrice(goalAmount)}
        </Text>
      </View>
    )
  }

  renderAmountDisplay () {
    const {goalMaturityAge, firstName} = this.props
    return (
      <View style={{marginTop: 18, marginHorizontal: 20}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.semibold, color: '#1C3C70', fontSize: 17}}>
          For when {firstName} is
        </Text>
        <View style={{borderWidth: 1, height: 54, justifyContent: 'center', borderColor: '#9FB0C5', marginTop: 10, borderRadius: 50}}>
          <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 27}}>
            {goalMaturityAge} years old
          </Text>
        </View>
      </View>
    )
  }

  renderAmountSlider () {
    const {goalMaturityAge, minAgeValue} = this.props
    const maxValue = 21
    const step = 1
    return (
      <View style={{marginTop: 16}}>
        <Slider
          accessible
          accessibilityLabel={'Set Amount'}
          accessibilityRole={'adjustable'}
          minimumValue={minAgeValue}
          maximumTrackTintColor='rgba(0, 0, 0, 0.2)'
          minimumTrackTintColor='#397BDF'
          maximumValue={maxValue}
          step={step}
          value={goalMaturityAge}
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
          onValueChange={age => requestAnimationFrame(() => this.updateGoalMaturityAge(age))} />

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
          Tip: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
          onPress={_.debounce(_.bind(() => this.selectGoalPortfolio(), this), 500, {'leading': true, 'trailing': false})}
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
            return this.renderProgressCell(index <= 2)
          })}
        </View>
      </View>
    )
  }

  renderPrePareInvestment () {
    const {childID, goalName, goalAmount, goalMaturityAge, navigator, firstName} = this.props
    return (
      <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop popManually leftFoo={this.onNext.bind(this)} leftButtonPresent titlePresent title={goalName} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <View style={{flex: 8, justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 16}}>
            <Text style={{textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
              Your plan for {firstName}'s
            </Text>
            <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
              {goalName}
            </Text>
            <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
              To Reach
            </Text>
            <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
              {formatPrice(goalAmount)}
            </Text>
            <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
              For when {firstName} is
            </Text>
            <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
              {goalMaturityAge} years old
            </Text>

            <View style={{alignItems: 'center'}}>
              <Text style={{textAlign: 'center', marginBottom: 32, fontFamily: Fonts.type.bold, fontSize: 22, color: '#1C3C70'}}>
                We’re preparing your investment recommendation.
              </Text>
              <Image source={require('../../../Img/assets/goal/bull/bull.png')} />
            </View>
          </View>
          <View style={{flex: 2}}>
            <View style={{position: 'absolute', top: 10, left: 0, right: 0}}>
              <View style={{flexDirection: 'row'}}>
                {PROGRESS_BAR_CAP.map(index => {
                  return this.renderProgressCell(index <= 3)
                })}
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
  // --------------------------------------------------------
  // Core render method

  render () {
    const {isVisible, code, isModal, pushFunc, popFunc, firstName, goalName, navigator} = this.props
    const { showPrepareInvestment } = this.state

    let heading = firstName + '\'s ' + goalName + ' Fund'
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={goalName} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {
            !isModal && this.renderNextButton()
          }
        </View>
        {showPrepareInvestment && this.renderPrePareInvestment()}
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_GoalDuration.propTypes = {
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

  // user id
  userID: PropTypes.string.isRequired,

  // first name of child
  firstName: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // goal maturity age
  goalMaturityAge: PropTypes.number.isRequired,

  // minimum maturity age
  minAgeValue: PropTypes.number.isRequired,

  // goal amount
  goalAmount: PropTypes.number.isRequired,

  // is modal
  isModal: PropTypes.bool.isRequired
}

LI_GoalDuration.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_GoalDuration))

export default Screen
