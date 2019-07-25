/* eslint-disable no-multiple-empty-lines,no-multiple-empty-lines,no-trailing-spaces,key-spacing */
/**
 * Created by demon on 13/7/18.
 */

// ========================================================
// ADD_GOAL Component
// ========================================================

// Entities
export const LEARN_ENTITIES = {

  // ----- BUSINESS entities -----

  CONTENT: 'content',

  MODULE: 'module',
  MODULE_ID: 'moduleID',
  MODULE_NAME: 'moduleName',
  MODULE_BACKDROP: 'moduleBackdrop',
  MODULE_IMAGE: 'moduleImage',
  MODULE_DESCRIPTION: 'moduleDescription',
  MODULE_CONTENT: 'moduleContent',
  MODULE_UPDATED_AT: 'moduleUpdatedAt',
  MODULE_TILE_ONE: 'moduleTileOne',
  MODULE_TILE_TWO: 'moduleTileTwo',

  // ----- Storage specific entities -----


  // ----- UTILITY entities -----

  // are there any error's in goal module functioining
  IS_OK     : 'OK',
  // error related to goal module
  ERROR     : 'ERROR',
  // processing index tag
  PROCESSING: 'PROCESSING',

  PROCESSING_FETCH_MODULES: 'processingFetchModules'
}

// --------------------------------------------------------------------------------
// Path of Entities in STORE

export function path (ENTITIY) {
  switch (ENTITIY) {

    case LEARN_ENTITIES.CONTENT:
      return () => [LEARN_ENTITIES.CONTENT]

    case LEARN_ENTITIES.MODULE_ID:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_ID]
    case LEARN_ENTITIES.MODULE_NAME:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_NAME]
    case LEARN_ENTITIES.MODULE_DESCRIPTION:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_DESCRIPTION]
    case LEARN_ENTITIES.MODULE_CONTENT:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_CONTENT]
    case LEARN_ENTITIES.MODULE_BACKDROP:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_BACKDROP]
    case LEARN_ENTITIES.MODULE_IMAGE:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_IMAGE]
    case LEARN_ENTITIES.MODULE_UPDATED_AT:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_UPDATED_AT]
    case LEARN_ENTITIES.MODULE_TILE_ONE:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_TILE_ONE]
    case LEARN_ENTITIES.MODULE_TILE_TWO:
      return (id) => [LEARN_ENTITIES.CONTENT, id, LEARN_ENTITIES.MODULE_TILE_TWO]

    // ----------------------------------

    case LEARN_ENTITIES.IS_OK:
      return () => ['sanity', LEARN_ENTITIES.IS_OK]

    case LEARN_ENTITIES.ERROR:
      return () => ['sanity', LEARN_ENTITIES.ERROR]

    case LEARN_ENTITIES.PROCESSING:
      return () => ['sanity', LEARN_ENTITIES.PROCESSING]
  }
}
