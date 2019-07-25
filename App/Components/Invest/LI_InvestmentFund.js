/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * Created by demon on 15/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View,
  Text,
  Alert,
  StatusBar,
  FlatList,
  LayoutAnimation,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Animated,
  AsyncStorage,
  AppState,
  ImageBackground
}
  from 'react-native'
import Modal
  from 'react-native-modal'
import {reduxForm}
  from 'redux-form'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {Icon, ButtonGroup}
  from 'react-native-elements'
import { connect }
  from 'react-redux'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, FREQUENCY, DEVICE_LOGICAL_RESOLUTION, getPortfolioInternalID}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import LinearGradient
  from 'react-native-linear-gradient'
import Avatar
  from '../../Containers/Utility/Avatar'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'
import CustomNav
  from '../../Containers/Common/CustomNav'
var Spinner = require('react-native-spinkit')
import { CachedImage }
  from 'react-native-cached-image'
import styles
  from '../../Themes/ApplicationStyles'
import _
  from 'lodash'
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import LI_Confirm
  from '../../Containers/Invest/LI_Confirm'
import MultiSwitch
  from '../../CommonComponents/SwitchButton/MultiSwitch'
import EditableTextInput
  from '../../CommonComponents/editableTextInput'
import moment from 'moment'
import Colors from '../../Themes/Colors'
import * as Constants from '../../Themes/Constants'
import loginPinStyles from '../Common/Styles/LoginPinStyle'
let lastActiveAt = moment()
let resumeDuration = 5

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_INVESTMENT,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class LI_InvestmentFund extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.state = {
      appState: AppState.currentState,
      showConfirmation: false,
      investmentType: 'Weekly',
      showFrequencyModal: false,
      lessInvestment: false,
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
      amount: props.investmentAmount
    }
    this.updateIndex(1)
  }

  componentDidMount () {
    const {isModal} = this.props
    if (!isModal) {
      AppState.addEventListener('change', this._handleAppStateChange)
    }
  }

  componentWillUnmount () {
    const {isModal} = this.props
    if (!isModal) {
      AppState.removeEventListener('change', this._handleAppStateChange)
    }
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      var seconds = moment().diff(lastActiveAt, 'seconds')
      if (seconds > resumeDuration) {
        this.toggleConfirmation(false)
      }
    } else if (nextAppState.match(/inactive|background/)) {
      lastActiveAt = moment()
    }

    this.setState({appState: nextAppState})
  }

  // --------------------------------------------------------
  // Action handler

  textChangeListener (text) {
  }

  onSubmitEditing ($) {
    this.updateInvestmentAmount($)
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

  toggleConfirmation (visible, close = false) {
    if (parseFloat(this.state.amount) < 5) {
      Alert.alert('Investment Error', 'Minimum Invest of $5 is Required.')
      return
    }
    this.updateInvestmentAmount(parseFloat(this.state.amount))

    this.setState({
      showConfirmation: visible
    })
    if (close) {
      const {navigator, hideModal} = this.props
      navigator.dismissModal()
      hideModal && hideModal()
    }
  }

  toggleShowFrequencyModal (show = false) {
    if (show) {
      if (parseFloat(this.state.amount) < 5) {
        Alert.alert('Investment Error', 'Minimum Invest of $5 is Required.')
        return
      }
      this.updateInvestmentAmount(parseFloat(this.state.amount))
    }
    this.setState({ showFrequencyModal: show })
  }
  updateInvestmentAmount ($) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.UPDATE_INVESTMENT_AMOUNT, [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: $})
  }

  updateInvestmentFrequency (f) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.UPDATE_INVESTMENT_FREQUENCY, [INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]: f})
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
    this.updateInvestmentFrequency(frequency)
  }

  makeInvestment (frequency) {
    const {handleLocalAction, localActions, navigator, isModal, userID, goalID, childID, investmentName, investmentFrequency, investmentAmount, investmentPortfolioID, isPlaidLinked} = this.props
    if (goalID) {
      if (frequency === FREQUENCY.ONCE) {
        this.buyOnce()
      } else {
        this.setRecurring()
      }
      this.setState({
        showFrequencyModal: false
      })
      return
    }
    this.setState({
      showFrequencyModal: false
    }, () => {
      this.setState({
        showConfirmation: !isPlaidLinked
      }, () => {
        const actionType = isModal ? localActions.MAKE_INVESTMENT : localActions.CONFIRM_INVESTMENT
        handleLocalAction({
          type: localActions.MAKE_INVESTMENT,
          [USER_ENTITIES.USER_ID]: userID,
          [CHILD_ENTITIES.CHILD_ID]: childID,
          [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName,
          [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: investmentAmount,
          [INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]: frequency || investmentFrequency,
          [INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]: investmentPortfolioID,
          [USER_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked,
          [COMMON_ENTITIES.NAVIGATOR]: isModal ? undefined : navigator
        })
      })
    })
  }

  buyOnce () {
    const {handleLocalAction, localActions, navigator, investmentName, userID, childID, goalID, investmentAmount} = this.props
    handleLocalAction({
      type: localActions.BUY_ONCE_OFF,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.ONE_OFF_INVESTMENT]: investmentAmount,
      [GOAL_ENTITIES.NAME]: investmentName,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  setRecurring () {
    const {handleLocalAction, localActions, navigator, investmentName, userID, childID, goalID, investmentFrequency, investmentAmount} = this.props
    handleLocalAction({
      type: localActions.SET_RECURRING,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: investmentAmount,
      [GOAL_ENTITIES.RECURRING_FREQUENCY]: investmentFrequency,
      [GOAL_ENTITIES.NAME]: investmentName,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderBodyHeader () {
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

  renderFundAmount () {
    const {investmentAmount} = this.props
    const {lessInvestment} = this.state
    return (
      <View style={{marginTop: 24, marginHorizontal: 20}}>
        <EditableTextInput
          value={investmentAmount}
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
    const {investmentFrequency} = this.props
    const buttons = ['Once', 'Weekly', 'Monthly']
    let selectedIndex
    switch (investmentFrequency) {
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
          style={{...loginPinStyles.buttonPadStyle, borderRadius: (diameter / 2), backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}
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

  investmentTypeButton (title) {
    this.setState({investmentType: title})

    switch (title) {
      case 'Weekly':
        this.updateIndex(1)
        break
      case 'Monthly':
        this.updateIndex(2)
        break
      case 'Once':
        this.updateIndex(0)
        break

      default:
        break
    }
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
    return (
      <Text style={{fontFamily: Fonts.type.bold, fontSize: 26, lineHeight: 49, textAlign: 'center', color: Colors.buttonYellow}}>
        {formatPrice(this.state.amount)}
      </Text>
    )
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

  renderMainComponent () {
    const {amount, investmentType} = this.state
    const {investmentFrequency} = this.props

    return (
      <View style={{paddingTop: 40, paddingBottom: 30, backgroundColor: Colors.white, borderRadius: 10}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'close'}
          accessibilityRole={'button'}
          onPress={_.debounce(_.bind(() => this.toggleShowFrequencyModal(), this), 500, {'leading': true, 'trailing': false})}>
          <Image style={{alignSelf: 'flex-end', marginBottom: 23, marginRight: 43}} source={require('../../../Img/iconImages/closeGray.png')} />
        </TouchableOpacity>
        <Image style={{alignSelf: 'center', marginBottom: 23}} source={require('../../../Img/assets/onboard/verifyIdentity/verifyIdentity.png')} />
        <Text style={{ ...styles.text.mainHeader, fontFamily: Fonts.type.bold, color: '#1C3C70' }}>
          {'Want to do something\na little more often?'}
        </Text>
        <Text style={{ color: Colors.darkBlue, fontFamily: Fonts.type.book, fontSize: 18, lineHeight: 22, marginTop: 10, textAlign: 'center' }}>
          {'Take advantage of time\nwith a regular investment.'}
        </Text>

        <View style={{backgroundColor: '#DEDEDE', width: 96, borderRadius: 6, alignSelf: 'center', marginVertical: 25, paddingVertical: 5}}>
          {this.renderInvestmentTypeButton('Weekly')}
          {this.renderInvestmentTypeButton('Monthly')}
        </View>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'set auto-invest'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            width: 190,
            alignSelf: 'center'
          }}
          onPress={_.debounce(_.bind(() => this.makeInvestment(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Set Auto-Invest</Text>
        </TouchableHighlight>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'set auto-invest'}
          accessibilityRole={'button'}
          onPress={_.debounce(_.bind(() => this.makeInvestment(FREQUENCY.ONCE), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={{ color: Colors.blue, fontFamily: Fonts.type.book, fontSize: 18, lineHeight: 23, marginTop: 12, textAlign: 'center' }}>
            {`Invest ${formatPrice(amount)} Just Once`}
          </Text>
        </TouchableOpacity>

      </View>
    )
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

  renderNextButton () {
    const isX = this.isX || false
    const {isModal} = this.props
    return (
      <View style={{flex: 2, justifyContent: 'center', paddingHorizontal: 35}}>
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
          onPress={_.debounce(_.bind(() => this.toggleShowFrequencyModal(true), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={[styles.bottomNavigator.textStyle, {color: Colors.darkBlue}]}>Confirm Investment</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderConfirmation () {
    const {showConfirmation} = this.state
    const {navigator, investmentName, isModal, investmentFrequency, tickerName, childID, investmentAmount} = this.props
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

          <LI_Confirm childID={childID} setScreen={1} isModal={isModal} tickerName={tickerName} confirmFunc={this.makeInvestment.bind(this)} recurringFrequency={investmentFrequency} dismissConfirm={this.toggleConfirmation.bind(this)} goalName={investmentName} recurringAmount={this.state.amount} navigator={navigator} isWithdraw={false} />

        </Modal>
      )
    }
  }

  renderFrequencyModal () {
    const {showFrequencyModal} = this.state
    const {investmentFrequency} = this.props
    if (!showFrequencyModal) {
      return null
    } else {
      return (
        <Modal
          keyboardShouldPersistTaps='always'
          style={{marginHorizontal: 32, justifyContent: 'center'}}
          backdropColor='black'
          backdropOpacity={0.6}
          isVisible={showFrequencyModal}>
          {this.renderMainComponent()}
        </Modal>
      )
    }
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    const {investmentName, isProcessing, isModal, navigator} = this.props
    let popFunction
    if (isModal) {
      popFunction = () => this.props.popFunc()
    } else {
      popFunction = console.log('pop')
    }
    return (
      <ImageBackground source={require('../../../Img/appBackground.png')} style={{...styles.screen.containers.root}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <StatusBar barStyle='light-content' />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent leftFoo={popFunction} popManually={isModal} dropTopMargin={isModal} titlePresent title={investmentName} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderNextButton()}
          {this.renderFrequencyModal()}
        </View>
      </ImageBackground>
    )
  }

}

LI_InvestmentFund.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // is processing
  isProcessing: PropTypes.bool,

  // firstname
  firstName: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // goal id : would only be provided in case it's top up screen
  goalID: PropTypes.string,

  // push func
  pushFunc: PropTypes.func,

  // hide the parent modal
  hideModal: PropTypes.func,

  // pop func
  popFunc: PropTypes.func,

  // is modal
  isModal: PropTypes.bool,

  // ticker name
  tickerName: PropTypes.string,

  // investment name
  investmentName: PropTypes.string,

  // investment amount
  investmentAmount: PropTypes.number,

  // investment frequency
  investmentFrequency: PropTypes.string,

  // investment portfolio id
  investmentPortfolioID: PropTypes.string,

  // is funding source linked
  isPlaidLinked: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(LI_InvestmentFund))

export default Screen
