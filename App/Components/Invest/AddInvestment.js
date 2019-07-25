/* eslint-disable no-unused-vars,no-trailing-spaces,operator-linebreak */
/**
 * Created by demon on 25/4/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View,
  Text,
  Alert,
  FlatList,
  Modal,
  LayoutAnimation,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Animated, AsyncStorage
}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import globalStyle
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {Icon}
  from 'react-native-elements'
import { connect }
  from 'react-redux'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION, getPortfolioInternalID}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import LinearGradient
  from 'react-native-linear-gradient'
import Avatar
  from '../../Containers/Utility/Avatar'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'
var Spinner = require('react-native-spinkit')
import { CachedImage }
  from 'react-native-cached-image'
import _ from 'lodash'
import Goal from '../../Containers/Goals/SelectGoal.js'
// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_INVESTMENT,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class SelectInvestment extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _selectedChild: props.selectedChild,
      _selectedTab: 0,
      scrollY: new Animated.Value(0),
      toggleChildPanel: true
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    // AsyncStorage.setItem('LAST_SCREEN', 'dream')
  }

  componentDidMount () {
    const {products, userID} = this.props
    if (!products) {
      this.fetchProducts()
    }
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.DREAM
    })
    // *********** Log Analytics ***********
  }

  componentWillReceiveProps (nextProp) {
    const {selectedChild} = nextProp
    const {_selectedChild} = this.state
    if (_selectedChild) {
      selectedChild && (_selectedChild.childID !== selectedChild.childID) && this.setState({_selectedChild: selectedChild})
    } else if (selectedChild) {
      this.setState({_selectedChild: selectedChild})
    }
  }

  showSettings () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_SETTINGS, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Action handler

  fetchProducts () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.FETCH_PRODUCTS})
  }

  updateSelectedChild (_selectedChild) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.SET_SELECTED_CHILD, [USER_ENTITIES.SELECTED_CHILD]: _selectedChild})
  }

  setSelectedChild (childObj) {
    this.setState({_selectedChild: childObj, toggleChildPanel: true})
    childObj && this.updateSelectedChild(childObj.childID)
  }

  selectInvestment (investmentName, product, riskID) {
    const {_selectedChild} = this.state
    const childID = (_selectedChild && _selectedChild.childID) || undefined
    const {localActions, handleLocalAction, navigator} = this.props
    const investment = product.investment
    let recurrenceExixts = false
    if (investment && !investment.investmentRecurringAmount) {
      let duplicateInvestments = this.props.investments.filter(i => i.name === investmentName && i.investmentRecurringAmount)
      if (duplicateInvestments.length > 0) {
        recurrenceExixts = duplicateInvestments[0][INVESTMENT_ENTITIES.INVESTMENT_ID]
      }
    }
    handleLocalAction({
      type: localActions.INVESTMENT_SELECTED,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName,
      [INVESTMENT_ENTITIES.PRODUCT]: product,
      [INVESTMENT_ENTITIES.IS_DISPLAY_ONLY]: !!investment,
      [INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]: riskID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,

      [INVESTMENT_ENTITIES.INVESTMENT_INTERNAL_ID]: (investment) ? getPortfolioInternalID(product.productPortfolioID) : undefined,
      [INVESTMENT_ENTITIES.INVESTMENT_ID]: (investment) ? investment.investmentID : undefined,
      [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: (investment) ? investment.investmentBalance : undefined,
      [INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT]: (investment) ? investment.investmentRecurringAmount : undefined,
      [INVESTMENT_ENTITIES.IS_RECURRENCE_INVESTMENT_EXIST]: recurrenceExixts
    })
  }

  setSelectedTab (tab) {
    LayoutAnimation.spring()
    this.setState({_selectedTab: tab}, () => {
      try {
        this.refs.scrollView.scrollTo({x: 0, y: 0, animated: false})
      } catch (e) {
        console.log('Error set scrollView offset', e)
      }
    })
  }

  renderHeader () {
    const isX = this.isX
    const {_selectedChild, toggleChildPanel} = this.state
    const {childArr, isFresh} = this.props
    let arr = (childArr && Object.values(childArr)) || []
    const singleChild = arr.length === 1 || arr.length === 0
    const empty = arr.length === 0
    const heading = isFresh ? 'Making a first investment' : empty ? 'Invest' : 'Invest for ' + (_selectedChild && _selectedChild['firstname'])
    const arrow = toggleChildPanel ? 'ios-arrow-down' : 'ios-arrow-up'

    return (
      <View style={{paddingTop: isX ? 30 : 22, height: isX ? 80 : 70, backgroundColor: '#FFCF50'}}>
        {
          !singleChild
          &&
          <TouchableOpacity
            accessible
            accessibilityLabel={heading}
            accessibilityRole={'button'}
            style={{justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row'}} onPress={() => this.setState({toggleChildPanel: !this.state.toggleChildPanel})}>
            <Text style={{fontFamily: Fonts.type.semibold, fontSize: 18, color: '#000', backgroundColor: 'transparent'}}>
              {heading}
            </Text>
            <Icon name={arrow} size={12} color='#000' type={'ionicon'} containerStyle={{top: 3, marginLeft: 8}} />
          </TouchableOpacity>
          ||
          <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row'}} onPress={() => this.setState({toggleChildPanel: !this.state.toggleChildPanel})}>
            <Text style={{fontFamily: Fonts.type.semibold, fontSize: 18, color: '#000', backgroundColor: 'transparent'}}>
              {heading}
            </Text>
          </View>
        }
      </View>
    )
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const {firstname} = this.props
    return (
      <View style={{marginTop: 32, paddingHorizontal: 16}}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000', fontSize: 20}}>
          Now it's time to choose {firstname}'s first investment and learning theme.
        </Text>
      </View>
    )
  }

  renderCard (portfolio) {
    let name = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_NAME]
    let description = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_DESCRIPTION]
    let whatInvestment = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_WHAT_IS_INVESTMENT]
    let imageURL = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_IMAGE_URL]
    let portfolioID = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_PORTFOLIO_ID]
    let addedInvestment = portfolio && portfolio.investment
    return (
      <TouchableOpacity
        onPress={() => {
          portfolio && this.selectInvestment(name, portfolio, portfolioID)
        }}
        accessible
        accessibilityLabel={name}
        style={{flexDirection: 'row', backgroundColor: 'transparent', borderBottomWidth: 0.5}}>
        <View style={{overflow: 'hidden', paddingTop: 16, paddingLeft: 16, paddingBottom: 16, paddingRight: 16}}>
          {
            imageURL ?
              <CachedImage source={{uri: imageURL}} style={{height: 100, width: 100, borderRadius: 50}} />
              :
              <View style={{height: 100, width: 100, backgroundColor: 'transparent'}} />
          }
        </View>
        <View style={{flex: 1, justifyContent: 'center', paddingLeft: 0, paddingRight: 10}}>
          {
            name &&
            <Text style={{fontSize: 18, fontFamily: Fonts.type.bold, color: '#000', marginBottom: 3}} ellipsizeMode={'tail'} >
              {name}
            </Text>
          }
          {
            description &&
            <Text style={{fontSize: 14.5, lineHeight: 19, fontFamily: Fonts.type.medium, color: '#4A4A4A'}} >
              {description}
            </Text>
          }
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 16}}>
          <Image source={require('../../../Img/iconImages/rightArrow.png')} style={{height: 9, width: 6}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderInvestments () {
    const {_selectedTab} = this.state
    const {products, investments, isFresh} = this.props
    let keys = (products && Object.keys(products)) || []

    let _selectedKey = (_selectedTab !== undefined) && keys[_selectedTab]
    let _selectedValue = (_selectedKey && products[_selectedKey])

    let portfolio = (_selectedValue && Object.values(_selectedValue))
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <LinearGradient
          start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
          locations={[0.2, 0.5, 1]}
          colors={['#FFF', 'rgb(250, 242, 221)', 'rgb(250, 242, 221)']}
          style={{flex: 1}}>
          {
            isFresh && this.renderHeading()
          }
          {portfolio && portfolio.map(p => {
            let goal = _.cloneDeep(p)
            goal.investment = investments && investments.find(function (i) {
              return i.name === goal.productName
            })
            return this.renderCard(goal)
          })}
        </LinearGradient>
      </View>
    )
  }

  renderChildBadge (c) {
    const {_selectedChild} = this.state
    const {childImage = ''} = c
    const {userID} = this.props
    let initials = c.firstname && c.firstname.charAt(0)
    const isSelected = _selectedChild && (_selectedChild.childID === c.childID)

    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Select child ${c.firstName}`}
        accessibilityRole={'button'}
        onPress={() => this.setSelectedChild(c)} style={{height: 72, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{opacity: isSelected ? 1 : 0.6, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          {
            childImage
            &&
            <Image source={{ uri: childImage }} style={{height: 56, width: 56, borderRadius: 28}} />
            ||
            <View style={{height: 56, width: 56, borderRadius: 28, borderColor: '#10427E', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}} >
              <Text style={{fontFamily: Fonts.type.bold, fontSize: 28, color: '#10427E', backgroundColor: 'transparent'}}>
                {initials}
              </Text>
            </View>
          }
          <Text style={{marginLeft: 9, marginRight: 50, fontSize: 14, color: isSelected ? '#1B4F95' : '#000', fontFamily: Fonts.type.bold}} numberOfLines={1} ellipsizeMode={'tail'}>{c.firstname}</Text>
        </View>
        { isSelected && <Image source={require('../../../Img/goals/selected.png')} style={{height: 20, width: 20, borderRadius: 10}} />}
      </TouchableOpacity>
    )
  }

  renderChildPanel () {
    const {childArr} = this.props
    const { toggleChildPanel } = this.state
    let arr = (childArr && Object.values(childArr)) || []
    const singleChild = arr.length === 1 || arr.length === 0
    const {width} = Dimensions.get('window')
    const isX = this.isX

    if (toggleChildPanel) return null

    return (
      <View style={{position: 'absolute', left: 0, right: 0, top: isX ? 80 : 70, width: '100%', backgroundColor: '#fff', shadowOpacity: 0.8, shadowOffset: {width: 0, height: 2}}}>
        <FlatList
          data={arr}
          renderItem={({item}) => this.renderChildBadge(item)}
        />
      </View>
    )
  }

  renderPanelCube (title, index) {
    const {_selectedTab} = this.state
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        onPress={() => this.setSelectedTab(index)} style={{top: _selectedTab === index ? 1 : 0, justifyContent: 'flex-end', paddingBottom: 4, borderBottomWidth: _selectedTab === index ? 3 : 0, borderColor: '#000'}}>
        <Text style={{fontSize: 17, color: '#000', fontFamily: _selectedTab === index ? Fonts.type.black : Fonts.type.semibold, backgroundColor: 'transparent'}}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderPortfolioSelectPanel () {
    const {products} = this.props
    let keys = (products && Object.keys(products)) || []
    return (
      <View>
        <View style={{flexDirection: 'row', height: 40, borderColor: '#979797', backgroundColor: '#FFCF50', justifyContent: 'space-around', shadowOpacity: 0.7, shadowOffset: {width: 0, height: 5}}}>
          {
            keys.map((k, i) => this.renderPanelCube(k, i))
          }
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    const {navigator, popButton, childArr, isFresh, processingProducts} = this.props
    const {height} = Dimensions.get('window')
    let title = isFresh ? 'First Investment' : 'Dreams'
    let arr = (childArr && Object.values(childArr)) || []
    const singleChild = arr.length === 1 || arr.length === 0
    let stickyIndex = isFresh ? 5 : 1
    return (
      <LinearGradient
        start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
        locations={[0.2, 0.5, 1]}
        colors={['#FFF', 'rgb(250, 242, 221)', 'rgb(250, 242, 221)']}
        style={{...globalStyle.screen.containers.root, backgroundColor: '#FFCF50'}}>
        {this.renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false} ref='scrollView' stickyHeaderIndices={[stickyIndex]}>
          {
            !isFresh && <Goal navigator={navigator} />
          }
          {
            !isFresh && this.renderPortfolioSelectPanel()
          }
          {
            processingProducts
            &&
            <View style={{height: height - 200, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center'}}>
              <Spinner isVisible size={100} type={'ThreeBounce'} color='#000' />
            </View>
            ||
            this.renderInvestments()
          }
        </ScrollView>
        {this.renderChildPanel()}
      </LinearGradient>
    )
  }

}

SelectInvestment.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user id
  userID: PropTypes.string.isRequired,

  // child objects
  childArr: PropTypes.array.isRequired,

  // selected child
  selectedChild: PropTypes.object.isRequired,

  popButton: PropTypes.bool.isrequired,

  // goal name
  investmentName: PropTypes.string,

  // investments
  investments: PropTypes.string,

  // firstname
  firstname: PropTypes.string.isRequired,

  // default index
  defaultIndex: PropTypes.number.isRequired,

  // is fresh
  isFresh: PropTypes.bool.isRequired,

  // loading products
  processingProducts: PropTypes.bool.isRequired,

  // products
  products: PropTypes.array.isRequired,

  modules: PropTypes.array
}

SelectInvestment.defaultProps = {
  isProcessing: false,
  popButton: false,
  processingProducts: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(SelectInvestment))

export default Screen
