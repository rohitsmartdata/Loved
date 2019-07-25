/**
 * Created by viktor on 31/7/17.
 */

import apisauce
  from 'apisauce'
import {ParameterNotProvided} from '../Utility/Errors'

export const googleAPI = () => {
  const api = apisauce.create({
    baseURL: 'https://maps.googleapis.com/maps/api/place'
  })

  const autocomplete = payload => {
    return api.get('autocomplete/json', {key: 'AIzaSyBY5E1KirN4c7wbMIHLWN-gnFUVr7cjj9I', input: payload.input, types: ['address'], components: 'country:us'})
  }

  const getDetail = payload => {
    let placeid = payload && payload['placeid']
    if (!placeid) {
      throw new ParameterNotProvided('placeid is missing')
    }
    return api.get('details/json', {key: 'AIzaSyBY5E1KirN4c7wbMIHLWN-gnFUVr7cjj9I', placeid: payload.placeid})
  }

  return {
    autocomplete,
    getDetail
  }
}
