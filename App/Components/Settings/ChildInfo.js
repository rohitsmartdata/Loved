/* eslint-disable no-unused-vars,no-trailing-spaces,operator-linebreak */
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
import { View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import CustomNav
  from '../../Containers/Common/CustomNav'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class ChildInfo extends Component {

  // --------------------------------------------------------
  // Child Components

  renderBlankState () {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 18, color: '#000', backgroundColor: 'transparent'}}>
          BROKER DEALER INFO {'\n'} WILL BE SHOWN HERE
        </Text>
      </View>
    )
  }

  renderBrokerDealerInfo () {
    const {brokerDealerData} = this.props
    if (brokerDealerData) {
      const accountID = brokerDealerData['account_id']
      const accountStatus = brokerDealerData['account_status']
      const parentSSN = brokerDealerData['parent_ssn']
      const childSSN = brokerDealerData['child_ssn']
      const accountSource = brokerDealerData['account_sources']
      const accountTransfers = brokerDealerData['account_transfers']
      const accountCashTransactions = brokerDealerData['account_cash_transactions']
      const accountEquities = brokerDealerData['account_equities']
      const accountPortfolio = brokerDealerData['account_portfolio']
      const stocks = brokerDealerData['stocks']
      return (
        <View style={{flex: 1}}>
          {this.renderSingularCard('Account ID', accountID)}
          {this.renderSingularCard('Account Status', accountStatus)}
          {this.renderSingularCard('Parent SSN', parentSSN)}
          {this.renderSingularCard('Child SSN', childSSN)}
          {this.renderAccountSource(accountSource)}
          {this.renderAccountTransfers(accountTransfers)}
          {this.renderAccountCashTransactions(accountCashTransactions)}
          {this.renderAccountEquities(accountEquities)}
          {this.renderAccountPortfolio(accountPortfolio)}
          {this.renderStocks(stocks)}
        </View>
      )
    } else return null
  }

  renderSingularCard (title, value) {
    return (
      <View style={{marginHorizontal: 10, marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          {title}
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 5}}>
          {value}
        </Text>
      </View>
    )
  }

  renderAccountPortfolio (accountPortfolio) {
    if (accountPortfolio) {
      return (
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: '#000', backgroundColor: 'transparent'}}>
            Account Portfolio
          </Text>
          <View style={{marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Available to Withdraw
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['available_to_withdraw']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Available to Trade
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['available_to_trade']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Cash Balance
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['cash_balance']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Pending Increase
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['pending_increase']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Pending Decrease
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['pending_decrease']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Pending cash balance
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['pending_cash_balance']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Pending buy trades
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['pending_buy_trades']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Pending sell trades
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['pending_sell_trades']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Pending withdraws
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['pending_withdrawals']}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Pending deposits
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountPortfolio['pending_deposits']}
            </Text>
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  renderStocks (stocks) {
    if (stocks) {
      return (
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: '#000', backgroundColor: 'transparent'}}>
            Account Equities
          </Text>
          {
            stocks.map(a => this.renderStockCard(a['symbol'], a['last_price']))
          }
        </View>
      )
    } else {
      return null
    }
  }

  renderStockCard (symbol, lastPrice) {
    return (
      <View style={{marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Symbol
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {symbol}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Last Price
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {lastPrice}
        </Text>
      </View>
    )
  }

  renderAccountEquities (accountEquities) {
    if (accountEquities) {
      return (
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: '#000', backgroundColor: 'transparent'}}>
            Account Equities
          </Text>
          {
            accountEquities.map(a => this.renderAccountEquitiesCard(a['symbol'], a['average_price'], a['quantity_settled'], a['quantity_pending'], a['unit_price']))
          }
        </View>
      )
    } else {
      return null
    }
  }

  renderAccountEquitiesCard (symbol, averagePrice, quantitySettled, quantityPending, unitPrice) {
    return (
      <View style={{marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Symbol
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {symbol}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Average Price
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {averagePrice}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Quantity Settled
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {quantitySettled}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Quantity Pending
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {quantityPending}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Unit Price
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {unitPrice}
        </Text>
      </View>
    )
  }

  renderAccountTransfers (accountTransfers) {
    if (accountTransfers) {
      return (
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: '#000', backgroundColor: 'transparent'}}>
            Account Transfers
          </Text>
          {
            accountTransfers.map(a => this.renderAccountTransferCard(a['transfer_id'], a['timestamp'], a['amount'], a['status']))
          }
        </View>
      )
    } else {
      return null
    }
  }

  renderAccountTransferCard (transferID, timestamp, amount, status) {
    return (
      <View style={{marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Transfer ID
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {transferID}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Timestamp
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {timestamp}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Amount
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {amount}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Status
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {status}
        </Text>
      </View>
    )
  }

  renderAccountCashTransactions (accountCashTransactions) {
    if (accountCashTransactions) {
      return (
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: '#000', backgroundColor: 'transparent'}}>
            Account Cash Transactions
          </Text>
          {
            accountCashTransactions.map(a => this.renderAccountCashTransactionsCard(a['transaction_time'], a['transaction_type'], a['amount'], a['description'], a['unit_price']))
          }
        </View>
      )
    } else {
      return null
    }
  }

  renderAccountCashTransactionsCard (transactionTime, transactionType, amount, description, unitPrice) {
    return (
      <View style={{marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Transaction Time
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {transactionTime}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Transaction Type
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {transactionType}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Amount
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {amount}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Description
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {description}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Unit Price
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {unitPrice}
        </Text>
      </View>
    )
  }

  renderAccountSource (sourceData) {
    if (sourceData && sourceData[0]) {
      const accountType = sourceData[0]['account_type']
      const accountNumber = sourceData[0]['account_number']
      const sourceID = sourceData[0]['source_id']
      const sourceStatus = sourceData[0]['source_status']
      return (
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: '#000', backgroundColor: 'transparent'}}>
            Account Source
          </Text>
          <View style={{marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
              Account Type
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountType}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
              Account Number
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {accountNumber}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
              Source ID
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {sourceID}
            </Text>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
              Source Status
            </Text>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
              {sourceStatus}
            </Text>
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {processing} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={this.props.navigator} leftButtonPresent titlePresent title='BROKER DEALER INFO' />
        <ProcessingIndicator isProcessing={processing} />
        <ScrollView>
          {
            processing
              ?
              this.renderBlankState()
              :
              this.renderBrokerDealerInfo()
          }
        </ScrollView>
      </View>
    )
  }

}

ChildInfo.propTypes = {
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

  // child id's
  childID: PropTypes.string.isRequired,

  // is processing
  processing: PropTypes.bool.isRequired,

  // broker dealer info
  brokerDealerData: PropTypes.object
}

// ========================================================
// Export
// ========================================================

export default ChildInfo
