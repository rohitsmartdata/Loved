/* eslint-disable no-trailing-spaces,new-cap */
/**
 * Created by viktor on 30/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import gql from 'graphql-tag'
import {client, transferClient, detailClient} from '../../Config/AppConfig'
import {GOAL_ENTITIES} from '../../Utility/Mapper/Goal'
import {INVESTMENT_ENTITIES} from '../../Utility/Mapper/Investment'
import {USER_ENTITIES} from '../../Utility/Mapper/User'
import {CHILD_ENTITIES} from '../../Utility/Mapper/Child'
import {fetchAPIToken} from '../../Sagas/AuthSaga'
import moment from 'moment'

// ========================================================
// Queries
// ========================================================

export const updateCompleteGoalQuery = () => {
  let mutation = gql`
    mutation ($userID: String!, $childID: String!, $goalID: String!, $target: String!, $recurringAmount: String!, $recurringFrequency: String!, $initialTransferDate: String!){
      update_goal(
        input:{
          clientid: "Macbook",
          userid: $userID,
          sproutid: $childID,
          goalid: $goalID,
          patch: {
            target: $target,
            recurringinvestmentamount: $recurringAmount,
            recurringinvestmentfrequency: $recurringFrequency,
            initialtransferdate: $initialTransferDate
          }
        }
      ) {
        userid
        sproutid
        goal{
          goalid
          target
          recurringinvestmentfrequency
          recurringinvestmentamount
          initialtransferdate
        }
      }
    }
  `

  async function updateGoal (action) {
    let token = await fetchAPIToken()
    let ql = new client(token)
    return ql.client.mutate(
      {
        mutation,
        variables: {
          userID: action[USER_ENTITIES.USER_ID],
          childID: action[CHILD_ENTITIES.CHILD_ID],
          goalID: action[GOAL_ENTITIES.GID],
          target: action[GOAL_ENTITIES.GOAL_AMOUNT],
          recurringAmount: action[GOAL_ENTITIES.RECURRING_AMOUNT],
          recurringFrequency: action[GOAL_ENTITIES.RECURRING_FREQUENCY],
          initialTransferDate: action[GOAL_ENTITIES.FIRST_TRANSFER_DATE]
        }
      }
    )
  }

  return {
    updateGoal
  }
}

export const updateNameTargetGoalQuery = () => {
  let mutation = gql`
    mutation ($userID: String!, $childID: String!, $goalID: String!, $target: String!, $name: String!, $endDate: String!){
      update_goal(
        input:{
          client_id: "Macbook",
          user_id: $userID,
          sprout_id: $childID,
          goal_id: $goalID,
          patch: {
            target: $target,
            name: $name,
            end_date: $endDate
          }
        }
      ) {
        user_id
        sprout_id
        goal{
          goal_id
          target
          name
        }
      }
    }
  `

  async function updateGoal (action) {
    let token = await fetchAPIToken()
    let duration = action[GOAL_ENTITIES.DURATION]
    let ql = new client(token)
    let m = moment()
    m.add(duration, 'y')
    let endDate = m.format('YYYY-MM-DD')
    return ql.client.mutate(
      {
        mutation,
        variables: {
          userID: action[USER_ENTITIES.USER_ID],
          childID: action[CHILD_ENTITIES.CHILD_ID],
          goalID: action[GOAL_ENTITIES.GID],
          target: action[GOAL_ENTITIES.GOAL_AMOUNT],
          name: action[GOAL_ENTITIES.NAME],
          endDate: endDate
        }
      })
  }

  return {
    updateGoal
  }
}

export const updatePartialGoalQuery = () => {
  let mutation = gql`
    mutation ($userID: String!, $childID: String!, $goalID: String!, $target: String!, $portfolioRisk: String!, $endDate: String!){
      update_goal(
        input:{
          client_id: "Macbook",
          user_id: $userID,
          sprout_id: $childID,
          goal_id: $goalID,
          patch: {
            target: $target,
            current_portfolio_id: $portfolioRisk,
            end_date: $endDate
          }
        }
      ) {
        user_id
        sprout_id
        goal{
          goal_id
          target
        }
      }
    }
  `

  async function updateGoal (action) {
    let token = await fetchAPIToken()
    let duration = action[GOAL_ENTITIES.DURATION]
    let ql = new client(token)
    let m = moment()
    m.add(duration, 'y')
    let endDate = m.format('YYYY-MM-DD')
    return ql.client.mutate(
      {
        mutation,
        variables: {
          userID: action[USER_ENTITIES.USER_ID],
          childID: action[CHILD_ENTITIES.CHILD_ID],
          goalID: action[GOAL_ENTITIES.GID],
          target: action[GOAL_ENTITIES.GOAL_AMOUNT],
          portfolioRisk: action[GOAL_ENTITIES.PORTFOLIO_RISK],
          endDate: endDate
        }
      })
  }

  return {
    updateGoal
  }
}

export const goalQuery = () => {
  let foo = () => gql`
      mutation ($userID: String!, $childID : String!, $name : String!){
         create_goal(
          input:{
            client_id:"macbook pro",
            user_id: $userID,
            sprout_id: $childID,
            goal:{
              name: $name
            }
          }
        ) {
          goal {
            goal_id
            name
            sprout{
              sprout_id
            }
          }
        }
      }
    `

  async function addCustomGoal (action) {
    let token = await fetchAPIToken()
    let ql = new client(token)
    let mutation = foo()
    return ql.client.mutate(
      {
        mutation,
        variables: {
          userID: action[GOAL_ENTITIES.USER_ID],
          childID: action[GOAL_ENTITIES.CID],
          name: action[GOAL_ENTITIES.NAME]
        }
      })
  }

  return {
    addCustomGoal
  }
}

export const makeGoalQuery = () => {
  let foo = () => gql`
      mutation ($userID: String!, $childID : String!, $name : String!, $portfolioRisk: String!, $target: String, $endDate: String, $pathID: String){
         create_goal(
          input:{
            client_id:"macbook pro",
            user_id: $userID,
            sprout_id: $childID,
            goal:{
              name: $name,
              target: $target,
              current_portfolio_id: $portfolioRisk,
              end_date: $endDate,
              path_id: $pathID
            }
          }
        ) {
          goal {
            goal_id
            name
            target
            current_portfolio_id
            end_date
            path_id
            path_locked
            sprout{
              sprout_id
            }
          }
        }
      }
    `

  async function makeGoal (action) {
    let token = await fetchAPIToken()
    let ql = new client(token)
    let mutation = foo()

    let duration = action[GOAL_ENTITIES.DURATION]
    let endDate
    if (duration) {
      let m = moment()
      m.add(duration, 'y')
      endDate = m.format('YYYY-MM-DD')
    }
    return ql.client.mutate(
      {
        mutation,
        variables: {
          userID: action[GOAL_ENTITIES.USER_ID],
          childID: action[GOAL_ENTITIES.CID],
          name: action[GOAL_ENTITIES.NAME],
          portfolioRisk: action[GOAL_ENTITIES.PORTFOLIO_RISK],
          target: action[GOAL_ENTITIES.GOAL_AMOUNT] || undefined,   // optional
          endDate: endDate || undefined,  // optional
          pathID: action[INVESTMENT_ENTITIES.INVESTMENT_PATH_ID] || undefined   // optional
        }
      })
  }

  return {
    makeGoal
  }
}

export const fetchGoalDetail = () => {
  let query = gql`
    query ($userID: String!, $goalID: String!){
    goal_detail(user_id: $userID, goal_id: $goalID) {
      goal_id
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
    last_updated_time
    }
  }
  `

  async function fetchGoalDetail (action) {
    let token = await fetchAPIToken()
    let ql = new detailClient(token).client
    return ql.query(
      {
        query,
        variables: {
          userID: action[USER_ENTITIES.USER_ID],
          goalID: action[GOAL_ENTITIES.GID]
        }
      })
  }

  return {
    fetchGoalDetail
  }
}

export const fetchRecurringInvestmentData = () => {
  let query = gql`
    query ($userID: String!){
    user(userid: $userID) {
      userid
      sprout {
        sproutid
        firstname
        goal{
          goalid
          name
          recurringinvestmentamount
          recurringinvestmentfrequency
          initialtransferdate
        }
      }
    }
  }
  `

  const fetchData = (action) => {
    return client.query(
      {
        query,
        variables: {
          userID: action[USER_ENTITIES.USER_ID]
        }
      })
  }

  return {
    fetchData
  }
}

export const fetchUserTransfers = () => {
  let query = gql`
    query ($userID: String!){
    user_transfers(user_id: $userID) {
      user_id
      transfer_reference_id
      sprout_id
      goal_id
      amount
      frequency
      type
      transfer_status
      next_transfer_date
      transactions {
        individual_transfer_id
        individual_transfer_request_time
        individual_transfer_amount
        individual_transfer_status
      }
    }
  }
  `

  async function fetchUserTransfers (action) {
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
    fetchUserTransfers
  }
}
