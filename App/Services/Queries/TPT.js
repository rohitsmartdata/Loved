/* eslint-disable no-trailing-spaces,new-cap */
/**
 * Created by viktor on 9/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {fetchAPIToken} from '../../Sagas/AuthSaga'
import gql from 'graphql-tag'
import {tptClient, fundingClient, transferClient} from '../../Config/AppConfig'
import {USER_ENTITIES} from '../../Utility/Mapper/User'
import {CHILD_ENTITIES} from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES} from '../../Utility/Mapper/Goal'
import {convertDateStringToRequestFormat, convertDateToRequestFormat}
  from '../../Utility/Transforms/Converter'

// ========================================================
// Queries
// ========================================================

export const foo = () => {
  let foo = (residencyType, familyBrokerageFlag, familyPoliticalFlag, stockOwnerFlag) => {
    return gql`
    mutation ($clientID: String!, $userID: String!, $childID: String!, $incomeRange: String!, $assetsWorth: String!,
      $investorType: String!, $firstName: String!, $middleName: String, $lastName: String!, $emailID: String!,
      $DOB: String!, $ssn: String!, $citizenshipCountry: String!, $birthCountry: String!, $phone: String!,
      $employmentStatus: String!, $line1: String!, $line2: String!, $city: String!, $state: String!, $postalCode: String!,
      $disclosureType: String!, $disclosurePoliticalExposureOrganization: String, $disclosurePoliticalExposureFamily: [String],
      $disclosureControlPersonCompanySymbols: [String], $disclosureFirmAffiliationName: String, $visaType: String, $visaExpiration: String,
      $childFirstName: String!, $childLastName: String!, $childSSN: String!, $childDOB: String!){
      create_account (input: {
        client_id: $clientID,
          user_id: $userID,
          sprout_id: $childID,
          income_range: $incomeRange,
          assets_worth: $assetsWorth,
          investor_type: $investorType,
          applicants: [
          {
            applicant_type: "custodian",
            first: $firstName,
            middle: $middleName,
            last: $lastName,
            email: $emailID,
            birthday: $DOB,
            ssn: $ssn,
            citizenship_country: $citizenshipCountry,
            birth_country: $birthCountry,
            mobile: $phone,
            employment_status: $employmentStatus,
            line_1: $line1,
            line_2: $line2,
            city: $city,
            state: $state,
            postal_code: $postalCode,
            disclosure_type: $disclosureType,
            disclosure_political_exposure_organization: $disclosurePoliticalExposureOrganization,
            disclosure_political_exposure_family: $disclosurePoliticalExposureFamily,
            disclosure_control_person_company_symbols: $disclosureControlPersonCompanySymbols,
            disclosure_firm_affiliation_name: $disclosureFirmAffiliationName,
            visa_type: $visaType,
            visa_expiration: $visaExpiration
          },
          {
            applicant_type: "minor",
            first: $childFirstName,
            last: $childLastName,
            email: $emailID,
            birthday: $childDOB,
            ssn: $childSSN,
            citizenship_country: $citizenshipCountry,
            mobile: $phone,
            employment_status: "student",
            line_1: $line1,
            line_2: $line2,
            city: $city,
            state: $state,
            postal_code: $postalCode
          }
        ]
      }) {
        account_id
        status
      }
    }
      `
  }

  async function createAccount (userData, childData, userID, childSSN, emailID) {
    let childDOB = childData['date_of_birth']
    let parentDOB = userData[USER_ENTITIES.DOB]
    let visaExpiry = userData[USER_ENTITIES.VISA_EXPIRY]

    let modifiedChildDOB = convertDateStringToRequestFormat(childDOB)
    modifiedChildDOB && (childData['date_of_birth'] = modifiedChildDOB)

    let modifiedParentDOB = convertDateToRequestFormat(parentDOB)
    let modifiedVisaExpiry = (visaExpiry && convertDateToRequestFormat(visaExpiry)) || undefined

    let token = await fetchAPIToken()
    let mutation = foo()
    let ql = new tptClient(token).client

    const middleName = userData[USER_ENTITIES.MIDDLE_INITIAL] || undefined

    return ql.mutate(
      {
        mutation,
        variables: {
          clientID: '11-11-11',
          userID: userID,
          incomeRange: userData[USER_ENTITIES.SALARY_PER_YEAR],
          assetsWorth: userData[USER_ENTITIES.USER_TOTAL_VALUE],
          investorType: userData[USER_ENTITIES.INVESTOR_TYPE],
          firstName: userData[USER_ENTITIES.FIRST_NAME],
          lastName: userData[USER_ENTITIES.LAST_NAME],
          middleName: middleName,
          emailID: emailID,
          DOB: modifiedParentDOB,
          ssn: userData[USER_ENTITIES.SSN],

          citizenshipCountry: userData[USER_ENTITIES.COUNTRY_CITIZENSHIP] || 'USA',
          birthCountry: userData[USER_ENTITIES.COUNTRY_BORN] || 'USA', // optional
          phone: userData[USER_ENTITIES.PHONE_NUMBER],
          employmentStatus: userData[USER_ENTITIES.EMPLOYMENT_TYPE],
          line1: userData[USER_ENTITIES.ADDRESS_LINE_1],
          line2: userData[USER_ENTITIES.ADDRESS_LINE_2] || '', // optional
          city: userData[USER_ENTITIES.CITY],
          state: userData[USER_ENTITIES.STATE],
          postalCode: userData[USER_ENTITIES.ZIP_CODE],
          disclosureType: [userData[USER_ENTITIES.FAMILY_POLITICAL_FLAG] ? 'political_exposure' : '', userData[USER_ENTITIES.FAMILY_BROKERAGE_FLAG] ? 'control_person' : '', userData[USER_ENTITIES.STOCK_OWNER_FLAG] ? 'firm_affiliation' : ''], // optional
          disclosurePoliticalExposureOrganization: userData[USER_ENTITIES.FAMILY_POLITICAL_FLAG] ? userData[USER_ENTITIES.POLITICAL_ORGANISATION] : undefined, // optional
          disclosurePoliticalExposureFamily: userData[USER_ENTITIES.FAMILY_POLITICAL_FLAG] ? userData[USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE] : undefined, // optional
          disclosureControlPersonCompanySymbols: userData[USER_ENTITIES.FAMILY_BROKERAGE_FLAG] ? userData[USER_ENTITIES.STOCK_TICKER] : undefined, // optional
          disclosureFirmAffiliationName: userData[USER_ENTITIES.STOCK_OWNER_FLAG] ? userData[USER_ENTITIES.STOCK_BROKERAGE_FIRM] : undefined, // optional
          visaType: userData[USER_ENTITIES.VISA_TYPE] || undefined, // optional
          visaExpiration: modifiedVisaExpiry,

          // child values
          childID: childData['sprout_id'],
          childFirstName: childData['first_name'],
          childLastName: childData['last_name'],
          childSSN: childSSN || userData[USER_ENTITIES.SSN], //
          childDOB: childData['date_of_birth']

        }
      })
  }

  return {
    createAccount
  }
}

export const storeInformation = () => {
  let foo = () => {
    return gql`
    mutation ($clientID: String!, $userID: String!, $incomeRange: String!, $assetsWorth: String!, $employmentStatus: String!,
      $investorType: String!, $firstName: String!, $middleName: String, $lastName: String!, $emailID: String!,
      $DOB: String!, $citizenshipCountry: String!, $birthCountry: String!, $phone: String!,
      $disclosureType: String, $disclosurePoliticalExposureOrganization: String, $disclosurePoliticalExposureFamily: [String],
      $disclosureControlPersonCompanySymbols: [String], $disclosureFirmAffiliationName: String, $visaType: String, $visaExpiration: String){

      store_information (input: {
          client_id: $clientID,
          user_id: $userID,
          income_range: $incomeRange,
          assets_worth: $assetsWorth,
          employment_status: $employmentStatus,
          investor_type: $investorType,
          first: $firstName,
          middle: $middleName,
          last: $lastName,
          email: $emailID,
          birthday: $DOB,
          citizenship_country: $citizenshipCountry,
          birth_country: $birthCountry,
          mobile: $phone,
          disclosure_type : $disclosureType,
          disclosure_political_exposure_organization: $disclosurePoliticalExposureOrganization,
          disclosure_political_exposure_family: $disclosurePoliticalExposureFamily,
          disclosure_control_person_company_symbols: $disclosureControlPersonCompanySymbols,
          disclosure_firm_affiliation_name: $disclosureFirmAffiliationName,
          visa_type: $visaType,
          visa_expiration: $visaExpiration
      }) {
        user_id
        status
      }
    }
      `
  }

  async function storeInformation (userData) {
    let userID = userData[USER_ENTITIES.USER_ID]
    let emailID = userData[USER_ENTITIES.EMAIL_ID]
    let parentDOB = userData[USER_ENTITIES.DOB]
    let visaExpiry = userData[USER_ENTITIES.VISA_EXPIRY]

    let modifiedParentDOB = convertDateToRequestFormat(parentDOB)
    let modifiedVisaExpiry = (visaExpiry && convertDateToRequestFormat(visaExpiry)) || undefined

    let token = await fetchAPIToken()
    let mutation = foo()
    let ql = new tptClient(token).client

    let disclosureType = []

    userData[USER_ENTITIES.FAMILY_POLITICAL_FLAG] ? disclosureType.push('political_exposure') : null
    userData[USER_ENTITIES.FAMILY_BROKERAGE_FLAG] ? disclosureType.push('control_person') : null
    userData[USER_ENTITIES.STOCK_OWNER_FLAG] ? disclosureType.push('firm_affiliation') : null

    if (disclosureType.length === 0) { disclosureType = undefined }
    let variables = {
      clientID: '11-11-11',
      userID: userID,
      incomeRange: userData[USER_ENTITIES.SALARY_PER_YEAR], //
      assetsWorth: userData[USER_ENTITIES.USER_TOTAL_VALUE], //
      employmentStatus: userData[USER_ENTITIES.EMPLOYMENT_TYPE], //
      investorType: userData[USER_ENTITIES.INVESTOR_TYPE], //
      firstName: userData[USER_ENTITIES.FIRST_NAME], //
      middleName: userData[USER_ENTITIES.MIDDLE_INITIAL] || undefined, //
      lastName: userData[USER_ENTITIES.LAST_NAME], //
      emailID: emailID, //
      DOB: modifiedParentDOB, //
      citizenshipCountry: 'USA',
      birthCountry: 'USA', // optional
      phone: userData[USER_ENTITIES.PHONE_NUMBER],
      disclosureType, // optional
      disclosurePoliticalExposureOrganization: userData[USER_ENTITIES.FAMILY_POLITICAL_FLAG] ? userData[USER_ENTITIES.POLITICAL_ORGANISATION] : undefined, // optional
      disclosurePoliticalExposureFamily: userData[USER_ENTITIES.FAMILY_POLITICAL_FLAG] ? userData[USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE] : undefined, // optional
      disclosureControlPersonCompanySymbols: userData[USER_ENTITIES.FAMILY_BROKERAGE_FLAG] ? userData[USER_ENTITIES.STOCK_TICKER] : undefined, // optional
      disclosureFirmAffiliationName: userData[USER_ENTITIES.STOCK_OWNER_FLAG] ? userData[USER_ENTITIES.STOCK_BROKERAGE_FIRM] : undefined, // optional
      visaType: userData[USER_ENTITIES.VISA_TYPE] || undefined, // optional
      visaExpiration: modifiedVisaExpiry
    }

    return ql.mutate(
      {
        mutation,
        variables
      })
  }

  return {
    storeInformation
  }
}

export const storeAddressDetail = () => {
  let foo = () => {
    return gql`
    mutation ($userID: String!, $line1: String!, $line2: String, $city: String!, $state: String!, $postalCode: String!){
      store_information (input: {
          user_id: $userID,
          line_1: $line1,
          line_2: $line2,
          city: $city,
          state: $state,
          postal_code: $postalCode
      }) {
        user_id
        status
      }
    }
      `
  }

  async function storeAddressDetail (userData) {
    let userID = userData[USER_ENTITIES.USER_ID]

    let token = await fetchAPIToken()
    let mutation = foo()
    let ql = new tptClient(token).client
    let identityData = userData[USER_ENTITIES.IDENTITY_DATA]

    return ql.mutate(
      {
        mutation,
        variables: {
          userID: userID,
          line1: identityData[USER_ENTITIES.ADDRESS_LINE_1],
          line2: identityData[USER_ENTITIES.ADDRESS_LINE_2] || '', // optional
          city: identityData[USER_ENTITIES.CITY],
          state: identityData[USER_ENTITIES.STATE],
          postalCode: identityData[USER_ENTITIES.ZIP_CODE]
        }
      })
  }

  return {
    storeAddressDetail
  }
}

export const storeUserSSN = () => {
  let foo = () => {
    return gql`
    mutation ($userID: String!, $ssn: String!){
      store_information (input: {
          user_id: $userID,
          ssn: $ssn
      }) {
        user_id
        status
      }
    }
      `
  }

  async function storeInformation (userData) {
    let userID = userData[USER_ENTITIES.USER_ID]
    let ssn = userData[USER_ENTITIES.SSN]

    let token = await fetchAPIToken()
    let mutation = foo()
    let ql = new tptClient(token).client

    return ql.mutate(
      {
        mutation,
        variables: {
          userID: userID,
          ssn: ssn
        }
      })
  }

  return {
    storeInformation
  }
}

export const requestChildSSNPayload = () => {
  let foo = () => {
    return gql`
    mutation ($userID: String!, $sproutID: String!, $uniqueCode: String!, $ssnRequestEmail: String!){
      request_child_ssn_from_parent (
          input: {
            user_id: $userID,
            sprout_id: $sproutID,
            unique_code: $uniqueCode,
            ssn_request_email: $ssnRequestEmail
          }
      ) {
        user_id
        status
      }
    }
      `
  }

  async function requestChildSSNPayload (action) {
    let userID = action[USER_ENTITIES.USER_ID]
    let childID = action[CHILD_ENTITIES.CHILD_ID]
    let uniqueCode = action[CHILD_ENTITIES.UNIQUE_CODE]
    let emailID = action[USER_ENTITIES.EMAIL_ID]

    let token = await fetchAPIToken()
    let mutation = foo()
    let ql = new tptClient(token).client

    return ql.mutate(
      {
        mutation,
        variables: {
          userID: userID,
          sproutID: childID,
          uniqueCode: uniqueCode,
          ssnRequestEmail: emailID
        }
      })
  }

  return {
    requestChildSSNPayload
  }
}

export const createChildAccount = () => {
  let foo = () => {
    return gql`
      mutation ($userID: String!, $childID: String!, $userSSN: String, $childSSN: String!){
        create_child_account (input: {
          user_id: $userID,
          sprout_id: $childID,
          child_ssn: $childSSN,
          parent_ssn: $userSSN
      }) {
        account_id
        status
      }
    }
      `
  }

  // note:  userData parameter isn't used inside the function
  async function createChildAccount (userID, childID, userSSN, childSSN) {
    let token = await fetchAPIToken()
    let ql = new tptClient(token).client
    let mutation = foo(childSSN)
    return ql.mutate(
      {
        mutation,
        variables: {
          userID: userID,
          childID: childID,
          userSSN: userSSN,
          childSSN: childSSN
        }
      })
  }

  return {
    createChildAccount
  }
}

export const queryAccountAPI = () => {
  let query = gql`
    query ($userID: String!, $accountID: String!){
      account(user_id: $userID, account_id: $accountID) {
         user_id
         account_id
         parent_ssn
         child_ssn
         account_status
         account_sources {
          account_type
          account_number
          source_id
          source_status
         }
         account_transfers {
          transfer_id
          timestamp
          amount
          status
         }
         account_cash_transactions {
          transaction_time
          transaction_type
          amount
          description
          unit_price
         }
         account_equities {
          symbol
          average_price
          quantity_settled
          quantity_pending
          unit_price
         }
         account_portfolio {
          available_to_withdraw
          available_to_trade
          cash_balance
          pending_increase
          pending_decrease
          pending_cash_balance
          pending_buy_trades
          pending_sell_trades
          pending_withdrawals
          pending_deposits
         }
         stocks {
          symbol
          last_price
         }
      }
    }`

  async function queryAccountAPI (action) {
    let token = await fetchAPIToken()
    let client = new tptClient(token).client

    let userID = action[USER_ENTITIES.USER_ID]
    let accountID = action[CHILD_ENTITIES.BD_ACCOUNT_ID]
    return client.query(
      {
        query,
        variables: {
          userID: userID,
          accountID: accountID
        }
      })
  }

  return {
    queryAccountAPI
  }
}

export const linkPlaidQuery = () => {
  let mutationPlaid = gql`
    mutation ($userID: String!, $plaidPublicToken: String!, $plaidAccountID: String!) {
          create_funding_source(input: {
            user_id: $userID,
            plaid_public_token: $plaidPublicToken,
            plaid_account_id: $plaidAccountID
          }) {
            source_reference_id
            status
          }
        }
  `

  let mutationBank = gql`
    mutation ($userID: String!, $backAccountType: String!, $bankAccountNumber: String!, $bankRoutingNumber: String!) {
          create_funding_source(input: {
            user_id: $userID,
            account_type: $backAccountType,
            account_number: $bankAccountNumber,
            bank_routing_number: $bankRoutingNumber
          }) {
            source_reference_id
            status
          }
        }
  `

  async function linkPlaid (userData) {
    let token = await fetchAPIToken()
    let ql = new fundingClient(token).client

    let payloadPlaid = {
      plaidPublicToken: userData[USER_ENTITIES.PLAID_PUBLIC_TOKEN],
      plaidAccountID: userData[USER_ENTITIES.PLAID_ACCOUNT_ID]
    }
    let payloadBank = {
      backAccountType: userData[USER_ENTITIES.BANK_ACCOUNT_TYPE],
      bankAccountNumber: userData[USER_ENTITIES.BANK_ACCOUNT_NUMBER],
      bankRoutingNumber: userData[USER_ENTITIES.BANK_ROUTING_NUMBER]
    }

    let mutation = (userData[USER_ENTITIES.PLAID_PUBLIC_TOKEN]) ? mutationPlaid : mutationBank
    let payload = (userData[USER_ENTITIES.PLAID_PUBLIC_TOKEN]) ? payloadPlaid : payloadBank

    return ql.mutate({
      mutation,
      variables: {
        userID: userData[USER_ENTITIES.USER_ID],
        ...payload
      }
    })
  }

  return {
    linkPlaid
  }
}

export const plaidUpdateModeQuery = () => {
  let mutation = gql`
    mutation ($userID: String!, $sourceReferenceID: String) {
          reset_login(input: {
            user_id: $userID,
            source_reference_id: $sourceReferenceID
          }) {
            plaid_public_token
            status
          }
        }
  `

  async function plaidUpdateMode (userData) {
    let token = await fetchAPIToken()
    let ql = new fundingClient(token).client
    let payload = {
      sourceReferenceID: userData[USER_ENTITIES.SOURCE_REFERENCE_ID]
    }

    return ql.mutate({
      mutation,
      variables: {
        userID: userData[USER_ENTITIES.USER_ID],
        ...payload
      }
    })
  }

  return {
    plaidUpdateMode
  }
}

export const resetBankAccountQuery = () => {
  let mutation = gql`
    mutation ($userID: String!, $sourceReferenceID: String) {
          reset_login(input:{
            user_id: $userID,
            source_reference_id: $sourceReferenceID,
            reset_login: "true",
          }) {
            status
          }
        }
  `

  async function resetBankAccount (userData) {
    let token = await fetchAPIToken()
    let ql = new fundingClient(token).client
    let payload = {
      sourceReferenceID: userData[USER_ENTITIES.SOURCE_REFERENCE_ID]
    }

    return ql.mutate({
      mutation,
      variables: {
        userID: userData[USER_ENTITIES.USER_ID],
        ...payload
      }
    })
  }

  return {
    resetBankAccount
  }
}

export const plaidUpdateModeQueryForAccountId = () => {
  let mutation = gql`
    mutation ($userID: String!,$plaidAccountID: String!, $sourceReferenceID: String) {
          reset_login(input: {
            user_id: $userID,
            plaid_account_id: $plaidAccountID,
            source_reference_id: $sourceReferenceID
          }) {
            plaid_public_token
            status
          }
        }
  `

  async function plaidUpdateMode (userData) {
    let token = await fetchAPIToken()
    let ql = new fundingClient(token).client
    let payload = {
      plaidAccountID: userData[USER_ENTITIES.PLAID_ACCOUNT_ID],
      sourceReferenceID: userData[USER_ENTITIES.SOURCE_REFERENCE_ID]
    }

    return ql.mutate({
      mutation,
      variables: {
        userID: userData[USER_ENTITIES.USER_ID],
        ...payload
      }
    })
  }

  return {
    plaidUpdateMode
  }
}

export const verifyPlaidAmount = () => {
  let mutation = gql`
mutation ($userID: String!, $childID: String!, $sourceReferenceID: String!, $amount1: Float!, $amount2: Float!) {
  verify_funding_source(input:{
    user_id: $userID,
    sprout_id: $childID,
    source_reference_id: $sourceReferenceID,
    amount_1: $amount1,
    amount_2: $amount2
  }) {
    status
  }
}  `

  async function verifyPlaid (userData) {
    let token = await fetchAPIToken()
    let ql = new fundingClient(token).client

    return ql.mutate({
      mutation,
      variables: {
        userID: userData[USER_ENTITIES.USER_ID],
        childID: userData[CHILD_ENTITIES.CHILD_ID],
        sourceReferenceID: userData[USER_ENTITIES.SOURCE_REFERENCE_ID] || '',
        amount1: userData[USER_ENTITIES.FIRST_AMOUNT],
        amount2: userData[USER_ENTITIES.SECOND_AMOUNT]
      }
    })
  }

  return {
    verifyPlaid
  }
}

export const initiateTransfer = () => {
  let mutation = gql`
  mutation ($userID: String!, $childID: String!, $goalID: String!, $amount: String!, $frequency: String!) {
    create_transfer(input: {
      user_id: $userID,
      sprout_id: $childID,
      goal_id: $goalID,
      amount: $amount,
      frequency: $frequency
    }) {
      transfer_id
      status
      goal_instructions {
        user_id
        instruction_id
        goal_id
        instruction_request_time
        instruction_amount
        instruction_frequency
        instruction_type
        instruction_initial_date
        instruction_status
        instruction_next_date
      }
    }
  }
  `

  async function doTransfer (data) {
    let token = await fetchAPIToken()
    let ql = new transferClient(token).client
    return ql.mutate({
      mutation,
      variables: {
        userID: data[USER_ENTITIES.USER_ID],
        childID: data[CHILD_ENTITIES.CHILD_ID],
        goalID: data[GOAL_ENTITIES.GID],
        amount: data[GOAL_ENTITIES.TRANSFER_AMOUNT],
        frequency: data[GOAL_ENTITIES.RECURRING_FREQUENCY]
      }
    })
  }

  return {
    doTransfer
  }
}

export const initiateWithdraw = () => {
  let mutation = gql`
  mutation ($userID: String!, $childID: String!, $goalID: String!, $amount: String!) {
    create_withdrawal(input: {
       user_id: $userID,
       sprout_id: $childID,
       goal_id: $goalID,
       amount: $amount
     }) {
       withdrawal_instruction_id
       status
       goal_instructions {
        user_id
        instruction_id
        goal_id
        instruction_request_time
        instruction_amount
        instruction_frequency
        instruction_type
        instruction_initial_date
        instruction_status
        instruction_next_date
      }
     }
  }
  `

  async function doWithdraw (data) {
    let token = await fetchAPIToken()
    let ql = new transferClient(token).client
    return ql.mutate({
      mutation,
      variables: {
        userID: data[USER_ENTITIES.USER_ID],
        childID: data[CHILD_ENTITIES.CHILD_ID],
        goalID: data[GOAL_ENTITIES.GID],
        amount: data[GOAL_ENTITIES.WITHDRAW_AMOUNT]
      }
    })
  }

  return {
    doWithdraw
  }
}
