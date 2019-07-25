/* eslint-disable no-undef,no-trailing-spaces */
/**
 * Created by Anita on 29/6/18.
 */

import {environmentVariable} from '../Config/AppConfig'
import {fetchAPIToken} from '../Sagas/AuthSaga'

export async function productsAPI (action) {
  const token = await fetchAPIToken()

  var myHeaders = new Headers()
  myHeaders.append('Authorization', token)

  var myInit = { method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default' }

  return fetch(environmentVariable.PRODUCTS, myInit).then(response => response.json())
}
