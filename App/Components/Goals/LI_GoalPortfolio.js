/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces,operator-linebreak */
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
import { DEVICE_LOGICAL_RESOLUTION, COMMON_ENTITIES, getPortfolio }
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
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import { connect }
  from 'react-redux'
import {reduxForm, Field}
  from 'redux-form'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'
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

class LI_GoalPortfolio extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.state = {
      recommended: props.recommended
    }
    if (props.recommended) {
      this.updateRecommendedRisk()
    }
  }

  // --------------------------------------------------------
  // Action handlers

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

  updateRecommendedRisk () {
    const {recommended, portfolioRisk, localActions} = this.props
    this.setState({recommended: recommended})
    this.updateField(localActions.UPDATE_RISK, GOAL_ENTITIES.PORTFOLIO_RISK, recommended)
  }

  updateField (action, field, value) {
    const {handleLocalAction} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  showDisclaimer () {
    const {handleLocalAction, localActions, navigator, isModal, showDisclaimer} = this.props
    if (isModal) {
      showDisclaimer && showDisclaimer(true)
    } else {
      handleLocalAction({type: localActions.SHOW_DISCLAIMER, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    }
  }

  updatePortfolioRisk (index) {
    const {localActions} = this.props
    let pRisk
    switch (index) {
      case 0: pRisk = '04'
        break
      case 1: pRisk = '03'
        break
      case 2: pRisk = '02'
        break
      case 3: pRisk = '01'
        break
      default: pRisk = '02'
    }
    this.updateField(localActions.UPDATE_RISK, GOAL_ENTITIES.PORTFOLIO_RISK, pRisk)
  }

  selectGoalFund () {
    const {handleLocalAction, localActions, userID, childID, goalAmount, goalName, goalMaturityAge, portfolioRisk, navigator} = this.props
    handleLocalAction({type: localActions.SELECT_GOAL_FUND,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.NAME]: goalName,
      [USER_ENTITIES.USER_ID]: userID,
      [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount,
      [GOAL_ENTITIES.GOAL_MATURITY_AGE]: goalMaturityAge,
      [GOAL_ENTITIES.PORTFOLIO_RISK]: portfolioRisk,
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  calculateFutureValue (c) {
    const {goalDuration, portfolioRisk} = this.props
    const portfolio = portfolioRisk && getPortfolio(portfolioRisk)
    const growthRate = portfolio && portfolio.GROWTH && parseFloat(portfolio.GROWTH)
    let x = Math.pow((1 + growthRate), goalDuration) * c
    return x && x.toFixed(2)
  }

  // --------------------------------------------------------
  // Child Components

  renderBodyHeader () {
    const {firstName, goalName} = this.props
    return (
      <View style={{marginTop: 0, marginHorizontal: 20}}>
        <Text style={{...styles.screen.h2.textStyle, textAlign: 'center', fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22}}>
          Choose a portfolio for {firstName}’s {goalName}.
        </Text>
      </View>
    )
  }

  renderCash () {
    const {portfolioRisk, recommended} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Cash'}
        accessibilityRole={'button'}
        onPress={() => this.updatePortfolioRisk(0)}
        style={{
          flex: 1,
          borderColor: '#1C3C70',
          height: 60,
          padding: 5,
          marginRight: 4,
          backgroundColor: portfolioRisk === '04' ? '#1C3C70' : '#FFF',
          borderWidth: 1,
          borderRadius: 5}}>
        <Text style={{fontSize: 10, color: portfolioRisk === '04' ? '#FFF' : '#1C3C70', fontFamily: Fonts.type.bold}}>
          Cash
        </Text>
        {
          recommended === '04' &&
          <Icon name='star' color='#FFDD00' size={20} containerStyle={{position: 'absolute', right: 2, top: 2}} />
        }
        <View style={{position: 'absolute', bottom: 5, left: 5, right: 5, height: 25}}>
          <Image resizeMode='contain' source={require('../../../Img/assets/goal/cash/cash.png')} style={{height: undefined, width: undefined, flex: 1}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderSlowSteady () {
    const {portfolioRisk, recommended} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Slow and Steady'}
        accessibilityRole={'button'}
        onPress={() => this.updatePortfolioRisk(1)}
        style={{
          flex: 1,
          borderColor: '#1C3C70',
          height: 60,
          padding: 5,
          marginRight: 4,
          backgroundColor: portfolioRisk === '03' ? '#1C3C70' : '#FFF',
          borderWidth: 1,
          borderRadius: 5}}>
        <Text style={{fontSize: 10, color: portfolioRisk === '03' ? '#FFF' : '#1C3C70', fontFamily: Fonts.type.bold}}>
          Slow and Steady
        </Text>
        {
          recommended === '03' &&
          <Icon name='star' color='#FFDD00' size={20} containerStyle={{position: 'absolute', right: 2, top: 2}} />
        }
        <View style={{position: 'absolute', bottom: 5, left: 5, right: 5, height: 25}}>
          <Image resizeMode='contain' source={require('../../../Img/assets/goal/slow/slow.png')} style={{height: undefined, width: undefined, flex: 1}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderModerate () {
    const {portfolioRisk, recommended} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Moderate'}
        accessibilityRole={'button'}
        onPress={() => this.updatePortfolioRisk(2)}
        style={{
          flex: 1,
          borderColor: '#1C3C70',
          height: 60,
          padding: 5,
          marginRight: 4,
          backgroundColor: portfolioRisk === '02' ? '#1C3C70' : '#FFF',
          borderWidth: 1,
          borderRadius: 5}}>
        <Text style={{fontSize: 10, color: portfolioRisk === '02' ? '#FFF' : '#1C3C70', fontFamily: Fonts.type.bold}}>
          Moderate
        </Text>
        {
          recommended === '02' &&
          <Icon name='star' color='#FFDD00' size={20} containerStyle={{position: 'absolute', right: 2, top: 2}} />
        }
        <View style={{position: 'absolute', bottom: 5, left: 5, right: 5, height: 25}}>
          <Image resizeMode='contain' source={require('../../../Img/assets/goal/moderate/moderate.png')} style={{height: undefined, width: undefined, flex: 1}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderAggresive () {
    const {portfolioRisk, recommended} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Aggeresive'}
        accessibilityRole={'button'}
        onPress={() => this.updatePortfolioRisk(3)}
        style={{
          flex: 1,
          borderColor: '#1C3C70',
          height: 60,
          padding: 5,
          backgroundColor: portfolioRisk === '01' ? '#1C3C70' : '#FFF',
          borderWidth: 1,
          borderRadius: 5}}>
        <Text style={{fontSize: 10, color: portfolioRisk === '01' ? '#FFF' : '#1C3C70', fontFamily: Fonts.type.bold}}>
          Aggressive
        </Text>
        {
          recommended === '01' &&
          <Icon name='star' color='#FFDD00' size={20} containerStyle={{position: 'absolute', right: 2, top: 2}} />
        }
        <View style={{position: 'absolute', bottom: 5, left: 5, right: 5, height: 25}}>
          <Image resizeMode='contain' source={require('../../../Img/assets/goal/aggressive/aggressive.png')} style={{height: undefined, width: undefined, flex: 1}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderPortfolioItems () {
    return (
      <View style={{marginTop: 20}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {this.renderCash()}
          {this.renderSlowSteady()}
          {this.renderModerate()}
          {this.renderAggresive()}
        </View>
      </View>
    )
  }

  renderSelected () {
    const {portfolioRisk, recommended, goalMaturityAge} = this.props
    const portfolio = portfolioRisk && getPortfolio(portfolioRisk)
    const value = 100
    const futureValue = this.calculateFutureValue(value)
    return (
      <View style={{height: 177, borderRadius: 5, marginTop: 50}}>

        <View style={{flex: 3.5, flexDirection: 'row', backgroundColor: '#1C3C70', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
          <View style={{flex: 7, justifyContent: 'center', paddingLeft: 15}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 18, color: '#FFF'}}>
              {portfolio && portfolio.NAME}
            </Text>
            {
              portfolioRisk === recommended
              &&
              <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 1, fontSize: 10, color: '#FFF', marginTop: 3}}>
                RECOMMENDED
              </Text>
            }
          </View>
          {
            portfolioRisk === recommended
            &&
            <View style={{flex: 3, alignItems: 'flex-end', justifyContent: 'center'}}>
              <Icon name='star' color='#FFDD00' size={32} containerStyle={{marginRight: 10}} />
            </View>
          }
        </View>

        <View style={{flex: 6.5, flexDirection: 'row', paddingHorizontal: 15, backgroundColor: '#7A8AA5', borderBottomRightRadius: 5, borderBottomLeftRadius: 5}}>
          <View style={{flex: 1, marginVertical: 15}}>
            <Text style={{fontFamily: Fonts.type.black, letterSpacing: 2, fontSize: 20, color: '#FFF'}}>
              NOW
            </Text>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 20, color: '#FFF'}}>
              Buying{'\n'}${value}
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../../../Img/assets/goal/rightArrow/rightArrow.png')} />
          </View>
          <View style={{flex: 1, marginVertical: 15}}>
            <Text style={{fontFamily: Fonts.type.black, letterSpacing: 2, textAlign: 'right', fontSize: 20, color: '#FFF'}}>
              AGE {goalMaturityAge}
            </Text>
            <Text style={{fontFamily: Fonts.type.book, textAlign: 'right', fontSize: 20, color: '#FFF'}}>
              Worth{'\n'}${futureValue}
            </Text>
          </View>
        </View>

      </View>
    )
  }

  renderDisclaimer () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Desclaimer'}
        accessibilityRole={'link'}
        onPress={_.debounce(_.bind(() => this.showDisclaimer(), this), 500, {'leading': true, 'trailing': false})}>
        <Text style={{textAlign: 'center', textDecorationLine: 'underline', fontFamily: Fonts.type.book, fontSize: 16, color: '#505050', marginBottom: 3}}>
          Disclaimer
        </Text>
      </TouchableOpacity>
    )
  }
  renderBody () {
    return (
      <View style={{flex: 8, marginHorizontal: 20, marginTop: 15}}>
        {this.renderBodyHeader()}
        {this.renderPortfolioItems()}
        {this.renderSelected()}
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <View style={{flex: 2, marginHorizontal: 20, justifyContent: 'center'}}>
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
          onPress={_.debounce(_.bind(() => this.selectGoalFund(), this), 500, {'leading': true, 'trailing': false})}
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
            return this.renderProgressCell(index <= 3)
          })}
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isVisible, isModal, code, pushFunc, popFunc, firstName, goalName, recommended, portfolioRisk, navigator} = this.props
    let heading = firstName + '\'s ' + goalName + ' Fund'
    if (!this.state.recommended && recommended) {
      this.updateRecommendedRisk()
    }
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={goalName} />
        <View style={{flex: 1}}>
          {this.renderBody()}
          {this.renderDisclaimer()}
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

LI_GoalPortfolio.propTypes = {
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

  // portfolio risk
  portfolioRisk: PropTypes.string.isRequired,

  // goal amount
  goalAmount: PropTypes.number.isRequired,

  // is modal
  isModal: PropTypes.bool.isRequired,

  // recommended
  recommended: PropTypes.string.isRequired,

  // goal maturity age
  goalMaturityAge: PropTypes.number.isRequired,

  // goal duration
  goalDuration: PropTypes.number.isRequired
}

LI_GoalPortfolio.defaultProps = {
  // is processing
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_GoalPortfolio))

export default Screen
