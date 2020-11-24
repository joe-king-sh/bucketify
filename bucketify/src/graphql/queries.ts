/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncAudioMetaData = /* GraphQL */ `
  query SyncAudioMetaData(
    $filter: ModelAudioMetaDataFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncAudioMetaData(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        dataType
        dataValue1
        dataValue2
        owner
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getAudioMetaData = /* GraphQL */ `
  query GetAudioMetaData($id: ID!) {
    getAudioMetaData(id: $id) {
      id
      dataType
      dataValue1
      dataValue2
      owner
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listAudioMetaDatas = /* GraphQL */ `
  query ListAudioMetaDatas(
    $filter: ModelAudioMetaDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAudioMetaDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        dataType
        dataValue1
        dataValue2
        owner
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
