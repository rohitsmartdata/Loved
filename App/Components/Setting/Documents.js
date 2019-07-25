
// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TouchableHighlight }
  from 'react-native'
import Colors from '../../Themes/Colors'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import { Icon } from 'react-native-elements'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import Fonts from '../../Themes/Fonts'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'

// ========================================================
// UTILITY
// ========================================================

// ========================================================
// Core Component
// ========================================================

class Documents extends Component {

  showDocuments () {
    const {handleLocalAction, localActions, idToken, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_DOCUMENTS, [AUTH_ENTITIES.ID_TOKEN]: idToken, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showConfirmations () {
    const {handleLocalAction, localActions, idToken, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_CONFIRMATIONS, [AUTH_ENTITIES.ID_TOKEN]: idToken, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  renderOptions () {
    return (
      <View style={{marginTop: 15, marginHorizontal: 25}}>
        <TouchableHighlight onPress={() => this.showConfirmations()} underlayColor={Colors.transparent}>
          <View style={{ backgroundColor: Colors.white, borderRadius: 11, shadowColor: Colors.black, shadowOpacity: 0.16, shadowOffset: {x: 2, y: 1}, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15, paddingRight: 25, paddingVertical: 27, marginBottom: 10, height: null }} >
            <Text style={{...styles.text.header, fontWeight: 'normal', fontFamily: Fonts.type.book}}>
              Trade Confirmations
            </Text>
            <Icon name='chevron-thin-right' type='entypo' color={Colors.blue} size={20} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.showDocuments()} underlayColor={Colors.transparent}>
          <View style={{ backgroundColor: Colors.white, borderRadius: 11, shadowColor: Colors.black, shadowOpacity: 0.16, shadowOffset: {x: 2, y: 1}, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15, paddingRight: 25, paddingVertical: 27, marginBottom: 10, height: null }} >
            <Text style={{...styles.text.header, fontWeight: 'normal', fontFamily: Fonts.type.book}}>
              Statements
            </Text>
            <Icon name='chevron-thin-right' type='entypo' color={Colors.blue} size={20} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.showDocuments()} underlayColor={Colors.transparent}>
          <View style={{ backgroundColor: Colors.white, borderRadius: 11, shadowColor: Colors.black, shadowOpacity: 0.16, shadowOffset: {x: 2, y: 1}, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15, paddingRight: 25, paddingVertical: 27, marginBottom: 10, height: null }} >
            <Text style={{...styles.text.header, fontWeight: 'normal', fontFamily: Fonts.type.book}}>
              Tax Documents
            </Text>
            <Icon name='chevron-thin-right' type='entypo' color={Colors.blue} size={20} />
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  render () {
    const {navigator, processing} = this.props

    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Documents' />
        <ProcessingIndicator isProcessing={processing} />
        {this.renderOptions()}
      </View>
    )
  }

}

Documents.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // id token
  idToken: PropTypes.string.isRequired,

  // is processing
  processing: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default Documents

