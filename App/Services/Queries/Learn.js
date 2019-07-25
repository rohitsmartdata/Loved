/* eslint-disable no-unused-vars,new-cap */
/**
 * Created by demon on 13/7/18.
 */

// ========================================================
// Import Packages
// ========================================================

import gql from 'graphql-tag'
import {learnClient} from '../../Config/AppConfig'
import {LEARN_ENTITIES} from '../../Utility/Mapper/Learn'

// ========================================================
// Queries
// ========================================================

export const fetchLearningModules = () => {
  let query = gql`
    query {
      allContents (filter: {isPublished: true}) {
        id
        name
        imagepreview {
          id
          url
        }
        contentheroimage {
          id
          url
        }
        tileTwoDashboard
        tileOneDashboard
        descriptionofcontent
        maincontent
        updatedAt
      }
    }
  `

  async function fetchLearningModules (action) {
    let ql = new learnClient().client
    return ql.query(
      {
        query
      })
  }

  return {
    fetchLearningModules
  }
}

export const fetchGlossary = () => {
  let query = gql`
    query {
      allInformations (filter: {isPublished: true}) {
        id
        infoHeader
        infoBody
        infoType
        updatedAt
      }
    }
  `

  async function fetchGlossary (action) {
    let ql = new learnClient().client
    return ql.query(
      {
        query
      })
  }

  return {
    fetchGlossary
  }
}
