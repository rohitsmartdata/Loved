/* eslint-disable no-unused-vars,no-trailing-spaces,spaced-comment */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TouchableOpacity, ScrollView, Image }
  from 'react-native'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {reduxForm, Field}
  from 'redux-form'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import styles
  from '../../Themes/ApplicationStyles'
import LWFormInput
  from '../Utility/LWFormInput'
import Fonts
  from '../../Themes/Fonts'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.EDIT_PROFILE,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class EditProfile extends Component {

  // ------------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      showPassword: false,
      showPasscode: false
    }
  }

  componentWillMount () {
    const {firstName, lastName, passcode, password, emailID} = this.props
    this.setValue(USER_ENTITIES.FULL_NAME, firstName + ' ' + lastName)
    this.setValue(USER_ENTITIES.EMAIL_ID, emailID)
    this.setValue(AUTH_ENTITIES.PIN, passcode)
    this.setValue(AUTH_ENTITIES.PASSWORD, password)
  }

  // ------------------------------------------------------------
  // Action Handlers

  setValue (field, value) {
    const {localActions, handleLocalAction} = this.props
    handleLocalAction({type: localActions.SET_VALUE, form: FORM_TYPES.EDIT_PROFILE, field: field, value: value})
  }

  navigateToChangePassword () {
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({type: localActions.CHANGE_PASSWORD, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  navigateToChangePin () {
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({type: localActions.CHANGE_PIN, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // ------------------------------------------------------------
  // child render methods

  renderDetailCube () {
    const {firstName, lastName, imageUrl, userID, emailID, userImage} = this.props
    const imageType = ['USER']
    const imageId = [userID]
    return (
      <View style={{marginTop: 60}}>
        {
          firstName && lastName &&
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 20, color: '#000', backgroundColor: 'transparent'}}>
            {firstName} {lastName}
          </Text>
        }

        <View style={{marginTop: 30}}>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 14, color: '#10427E', backgroundColor: 'transparent'}}>
            Email Address
          </Text>
          <View style={{...styles.screen.textInput.parentContainerStyle, marginTop: 5}}>
            <Field name={USER_ENTITIES.EMAIL_ID} whiteBackground editable={false} accessible accessibilityLabel={'email'} accessibilityRole={'keyboardkey'} component={LWFormInput} placeholderText='Email Address' extraTextStyle={{color: '#10427E', fontFamily: Fonts.type.regular, fontSize: 18}} extraStyle={{marginRight: 4}} maxLength={39} />
          </View>
        </View>

      </View>
    )
  }

  renderPasswordCube () {
    return (
      <View style={{marginTop: 60}}>

        <Text style={{fontFamily: Fonts.type.bold, fontSize: 20, color: '#10427E', backgroundColor: 'transparent'}}>
          Security
        </Text>

        <View style={{marginTop: 30}}>
          {this.renderInvestorButton('Change PIN', () => this.navigateToChangePin())}
        </View>

        <View style={{marginTop: 30}}>
          {this.renderInvestorButton('Change Password', () => this.navigateToChangePassword())}
        </View>

      </View>
    )
  }

  renderInvestorCube () {
    return (
      <View style={{marginTop: 60}}>

        <Text style={{fontFamily: Fonts.type.bold, fontSize: 22, color: '#00CBCE', backgroundColor: 'transparent'}}>
          Investor Profile
        </Text>

        <View style={{marginTop: 30}}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 14, color: '#9B9B9B', backgroundColor: 'transparent'}}>
            Investor Type
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, borderBottomWidth: 1, borderColor: '#D7D7D7'}}>
            <Text style={{color: '#9B9B9B', marginBottom: 10, fontFamily: Fonts.type.bold, fontSize: 18}}>
              Moderate
            </Text>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 14, color: '#9B9B9B', backgroundColor: 'transparent'}}>
            Employment State
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, borderBottomWidth: 1, borderColor: '#D7D7D7'}}>
            <Text style={{color: '#9B9B9B', marginBottom: 10, fontFamily: Fonts.type.bold, fontSize: 18}}>
              Employed
            </Text>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 14, color: '#9B9B9B', backgroundColor: 'transparent'}}>
            Net income
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, borderBottomWidth: 1, borderColor: '#D7D7D7'}}>
            <Text style={{color: '#9B9B9B', marginBottom: 10, fontFamily: Fonts.type.bold, fontSize: 18}}>
              Over $100K
            </Text>
          </View>
        </View>

        <View style={{marginTop: 30, marginBottom: 50}}>
          <Text style={{fontFamily: 'Lato-Light', fontSize: 14, color: '#9B9B9B', backgroundColor: 'transparent'}}>
            Net Assets
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, borderBottomWidth: 1, borderColor: '#D7D7D7'}}>
            <Text style={{color: '#9B9B9B', marginBottom: 10, fontFamily: Fonts.type.bold, fontSize: 18}}>
              $50-$100
            </Text>
          </View>
        </View>

      </View>
    )
  }

  renderInvestorButton (title, foo) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        onPress={() => foo()} style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, borderBottomWidth: 1, borderColor: '#D7D7D7'}}>
        <Text style={{color: '#10427E', marginBottom: 10, fontFamily: Fonts.type.regular, fontSize: 18, backgroundColor: 'transparent'}}>
          {title}
        </Text>
        <Image style={{tintColor: '#10427E'}} source={require('../../../Img/icons/forward.png')} />
      </TouchableOpacity>
    )
  }

  // ------------------------------------------------------------
  // Core render method

  render () {
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={this.props.navigator} leftButtonPresent titlePresent title='EDIT PROFILE' />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1, paddingLeft: 20, paddingRight: 40}}>
          {this.renderDetailCube()}
          {this.renderPasswordCube()}
        </ScrollView>
      </View>
    )
  }
}

EditProfile.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired,

  // firstname of user
  firstName: PropTypes.string.isRequired,
  // lastname of user
  lastName: PropTypes.string.isRequired,
  // passcode
  passcode: PropTypes.string.isRequired,
  // password
  password: PropTypes.string.isRequired,
  // email id of user
  emailID: PropTypes.string.isRequired,
  imageUrl: PropTypes.any,
  userId: PropTypes.string,
  userImage: PropTypes.string
}

const Screen = connect()(form(EditProfile))

export default Screen
