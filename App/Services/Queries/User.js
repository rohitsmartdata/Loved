/* eslint-disable new-cap */
/**
 * Created by viktor on 14/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import gql from 'graphql-tag'
import {readClient, transferClient, detailClient} from '../../Config/AppConfig'
import {USER_ENTITIES} from '../../Utility/Mapper/User'
import {CHILD_ENTITIES} from '../../Utility/Mapper/Child'
import {fetchAPIToken} from '../../Sagas/AuthSaga'
import {GOAL_ENTITIES} from '../../Utility/Mapper/Goal'

// ========================================================
// Queries
// ========================================================

export const userQuery = () => {
  let query = gql`
      query ($userID: String!){
          user (user_id: $userID) {
            user_id,
            user_name,
            first_name,
            last_name,
            date_of_birth,
            email,
            current_funding_source_id,
            current_funding_source_status,
            current_funding_source_account,
            image_url,
            funding_status,
            risk_score,
            ssn_entered,
            bank_entered,
            
            sprout {
              sprout_id,
              first_name,
              last_name,
              date_of_birth,
              image_url,
              broker_dealer_account_id,
              broker_dealer_account_status,
              updated_at,
              ssn_entered,
              image_url,
              bank_entered,
              
              goal {
                goal_id,
                name,
                target,
                end_date,
                path_id,
                path_locked,
                current_portfolio_id,
                image_url
              }
            }
          }      
      }
    `

  async function fetchUser (action) {
    let token = await fetchAPIToken()
    let ql = new readClient(token)
    return ql.client.query(
      {
        query,
        variables: {
          userID: action[USER_ENTITIES.USER_ID]
        }
      })
  }

  return {
    fetchUser
  }
}

export const userInstructions = () => {
  let query = gql`
    query ($userID: String!){
    user_instructions(user_id: $userID) {
      user_id
      instruction_id
      sprout_id     
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
  `

  async function fetchUserInstructions (action) {
    let token = await fetchAPIToken()
    let ql = new transferClient(token).client
    return ql.query(
      {
        query,
        variables: {
          userID: action[USER_ENTITIES.USER_ID]
        }
      })
  }

  return {
    fetchUserInstructions
  }
}

export const modifyUserInstruction = () => {
  let mutation = gql`
    mutation ($userID: String!, $childID: String!, $goalID: String!, $transferID: String!, $action: String!) {
      update_transfer(input: {
        user_id: $userID,
        sprout_id: $childID,
        goal_id: $goalID,
        transfer_reference_id: $transferID,
        action: $action
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

  async function modifyUserInstruction (action) {
    let token = await fetchAPIToken()
    let ql = new transferClient(token).client
    return ql.mutate({
      mutation,
      variables: {
        userID: action[USER_ENTITIES.USER_ID],
        childID: action[CHILD_ENTITIES.CHILD_ID],
        goalID: action[GOAL_ENTITIES.GID],
        transferID: action[GOAL_ENTITIES.INSTRUCTION_ID],
        action: action[GOAL_ENTITIES.INSTRUCTION_ACTION]
      }}
    )
  }

  return {
    modifyUserInstruction
  }
}

export const modifyRecurringAmount = () => {
  let mutation = gql`
    mutation ($userID: String!, $childID: String!, $goalID: String!, $transferID: String!, $frequency: String!, $amount: String!) {
      update_transfer(input: {
        user_id: $userID,
        sprout_id: $childID,
        goal_id: $goalID,
        transfer_reference_id: $transferID,
        frequency: $frequency,
        amount: $amount
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

  async function modifyRecurringAmount (action) {
    let token = await fetchAPIToken()
    let ql = new transferClient(token).client
    return ql.mutate({
      mutation,
      variables: {
        userID: action[USER_ENTITIES.USER_ID],
        childID: action[CHILD_ENTITIES.CHILD_ID],
        goalID: action[GOAL_ENTITIES.GID],
        transferID: action[GOAL_ENTITIES.INSTRUCTION_ID],
        amount: action[GOAL_ENTITIES.RECURRING_AMOUNT],
        frequency: action[GOAL_ENTITIES.RECURRING_FREQUENCY]
      }}
    )
  }

  return {
    modifyRecurringAmount
  }
}

export const userTransactions = () => {
  let query = gql`
    query ($userID: String!){
    user_detail(user_id: $userID) {
      user_id
      transactions {
        transaction_reference_id
        transaction_amount
        transaction_time
        transaction_instruction_reference
        transaction_type
        transaction_status
        transaction_goal_id
        transaction_sprout_id
        transaction_stocks {
          stock_name
          stock_units
        }
      }
    }
  }
  `

  async function fetchUserTransactions (action) {
    let token = await fetchAPIToken()
    let client = new detailClient(token).client
    return client.query(
      {
        query,
        variables: {
          userID: action[USER_ENTITIES.USER_ID]
        }
      })
  }

  return {
    fetchUserTransactions
  }
}

export const fetchDebugData = () => {
  let query = gql`
    query ($userID: String!){
    user_detail(user_id: $userID) {
      user_id
      stocks {
        stock_ticker
        stock_name
        stock_units
        stock_available_units
        stock_invested_amount
        stock_unit_price
        stock_current_value
        stock_growth_in_value
        stock_growth_in_percentage
        stock_fetch_time
      }
    }
  }
  `

  async function fetchDebugData (action) {
    let token = await fetchAPIToken()
    let client = new detailClient(token).client
    return client.query(
      {
        query,
        variables: {
          userID: action[USER_ENTITIES.USER_ID]
        }
      })
  }

  return {
    fetchDebugData
  }
}
