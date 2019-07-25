/* eslint-disable no-unused-vars,no-trailing-spaces,operator-linebreak */
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
import {View, Text, ActionSheetIOS, ScrollView, ActivityIndicator, ProgressViewIOS, Image, Dimensions, TouchableOpacity, LayoutAnimation}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import {Icon}
  from 'react-native-elements'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION, CUSTOM_LIST_ENTITIES}
  from '../../Utility/Mapper/Common'
import CustomListView
  from '../Utility/CustomListView'
import { connect }
  from 'react-redux'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import _
  from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import { CachedImage }
  from 'react-native-cached-image'
import moment from 'moment'
import ChartView from 'react-native-highcharts'
import InfoTip
  from '../../Containers/User/InfoTip'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_INVESTMENT,
  destroyOnUnmount: false
})

const horizontalPadding = 16

function interpolate (num, inMin, inMax, outMin, outMax) {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

// ========================================================
// Core Component
// ========================================================

class PortfolioDetail extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showDreamOptions: false,
      _selectedTab: 0,
      infoTipVisible: false,
      infoTipCode: undefined
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    const {isDisplayOnly} = this.props
    this.fetchPerformanceData()
    isDisplayOnly && this.fetchGoalDetail()
    // this.fetchInvestChartData()
  }

  componentDidMount () {
    const {userID, portfolio} = this.props
    let portfolioName = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_NAME]
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.DREAM_DETAIL,
      properties: {
        dream: portfolioName || 'unknown'
      }
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  toggleInfoTip (visibility, code) {
    this.setState({
      infoTipVisible: visibility
    })
    code && this.setState({
      infoTipCode: code
    })
  }

  next (investmentName) {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.ADD_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  hide () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.HIDE_RISK, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  fetchGoalDetail () {
    const {handleLocalAction, localActions, userID, goalID} = this.props
    handleLocalAction({type: localActions.FETCH_GOAL_DETAIL, [USER_ENTITIES.USER_ID]: userID, [GOAL_ENTITIES.GID]: goalID})
  }

  fetchPerformanceData () {
    const {handleLocalAction, localActions, navigator, idToken, portfolio} = this.props
    let tickerName = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_TICKER]
    handleLocalAction({type: localActions.FETCH_PERFORMANCE_DATA, [COMMON_ENTITIES.NAVIGATOR]: navigator, [AUTH_ENTITIES.ID_TOKEN]: idToken, [GOAL_ENTITIES.TICKER_NAME]: tickerName})
  }

  fetchInvestChartData () {
    const {handleLocalAction, localActions, navigator, idToken, portfolio} = this.props
    let tickerName = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_TICKER]
    handleLocalAction({type: localActions.FETCH_INVEST_CHART_DATA, [COMMON_ENTITIES.NAVIGATOR]: navigator, [AUTH_ENTITIES.ID_TOKEN]: idToken, [GOAL_ENTITIES.TICKER_NAME]: tickerName})
  }

  toggleShowDreamOptions () {
    this.setState({
      showDreamOptions: !this.state.showDreamOptions
    })
  }

  editRecurringAmount () {
    const {handleLocalAction, localActions, navigator, childID, goalID, recurrenceExixts} = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_EDIT_RECURRING_AMOUNT,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: recurrenceExixts || goalID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  addRecurring () {
    const { handleLocalAction, localActions, navigator, childID, portfolio } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_ADD_RECURRING_AMOUNT,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [INVESTMENT_ENTITIES.INVESTMENT_NAME]: portfolio.productName,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [GOAL_ENTITIES.IS_ADD_RECURRING]: true,
      [INVESTMENT_ENTITIES.PRODUCT]: portfolio
    })
  }

  invest () {
    const {handleLocalAction, localActions, navigator, childID, goalID, portfolio} = this.props
    handleLocalAction({
      type: localActions.INVEST,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.NAME]: portfolio && portfolio[INVESTMENT_ENTITIES.INVESTMENT_NAME],
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  withdraw () {
    const {handleLocalAction, localActions, navigator, childID, firstname, goalID, goalName, balance} = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_WITHDRAW,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [CHILD_ENTITIES.FIRST_NAME]: firstname,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.BALANCE]: balance,
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showURL (tickerURL) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({
      type: localActions.SHOW_URL,
      [SETTINGS_ENTITIES.URL]: tickerURL,
      [SETTINGS_ENTITIES.HEADING]: 'Ticker',
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }
  setSelectedTab (tab) {
    // LayoutAnimation.spring()
    this.setState({_selectedTab: tab}, () => {
      try {
        this.refs.scrollView.scrollTo({x: 0, y: 0, animated: false})
      } catch (e) {
        console.log('Error set scrollView offset', e)
      }
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderDescription () {
    const {isTickerProcessing, ticker} = this.props
    let portfolioDescription = ticker && ticker[GOAL_ENTITIES.TICKER_DESCRIPTION] || ''
    if (isTickerProcessing) {
      return (
        <View style={{height: 60, justifyContent: 'flex-end', alignItems: 'center'}}>
          <ActivityIndicator size='large' animating={isTickerProcessing} color='#FFF' />
        </View>
      )
    } else if (ticker) {
      return (
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 16.5, lineHeight: 25, backgroundColor: 'transparent', color: '#000', textAlign: 'center'}}>
          {portfolioDescription}
        </Text>
      )
    }
  }
  renderHeading () {
    const {portfolio, isDisplayOnly, firstname} = this.props
    const {showDreamOptions} = this.state
    const {width} = Dimensions.get('window')
    let portfolioName = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_NAME]
    let backdrop = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]
    const isX = this.isX || false
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', zIndex: 1, height: 180, paddingHorizontal: horizontalPadding, shadowOpacity: 0.7, shadowRadius: 5, shadowOffset: {width: 0, height: 4}}}>
        {
          backdrop && <CachedImage source={{uri: backdrop}} resizeMode='cover' style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: undefined, width: undefined}} />
        }
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000', opacity: 0.3}} />
        <TouchableOpacity
          accessible
          accessibilityLabel={'Clear'}
          accessibilityRole={'button'}
          onPress={() => this.hide()} style={{position: 'absolute', top: isX ? 35 : 20, left: 11, width: 26, height: 26}}>
          <Icon name='clear' color='#FFF' size={26} />
        </TouchableOpacity>
        <Text style={{fontFamily: Fonts.type.black, fontSize: 30, backgroundColor: 'transparent', color: '#FFF'}}>
          {portfolioName}
        </Text>
        <View style={{position: 'absolute', left: 0, right: 0, zIndex: 5, bottom: -25, height: 50, alignItems: 'center'}}>
          {
            (isDisplayOnly) ?
              (
                !showDreamOptions ?
                  <TouchableOpacity
                    accessible
                    accessibilityLabel={`Buy/Sell for ${firstname}`}
                    accessibilityRole={'button'}
                    onPress={() => this.toggleShowDreamOptions()} style={{backgroundColor: '#10427E', height: 50, width: 245, alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 20, color: '#FFF', fontFamily: Fonts.type.bold, flex: 1, textAlign: 'center'}} numberOfLines={1}>
                      Buy/Sell for {firstname}
                    </Text>
                  </TouchableOpacity>
                  :
                  null
              )
              :
                  <TouchableOpacity
                    accessible
                    accessibilityLabel={`Buy for ${firstname}`}
                    accessibilityRole={'button'}
                    onPress={_.debounce(_.bind(() => this.next(portfolio.NAME), this), 500, {'leading': true, 'trailing': false})}
                    style={{backgroundColor: '#10427E', height: 50, width: 245, alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 20.5, color: '#FFF', fontFamily: Fonts.type.bold, flex: 1, textAlign: 'center', paddingRight: 30, paddingLeft: 5}} numberOfLines={1}>
                      Buy for {firstname}
                    </Text>
                    <TouchableOpacity
                      onPress={_.debounce(_.bind(() => this.next(portfolio.NAME), this), 500, {'leading': true, 'trailing': false})}
                      style={{position: 'absolute', top: 0, right: 0, width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                      <Image source={require('../../../Img/iconImages/add.png')} />
                    </TouchableOpacity>
                  </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
  renderPanelCube (title, index) {
    const {_selectedTab} = this.state
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        accessibilityRole={'button'}
        onPress={() => this.setSelectedTab(index)} style={{paddingHorizontal: 5, top: _selectedTab === index ? 1 : 0, justifyContent: 'flex-end', paddingBottom: 4, borderBottomWidth: _selectedTab === index ? 3 : 0, borderColor: '#000'}}>
        <Text style={{fontSize: 20, color: '#000', fontFamily: _selectedTab === index ? Fonts.type.bold : Fonts.type.medium, backgroundColor: 'transparent'}}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderTabs () {
    const { isDisplayOnly, firstname } = this.props
    let keys = (isDisplayOnly) ? ['What', 'Why', firstname] : ['What', 'Why']

    return (
      <View style={{flexDirection: 'row', height: 66, borderColor: '#000', backgroundColor: '#ECC016', paddingHorizontal: 16, justifyContent: isDisplayOnly ? 'space-between' : 'space-around', shadowOpacity: 0.7, shadowOffset: {width: 0, height: 5}}}>
        {
          keys.map((k, i) => this.renderPanelCube(k, i))
        }
      </View>
    )
  }

  renderSelectedTab () {
    const {_selectedTab} = this.state
    let renderFunction
    switch (_selectedTab) {
      case 0:
        renderFunction = () => this.renderWhat()
        break
      case 1:
        renderFunction = () => this.renderWhy()
        break
      case 2:
        renderFunction = () => this.renderChild()
        break
      default:
        renderFunction = () => this.renderWhat()
        break
    }
    return (
      <View style={{flex: 1}}>
        {renderFunction()}
      </View>
    )
  }

  renderWhat () {
    return (
      <View style={{backgroundColor: '#FFF'}}>
        <View style={{paddingHorizontal: horizontalPadding}}>
          {this.renderDescription()}
          {this.renderWhatDetails()}
        </View>
        {this.renderDetailContainer()}
      </View>
    )
  }
  renderWhy () {
    return (
      <View style={{backgroundColor: '#FFF'}}>
        <View style={{paddingHorizontal: horizontalPadding}}>
          {this.renderWhyDetails()}
        </View>
        <View style={{paddingTop: 11}}>
          {/* {this.renderWhyChart()} */}
        </View>
      </View>
    )
  }

  renderChild () {
    const {stock} = this.props
    console.log('(((( stock )))) : ', stock)
    const availableUnits = (stock && stock[INVESTMENT_ENTITIES.STOCK_AVAILABLE_UNITS]) || 0
    const currentValue = (stock && stock[INVESTMENT_ENTITIES.STOCK_CURRENT_VALUE]) || 0
    return (
      <View style={{backgroundColor: '#FFF'}}>
        <View style={{paddingHorizontal: horizontalPadding}}>

          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
              Units of stock you own:
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#4A4A4A'}}>
                {parseFloat(availableUnits).toFixed(2)} units
              </Text>
              <TouchableOpacity
                accessible
                accessibilityLabel={'show info for GLOSSARY KEYWORD UNITS OF STOCK YOU OWN'}
                accessibilityRole={'button'}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_UNITS_OF_STOCK_YOU_OWN)}>
                <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 5}} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
              Value of stock you own:
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#4A4A4A'}}>
                {formatPrice(currentValue)}
              </Text>
              <TouchableOpacity
                accessible
                accessibilityLabel={'show info for GLOSSARY KEYWORD VALUE OF STOCK YOU OWN'}
                accessibilityRole={'button'}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_VALUE_OF_STOCK_YOU_OWN)}>
                <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 5}} />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    )
  }

  renderWhyDetails () {
    const {ticker} = this.props
    const ticker1YearReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_1_YEAR_CHANGE]) || 0
    const ticker3YearReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_3_YEAR_CHANGE]) || 0
    const ticker5yearReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_5_YEAR_CHANGE]) || 0
    const tickerOverallReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_OVERALL_CHANGE]) || 0
    const tickerExpenses = (ticker && ticker[GOAL_ENTITIES.TICKER_EXPENSES]) || 0
    let tickerDividend = (ticker && ticker[GOAL_ENTITIES.TICKER_DIVIDEND_YIELD]) || 0

    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
            You can expect a dividend of:
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#4A4A4A'}}>
              { isNaN(tickerDividend) ? 'n/a' : `${parseFloat(tickerDividend).toFixed(2)}% p.a.` }
            </Text>
            <TouchableOpacity
              accessible
              accessibilityLabel={'show info for Portfolio Detail Dividend'}
              accessibilityRole={'button'}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_DIVIDEND)}>
              <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 5}} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
            Fund management expenses are:
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#4A4A4A'}}>
              { isNaN(tickerExpenses) ? 'n/a' : `${parseFloat(tickerExpenses).toFixed(2)}% p.a.` }
            </Text>
            <TouchableOpacity
              accessible
              accessibilityLabel={'show info for Portfolio Detail Expense'}
              accessibilityRole={'button'}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_EXPENSES)}>
              <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 5}} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
            Its annual growth has been
          </Text>
          <TouchableOpacity
            accessible
            accessibilityLabel={'show info for Portfolio Detail Annual Growth'}
            accessibilityRole={'button'}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_ANNUAL_GROWTH)}>
            <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 5}} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16, marginTop: 5}}>
              {isNaN(ticker1YearReturn) ? 'n/a' : `${parseFloat(ticker1YearReturn).toFixed(2)}%` }
            </Text>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16}}>
              1-year
            </Text>
          </View>

          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16, marginTop: 5}}>
              { isNaN(ticker3YearReturn) ? 'n/a' : `${parseFloat(ticker3YearReturn).toFixed(2)}%` }
            </Text>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16}}>
              3-year
            </Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16, marginTop: 5}}>
              { isNaN(ticker5yearReturn) ? 'n/a' : `${parseFloat(ticker5yearReturn).toFixed(2)}%` }
            </Text>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16}}>
              5-year
            </Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16, marginTop: 5}}>
              { isNaN(tickerOverallReturn) ? 'n/a' : `${parseFloat(tickerOverallReturn).toFixed(2)}%` }
            </Text>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16, textAlign: 'center'}}>
              All
            </Text>
          </View>
        </View>
      </View>
    )
  }

  renderWhyChart () {
    return (
      <View style={{flex: 1, backgroundColor: '#ECC016', height: 232}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 19}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: 'rgba(0,0,0,1)'}}>
            You can see its performance in this chart
          </Text>
          <Icon type='font-awesome' containerStyle={{marginHorizontal: 5, alignSelf: 'center', textAlign: 'center'}} name='question-circle' color='#fff' size={9} onPress={() => console.log('dmmm')} />
        </View>

        <View style={{justifyContent: 'center', marginTop: 19}}>
          {this.renderChart()}
        </View>

        <View style={{marginTop: 5, paddingHorizontal: 15}}>
          {this.renderWhyYear()}
        </View>
      </View>
    )
  }

  renderChart () {
    const { chartData } = this.props
    var Highcharts = 'Highcharts'
    var conf = {
      chart: {
        type: 'line',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        backgroundColor: '#ECC016',
        styles: {
          fontFamily: Fonts.type.regular,
          fontSize: 16
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        title: {
          text: '',
          style: {
            color: '#000'
          }
        },
        labels: {
          // format: '{value: %m-%d}',
          style: {
            color: '#000',
            fontSize: 16,
            fontFamily: Fonts.type.regular
          }
        },
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%b-\'%y',
          week: '%e. %b',
          month: '%b \'%y',
          year: '%Y'
        },
        tickPixelInterval: 100,
        tickColor: 'transparent',
        lineColor: '#979797',
        lineWidth: 1
      },
      yAxis: {
        title: {
          text: '',
          style: {
            color: '#000'
          }
        },
        labels: {
          format: '$' + '{value}',
          style: {
            color: '#4A4A4A',
            fontSize: 16,
            fontFamily: Fonts.type.regular
          }
        },
        plotLines: [{
          value: 1,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            Highcharts.numberFormat(this.y, 2)
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: 'Investment',
        data: chartData,
        pointInterval: 24 * 3600 * 1000,
        pointStart: Date.UTC(2006, 0, 1),
        lineColor: '#000',
        lineWidth: 3
      }]
    }
    return (
      <View>
        <ChartView style={{height: 132}} config={conf} />
      </View>
    )
  }

  renderWhyYear () {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Text style={{color: '#1B4F95', fontFamily: Fonts.type.semibold, fontSize: 16}}>
          1-year
        </Text>
        <Text style={{color: '#000', fontFamily: Fonts.type.bold, fontSize: 16}}>
          3-years
        </Text>
        <Text style={{color: '#1B4F95', fontFamily: Fonts.type.semibold, fontSize: 16}}>
          5-years
        </Text>
        <Text style={{color: '#1B4F95', fontFamily: Fonts.type.semibold, fontSize: 16}}>
          10-years
        </Text>
        <Text style={{color: '#1B4F95', fontFamily: Fonts.type.semibold, fontSize: 16}}>
          All
        </Text>
      </View>
    )
  }

  renderChildDetails () {
    const { firstname } = this.props
    return (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
            Units of stock you own:
          </Text>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#4A4A4A'}}>
            0.45 units
            <Icon type='font-awesome' containerStyle={{marginHorizontal: 1, alignSelf: 'center', textAlign: 'center'}} name='question-circle' color='#ECC016' size={9} onPress={() => console.log('dmmm')} />
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
            Value of stock you own:
          </Text>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#4A4A4A'}}>
            $500.44
            <Icon type='font-awesome' containerStyle={{marginHorizontal: 1, alignSelf: 'center', textAlign: 'center'}} name='question-circle' color='#ECC016' size={9} onPress={() => console.log('dmmm')} />
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#4A4A4A'}}>
            Percent of {firstname}'s portfolio:
          </Text>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#4A4A4A'}}>
            0.45 units
            <Icon type='font-awesome' containerStyle={{marginHorizontal: 1, alignSelf: 'center', textAlign: 'center'}} name='question-circle' color='#ECC016' size={9} onPress={() => console.log('dmmm')} />
          </Text>
        </View>
      </View>
    )
  }

  renderWhatDetails () {
    const {ticker} = this.props
    const whatInvestment = (ticker && ticker[GOAL_ENTITIES.TICKER_WHAT_INVESTMENT]) || ''
    const whatLearn = (ticker && ticker[GOAL_ENTITIES.TICKER_WHAT_LEARN]) || ''
    const standardDeviation = (ticker && ticker[GOAL_ENTITIES.TICKER_STANDARD_DEVIATION]) || 8
    const tickerPrice = (ticker && ticker[GOAL_ENTITIES.TICKER_LAST_PRICE])
    const tickerURL = (ticker && ticker[GOAL_ENTITIES.TICKER_URL])

    const deviationNumber = standardDeviation * 100
    let barValue = interpolate(deviationNumber, 0, 8, 0, 10)
    let remainingValue = 10 - barValue

    return (
      <View style={{paddingTop: 22, paddingBottom: 30}}>

        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 16.5}}>
              What is the investment?
            </Text>
            <TouchableOpacity
              accessible
              accessibilityLabel={'show info for Portfolio Detail what is investment'}
              accessibilityRole={'button'}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT)}>
              <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 8}} />
            </TouchableOpacity>
          </View>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 16.5, marginTop: 3}}>
            {whatInvestment}
          </Text>
        </View>

        <View style={{marginTop: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 16.5}}>
              What could you learn from it?
            </Text>
            <TouchableOpacity
              accessible
              accessibilityLabel={'show info for portfolio detail What could you earn from it'}
              accessibilityRole={'button'}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_COULD_YOU_LEARN_FROM_IT)}>
              <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 8}} />
            </TouchableOpacity>
          </View>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 16.5, marginTop: 3}}>
            {whatLearn}
          </Text>
        </View>

        <View style={{marginTop: 15}}>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 16.5, color: '#000'}}>
              What’s the investment risk?
            </Text>
            <TouchableOpacity
              accessible
              accessibilityLabel={'show info for Portfolio what is investment risk'}
              accessibilityRole={'button'}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT_RISK)}>
              <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 8}} />
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', height: 20, marginTop: 5, backgroundColor: '#9B9B9B'}}>
            <View style={{flex: barValue, backgroundColor: 'rgb(255, 91, 120)'}} />
            <View style={{flex: remainingValue, backgroundColor: 'transparent'}} />
            <View style={{position: 'absolute', left: 5, right: 5, top: 0, bottom: 0}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: '#FFF', fontFamily: Fonts.type.regular, fontSize: 16.5}}>
                  Low
                </Text>
                <Text style={{color: '#FFF', fontFamily: Fonts.type.regular, fontSize: 16.5}}>
                  Medium
                </Text>
                <Text style={{color: '#FFF', fontFamily: Fonts.type.regular, fontSize: 16.5}}>
                  High
                </Text>
              </View>
            </View>
          </View>

          <View style={{marginTop: 15}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontFamily: Fonts.type.bold, fontSize: 16.5, color: '#000'}}>
                  What is its price?
                </Text>
                <TouchableOpacity
                  accessible
                  accessibilityLabel={'show info for Portfolio Detail what is price'}
                  accessibilityRole={'button'}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_PRICE)}>
                  <Image source={require('../../../Img/iconImages/questionYellow.png')} style={{height: 9, width: 9, marginLeft: 8}} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                accessible
                accessibilityLabel={'show more info'}
                accessibilityRole={'link'}
                onPress={() => this.showURL(tickerURL)}>
                <Text style={{fontFamily: Fonts.type.regular, fontSize: 16.5, color: '#000'}}>
                  More info
                </Text>
              </TouchableOpacity>
            </View>
            {
              isNaN(tickerPrice) ?
                <Text style={{fontSize: 16.5, fontFamily: Fonts.type.regular, color: '#000', maringTop: 3}}>
                  n/a
                </Text>
                :
                <Text style={{fontSize: 16.5, fontFamily: Fonts.type.regular, color: '#000', marginTop: 3}}>
                  ${parseFloat(tickerPrice).toFixed(2)}
                </Text>
            }
          </View>

        </View>
      </View>
    )
  }
  renderLastUpdateTime () {
    const {lastUpdatedTime} = this.props

    if (lastUpdatedTime) {
      let m = moment(lastUpdatedTime).format('h:MM a, MMMM DD')
      return (
        <View style={{paddingHorizontal: 26, marginTop: 17, marginBottom: 15}}>
          <Text style={{textAlign: 'center', fontSize: 14.5, color: '#000', fontFamily: Fonts.type.regular, backgroundColor: 'transparent'}}>
            Last updated: {m}
          </Text>
        </View>
      )
    } else {
      return (
        <View style={{paddingHorizontal: 26, marginTop: 17, marginBottom: 15}}>
          <Text style={{textAlign: 'center', fontSize: 14.5, color: '#000', fontFamily: Fonts.type.regular, backgroundColor: 'transparent'}} />
        </View>
      )
    }
  }

  renderTickerDetailOne () {
    const {ticker} = this.props
    const whatInvestment = (ticker && ticker[GOAL_ENTITIES.TICKER_WHAT_INVESTMENT]) || ''
    const whatLearn = (ticker && ticker[GOAL_ENTITIES.TICKER_WHAT_LEARN]) || ''
    const ticker1YearReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_1_YEAR_CHANGE]) || 0
    const ticker3YearReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_3_YEAR_CHANGE]) || 0
    const ticker5yearReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_5_YEAR_CHANGE]) || 0
    const tickerOverallReturn = (ticker && ticker[GOAL_ENTITIES.TICKER_OVERALL_CHANGE]) || 0
    const standardDeviation = (ticker && ticker[GOAL_ENTITIES.TICKER_STANDARD_DEVIATION]) || 8

    const deviationNumber = standardDeviation * 100
    let barValue = interpolate(deviationNumber, 0, 8, 0, 10)
    let remainingValue = 10 - barValue

    return (
      <View style={{backgroundColor: '#FFF', paddingTop: 20, paddingBottom: 0}}>

        <View style={{paddingHorizontal: horizontalPadding}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 12}}>
            What is the investment?
          </Text>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 14}}>
            {whatInvestment}
          </Text>
        </View>

        <View style={{marginTop: 20, paddingHorizontal: horizontalPadding}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 12}}>
            What will they learn?
          </Text>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 14}}>
            {whatLearn}
          </Text>
        </View>

        <View style={{marginTop: 20, paddingHorizontal: horizontalPadding}}>
          <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.bold, fontSize: 12}}>
            Historical investment performance
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 12}}>
                1-yr
              </Text>
              {
                isNaN(ticker1YearReturn) ?
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    n/a
                  </Text>
                  :
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    {parseFloat(ticker1YearReturn).toFixed(2)}%
                  </Text>
              }
            </View>

            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 12}}>
                3-yr
              </Text>
              {
                isNaN(ticker3YearReturn) ?
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    n/a
                  </Text>
                  :
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    {parseFloat(ticker3YearReturn).toFixed(2)}%
                  </Text>
              }
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 12}}>
                5-yr
              </Text>
              {
                isNaN(ticker5yearReturn) ?
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    n/a
                  </Text>
                  :
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    {parseFloat(ticker5yearReturn).toFixed(2)}%
                  </Text>
              }
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 12, textAlign: 'center'}}>
                All
              </Text>
              {
                isNaN(tickerOverallReturn) ?
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    n/a
                  </Text>
                  :
                  <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 14, marginTop: 5}}>
                    {parseFloat(tickerOverallReturn).toFixed(2)}%
                  </Text>
              }
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>

          <View style={{paddingHorizontal: horizontalPadding}}>
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.bold, fontSize: 12}}>
              Historical investment risk
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 12}}>
                Low
              </Text>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 12}}>
                Medium
              </Text>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 12}}>
                High
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', height: 10, marginTop: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
            <View style={{flex: barValue, backgroundColor: '#FF6578'}} />
            <View style={{flex: remainingValue, backgroundColor: 'transparent'}} />
          </View>
        </View>
        {this.renderTickerDetailTwo()}
      </View>
    )
  }

  renderTickerDetailTwo () {
    const {ticker} = this.props
    const tickerName = (ticker && ticker[GOAL_ENTITIES.TICKER_UNDERLYING]) || ''
    const tickerPrice = (ticker && ticker[GOAL_ENTITIES.TICKER_LAST_PRICE])
    const tickerExpenses = (ticker && ticker[GOAL_ENTITIES.TICKER_EXPENSES])
    let tickerDividend = (ticker && ticker[GOAL_ENTITIES.TICKER_DIVIDEND_YIELD]) || 0
    const tickerURL = (ticker && ticker[GOAL_ENTITIES.TICKER_URL]) || undefined
    let dividend = parseFloat(tickerDividend).toFixed(2)
    tickerDividend = tickerDividend === 'n/a' ? 0 : tickerDividend
    return (
      <View style={{marginTop: 20, paddingHorizontal: horizontalPadding, marginBottom: 30}}>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={{fontSize: 12, fontFamily: Fonts.type.bold, color: '#4A4A4A'}}>
              Price per unit
            </Text>
            {
              isNaN(tickerPrice) ?
                <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
                  n/a
                </Text>
                :
                <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
                  ${parseFloat(tickerPrice).toFixed(2)}
                </Text>
            }
          </View>

          <View>
            <Text style={{fontSize: 12, fontFamily: Fonts.type.bold, color: '#4A4A4A'}}>
              Expected dividend
            </Text>
            {
              isNaN(tickerDividend) ?
                <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
                  n/a
                </Text>
                :
                <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
                  {parseFloat(tickerDividend).toFixed(2)}% p.a.
                </Text>
            }
          </View>

          <View>
            <Text style={{fontSize: 12, fontFamily: Fonts.type.bold, color: '#4A4A4A'}}>
              Mgmt. expense
            </Text>
            {
              isNaN(tickerExpenses) ?
                <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
                  n/a
                </Text>
                :
                <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
                  {parseFloat(tickerExpenses).toFixed(2)}% p.a.
                </Text>
            }
          </View>

        </View>

        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <View style={{flex: 6}}>
            <Text style={{fontSize: 12, fontFamily: Fonts.type.bold, color: '#4A4A4A'}}>
              Underlying security and ticker
            </Text>
            <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
              {tickerName}
            </Text>
          </View>
          {
            tickerURL
            &&
            <View style={{flex: 4}}>
              <TouchableOpacity
                accessible
                accessibilityLabel={'Click for detail'}
                accessibilityRole={'button'}
                onPress={() => this.showURL(tickerURL)}>
                <Text style={{textAlign: 'right', fontSize: 12, fontFamily: Fonts.type.bold, color: '#4A4A4A'}}>
                  Click for detail
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }

  renderRiskDetailContainer () {
    const {isTickerProcessing, ticker} = this.props
    let portfolioDescription = ticker && ticker[GOAL_ENTITIES.TICKER_DESCRIPTION]

    if (isTickerProcessing) {
      return (
        <View style={{height: 60, justifyContent: 'flex-end', alignItems: 'center'}}>
          <ActivityIndicator size='large' animating={isTickerProcessing} color='#00CBCE' />
        </View>
      )
    } else if (ticker) {
      return this.renderTickerDetailOne()
    } else if (!ticker) {
      return null
    }
  }

  renderDreamOptions () {
    const { recurringAmount, recurrenceExixts } = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'show or hide deram options'}
        accessibilityRole={'button'}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.35)', justifyContent: 'center', alignItems: 'center', zIndex: 2}}
        onPress={() => this.toggleShowDreamOptions()} >
        <View style={{width: '60%'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Buy'}
              accessibilityRole={'button'}
              onPress={() => this.invest()} style={{flex: 1, backgroundColor: 'rgb(35, 103, 0)', borderRadius: 5, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, margin: 5}}>
              <Text style={{fontSize: 20, color: '#FFF', fontFamily: Fonts.type.bold}}>
                Buy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Sell'}
              accessibilityRole={'button'}
              onPress={() => this.withdraw()}
              style={{flex: 1, backgroundColor: 'rgb(216, 0, 4)', borderRadius: 5, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, margin: 5}}>
              <Text style={{fontSize: 20, color: '#FFF', fontFamily: Fonts.type.bold}}>
                Sell
              </Text>
            </TouchableOpacity>
          </View>
          {
            (recurringAmount || recurrenceExixts) &&
            <TouchableOpacity
              accessible
              accessibilityLabel={'Edit Recurring'}
              accessibilityRole={'button'}
              onPress={() => this.editRecurringAmount()} style={{backgroundColor: 'rgb(8, 53, 125)', borderRadius: 5, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, margin: 5}}>
              <Text style={{fontSize: 20, color: '#FFF', fontFamily: Fonts.type.bold}}>Edit recurring</Text>
            </TouchableOpacity>
            ||
            <TouchableOpacity
              accessible
              accessibilityLabel={'Add Recurring'}
              accessibilityRole={'button'}
              onPress={() => this.addRecurring()} style={{backgroundColor: 'rgb(8, 53, 125)', borderRadius: 5, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, margin: 5}}>
              <Text style={{fontSize: 20, color: '#FFF', fontFamily: Fonts.type.bold}}>Add recurring</Text>
            </TouchableOpacity>
          }
        </View>
      </TouchableOpacity>
    )
  }

  renderDetailContainer () {
    const {isTickerProcessing, ticker} = this.props
    let listData = []
    if (ticker && ticker[GOAL_ENTITIES.TICKER_HOLDINGS]) {
      let holdings = ticker[GOAL_ENTITIES.TICKER_HOLDINGS]
      holdings.map(h => {
        let key = Object.keys(h)[0]
        let value = Object.values(h)[0]
        listData.push({
          type: CUSTOM_LIST_ENTITIES.SIMPLE,
          key: key,
          value: value && (value.toString() + '%')
        })
      })
    }

    const isEmpty = listData.length === 0
    if (isTickerProcessing) {
      return null
    } else if (!ticker) {
      return null
    } else if (ticker && !isEmpty) {
      return (
        <View style={{paddingHorizontal: horizontalPadding, opacity: 1, backgroundColor: '#ECC016', shadowOpacity: 0.7, shadowRadius: 4, shadowOffset: {width: 1, height: -2}}}>
          {
            !isEmpty
            &&
            <View style={{paddingTop: 14, paddingBottom: 5, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, backgroundColor: 'transparent', color: '#000'}}>
                What does the stock represent?
              </Text>
              <TouchableOpacity
                accessible
                accessibilityLabel={'Show portfolio info for what does stock represent'}
                accessibilityRole={'button'}
                onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_DOES_STOCK_REPRESENT)}>
                <Image source={require('../../../Img/learn/help.png')} style={{height: 9, width: 9, marginLeft: 8}} />
              </TouchableOpacity>
            </View>
          }
          {
            listData.length > 0 && <CustomListView data={listData} />
          }

        </View>
      )
    } else return null
  }

  renderNextButton () {
    const {portfolio, isDisplayOnly} = this.props
    const isX = this.isX || false
    if (isDisplayOnly) {
      return (
        <View style={{position: 'absolute', bottom: isX ? 40 : 20, left: 0, right: 0}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Buy or sell Investment'}
            accessibilityRole={'button'}
            style={{...styles.bottomNavigator.containerStyle}}
            onPress={() => this.toggleShowDreamOptions()}
          >
            <Text style={styles.bottomNavigator.textStyle}>Buy / Sell Investment</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={{position: 'absolute', bottom: isX ? 40 : 20, left: 0, right: 0}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Confirm'}
            accessibilityRole={'button'}
            style={{...styles.bottomNavigator.containerStyle}}
            onPress={_.debounce(_.bind(() => this.next(portfolio.NAME), this), 500, {'leading': true, 'trailing': false})}
          >
            <Text style={styles.bottomNavigator.textStyle}>CONFIRM</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  // --------------------------------------------------------
  // Core component

  render () {
    const { showDreamOptions, infoTipCode, infoTipVisible } = this.state
    const {childID} = this.props
    console.log('child id in props --> ', childID)
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        {this.renderHeading()}
        {this.renderTabs()}
        <ScrollView style={{flex: 1, backgroundColor: '#FFF'}} showsVerticalScrollIndicator={false}>
          {this.renderLastUpdateTime()}
          {this.renderSelectedTab()}
        </ScrollView>
        {showDreamOptions && this.renderDreamOptions()}
        <InfoTip isVisible={infoTipVisible} isGlossary={false} code={infoTipCode} foo={this.toggleInfoTip.bind(this)} />
      </View>
    )
  }
}

// ========================================================
// Prop handlers
// ========================================================

PortfolioDetail.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // is display only
  isDisplayOnly: PropTypes.bool.isRequired,

  portfolio: PropTypes.object.isRequired,

  portfolioDetail: PropTypes.string.isRequired,

  childID: PropTypes.string.isRequired,
  firstname: PropTypes.string,
  goalID: PropTypes.string,
  goalName: PropTypes.string,
  lastUpdatedTime: PropTypes.string,
  balance: PropTypes.number,
  recurringAmount: PropTypes.number,
  userID: PropTypes.string.isRequired,
  idToken: PropTypes.string.isRequired,
  ticker: PropTypes.object.isRequired,
  stock: PropTypes.object.isRequired,
  isTickerProcessing: PropTypes.bool.isRequired,
  chartData: PropTypes.array
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(PortfolioDetail))

export default Screen
