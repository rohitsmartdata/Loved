/* eslint-disable no-undef,no-trailing-spaces */
/**
 * Created by demon on 22/1/18.
 */

import AWS, {environmentVariable} from '../Config/AppConfig'
import {GOAL_ENTITIES} from '../Utility/Mapper/Goal'
import {fetchAPIToken} from '../Sagas/AuthSaga'
import { USER_ENTITIES } from '../Utility/Mapper/User'
import { errorKeywords } from '../Utility/Mapper/Tracking'
import { getAWSSession } from './AWSSession'
import { Sentry }
  from 'react-native-sentry'

export async function settingsAPI (action) {
  const token = await fetchAPIToken()

  var myHeaders = new Headers()
  myHeaders.append('Authorization', token)

  var myInit = { method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default' }

  return fetch(environmentVariable.STATEMENTS, myInit).then(response => response.json())
}

export async function confirmationAPI (action) {
  const token = await fetchAPIToken()

  var myHeaders = new Headers()
  myHeaders.append('Authorization', token)

  var myInit = { method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default' }

  return fetch(environmentVariable.CONFIRMATIONS, myInit).then(response => response.json())
}

export async function disconnectBankAPI (action) {
  const token = await fetchAPIToken()

  var myHeaders = new Headers()
  myHeaders.append('Authorization', token)
  myHeaders.append('Content-Type', 'application/json')

  var myInit = { method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    body: JSON.stringify({action: 'disconnect_bank'}),
    cache: 'default' }

  return fetch(environmentVariable.UTILITY, myInit).then(response => response.json())
}

export async function doTransactionNow (action) {
  const token = await fetchAPIToken()
  var myHeaders = new Headers()
  myHeaders.append('Authorization', token)

  var myInit = { method: 'PUT',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default' }

  return fetch(environmentVariable.TRANSFER_NOW, myInit).then(response => response.json())
}

export async function getPerformanceData (action) {
  const token = await fetchAPIToken()
  let tickerName = action[GOAL_ENTITIES.TICKER_NAME]

  var myHeaders = new Headers()
  myHeaders.append('Authorization', token)
  myHeaders.append('Content-Type', 'application/json')

  let URL = environmentVariable.PERFORMANCE_API + '?tickers=' + tickerName

  var myInit = { method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default' }

  return fetch(URL, myInit).then(response => { console.log('response ---> ', response); return response.json() })
}

export function getChartData (action) {
  let username = action[USER_ENTITIES.EMAIL_ID]
  let tickerName = action[GOAL_ENTITIES.TICKER_NAME]
  return new Promise((resolve, reject) => {
    return getAWSSession(username)
      .then(() => {
        const s3 = new AWS.S3()
        let tickerKey = 'ticker/' + tickerName + '.json'

        const params = {
          Bucket: 'uat2.charts.loved.com',
          Key: tickerKey
        }
        // const ext = data.imageKey.split('.')[1]
        // const typeLevel = imageType[imageType.length - 1]
        s3.getObject(params, (s3Error, response) => {
          if (s3Error != null) {
            // error dispatch, todo
            let errorResponseString = (s3Error && JSON.stringify(s3Error))
            let performanceDataErrorMessage = errorKeywords.PERFORMANCE_DATA_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
            Sentry.captureMessage(performanceDataErrorMessage)   // capture & send message to sentry

            reject(s3Error)
          } else {
            var objectData = response && response.Body.toString('utf-8')
            objectData = JSON.parse(objectData)
            let finalData = objectData.map((graphPoint) => {
              // if (parsedArray[1] === 0) {
              //   return
              // }
              return JSON.parse(graphPoint)
            })
            resolve(finalData)
          }
        })
      })
      .catch((error) => {
        console.log('error in calling fetch statements : ', error)
        // log sentry as an issue
        let responseApiIssue = errorKeywords.PERFORMANCE_DATA_FETCH_ERROR
        Sentry.captureMessage(responseApiIssue)   // capture & send message to sentry
        reject(error)
      })
  })
  // const token = await fetchAPIToken()
  // let tickerName = action[GOAL_ENTITIES.TICKER_NAME]
  // var myHeaders = new Headers()
  // myHeaders.append('Authorization', token)
  // myHeaders.append('Content-Type', 'application/json')
  //
  // let URL = environmentVariable.CHART_DATA + '/' + tickerName + '.json'
  //
  // var myInit = { method: 'GET',
  //   headers: myHeaders,
  //   mode: 'cors',
  //   cache: 'default' }
  //
  // return fetch(URL, myInit).then(response => { console.log('response ---> ', response); return response.json() })
}
