/* eslint-disable no-unused-vars,no-trailing-spaces,camelcase */
/**
 * Created by demon on 1/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  PushNotificationIOS,
  Text,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList
} from 'react-native'
import Toast
  from '../Common/Toast'
import { reduxForm, Field } from 'redux-form'
import LinearGradient from 'react-native-linear-gradient'
import CustomNav from '../../Containers/Common/CustomNav'
import { connect } from 'react-redux'
import { FORM_TYPES, ANALYTIC_PROPERTIES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule from '../Utility/GravityCapsule'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import LWFormInput from '../Utility/LWFormInput'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { formatDOB } from '../../Utility/Formatter/inputFormatter'
import { validateDate } from '../../Utility/Transforms/Validator'
import { SPROUT, LW_SCREEN, LW_EVENT_TYPE } from '../../Utility/Mapper/Screens'
var Moment = require('moment')
import {CURRENT_ENVIRONMENT, analytics} from '../../Config/AppConfig'
import _
  from 'lodash'
import ContactsWrapper from 'react-native-contacts-wrapper'
var Buffer = require('buffer/').Buffer
import { Icon } from 'react-native-elements'
import {screens} from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_CHILD,
  destroyOnUnmount: false
})

const getUniqueCode = (user_id, sprout_id, ssn_request_mobile, ssn_request_email) => {
  let unique_code = ''
  let encoded_unique_code = ''
  if (!unique_code) {
    unique_code += user_id + '_' + sprout_id
    if (ssn_request_mobile) {
      unique_code += '_' + ssn_request_mobile
    }
    if (ssn_request_email) {
      unique_code += '_' + ssn_request_email
    }
    // console.log('-----> ENCODE:', unique_code);

    const buffer = Buffer.from(unique_code, 'utf8')
    encoded_unique_code = buffer.toString('base64')
    // console.log(logging_key + ' - unique_code created' + ' = ' + encoded_unique_code);
  } else {
    encoded_unique_code = unique_code
  }

  let unique_code_url = ''
  if (process.env.ENVIRONMENT === 'PROD') {
    unique_code_url = `https://www.loved.com/enterdetails/index.html?code=${encoded_unique_code}`
  } else {
    unique_code_url = `https://www.loved.com/enterdetails/test/${CURRENT_ENVIRONMENT}/index.html?code=${encoded_unique_code}`
  }
  return {
    code: encoded_unique_code,
    url: unique_code_url
  }
}

// ========================================================
// Core Component
// ========================================================

class SSNRequestContact extends Component {
  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX

    this.state = {
      contacts: [],
      allContacts: [],
      showContacts: false
    }
  }

  componentDidMount () {
    const {userID} = this.props
    // // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.REQUEST_CHILD_SSN
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers
  changeField (value) {
    const {localActions, handleLocalAction} = this.props
    handleLocalAction({type: localActions.CHANGE_FIELD, form: FORM_TYPES.ADD_CHILD, field: USER_ENTITIES.PHONE_NUMBER, value: value})
  }

  validate (val) {
    return /^\d{10}$/.test(val)
  }

  next () {
    const {localActions, handleLocalAction, navigator, userSSN, childID, email, userID, phoneNumber} = this.props
    let phone = phoneNumber
    if (!phone || (phone && phone.length === 0)) {
      return
    }
    let x = getUniqueCode(userID, childID, phone, email)
    let uniqueCode = x['code']
    let uniqueUrl = x['url']

    handleLocalAction({type: localActions.REQUEST_SSN,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.SSN]: userSSN,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [USER_ENTITIES.EMAIL_ID]: email,
      [CHILD_ENTITIES.SSN_REQUEST_PHONE_NUMBER]: phone,
      [CHILD_ENTITIES.UNIQUE_CODE]: uniqueCode,
      [CHILD_ENTITIES.UNIQUE_URL]: uniqueUrl,
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }
  openContact () {
    ContactsWrapper.getContact()
      .then((contact) => {
        this.changeField(contact.phone)
        this.setState({ showContacts: false })
      })
      .catch((error) => {
        console.log('ERROR CODE: ', error.code)
        console.log('ERROR MESSAGE: ', error.message)
      })
  }
  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={styles.screen.h2.containerStyle}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20 }}>
          Enter the phone number?
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit } = this.props
    const { contacts, showContacts } = this.state
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{...styles.screen.textInput.parentContainerStyle, flexDirection: 'row'}}>
          <Field
            accessible accessibilityLabel={'Phone Number'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.PHONE_NUMBER}
            component={LWFormInput}
            keyboardType='phone-pad'
            isLabel
            label='Phone number'
            placeholderText='Phone Number'
            returnKeyType='next'
            whiteBackground
            maxLength={18}
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))} />
          <TouchableOpacity
            accessible
            accessibilityLabel={'Open Contacts'}
            accessibilityRole={'button'}
            onPress={() => this.openContact()} style={{marginLeft: 16, justifyContent: 'center', alignItems: 'center'}}>
            <Icon name='address-book' type={'font-awesome'} color='#000' size={28} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={showContacts ? contacts : []}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                accessible
                accessibilityLabel={'Change Phone Number'}
                accessibilityRole={'button'}
                onPress={() => this.changeField(item.phoneNumbers[0].number)} style={{paddingVertical: 5}}>
                <Text style={{fontSize: 15, fontFamily: Fonts.type.semibold}}>{[item.givenName, item.middleName, item.familyName].join(' ')}</Text>
                <Text style={{fontSize: 13, fontFamily: Fonts.type.regular}}>{item.phoneNumbers[0].number}</Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Request'}
          accessibilityRole={'button'}
          style={{ ...styles.bottomNavigator.containerStyle }}
          onPress={() => this.next()}
        >
          <Text style={styles.bottomNavigator.textStyle}>REQUEST</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const { navigator, isProcessing } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent rightButtonPresent={false} title='REQUEST SSN' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 0 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

SSNRequestContact.propTypeDetail_s = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user ID
  userID: PropTypes.string,

  // user ssn
  userSSN: PropTypes.string,

  // phone number
  phoneNumber: PropTypes.string,

  // email id
  email: PropTypes.string,

  // child id
  childID: PropTypes.string,

  // is processing
  isProcessing: PropTypes.bool,

  // is ssn requested
  isSSNRequested: PropTypes.bool
}

SSNRequestContact.defaultProps = {
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(SSNRequestContact))

export default Screen
