/* eslint-disable camelcase,no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 15/10/18.
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
  LayoutAnimation
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION }
  from '../../Utility/Mapper/Common'
import {Icon}
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import LI_SelectInvestment
  from '../../Containers/Invest/LI_SelectInvestment'
import LI_InvestmentDetail
  from '../../Containers/Invest/LI_InvestmentDetail'
import LI_InvestmentFund
  from '../../Containers/Invest/LI_InvestmentFund'
import SSNPopup from '../../Containers/Sprout/SSNPopup'
import CustomNav from '../Common/CustomNav'
import Colors from '../../Themes/Colors'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

let CAP_INDEX = 2

// ========================================================
// Core Component
// ========================================================

class LI_InvestmentBase extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width

    this.state = {
      cursor: 0,
      screenWidth: width
    }
    this._customProps = {[CHILD_ENTITIES.CHILD_ID]: props[CHILD_ENTITIES.CHILD_ID]}
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.SELECT_INVESTMENT_SCREEN
    })
    // *********** Log Analytics ***********
  }

  triggerEvent (screen) {
    const {userID, investmentName} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screen,
      properties: {
        goalName: investmentName
      }
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  getCursorIndex (index) {
    switch (index) {
      case 0: return screens.SELECT_INVESTMENT_SCREEN
      case 1: return screens.INVESTMENT_DETAIL_SCREEN
      case 3: return screens.INVESTMENT_FUND_SCREEN
      default: return undefined
    }
  }

  resetForm () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.RESET_FORM})
  }

  hideModel () {
    const {foo} = this.props
    foo && foo(false)
    this.flushState()
    this.resetForm()
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
      cursor: 0
    })
    this._customProps = {}
  }

  handleNext (progress) {
    let {cursor} = this.state
    let {isssnAdded} = this.props
    let nextCursor = cursor + 1
    if (isssnAdded === 1) {
      CAP_INDEX = 3
    }
    if (nextCursor > CAP_INDEX) {
      return
    }
    this.setCursor(nextCursor)
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
    if (prevCursor === 0) {
      this.resetForm()
    }
    this.setCursor(prevCursor)
    this._scrollView.scrollToIndex({index: prevCursor})
  }
  reset () {
    this._scrollView.scrollTo({x: 0, y: 0, animated: true})
  }

  renderTopMargin (cursor) {
    if (cursor === 1) { return null }
    return (
      <View style={{height: 30, alignItems: 'center', backgroundColor: (cursor === 0) ? '#2948FF' : Colors.white, paddingTop: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{height: 7, width: 125, backgroundColor: (cursor === 0) ? Colors.white : 'gray', borderRadius: 20}} />
      </View>
    )
  }

  returnMap (key) {
    const {navigator, childID} = this.props
    const {width} = Dimensions.get('window')
    switch (key) {
      case 0: {
        return (
          <View style={{width: width}}>
            <LI_SelectInvestment navigator={navigator} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      }
      case 1: {
        return (
          <View style={{width: width}}>
            <LI_InvestmentDetail navigator={navigator} childID={childID} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      }
      case 2: {
        return (
          <View style={{width: width}}>
            <SSNPopup navigator={navigator} childID={childID} customProps={this._customProps} popFunc={this.handlePrevious.bind(this)} isFromModal />
          </View>
        )
      }
      case 3: {
        return (
          <View style={{width: width}}>
            <LI_InvestmentFund navigator={navigator} hideModal={this.hideModel.bind(this)} childID={childID} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderModalView () {
    const {height, width} = Dimensions.get('window')
    const {cursor} = this.state
    const {isssnAdded} = this.props
    const isX = this.isX
    let screenData = [{title: 'red', key: 0}, {title: 'blue', key: 1}, {title: 'gray', key: 2}, {title: 'gray', key: 3}]

    if (isssnAdded === 1) {
      screenData.splice(2, 1)
    }

    return (
      <View style={{backgroundColor: '#FFF', flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
          {
            this.renderTopMargin(cursor)
          }
          {
            (isssnAdded !== 1 && cursor === 2) &&
            <CustomNav leftButtonPresent dropTopMargin leftFoo={this.handlePrevious.bind(this)} popManually />
          }
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
      </View>
    )
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
          isVisible={isVisible}>
          {this.renderModalView()}
        </Modal>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_InvestmentBase.propTypes = {
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

  // child id
  childID: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // child name
  firstName: PropTypes.string.isRequired,

  // is ssn added for child
  isssnAdded: PropTypes.bool,

  // investment name
  investmentName: PropTypes.string.isRequired
}

LI_InvestmentBase.defaultProps = {
  isVisible: false,
  isProcessing: false
}

// ========================================================
// Export
// ========================================================

export default LI_InvestmentBase
