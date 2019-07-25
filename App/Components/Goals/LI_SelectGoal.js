/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * Created by demon on 14/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  TouchableHighlight
} from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import { DEVICE_LOGICAL_RESOLUTION, COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import {Icon}
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import HTML
  from 'react-native-render-html'
import CustomNav
  from '../../Containers/Common/CustomNav'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import { analytics }
  from '../../Config/AppConfig'
import {events}
  from '../../Utility/Mapper/Tracking'
import Colors from '../../Themes/Colors'
import { CachedImage } from '../Invest/LI_SelectInvestment'
import LinearGradient from 'react-native-linear-gradient'
import SSNPopup from '../../Containers/Sprout/SSNPopup'
import { INVESTMENT_ENTITIES } from '../../Utility/Mapper/Investment'
import UserSSNPopup from '../../Containers/User/UserSSNPopup'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class LI_SelectGoal extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.state = {
      currentTab: 0,
      ssnPopupVisible: false,
      userSSNPopupVisible: false
    }
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    const {products, userID} = this.props
    const {currentTab} = this.state
    if (!products) {
      this.fetchProducts()
    }
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_VIEW,
      properties: {
        tab_name: 0
      }
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  setCurrentTab (n) {
    this.setState({
      currentTab: n
    })

    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_VIEW,
      properties: {
        tab_name: n
      }
    })
    // *********** Log Analytics ***********
  }

  fetchProducts () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.FETCH_PRODUCTS})
  }

  updateField (action, field, value) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  selectGoal (goalName) {
    const {handleLocalAction, localActions, navigator, userID, isModal, childID, pushFunc, userSSNAdded, isssnAdded} = this.props

    if (userSSNAdded !== 1) {
      this.toggleShowUserSSN(true)
    } else if (isssnAdded !== 1) {
      this.toggleShowSSN(true)
    } else {
      handleLocalAction({type: localActions.SELECT_GOAL,
        [CHILD_ENTITIES.CHILD_ID]: childID,
        [USER_ENTITIES.USER_ID]: userID,
        [GOAL_ENTITIES.NAME]: goalName,
        'pushFunc': pushFunc,
        isModal: isModal,
        [COMMON_ENTITIES.NAVIGATOR]: navigator,
        form: FORM_TYPES.ADD_GOAL
      })
    }
  }

  showGoal (goalID, name) {
    const {handleLocalAction, localActions, childID, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [GOAL_ENTITIES.NAME]: name, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  pushHandler () {
    const {handleLocalAction, localActions, navigator, pushFunc} = this.props
    handleLocalAction({type: localActions.PUSH, 'pushFunc': pushFunc})
  }

  popHandler () {
    const {handleLocalAction, localActions, popFunc} = this.props
    handleLocalAction({type: localActions.POP, 'popFunc': popFunc})
  }

  toggleShowSSN (visibility) {
    this.setState({
      ssnPopupVisible: visibility
    })
  }

  toggleShowUserSSN (visibility) {
    this.setState({
      userSSNPopupVisible: visibility
    })
  }

  renderSSNPopup () {
    const {ssnPopupVisible} = this.state
    const {navigator, childID} = this.props
    if (ssnPopupVisible) {
      return (
        <View style={{flex: 1}}>
          <SSNPopup hideModal={this.toggleShowSSN.bind(this)} childID={childID} navigator={navigator} isVisible={ssnPopupVisible} />
        </View>
      )
    } else {
      return null
    }
  }

  renderUserSSNPopup () {
    const {userSSNPopupVisible} = this.state
    const {navigator} = this.props
    if (userSSNPopupVisible) {
      return (
        <View style={{flex: 1}}>
          <UserSSNPopup hideModal={this.toggleShowUserSSN.bind(this)} navigator={navigator} isVisible={userSSNPopupVisible} />
        </View>
      )
    } else {
      return null
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderGoalCell (title = '', description = '', img = '') {
    const {goalNames, goals} = this.props
    let isAdded = title && goalNames.includes(title)
    let GID = ''

    goals && goals.filter((i) => {
      if (i[GOAL_ENTITIES.NAME] === title) {
        GID = i[GOAL_ENTITIES.GID]
      }
    })

    return (
      <TouchableOpacity
        accessible
        accessibilityRole={'button'}
        onPress={() => isAdded ? this.showGoal(GID, title) : this.selectGoal(title)}
        accessibilityLabel={title}
        style={{flexDirection: 'row', backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 16, height: 100, borderRadius: 6, shadowOffset: { x: 0, y: 3 }, shadowOpacity: 0.09, shadowColor: Colors.black}}>
        <View style={{overflow: 'hidden', paddingHorizontal: 16, alignSelf: 'center'}}>
          {img && <Image source={{uri: img}} style={{height: 84, width: 84, borderRadius: 42}} resizeMode='stretch' />}
        </View>
        <View style={{flex: 1, marginVertical: 8, paddingRight: 10}}>
          {
            title &&
            <Text style={{fontSize: 18, lineHeight: 23, fontFamily: Fonts.type.bold, color: '#000', marginBottom: 3, width: 200}} numberOfLines={1} ellipsizeMode={'tail'} >
              {title}
            </Text>
          }
          <Text style={{fontSize: 16, lineHeight: 16, fontFamily: Fonts.type.book, color: 'rgba(0, 0, 0, 0.37)', marginBottom: 3}} numberOfLines={3} ellipsizeMode={'tail'} >
            {description}
          </Text>
        </View>
        <View style={{position: 'absolute', right: 10, top: 10}}>
          {
            isAdded &&
            <Icon name='heart' type={'font-awesome'} color={Colors.appBlue} size={15} /> ||
            <Icon name='heart-o' type={'font-awesome'} color={Colors.appBlue} size={15} />
          }
        </View>
      </TouchableOpacity>
    )
  }

  /*
  renderGoalBlock (heading, goals) {
    const {firstName, goalNames} = this.props
    let keys = (goals && Object.keys(goals)) || []
    let values = (goals && Object.values(goals)) || []
    return (
      <View style={{marginTop: 45}}>
        <View style={{marginLeft: 40}}>
          <Text style={{...styles.screen.h2.textStyle, fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 23}}>
            {heading}
          </Text>
          <Text style={{...styles.screen.h2.textStyle, marginTop: 10, fontFamily: Fonts.type.semibold, color: '#1C3C70', fontSize: 15}}>
            Unlock {firstName}'s future
          </Text>
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps='always' contentInset={{left: 40}} contentOffset={{x: -40}} horizontal style={{marginTop: 15, flexDirection: 'row'}}>
          {
            keys.map(k => {
              let goal = goals && goals[k]
              let title = goal && goal['productName']
              let image = goal && goal['productImageURL']
              if (goal && !(goalNames && goalNames.includes(title))) {
                return this.renderGoalCell(title, image)
              } else return null
            })
          }
        </ScrollView>
      </View>
    )
  }

  renderProductsOld () {
    const {products} = this.props
    const keys = (products && Object.keys(products)) || []
    return (
      <ScrollView>
        {
          keys.map(k => this.renderGoalBlock(k, (products ? products[k] : undefined)))
        }
      </ScrollView>
    )
  }
   */
  renderProducts () {
    const {currentTab} = this.state
    const {products} = this.props
    let keys = (products && Object.keys(products)) || []
    keys.push(...keys.splice(0, 1))

    let _selectedKey = (currentTab !== undefined) && keys[currentTab]
    let _selectedValue = (_selectedKey && products[_selectedKey])

    let goals = (_selectedValue && Object.values(_selectedValue))

    return (
      <View style={{ flex: 1 }}>
        <View style={{backgroundColor: '#2948FF', height: 27}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 5, marginBottom: 25, position: 'absolute', zIndex: 10}}>
          {
            keys.map((k, i) => this.renderPanelCube(k, i))
          }
        </View>
        <ScrollView style={{flex: 1, paddingTop: 30}} contentContainerStyle={{paddingBottom: 30}}>
          {goals && goals.map(({ productName, productDescription, productImageURL }) => {
            return this.renderGoalCell(productName, productDescription, productImageURL)
          })}
        </ScrollView>
      </View>
    )
  }

  renderPanelCube (title, index) {
    const {currentTab} = this.state
    return (
      <TouchableHighlight
        underlayColor={Colors.buttonYellowUnderlay}
        accessible
        accessibilityLabel={title}
        onPress={() => this.setCurrentTab(index)}
        style={{flex: 1, backgroundColor: currentTab === index ? Colors.white : Colors.buttonYellow, height: 40, justifyContent: 'center', alignItems: 'center', marginHorizontal: 7, borderRadius: 6, shadowOffset: { x: 0, y: 3 }, shadowOpacity: 0.16, shadowColor: Colors.black}}>
        <View style={{marginTop: 5, paddingBottom: 2, borderBottomWidth: 3, borderColor: currentTab === index ? Colors.darkBlue : Colors.transparent}}>
          <Text style={{fontSize: 13, color: Colors.darkBlue, fontFamily: Fonts.type.bold}}>
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isModal, navigator, isFetchingProducts, closeModal} = this.props
    return (
      <LinearGradient colors={['#FFFFFF', '#F8F8F8', '#F5F5F5', '#DCDCDC', '#D3D3D3']} style={{...styles.screen.containers.root, backgroundColor: Colors.lightGrayBG}}>
        <CustomNav navigator={navigator} leftButtonCloseModal={closeModal} leftButtonPresent leftButtonIcon={closeModal ? 'keyboard-arrow-left' : undefined} blueBackdrop titlePresent title='Achieve Goals' titleStyle={{color: Colors.white, fontSize: 20, fontFamily: Fonts.type.bold}} />
        <ProcessingIndicator isProcessing={isFetchingProducts} />
        <View style={{flex: 1}}>
          {this.renderProducts()}
        </View>
        {this.renderSSNPopup()}
        {this.renderUserSSNPopup()}
      </LinearGradient>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_SelectGoal.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // is modal visible
  isVisible: PropTypes.bool.isRequired,

  // close modal
  closeModal: PropTypes.bool,

  // binded modal hide func
  foo: PropTypes.func.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // pop function
  popFunc: PropTypes.func.isRequired,

  // forward function
  pushFunc: PropTypes.func.isRequired,

  // child id
  childID: 'x',

  // user id
  userID: PropTypes.string.isRequired,

  // user ssn added ?
  userSSNAdded: PropTypes.number,

  // user ssn added processing ?
  userSSNStoreProcessing: PropTypes.bool,

  // firstname
  firstName: PropTypes.string.isRequired,

  // products
  products: PropTypes.object.isRequired,

  // is fetching products.
  isFetchingProducts: PropTypes.bool.isRequired,

  // is modal or not
  isModal: PropTypes.bool.isRequired,

  // goal names
  goalNames: PropTypes.string.isRequired,

  // is ssn added
  isssnAdded: PropTypes.bool,

  // goals
  goals: PropTypes.object

}

LI_SelectGoal.defaultProps = {
  isVisible: false,
  isProcessing: false,
  closeModal: false
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(LI_SelectGoal))

export default Screen
