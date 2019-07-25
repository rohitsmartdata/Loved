/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 29/3/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Alert, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import CustomNav
  from '../../Containers/Common/CustomNav'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class BrokerDealerPage extends Component {

  // --------------------------------------------------------
  // Action handlers

  showChildInfo (childID, BDAccountID) {
    if (BDAccountID) {
      const {handleLocalAction, localActions, navigator, userID} = this.props
      handleLocalAction({type: localActions.SHOW_BROKER_DEALER_CHILD_INFO, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_ID]: childID, [CHILD_ENTITIES.BD_ACCOUNT_ID]: BDAccountID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    } else {
      Alert.alert('Some problem encountered', 'BDAccountID isn\'t present.')
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderChildren () {
    const {childArr} = this.props
    return (
      <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 0}}>

        {childArr && childArr.map(child => {
          return this.renderChildCard(child[CHILD_ENTITIES.CHILD_ID], child[CHILD_ENTITIES.FIRST_NAME], child[CHILD_ENTITIES.BD_ACCOUNT_ID])
        })}

      </View>
    )
  }

  renderChildCard (childID, childName = '', BDAccountID) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={childName}
        accessibilityRole={'button'}
        onPress={() => this.showChildInfo(childID, BDAccountID)}>
        <View style={{marginHorizontal: 10, marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
            {childName}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={this.props.navigator} leftButtonPresent titlePresent title='BROKER DEALER INFO' />
        {this.renderChildren()}
      </View>
    )
  }

}

BrokerDealerPage.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user id
  userID: PropTypes.string.isRequired,

  // childrens
  children: PropTypes.object.isRequired,

  // child id's
  childArr: PropTypes.array.isRequired
}

// ========================================================
// Export
// ========================================================

export default BrokerDealerPage
