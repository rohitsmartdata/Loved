/* eslint-disable no-unused-vars */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
import Colors from '../../Themes/Colors'
import CustomNav from '../../Containers/Common/CustomNav'
import Avatar from '../../Containers/Utility/Avatar'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { CURRENT_ENVIRONMENT, CURRENT_VERSION, analytics } from '../../Config/AppConfig'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import ShadowedContainer from '../../CommonComponents/ShadowedContainer'
import { Icon } from 'react-native-elements'
import Fonts from '../../Themes/Fonts'
import { ENVIRONMENT } from '../../Config/contants'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { events }
  from '../../Utility/Mapper/Tracking'

// ========================================================
// UTILITY
// ========================================================

// ========================================================
// Core Component
// ========================================================

class EditProfile extends Component {

  constructor (props) {
    super(props)
    this.state = {
      userID: props.userID
    }
  }

  logout () {
    const {userID} = this.state
    const {handleLocalAction, localActions, navigator} = this.props
    userID && (
      analytics.track({
        userId: userID,
        event: events.LOGOUT,
        properties: {
          screen: 'settings'
        }
      })
    )
    handleLocalAction({type: localActions.LOGOUT, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  navigateToChange (type) {
    const {handleLocalAction, navigator} = this.props
    handleLocalAction({type: type, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  changeDebugMode (value) {
    const {handleLocalAction, localActions, userID} = this.props
    if (value) {
      handleLocalAction({type: localActions.SWITCH_OFF_DEBUG_MODE})
    } else {
      handleLocalAction({type: localActions.SWITCH_ON_DEBUG_MODE, [USER_ENTITIES.USER_ID]: userID})
    }
  }

  renderHeading () {
    const { firstName, lastName, userID, navigator, userImage, imageUrl } = this.props
    const imageType = ['USER']
    const imageId = [userID]
    return (
      <View style={{paddingTop: 10, paddingBottom: 32, backgroundColor: Colors.appBlue}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title={'Profile Settings'} blueBackdrop extraStyles={{backgroundColor: Colors.transparent, fontFamily: Fonts.type.book}} titleStyle={{color: Colors.white}} />
        <View style={{ alignSelf: 'center' }}>
          <Avatar isSelected borderWidth={0} avatarSize={75} showAddButton={false} imageRadius={35} imageUrl={imageUrl} image={userImage} imageType={imageType} imageId={imageId} canEdit />
        </View>
        <Text style={{...ApplicationStyles.text.nameHeader, marginTop: 14, fontFamily: Fonts.type.book}}>{[firstName, lastName].join(' ')}</Text>
      </View>
    )
  }

  renderTitle (title) {
    return (
      <View>
        <Text style={{ ...ApplicationStyles.text.description, letterSpacing: 0.7, textAlign: 'left', color: Colors.gray, paddingHorizontal: 35, backgroundColor: Colors.white, height: 50, paddingTop: 30, fontFamily: Fonts.type.medium }}>
          {title}
        </Text>
        <View style={{height: 10, backgroundColor: Colors.offWhite}} />
      </View>
    )
  }

  renderBox (title, type, canEdit) {
    return (
      <View style={{height: 60, borderBottomColor: 'rgba(215, 215, 215, 0.5)', borderBottomWidth: 1, backgroundColor: Colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 35}}>
        <Text style={{ ...ApplicationStyles.text.subTitle, textAlign: 'left', color: Colors.blue, fontFamily: Fonts.type.book }}>{title}</Text>
        {
          canEdit &&
          <ShadowedContainer size={26} onPress={() => this.navigateToChange(type)} accessible accessibilityLabel={'Edit'} accessibilityRole={'button'}
          >
            <Icon name='edit-3' type='feather' color={Colors.fontGray} size={11} />
          </ShadowedContainer>
        }
      </View>
    )
  }

  renderMainComponent () {
    const {localActions, emailID} = this.props
    const showDebugMode = CURRENT_ENVIRONMENT === ENVIRONMENT.UAT2

    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: Colors.transparent}}>
          {this.renderTitle('CONTACT')}
          {this.renderBox(emailID || 'email')}
          {this.renderTitle('SECURITY')}
          {this.renderBox('PIN', localActions.CHANGE_PIN, true)}
          {this.renderBox('PASSWORD', localActions.CHANGE_PASSWORD, true)}

          {showDebugMode && this.renderDebugWindow()}

        </ScrollView>
        <View style={{paddingLeft: 35, paddingBottom: 40, paddingTop: 10, backgroundColor: Colors.white}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Log out'}
            accessibilityRole={'button'}
            onPress={() => this.logout()}>
            <Text
              style={{...ApplicationStyles.text.title, textAlign: 'left', color: Colors.blue, textDecorationLine: 'underline', marginBottom: 24, fontFamily: Fonts.type.book}}>
              Log out
            </Text>
          </TouchableOpacity>
          <Text style={{...ApplicationStyles.text.description, textAlign: 'left', color: Colors.gray, fontFamily: Fonts.type.book}}>
            {'Version ' + CURRENT_VERSION}
          </Text>
        </View>
      </View>
    )
  }

  renderDebugWindow () {
    const {localActions, userID} = this.props
    let userIDStr = 'USER ID : ' + userID

    return (
      <View>
        {this.renderTitle('DEBUG MODE')}
        {this.renderBox(userIDStr)}
        {this.renderBox('Third Party Trade data', localActions.BROKER_DEALER_INFO, true)}
        {this.renderSwitchButton()}
      </View>
    )
  }

  renderSwitchButton () {
    const {debugMode, childAvailable} = this.props
    return (
      <View style={{height: 60, borderBottomColor: 'rgba(215, 215, 215, 0.5)', borderBottomWidth: 1, backgroundColor: Colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 35}}>
        <Text style={{ ...ApplicationStyles.text.subTitle, textAlign: 'left', color: Colors.blue, fontFamily: Fonts.type.book }}>
          DEBUG MODE
        </Text>
        <Switch disabled={!childAvailable} value={debugMode} onValueChange={() => this.changeDebugMode(debugMode)} />
      </View>
    )
  }

  render () {
    const {isFetchProcessing, isLogoutHappening, userImageProcessing} = this.props

    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <ProcessingIndicator isProcessing={isFetchProcessing || isLogoutHappening || userImageProcessing} />
        {this.renderHeading()}
        {this.renderMainComponent()}
      </View>
    )
  }

}

EditProfile.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  // is fetch processing
  isFetchProcessing: PropTypes.bool.isRequired,
  // is logout processing
  isLogoutHappening: PropTypes.bool.isRequired,
  // email id of user
  emailID: PropTypes.string.isRequired,
  // phone number of user
  phoneNumber: PropTypes.string,
  imageUrl: PropTypes.any,
  userID: PropTypes.string,
  userImage: PropTypes.string,
  userImageProcessing: PropTypes.bool,
  // debug mode
  debugMode: PropTypes.bool.isRequired,
  // children available
  childAvailable: PropTypes.bool.isRequired
}

EditProfile.defaultProps = {
  debugMode: false,
  childAvailable: false,
  isLogoutHappening: false
}

// ========================================================
// Export
// ========================================================

export default EditProfile
