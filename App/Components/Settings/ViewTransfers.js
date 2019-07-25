/* eslint-disable no-unused-vars,no-trailing-spaces,new-cap */
/**
 * Created by demon on 1/12/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, LayoutAnimation, Dimensions, Alert, Image, KeyboardAvoidingView, Keyboard, ScrollView, ActivityIndicator, FlatList, TouchableOpacity }
  from 'react-native'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {formatPrice, convertDateStringToUSFormat}
  from '../../Utility/Transforms/Converter'
import Fonts
  from '../../Themes/Fonts'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import Avatar
  from '../../Containers/Utility/Avatar'
import moment
  from 'moment'
import _
  from 'lodash'

// ========================================================
// Core Component
// ========================================================

class ViewTransfers extends Component {

  // ------------------------------------------------------------
  // action handlers

  constructor (props) {
    super(props)
    this.state = {
      _selectedChild: props.selectedChild
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  // ------------------------------------------------------------
  // action handlers

  setSelectedChild (childObj) {
    LayoutAnimation.spring()
    this.setState({_selectedChild: childObj})
  }

  // ------------------------------------------------------------
  // render child components

  renderChildBadge (c) {
    const {_selectedChild} = this.state
    const {imageUrl = '', childImage = '', childID} = c
    const {userID} = this.props
    const imageType = ['USER', 'CHILD']
    const imageId = [userID, c.childID]
    let initials = c.firstname && c.firstname.charAt(0)
    const isSelected = _selectedChild.childID === c.childID
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Select child ${c.firstName}`}
        accessibilityRole={'button'}
        onPress={() => this.setSelectedChild(c)} style={{marginHorizontal: 0}}>
        <Avatar isSelected={isSelected} borderWidth={isSelected ? 2 : 1.5} avatarSize={70} name={c.firstname} showAddButton={false} initials={initials} imageRadius={30} imageUrl={imageUrl} image={childImage} imageType={imageType} imageId={imageId} />
      </TouchableOpacity>
    )
  }

  renderChildPanel () {
    const {childArr} = this.props
    const {width} = Dimensions.get('window')
    return (
      <View style={{backgroundColor: '#10427E', borderTopWidth: 0.4, borderColor: '#979797', paddingTop: 5}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentInset={{left: 5}} contentOffset={{x: -5}} automaticallyAdjustContentInsets={false} contentContainerStyle={{flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginVertical: 15}}>
          {childArr.map(c => this.renderChildBadge(c))}
        </ScrollView>
      </View>
    )
  }

  componentWillMount () {
    const {handleLocalAction, localActions, userID} = this.props
    handleLocalAction({type: localActions.FETCH_USER_TRANSACTIONS, [USER_ENTITIES.USER_ID]: userID})
  }

  renderTransactionCubes (t) {
    const {isDebugMode} = this.props
    let goalName = t[GOAL_ENTITIES.NAME]
    let transactionID = t[GOAL_ENTITIES.TRANSACTION_ID]
    let transactionAmount = t[GOAL_ENTITIES.TRANSACTION_AMOUNT]
    let transactionStock = t[GOAL_ENTITIES.TRANSACTION_STOCKS] && t[GOAL_ENTITIES.TRANSACTION_STOCKS][0]
    let transactionTime = t[GOAL_ENTITIES.TRANSACTION_TIME] && convertDateStringToUSFormat(t[GOAL_ENTITIES.TRANSACTION_TIME])
    let transactionStatus = t[GOAL_ENTITIES.TRANSACTION_STATUS] === 'complete' ? 'Complete' : 'In Progress'
    let type = t[GOAL_ENTITIES.TRANSACTION_TYPE]
    let typeText = type === 'transfer' ? 'bought ' : 'sold '
    return (
      <View style={{borderBottomWidth: 1, borderColor: '#D7D7D7', paddingHorizontal: 16, paddingVertical: 32}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 3.3, fontFamily: Fonts.type.semibold, fontSize: 17, color: '#000', backgroundColor: 'transparent'}}>
            {transactionTime}
          </Text>
          <Text style={{flex: 6.7, fontFamily: Fonts.type.regular, fontSize: 17, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            {formatPrice(transactionAmount)} {transactionStock ? typeText + parseFloat(transactionStock['stock_units']).toFixed(2) + ' x ' + transactionStock['stock_name'] : ''}
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 3}}>
          <Text style={{flex: 3.3, fontFamily: Fonts.type.regular, fontSize: 17, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            {transactionStatus}
          </Text>
          <Text style={{flex: 6.7, fontFamily: Fonts.type.regular, fontSize: 17, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            ({goalName})
          </Text>
        </View>
        {
          isDebugMode && transactionID && this.renderID(transactionID)
        }
      </View>
    )
  }

  renderTransactions () {
    const {_selectedChild} = this.state
    const {recentTransactions} = this.props
    const childID = _selectedChild.childID
    let transactions = (recentTransactions && recentTransactions[childID]) || []

    transactions = _.orderBy(transactions, function (o) {
      return new moment(o[GOAL_ENTITIES.TRANSACTION_TIME])
    }, ['desc'])

    if (_selectedChild) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          {transactions.map(t => this.renderTransactionCubes(t))}
        </ScrollView>
      )
    } else return null
  }

  // ------------------------------------------------------------
  // Debug mode components

  renderID (ID) {
    return (
      <View>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Transaction ID
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {ID}
        </Text>
      </View>
    )
  }

  stockCubes (stock) {
    return (
      <View>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Stock Name
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stock['stock_name']}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Stock Units
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stock['stock_units']}
        </Text>
      </View>
    )
  }

  // ------------------------------------------------------------
  // render core component

  render () {
    const {isProcessing, navigator} = this.props
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Recent Transactions' />
        {this.renderChildPanel()}
        {this.renderTransactions()}
      </View>
    )
  }

}

ViewTransfers.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,
  localActions: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // recent transactions
  recentTransactions: PropTypes.object.isRequired,

  // child array
  childArr: PropTypes.array.isRequired,
  // default index
  defaultIndex: PropTypes.number,
  // selected child
  selectedChild: PropTypes.object.isRequired,

  // is debug mode
  isDebugMode: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default ViewTransfers
