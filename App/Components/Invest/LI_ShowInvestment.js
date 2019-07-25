/* eslint-disable camelcase,no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 25/10/18.
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
import LI_InvestmentDetail
  from '../../Containers/Invest/LI_InvestmentDetail'
import LI_Sell
  from '../../Containers/Invest/LI_Sell'
import LI_Buy
  from '../../Containers/Invest/LI_Buy'
import LI_EditRecurring
  from '../../Containers/Invest/LI_EditRecurring'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

const CAP_INDEX = 2

// ========================================================
// Core Component
// ========================================================

class LI_ShowInvestment extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width

    this.state = {
      cursor: 0,
      screenWidth: width,
      type: 'buy'     // buy, sell, edit
    }
  }

  // --------------------------------------------------------
  // Action handlers

  getCursorIndex (index) {
    const {type} = this.state
    switch (index) {
      case 1: {
        if (type === 'buy') {
          return screens.BUY_INVESTMENT
        } else if (type === 'sell') {
          return screens.SELL_INVESTMENT
        }
      }
        break
      default: return undefined
    }
  }

  resetForm () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.RESET_FORM})
  }

  hideModel () {
    const {foo} = this.props
    foo && foo(false, undefined)
    this.flushState()
    this.resetForm()
  }

  setCursor (x, type) {
    if (x < 0) {
      x = 0
    }
    this.setState({cursor: x, type: type})
  }
  setType (type) {
    this.setState({type: type})
  }

  flushState () {
    this.setState({
      cursor: 0
    })
  }

  handleNext (type) {
    let {cursor} = this.state
    let nextCursor = cursor + 1
    if (nextCursor > CAP_INDEX) {
      return
    }
    this.setCursor(nextCursor, type)
    this._scrollView.scrollToIndex({index: nextCursor})
  }
  handlePrevious () {
    let {cursor, type} = this.state
    let prevCursor = cursor - 1
    if (prevCursor < 0) {
      return
    }
    if (prevCursor === 0) {
      this.resetForm()
    }
    this.setCursor(prevCursor, type)
    this._scrollView.scrollToIndex({index: prevCursor})
  }
  reset () {
    this._scrollView.scrollTo({x: 0, y: 0, animated: true})
  }

  renderTopMargin () {
    return (
      <View style={{height: 30, alignItems: 'center', backgroundColor: '#FFF', paddingTop: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{height: 7, width: 125, backgroundColor: 'gray', borderRadius: 20}} />
      </View>
    )
  }

  returnTypeMap () {
    const {navigator, childID, investmentID, foo} = this.props
    const {type} = this.state
    const {width} = Dimensions.get('window')
    switch (type) {
      case 'buy':
        return (
          <View style={{width: width}}>
            <LI_Buy navigator={navigator} hideModal={foo} goalID={investmentID} childID={childID} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      case 'sell':
        return (
          <View style={{width: width}}>
            <LI_Sell navigator={navigator} hideModal={foo} goalID={investmentID} childID={childID} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      case 'edit':
        return (
          <View style={{width: width}}>
            <LI_EditRecurring navigator={navigator} childID={childID} hideModal={foo} goalID={investmentID} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      default:
        return null
    }
  }

  returnMap (key) {
    const {navigator, childID, investmentID} = this.props
    const {width} = Dimensions.get('window')
    switch (key) {
      case 0: {
        return (
          <View style={{width: width}}>
            <LI_InvestmentDetail navigator={navigator} investmentID={investmentID} childID={childID} popFunc={this.handlePrevious.bind(this)} pushFunc={this.handleNext.bind(this)} />
          </View>
        )
      }
      case 1: {
        return this.returnTypeMap()
      }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderModalView () {
    const {cursor} = this.state
    return (
      <View style={{backgroundColor: '#FFF', flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{flex: 1, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
          {
            (cursor !== 0) &&
            this.renderTopMargin()
          }
          <FlatList
            horizontal
            initialNumToRender={1}
            decelerationRate='fast'
            pagingEnabled
            ref={ref => { this._scrollView = ref }}
            scrollEnabled={false}
            data={[{title: 'investmentDetail', key: 0}, {title: 'buySellEdit', key: 1}]}
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
    const {isVisible, investmentID} = this.props
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

LI_ShowInvestment.propTypes = {
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

  // child name
  firstName: PropTypes.string.isRequired,

  // investment id
  investmentID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default LI_ShowInvestment
