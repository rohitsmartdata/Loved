/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces,jsx-indent-props,new-cap */
/**
 * User Input Detail Number 3.
 * - Phone Number
 * - Address
 *
 * Created by viktor on 27/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { Animated, View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import Toast
  from '../Common/Toast'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import Fonts from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {parseAddress}
  from '../../Utility/Transforms/Parsers'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule
  from '../Utility/GravityCapsule'
import {googleAPI}
  from '../../Services/GoogleApi'
import AnimatedBoxList
  from '../Utility/AnimatedBoxList'
import LWFormInput
  from '../Utility/LWFormInput'
import _
  from 'lodash'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'
import MapView
  from 'react-native-maps'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import * as Constants
  from '../../Themes/Constants'
import Options
  from '../../CommonComponents/Options'
import Colors
  from '../../Themes/Colors'

const addressText = 'I don\'t see my address here., '

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

let formComponents = () => {
  return {
    [USER_ENTITIES.ADDRESS_LINE_1]: '',
    [USER_ENTITIES.ADDRESS_LINE_2]: '',
    [USER_ENTITIES.CITY]: '',
    [USER_ENTITIES.STATE]: '',
    [USER_ENTITIES.ZIP_CODE]: ''
  }
}
let deviceHeight = Dimensions.get('window').height

// ========================================================
// Core Component
// ========================================================

// Todo:-
// proper error handling
class InputUserDetail_3 extends Component {

  // -------------------------------------------------------
  // Lifecycle methods

  /*
   - introduces 'listData'
   to local state
   */
  constructor (props) {
    super(props)
    this.state = {
      listData: [],
      textFieldValue: '',
      _line1Error: false,
      height: 40,
      mapY: new Animated.Value(deviceHeight),
      showContinueButton: false
    }
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  openMap () {
    Animated.timing(this.state.mapY, {
      duration: 1000,
      toValue: 0,
      delay: 300
    }).start()
  }

  closeMap (cb) {
    Animated.timing(this.state.mapY, {
      duration: 500,
      toValue: deviceHeight,
      delay: 300
    }).start(cb)
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.FULL_ADDRESS:
        this.setState({_line1Error: error})
        break
      default:
        this.setState({
          _line1Error: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.FULL_ADDRESS:
        if (val && val !== ' ') {
          this.markError(USER_ENTITIES.FULL_ADDRESS, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.FULL_ADDRESS, true)
          return 'ADDRESS LINE 1 Required'
        }
    }
  }

  componentDidMount () {
    this.updateCurrentOnboarding()

    const {location} = this.props

    if (location) {
      this.openMap()
      this.setState({ showContinueButton: true })
    }
  }

  // -------------------------------------------------------
  // action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (data) {
    let missingValues = []
    Object.keys(new formComponents()).forEach((key) => {
      if (!data[key] && key !== USER_ENTITIES.ADDRESS_LINE_2) {
        missingValues.push(key)
      }
    })
    this.openMap()
    const {localActions, handleLocalAction, navigator, nextScreen, userID, childID, isAddingDesire, isAddingDream} = this.props
    if (missingValues.length > 0) {
      handleLocalAction({type: localActions.NAVIGATE_TO_INPUT_MANUAL_ADDRESS_SCREEN, [CHILD_ENTITIES.CHILD_ID]: childID, [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream, [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.SCREEN_TYPE]: SPROUT.USER_INPUT_MANUAL_ADDRESS, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.NEXT_SCREEN]: nextScreen, 'addressData': data})
    } else {
      handleLocalAction({type: localActions.NAVIGATE_TO_USER_SSN, [CHILD_ENTITIES.CHILD_ID]: childID, [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream, [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.CAN_POP]: true, 'addressData': data})
    }
  }

  changeField (field, value) {
    const {localActions, handleLocalAction} = this.props
    handleLocalAction({type: localActions.CHANGE_FIELD, form: FORM_TYPES.ADD_USER, field: field, value: value})
  }

  autoFill (obj) {
    let finalObj = Object.assign(new formComponents(), obj)
    let keys = Object.keys(finalObj)

    let addr1 = finalObj[USER_ENTITIES.ADDRESS_LINE_1]
    let addr2 = finalObj[USER_ENTITIES.ADDRESS_LINE_2]
    if (Object.keys(obj).length) { finalObj[USER_ENTITIES.ADDRESS_LINE_1] = (addr1 + ' ' + addr2).trim() }
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === USER_ENTITIES.ADDRESS_LINE_2) {
        continue
      }
      this.changeField(keys[i], _.cloneDeep(finalObj[keys[i]]))
    }
  }

  /*
   set List State :-
   - sets the state of
   the list as 's'
   */
  setListState (s) {
    this.setState({listData: s})
  }

  /*
   Text Change Listener :-
   - Custom Data listener for
   text address field 1
   - Responsible for communicating
   with google API and fetching
   auto-complete suggestions
   */
  textChangeListener (text) {
    try {
      googleAPI().autocomplete({input: text})
        .then(r => {
          this.closeMap(() => {
            this.setState({ showContinueButton: false, textFieldValue: text })
            this.changeField(USER_ENTITIES.LOCATION, '')
            this.autoFill({})
          })
          this.setListState(r.data.predictions)
        })
        .catch(err => console.log('error : ', err))
    } catch (err) {
      console.warn('error while autocomplete : ', err.message)
    }
  }

  getPlaceDetail (place) {
    if (place['description'] === addressText) {
      this.closeMap(() => {
        this.changeField(USER_ENTITIES.FULL_ADDRESS, '')
        this.changeField(USER_ENTITIES.ADDRESS_LINE_2, '')
        this.changeField(USER_ENTITIES.LOCATION, '')
        this.autoFill({})
        this.setListState([])
        const {localActions, handleLocalAction, navigator, userID, childID} = this.props
        handleLocalAction({type: localActions.NAVIGATE_TO_INPUT_MANUAL_ADDRESS_SCREEN, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.SCREEN_TYPE]: SPROUT.USER_INPUT_MANUAL_ADDRESS, [COMMON_ENTITIES.NAVIGATOR]: navigator})
      })
    } else {
      this.setListState([])
      Keyboard.dismiss()
      this.openMap()
      let obj, fieldObj
      try {
        // check 'place' is alright
        if (!place || !place['place_id']) {
          throw new Error('missing parameter')
        }

        // fetch place detail
        googleAPI()
          .getDetail({placeid: place['place_id']})
          .then(response => {
            this.setState({ showContinueButton: true })
            obj = response['data']['result']
            fieldObj = parseAddress(obj)
            this.autoFill(fieldObj)
          })
          .catch(err => { console.log('error while getting place detail : ', err) })
      } catch (err) {
        console.log(' ###### error while getting place detail ###### ', err.message)
      }
    }
  }

  /*
   blur handler :- (for 'address field 1')
   - objective is to flush the
   array list, to close the box
   */

  // -------------------------------------------------------
  // render inner component

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, marginBottom: 10, alignItems: 'center' }}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          What is your address?
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', textAlign: 'center', fontSize: 18 }}>
          We are required to collect this information under Federal Law.
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {handleSubmit} = this.props

    const {listData, textFieldValue, showContinueButton} = this.state
    let finalData = _.cloneDeep(listData)
    if (textFieldValue && !showContinueButton) {
      finalData.push({description: addressText})
    }

    const {width} = Dimensions.get('window')
    const fieldWidth = (width - 32)
    return (
      <View style={{marginTop: 20}}>
        <View style={{...styles.screen.textInput.parentContainerStyle}}>
          <Field
            accessible accessibilityLabel={'Address Line 1'}
            accessibilityRole={'keyboardkey'}
            accessibilityHint={'Street address'}
            name={USER_ENTITIES.FULL_ADDRESS}
            isLabel
            focusSmoothly
            label='Street address'
            component={LWFormInput}
            placeholderText='Street address'
            returnKeyType='next'
            whiteBackground
            isError={this.state._line1Error}
            validate={val => this.validate(USER_ENTITIES.FULL_ADDRESS, val)}
            textChangeListener={this.textChangeListener.bind(this)}
          />
        </View>
        <AnimatedBoxList
          data={finalData}
          touchHandler={_.debounce(this.getPlaceDetail.bind(this), 700, {'leading': true, 'trailing': false})}
        />
      </View>
    )
  }

  renderNextButton () {
    const {showContinueButton} = this.state
    if (!showContinueButton) return null
    const {handleSubmit} = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
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
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data)), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  renderMap () {
    const { location } = this.props
    if (!location) return null
    return (
      <Animated.View style={{ flex: 1, transform: [{translateY: this.state.mapY}] }}>
        <MapView
          style={{flex: 1}}
          region={{
            ...location,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}>
          <MapView.Marker
            coordinate={location}
          />
        </MapView>
      </Animated.View>
    )
  }

  // -------------------------------------------------------
  // render core component

  render () {
    const {navigator, popButton, toast, toastSubheading, toastHeading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent={popButton} titlePresent title='Verification' />
        <View style={{ paddingHorizontal: 20 }}>
          {this.renderHeading()}
          {this.renderFormContainer()}
        </View>
        <View style={{ flex: 1, marginTop: 20, marginBottom: Constants.screen.height * 0.16 }}>
          {this.renderMap()}
        </View>
        {this.renderNextButton()}
      </View>
    )
  }
}

InputUserDetail_3.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, omes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // next screen to navigate
  nextScreen: PropTypes.string.isRequired,

  // user ID
  userID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // is adding dream
  isAddingDream: PropTypes.bool,

  // is adding desire
  isAddingDesire: PropTypes.bool,

  // popButton
  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputUserDetail_3.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_3))

export default Screen
