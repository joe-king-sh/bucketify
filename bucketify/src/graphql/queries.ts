/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $id: ID
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTodos(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        description
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
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
export const todoByName = /* GraphQL */ `
  query TodoByName(
    $name: String
    $sortDirection: ModelSortDirection
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    todoByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
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
    $sortDirection: ModelSortDirection
    $filter: ModelAudioMetaDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAudioByDataValue(
      dataValue: $dataValue
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
    $sortDirection: ModelSortDirection
    $filter: ModelAudioMetaDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAudioByOwner(
      owner: $owner
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
