/* eslint-disable no-trailing-spaces,padded-blocks,new-cap */
/**
 * Created by viktor on 28/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import gql from 'graphql-tag'
import {client, detailClient} from '../../Config/AppConfig'
import {CHILD_ENTITIES} from '../../Utility/Mapper/Child'
import {USER_ENTITIES} from '../../Utility/Mapper/User'
import {fetchAPIToken} from '../../Sagas/AuthSaga'

// ========================================================
// Queries
// ========================================================

export const childQuery = () => {

  let mutation = gql`
      mutation ($userID: String!, $firstName : String!, $lastName : String!, $DOB: String!){
        create_sprout(
          input: {
            client_id: "iPhone",
            user_id: $userID,
            sprout: {
              first_name: $firstName,
              last_name: $lastName,
              date_of_birth: $DOB
            },
            attributes: {
              has_control: 1,
              relationship: "son"
             }
           }
         )
         {
          sprout {
            sprout_id
            first_name
            last_name
            date_of_birth
           }
         }
      }
    `

  async function addChild (action) {
    let token = await fetchAPIToken()
    let ql = new client(token)
    return ql.client.mutate(
      {
        mutation,
        variables: {
          userID: action[CHILD_ENTITIES.USER_ID],
          firstName: action[CHILD_ENTITIES.FIRST_NAME],
          lastName: action[CHILD_ENTITIES.LAST_NAME],
          DOB: action[CHILD_ENTITIES.DOB]
        }
      })
  }

  return {
    addChild
  }

}

export const fetchChildDetail = () => {

  let query = gql`
    query ($userID: String!){
    user_detail(user_id: $userID) {
      user_id
      last_updated_time
      user {
        total_contributions
        current_value
        available_value
        pending_transfer_amount
        pending_withdrawal_amount
        growth_in_value
        growth_in_percentage
      }
      sprouts {
        sprout_id
        available_value
        current_value
        pending_transfer_amount
        pending_withdrawal_amount
        total_contributions
        growth_in_percentage
        pending_transfer_amount
        growth_in_value
        goals {
          goal_id
          total_contributions
          path_id
          current_value
          ticker_name
          available_value
          growth_in_value
          growth_in_percentage
          pending_withdrawal_amount
          pending_transfer_amount
        }
      }
      instructions {
        instruction_goal_id
        instruction_sprout_id
        instruction_reference
        instruction_amount
        instruction_freqeuncy
        instruction_request_time
        instruction_initial_date
        instruction_type
        instruction_next_activity_date
        instruction_status
      }
      transactions {
        transaction_reference_id
        transaction_amount
        transaction_time
        transaction_instruction_reference
        transaction_type
        transaction_status
        transaction_goal_id
        transaction_goal_name
        transaction_sprout_id
        transaction_sprout_first_name
        transaction_sprout_last_name
      }
    }
  }
  `

  async function fetchChildDetail (action) {
    let token = await fetchAPIToken()
    let client = new detailClient(token).client
    await client.resetStore()

    return client.query(
      {
        query,
        variables: {
          userID: action[USER_ENTITIES.USER_ID]
        }
      })
  }

  return {
    fetchChildDetail
  }
}
