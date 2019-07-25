/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 5/2/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, Dimensions, Image, KeyboardAvoidingView, Keyboard, ScrollView, ActivityIndicator, FlatList, TouchableOpacity }
  from 'react-native'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import SwipeableViews
  from 'react-swipeable-views-native/lib/SwipeableViews.scroll'
import Fonts
  from '../../Themes/Fonts'
import moment from 'moment'

// ========================================================
// Core Component
// ========================================================

class Activity extends Component {

  // ------------------------------------------------------------
  // action handlers

  constructor (props) {
    super(props)
    this.state = {
      translateX: 0,
      currentIndex: 0,
      pdfVisible: false,
      url: undefined,
      title: undefined
    }
  }

  updateX (change) {
    const {childIDs} = this.props
    const {width} = Dimensions.get('window')
    const totalChildren = childIDs.length

    let capsuleWidth = width / totalChildren
    this.setState({translateX: (change * capsuleWidth)})
  }

  updateIndex (index) {
    this.setState({currentIndex: index})
  }

  // ------------------------------------------------------------
  // render child components

  renderTextBlock (amount, firstName, goal, duration, date, buttonName, foo) {
    let dStr = (date && moment(date).format('dddd, MMMM Do YYYY')) || undefined
    let str = formatPrice(amount) + ' invested on "' + goal + '"'

    return (
      <View style={{height: 100, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#D7D7D7', paddingLeft: 20, paddingRight: 20}}>
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 16, fontFamily: Fonts.type.regular, color: '#4A4A4A', backgroundColor: 'transparent'}}>
            {str}
          </Text>
          {
            dStr &&
            <Text style={{fontSize: 16, marginTop: 5, fontFamily: Fonts.type.regular, color: '#9B9B9B', backgroundColor: 'transparent'}}>
              Next transfer date: {dStr}
            </Text>
          }
        </View>
      </View>
    )
  }

  renderChildHomepage (childId) {
    const {transferObject} = this.props
    let obj = transferObject[childId]
    let firstName = obj && obj[CHILD_ENTITIES.FIRST_NAME]
    if (obj) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#FFF'}}>
          {
            obj['goals'].map(goal => {
              let goalName = goal[GOAL_ENTITIES.NAME]
              return goal[GOAL_ENTITIES.INSTRUCTIONS].map(ins => {
                let amount = ins[GOAL_ENTITIES.INSTRUCTION_AMOUNT]
                let freq = ins[GOAL_ENTITIES.INSTRUCTION_FREQUENCY]
                let nextTransferDate = ins[GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE]
                return this.renderTextBlock(amount, firstName, goalName, freq, nextTransferDate, 'Cancel')
              })
            })
          }
        </ScrollView>
      )
    } else {
      return (
        <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 28, color: '#006B58', backgroundColor: 'transparent'}}>
            Activity not available
          </Text>
        </View>
      )
    }
  }

  renderChildren (childIDs, children) {
    let views = childIDs.map(childID => this.renderChildHomepage(childID))
    return views
  }

  renderChildPanelElement (child, index) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={child[CHILD_ENTITIES.FIRST_NAME]}
        onPress={() => this.updateIndex(index)}>
        <Text style={{fontSize: 15, fontFamily: Fonts.type.regular, color: '#FFF', backgroundColor: 'transparent'}}>
          {child[CHILD_ENTITIES.FIRST_NAME]}
        </Text>
      </TouchableOpacity>
    )
  }

  renderChildPanel () {
    const {children, childIDs} = this.props
    const {width} = Dimensions.get('window')
    const totalChildren = childIDs.length
    let capsuleWidth = totalChildren && Math.ceil(width / totalChildren)
    if (totalChildren) {
      return (
        <View style={{height: 90, backgroundColor: 'rgb(47, 191, 112)', justifyContent: 'flex-end'}}>
          <View style={{flexDirection: 'row', height: 40, marginBottom: 20, justifyContent: 'space-around', alignItems: 'center'}}>
            {
              childIDs.map((childID, index) => this.renderChildPanelElement(children[childID], index))
            }
          </View>
        </View>
      )
    } else {
      return undefined
    }
  }

  // ------------------------------------------------------------
  // render core component

  render () {
    const {children, childIDs} = this.props
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        {this.renderChildPanel()}
        <SwipeableViews style={{flex: 1, backgroundColor: 'transparent'}} onSwitching={change => this.updateX(change)} index={this.state.currentIndex}>
          {
            this.renderChildren(childIDs, children)
          }
        </SwipeableViews>
      </View>
    )
  }

}

Activity.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  // object containing transfer information
  transferObject: PropTypes.object.isRequired,

  // children object
  children: PropTypes.object.isRequired,

  // child id array
  childIDs: PropTypes.array.isRequired,

  // userid
  userID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default Activity
