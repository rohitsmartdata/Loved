/* eslint-disable no-unused-vars,no-trailing-spaces,camelcase,operator-linebreak */
/**
 * Created by demon on 13/10/18.
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
  TouchableHighlight,
  LayoutAnimation
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION, COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import {Icon}
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
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
import LI_SelectGoal
  from '../../Containers/Goals/LI_SelectGoal'
import LI_GoalAmount
  from '../../Containers/Goals/LI_GoalAmount'
import LI_GoalDuration
  from '../../Containers/Goals/LI_GoalDuration'
import LI_GoalPortfolio
  from '../../Containers/Goals/LI_GoalPortfolio'
import LI_GoalFund
  from '../../Containers/Goals/LI_GoalFund'
import { RecyclerListView, DataProvider, LayoutProvider }
  from 'recyclerlistview'
import CustomNav
  from '../Common/CustomNav'
import _
  from 'lodash'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import LI_Confirm
  from '../../Containers/Invest/LI_Confirm'
import SSNPopup
  from '../../Containers/Sprout/SSNPopup'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'
import Colors from '../../Themes/Colors'
import Disclaimer from '../../Containers/Goals/Disclaimer'

// ========================================================
// Utility
// ========================================================

const CAP_INDEX = 4
const PROGRESS_BAR_CAP = [1, 2, 3, 4]

// ========================================================
// Core Component
// ========================================================

class GoalBase extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    const isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.isX = isIPhoneX
    this.isNormal = isNormal

    this.state = {
      cursor: 0,
      screenWidth: width,
      progress: 1,
      showDisclaimer: false,
      showConfirmation: false
    }
    this._customProps = {[CHILD_ENTITIES.CHILD_ID]: props[CHILD_ENTITIES.CHILD_ID]}
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.SELECT_GOAL_SCREEN
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  triggerEvent (screen) {
    const {userID, goalName} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screen,
      properties: {
        goalName: goalName
      }
    })
    // *********** Log Analytics ***********
  }

  toggleConfirmation (visible, close = false) {
    console.log(' --- toggle confirmation ::  visible :: ', visible)
    console.log(' --- toggle confirmation ::  close :: ', close)
    this.setState({
      showConfirmation: visible
    })
    if (close) {
      const {navigator} = this.props
      navigator.dismissModal()

      this.hideModel()
    }
  }

  showDisclaimer (show = false) {
    this.setState({ showDisclaimer: show })
  }

  createGoal () {
    const {handleLocalAction, localActions, navigator, isPlaidLinked, userID, childID, goalName, goalAmount, goalMaturityAge, portfolioRisk, recurringAmount, recurringFrequency} = this.props
    handleLocalAction({
      type: localActions.ADD_GOAL,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.PORTFOLIO_RISK]: portfolioRisk,
      [GOAL_ENTITIES.DURATION]: goalMaturityAge,
      [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount,
      [GOAL_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [GOAL_ENTITIES.RECURRING_FREQUENCY]: recurringFrequency,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  incrementProgress () {
    this.setState(prevState => {
      return {
        progress: prevState.progress + 1
      }
    })
  }
  decrementProgress () {
    this.setState(prevState => {
      const currentProgress = prevState.progress
      const nextProgress = currentProgress <= 1 ? currentProgress : (currentProgress - 1)
      return {
        progress: nextProgress
      }
    })
  }

  hideModel () {
    console.log(' < ------ [[[ hidding modal ]]] ------> ')
    const {foo} = this.props
    console.log(' [[[[[ foo ]]] ------> ', foo)
    foo && foo(false)
    this.flushState()
  }

  setCursor (x) {
    if (x < 0) {
      x = 0
    }
    this.setState({cursor: x})
  }

  flushProps () {
    this._customProps = {}
  }
  flushState () {
    this.setState({
      cursor: 0,
      showDisclaimer: false
    })
    this._customProps = {}
  }

  handleNext (progress) {
    let {cursor} = this.state
    let {goalName, goalAmount, goalMaturityAge, portfolioRisk, recurringAmount, recurringFrequency} = this.props
    let nextCursor = cursor + 1
    if (cursor === CAP_INDEX) {
      if (recurringAmount && parseInt(recurringAmount) < 5) {
        return
      }
      this.toggleConfirmation(true)
      return
    }
    if (nextCursor > CAP_INDEX) {
      return
    }
    if (progress && progress.name === 'SSN_ADDED') {
      return
    }
    this.setCursor(nextCursor)
    progress && progress === true && this.incrementProgress()
    this._scrollView.scrollToIndex({index: nextCursor})
    let screen = this.getCursorIndex(nextCursor)
    screen && this.triggerEvent(screen)
  }
  handlePrevious () {
    let {cursor} = this.state
    let prevCursor = cursor - 1
    if (prevCursor < 0) {
      return
    }
    this.setCursor(prevCursor)
    this.decrementProgress()
    this._scrollView.scrollToIndex({index: prevCursor})
  }
  reset () {
    this._scrollView.scrollTo({x: 0, y: 0, animated: true})
  }

  getCursorIndex (index) {
    switch (index) {
      case 0: return screens.SELECT_GOAL_SCREEN
      case 2: return screens.SELECT_GOAL_AMOUNT
      case 3: return screens.SELECT_GOAL_DURATION
      case 4: return screens.SELECT_GOAL_PORTFOLIO
      case 5: return screens.SELECT_GOAL_FUND
      default: return undefined
    }
  }

  renderTopMargin (cursor) {
    return (
      <View style={{height: 30, alignItems: 'center', backgroundColor: (cursor === 0) ? Colors.appBlue : '#FFF', paddingTop: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{height: 7, width: 125, backgroundColor: (cursor === 0) ? Colors.white : 'gray', borderRadius: 20}} />
      </View>
    )
  }

  returnHeaderMap (cursor) {
    const {firstName, goalName, isssnAdded} = this.props
    switch (cursor) {
      case 0:
        return {
          leftButton: false,
          heading: 'Achieve Goals'
        }
      case 1:
        if (isssnAdded === 1) {
          return {
            leftButton: true,
            heading: firstName + '\'s ' + goalName + ' Fund'
          }
        } else {
          return {
            leftButton: true,
            heading: ''
          }
        }
      default: return {
        leftButton: true,
        heading: firstName + '\'s ' + goalName + ' Fund'
      }
    }
  }
  returnFooterMap (cursor) {
    const {isssnAdded} = this.props
    switch (cursor) {
      case 0:
        return {
          visible: false
        }
      case 1:
        if (isssnAdded === 1) {
          return {
            visible: true
          }
        } else {
          return {
            visible: false
          }
        }
      default: return {
        visible: true
      }
    }
  }

  returnMap (key) {
    const {navigator, childID, foo} = this.props
    const {width} = Dimensions.get('window')
    switch (key) {
      case 0: {
        // this.triggerEvent(screens.SELECT_GOAL_SCREEN)
        return (
          <View style={{width: width}}>
            <LI_SelectGoal navigator={navigator} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      }
      case 1: {
        return (
          <View style={{width: width}}>
            <SSNPopup navigator={navigator} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} isFromModal />
          </View>
        )
      }
      case 2: {
        // this.triggerEvent(screens.SELECT_GOAL_AMOUNT)
        return (
          <View style={{width: width}}>
            <LI_GoalAmount navigator={navigator} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      }
      case 3: {
        // this.triggerEvent(screens.SELECT_GOAL_DURATION)
        return (
          <View style={{width: width}}>
            <LI_GoalDuration navigator={navigator} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      }
      case 4: {
        // this.triggerEvent(screens.SELECT_GOAL_PORTFOLIO)
        return (
          <View style={{width: width}}>
            <LI_GoalPortfolio navigator={navigator} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} showDisclaimer={this.showDisclaimer.bind(this)} />
          </View>
        )
      }
      case 5: {
        // this.triggerEvent(screens.SELECT_GOAL_FUND)
        return (
          <View style={{width: width}}>
            <LI_GoalFund navigator={navigator} hideModal={foo} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} showDisclaimer={this.showDisclaimer.bind(this)} />
          </View>
        )
      }
      default:
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderProgressCell (enabled) {
    return (
      <View style={{height: 10, flex: 1, marginHorizontal: 3, borderRadius: 3, borderWidth: enabled ? 0 : 1, borderColor: '#707070', backgroundColor: enabled ? '#2C78F9' : '#FFF'}} />
    )
  }

  renderProgressBar () {
    const {progress} = this.state
    return (
      <View style={{position: 'absolute', top: 10, left: 0, right: 0, paddingHorizontal: 20}}>
        <View style={{flexDirection: 'row'}}>
          {PROGRESS_BAR_CAP.map(index => {
            return this.renderProgressCell(index <= progress)
          })}
        </View>
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
          onPress={_.debounce(_.bind(() => this.handleNext(true), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderModalView () {
    const {height, width} = Dimensions.get('window')
    const {cursor, showDisclaimer} = this.state
    const {isProcessing, isssnAdded} = this.props
    const headerObj = this.returnHeaderMap(cursor)
    const footerObj = this.returnFooterMap(cursor)
    const isX = this.isX
    let screenData = [{title: 'red', key: 0}, {title: 'blue', key: 1}, {title: 'gray', key: 2}, {title: 'gray', key: 3}, {title: 'gray', key: 4}, {title: 'gray', key: 5}]

    if (isssnAdded === 1) {
      screenData.splice(1, 1)
    }
    return (
      <View style={{backgroundColor: '#FFF', flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10, backgroundColor: (cursor === 0) ? Colors.appBlue : Colors.transparent}}>
          {this.renderTopMargin(cursor)}
          <CustomNav leftButtonPresent={headerObj ? headerObj.leftButton : false} dropTopMargin titlePresent title={headerObj ? headerObj.heading : 'Goal'} titleStyle={{color: (cursor === 0) ? Colors.white : '#505050'}} leftFoo={this.handlePrevious.bind(this)} popManually />
          <View style={{flex: footerObj.visible ? 8.2 : 1}}>
            <FlatList
              horizontal
              initialNumToRender={1}
              decelerationRate='fast'
              pagingEnabled
              ref={ref => { this._scrollView = ref }}
              scrollEnabled={false}
              data={screenData}
              renderItem={({item, seperator}) => {
                return this.returnMap(item.key)
              }}
            />
          </View>
          {
            footerObj.visible
            &&
            <View style={{flex: 1.8, paddingHorizontal: 20}}>
              {this.renderProgressBar()}
              {this.renderNextButton()}
            </View>
          }
          {this.renderConfirmation()}
          {
            showDisclaimer &&
            <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, borderTopRightRadius: 10, borderTopLeftRadius: 10, backgroundColor: 'red', overflow: 'hidden'}}>
              <Disclaimer hideDisclaimer={this.showDisclaimer.bind(this)} />
            </View> ||
            <View />
          }
        </View>
      </View>
    )
  }

  renderConfirmation () {
    const {showConfirmation} = this.state
    const {navigator, goalName, childID, recurringAmount, recurringFrequency, hideModal} = this.props
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
          <LI_Confirm childID={childID} isModal tickerName={goalName} confirmFunc={this.createGoal.bind(this)} dismissConfirm={this.toggleConfirmation.bind(this)} goalName={goalName} recurringAmount={recurringAmount} recurringFrequency={recurringFrequency} navigator={navigator} isWithdraw={false} />
        </Modal>
      )
    }
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isVisible, code} = this.props
    const {progress} = this.state
    return (
      <View>
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', marginTop: 40, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onBackdropPress={() => this.hideModel()}
          onSwipe={() => this.hideModel()}
          swipeDirection='down'
          hideModalContentWhileAnimating
          scrollOffsetMax={300} // content height - ScrollView height
          isVisible={isVisible}>P
          {this.renderModalView()}
        </Modal>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

GoalBase.propTypes = {
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
  isProcessing: PropTypes.bool,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // child name
  firstName: PropTypes.string.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  // goal amount
  goalAmount: PropTypes.number,

  // goal maturity age
  goalMaturityAge: PropTypes.number,

  // portfolio risk
  portfolioRisk: PropTypes.string,

  // recurring amount
  recurringAmount: PropTypes.number,

  // recurring frequency
  recurringFrequency: PropTypes.string,

  // is plaid linked
  isPlaidLinked: PropTypes.bool.isRequired,

  // is ssn added for child
  isssnAdded: PropTypes.bool
}

GoalBase.defaultProps = {
  isVisible: false,
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

export default GoalBase
