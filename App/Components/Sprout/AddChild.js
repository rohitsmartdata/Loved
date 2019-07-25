/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { Alert, View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import { reduxForm, Field, reset }
  from 'redux-form'
import { connect }
  from 'react-redux'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { FORM_TYPES }
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION }
  from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule
  from '../Utility/GravityCapsule'
import LWTextInput
  from '../Utility/LWFormInput'
import Fonts
  from '../../Themes/Fonts'
import { validateDate }
  from '../../Utility/Transforms/Validator'
var Moment = require('moment')
import Avatar
  from '../../Containers/Utility/Avatar'
import _
  from 'lodash'
import { analytics }
  from '../../Config/AppConfig'
import {screens, events}
  from '../../Utility/Mapper/Tracking'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import Colors
  from '../../Themes/Colors'
import Modal
  from 'react-native-modal'
import CustodialInfo
  from './CustodialInfo'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_CHILD,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class AddChild extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _firstNameError: false,
      _lastNameError: false,
      showModal: false
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentDidMount () {
    const {shouldUpdateOnboarding, userID} = this.props
    shouldUpdateOnboarding && this.updateCurrentOnboarding()
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.ACCOUNT_KYC_START
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  toggleModal (visible) {
    this.setState({
      showModal: visible
    })

    const {userID} = this.props
    if (visible) {
      // *********** Log Analytics ***********
      analytics.track({
        userId: userID,
        event: events.VIEWED_WHAT_IS_CUSTODIAL_ACCOUNT
      })
      // *********** Log Analytics ***********
    }
  }

  onBack () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ON_BACK, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  markError (inputType, error) {
    switch (inputType) {
      case CHILD_ENTITIES.FIRST_NAME:
        this.setState({ _firstNameError: error })
        break
      case CHILD_ENTITIES.LAST_NAME:
        this.setState({ _lastNameError: error })
        break
      default:
        this.setState({
          _firstNameError: false,
          _lastNameError: false
        })

    }
  }

  validate (type, val) {
    switch (type) {
      case CHILD_ENTITIES.FIRST_NAME:
        if (val && val.trim() !== '') {
          this.markError(USER_ENTITIES.FIRST_NAME, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.FIRST_NAME, true)
          return 'FIRST NAME REQ'
        }
      case CHILD_ENTITIES.LAST_NAME:
        if (val && val.trim() !== '') {
          this.markError(USER_ENTITIES.LAST_NAME, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.LAST_NAME, true)
          return 'LAST NAME REQ'
        }
    }
  }

  navigateToNextScreen (data) {
    const { localActions, handleLocalAction, userID, navigator, imageMetadata, isOnboardingFlow } = this.props
    handleLocalAction({
      type: localActions.ADD_CHILD_BIRTH_DATE,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.FIRST_NAME]: data[CHILD_ENTITIES.FIRST_NAME],
      [CHILD_ENTITIES.LAST_NAME]: data[CHILD_ENTITIES.LAST_NAME],
      [CHILD_ENTITIES.IMAGE_META_DATA]: imageMetadata,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: isOnboardingFlow
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          What’s the child’s name?
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center' }}>
          {'We’ll need their full legal name to\nconfirm their identity.'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit, userID, userEmail } = this.props
    const { width } = Dimensions.get('window')
    return (
      <View style={{flex: 1, marginBottom: 80}}>
        <View style={{flex: 1}}>
          <View style={{ alignItems: 'center' }}>
            <Avatar autoUpload={false} imageId={userID} borderWidth={2} avatarSize={100} />
          </View>
          <View style={{...styles.screen.textInput.parentContainerStyle, marginTop: 20, marginBottom: 24}}>
            <Field
              label='First name'
              isLabel
              name={CHILD_ENTITIES.FIRST_NAME}
              accessible
              whiteBackground
              accessibilityLabel={'First Name'}
              accessibilityRole={'keyboardkey'}
              returnKeyType='next'
              onSubmitEditing={() => this.lastname.getRenderedComponent().refs.lastname.focus()}
              component={LWTextInput}
              focusSmoothly
              placeholderText="Child's first name"
              isError={this.state._firstNameError}
              validate={val => this.validate(CHILD_ENTITIES.FIRST_NAME, val)}
              extraTextStyle={{ marginRight: 4, width: width - 90 }}
            />
          </View>
          <View style={{...styles.screen.textInput.parentContainerStyle}}>
            <Field
              name={CHILD_ENTITIES.LAST_NAME}
              label='Last name'
              isLabel
              accessible
              whiteBackground
              accessibilityLabel={'lastname'}
              accessibilityRole={'keyboardkey'}
              returnKeyType='done'
              ref={(el) => { this.lastname = el }}
              refField='lastname'
              withRef
              component={LWTextInput}
              placeholderText="Child's last name"
              isError={this.state._lastNameError}
              validate={val => this.validate(CHILD_ENTITIES.LAST_NAME, val)}
              extraTextStyle={{ marginRight: 4, width: width - 32 }}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={`{what's a custodial account?}`}
          accessibilityRole={'button'}
          onPress={() => this.toggleModal(true)}>
          <Text style={{ ...styles.text.title, color: Colors.fontGray, textDecorationLine: 'underline' }}>
            {'What’s a custodial account?'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 20 
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data)), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  renderModal () {
    const {showModal} = this.state
    if (!showModal) {
      return null
    } else {
      return (
        <Modal
          keyboardShouldPersistTaps='always'
          backdropColor='black'
          animationOut='slideOutDown'
          backdropOpacity={0.6}
          isVisible={showModal}>

          <CustodialInfo toggleModal={this.toggleModal.bind(this)} />

        </Modal>
      )
    }
  }

  // --------------------------------------------------------
  // Render Core component

  render () {
    const { isProcessing, navigator, popButton } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav leftFoo={this.onBack.bind(this)} gradientBackdrop popManually navigator={navigator} leftButtonPresent={popButton} titlePresent title='Custodial Account' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={165}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ ...styles.screen.containers.keyboard }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
        {this.renderModal()}
      </View>
    )
  }
}

AddChild.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  userID: PropTypes.string.isRequired,

  // user identity data
  identityData: PropTypes.object,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // user email
  userEmail: PropTypes.string,

  // email id
  emailID: PropTypes.string.isRequired,

  // is adding desire
  isAddingDesire: PropTypes.bool,

  // is adding dream
  isAddingDream: PropTypes.bool,

  // image meta data
  imageMetadata: PropTypes.object,

  // id token string
  token: PropTypes.string,

  popButton: PropTypes.bool,

  userSSNAdded: PropTypes.bool,

  shouldUpdateOnboarding: PropTypes.bool,

  isOnboardingFlow: PropTypes.bool
}

AddChild.defaultProps = {
  isProcessing: false,
  // is adding desire
  isAddingDesire: false,
  // is adding dream
  isAddingDream: false,
  // pop button present of not
  popButton: true,
  // should update onboarding
  shouldUpdateOnboarding: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(AddChild))

export default Screen
