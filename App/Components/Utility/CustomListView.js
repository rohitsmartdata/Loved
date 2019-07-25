/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 11/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, FlatList}
  from 'react-native'
import styles
  from './Styles/CustomListViewStyle'
import Fonts
  from '../../Themes/Fonts'
import {CUSTOM_LIST_ENTITIES} from '../../Utility/Mapper/Common'
import Colors from '../../Themes/Colors'

// ========================================================
// Core Component
// ========================================================

class CustomListView extends Component {

  renderHeader () {
    return (
      <View style={{paddingTop: 15}}>
        <Text style={{fontSize: 10, fontFamily: Fonts.type.bold, letterSpacing: 1, color: '#050D13', opacity: 0.80, backgroundColor: 'transparent'}}>
          {this.props.header}
        </Text>
      </View>
    )
  }

  renderCapsule (type, key, value, subheading, showBorder) {
    var {paddingRequired} = this.props
    if (paddingRequired === undefined || paddingRequired === null) {
      paddingRequired = true
    }
    switch (type) {

      case CUSTOM_LIST_ENTITIES.SIMPLE: {
        return (
          <View style={{...styles.capsuleContainer}}>
            <View style={{...styles.capsule, paddingLeft: 0, borderBottomWidth: showBorder ? 1 : 0, borderColor: 'rgba(5, 13, 19, 0.2)'}}>
              <Text style={{fontSize: 16, fontFamily: Fonts.type.book, color: Colors.black, backgroundColor: 'transparent'}}>
                {key}
              </Text>
              <Text style={{fontSize: 16, textAlign: 'right', fontFamily: Fonts.type.book, color: Colors.black, backgroundColor: 'transparent'}}>
                {value}
              </Text>
            </View>
          </View>
        )
      }

      case CUSTOM_LIST_ENTITIES.BULLET: {
        return (
          <View style={{...styles.capsuleContainer, paddingLeft: paddingRequired ? 14 : 0, paddingRight: paddingRequired ? 14 : 0}}>
            <View style={styles.capsuleHeader}>
              <View style={styles.capsuleHeaderStyle} />
            </View>
            <View style={styles.capsule}>
              <Text style={styles.capsuleTextStyle}>
                {key}
              </Text>
              <Text style={styles.capsuleTextStyle}>
                {value}
              </Text>
            </View>
          </View>
        )
      }

      case CUSTOM_LIST_ENTITIES.GAP: {
        return (
          <View style={{...styles.capsuleContainer, paddingLeft: paddingRequired ? 14 : 0, paddingRight: paddingRequired ? 14 : 0}}>
            <View style={{...styles.capsuleHeader, width: 80}} />
            <View style={{...styles.compactCapsuleContainer, borderBottomWidth: showBorder ? styles.compactCapsuleContainer.borderBottomWidth : 0}}>

              <View style={styles.compactCapsule}>
                <Text style={{...styles.capsuleTextStyle, fontSize: 14}}>
                  {key}
                </Text>
                <Text style={{...styles.capsuleTextStyle, fontSize: 14}}>
                  {value}
                </Text>
              </View>
              <View style={styles.compactCapsuleDescriptorContainer}>
                <Text style={{...styles.capsuleTextStyle, fontSize: 12}}>
                  {subheading}
                </Text>
              </View>

            </View>
          </View>
        )
      }
    }
  }

  renderListView () {
    const {data} = this.props
    let endIndex = (data && (data.length - 1)) || 0
    return (
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return this.renderCapsule(item.type, item.key, item.value, item.subheading, index !== endIndex)
        }}
        />
    )
  }

  render () {
    const {header} = this.props
    return (
      <View style={{backgroundColor: 'white', margin: 5, borderRadius: 6, paddingHorizontal: 19, paddingBottom: 19}}>
        {header && this.renderHeader()}
        {this.renderListView()}
      </View>
    )
  }

}

CustomListView.propTypes = {
  header: PropTypes.string,

  // data for the list
  data: PropTypes.array.isRequired,

  paddingRequired: PropTypes.bool
}
CustomListView.defaultProps = {
  header: undefined
}

// ========================================================
// Export
// ========================================================

export default CustomListView
