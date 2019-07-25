/* eslint-disable padded-blocks,no-unused-vars,no-trailing-spaces,no-undef */
/**
 * Created by victorchoudhary on 15/05/17.
 */

import apisauce
  from 'apisauce'
import {CHILD_ENTITIES}
  from '../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../Utility/Mapper/User'
import {fetchAPIToken} from '../Sagas/AuthSaga'
import { COMMON_ENTITIES } from '../Utility/Mapper/Common'
import { SETTINGS_ENTITIES } from '../Utility/Mapper/Settings'
import { AUTH_ENTITIES } from '../Utility/Mapper/Auth'
import { GOAL_ENTITIES } from '../Utility/Mapper/Goal'
import AWS, {MOCK_URL, environmentVariable, userPool} from '../Config/AppConfig'
import { AsyncStorage } from 'react-native'
import { UserActions } from '../Redux/Reducers/UserReducer'
import { ChildActions } from '../Redux/Reducers/ChildReducer'
import { decodeCredentials, getCredentialLocalKey } from '../Utility/Transforms/Converter'

export const goalAPI = () => {
  const api = apisauce.create({
    baseURL: MOCK_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const addGoal = payload => api.post('/goal/', payload)

  const editGoal = payload => api.post('/goal/edit', payload)

  return {
    addGoal,
    editGoal
  }
}

export const goalChart = () => {
  const api = apisauce.create({
    baseURL: 'https://dev1.charts.lovedwealth.com',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const fetchChart = payload => {
    // const p = '/' + payload[GOAL_ENTITIES.GID] + '.json'
    const p = '/' + '3a00eddc-c7e0-4362-b298-d00e01458c6e' + '.json'
    return api.get(p)
  }

  return {
    fetchChart
  }
}

export async function childStockPerformance (action) {
  const token = await fetchAPIToken()
  const imageType = action[SETTINGS_ENTITIES.IMAGE_TYPE]
  let username = action[AUTH_ENTITIES.EMAIL]
  let userID = action[USER_ENTITIES.USER_ID]

  let childID = action[CHILD_ENTITIES.CHILD_ID]
  let imageKey = 'cognito/lovedwealth/' + userID + '/' + childID + '/prediction.json'

  const credentials = await AsyncStorage.getItem(getCredentialLocalKey(username))
  if (!credentials) { return }
  let finalCredentials = decodeCredentials(credentials)
  let poolDataUAT2 = {
    UserPoolId: environmentVariable.USER_POOL_ID,
    ClientId: environmentVariable.CLIENT_ID,
    IdentityPoolId: environmentVariable.AWS_IDENTITY_POOL_ID
  }

  let authenticationData = {
    Username: finalCredentials[AUTH_ENTITIES.EMAIL],
    Password: finalCredentials[AUTH_ENTITIES.PASSWORD]
  }

  const poolData = poolDataUAT2
  let userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData)
  let authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData)
  let userData = {
    Username: authenticationData.Username,
    Pool: userPool
  }
  let cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData)

  return new Promise((resolve, reject) => {

    return cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        AWS.config.region = environmentVariable.AWS_REGION

        let credentialParams = {
          IdentityPoolId: environmentVariable.AWS_IDENTITY_POOL_ID,
          Logins: {
            [environmentVariable.AWS_LOGIN]: session.idToken.jwtToken
          }
        }

        var credentials = new AWS.CognitoIdentityCredentials(credentialParams)
        credentials.clearCachedId()
        credentials = new AWS.CognitoIdentityCredentials(credentialParams)
        AWS.config.credentials = credentials

        const s3 = new AWS.S3()
        const params = {
          Bucket: 'uat2.charts.loved.com',
          Key: imageKey
        }
        // const ext = imageKey.split('.')[1]
        // const typeLevel = imageType[imageType.length - 1]
        return s3.getObject(params, (s3Error, response) => {

          if (s3Error != null) {
            console.log('err', s3Error)
            // error dispatch, todo
            reject(false)
          } else {
            let jsonResponse = []
            try {
              jsonResponse = JSON.parse(response.Body.toString('utf-8'))
            } catch (e) {
              console.log('Error parsing childStockPerformance data', e)
            }
            resolve(jsonResponse)
          }
        })
      },
      onFailure: (error) => {
        console.log(error)
        reject(false)
      }
    })
  })
}
