/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAudioMetaData = /* GraphQL */ `
  query GetAudioMetaData($id: ID!, $dataType: String!) {
    getAudioMetaData(id: $id, dataType: $dataType) {
      id
      dataType
      dataValue
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listAudioMetaDatas = /* GraphQL */ `
  query ListAudioMetaDatas(
    $id: ID
    $dataType: ModelStringKeyConditionInput
    $filter: ModelAudioMetaDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAudioMetaDatas(
      id: $id
      dataType: $dataType
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        dataType
        dataValue
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listAudioByDataValue = /* GraphQL */ `
  query ListAudioByDataValue(
    $dataValue: String
    $dataType: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAudioMetaDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAudioByDataValue(
      dataValue: $dataValue
      dataType: $dataType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dataType
        dataValue
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listAudioByOwner = /* GraphQL */ `
  query ListAudioByOwner(
    $owner: String
    $dataType: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAudioMetaDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAudioByOwner(
      owner: $owner
      dataType: $dataType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dataType
        dataValue
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
