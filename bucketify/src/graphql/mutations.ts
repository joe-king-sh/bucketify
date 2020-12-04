/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      owner
      createdAt
      updatedAt
    }
  }
`;
export const createAudioMetaData = /* GraphQL */ `
  mutation CreateAudioMetaData(
    $input: CreateAudioMetaDataInput!
    $condition: ModelAudioMetaDataConditionInput
  ) {
    createAudioMetaData(input: $input, condition: $condition) {
      id
      dataType
      dataValue
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateAudioMetaData = /* GraphQL */ `
  mutation UpdateAudioMetaData(
    $input: UpdateAudioMetaDataInput!
    $condition: ModelAudioMetaDataConditionInput
  ) {
    updateAudioMetaData(input: $input, condition: $condition) {
      id
      dataType
      dataValue
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deleteAudioMetaData = /* GraphQL */ `
  mutation DeleteAudioMetaData(
    $input: DeleteAudioMetaDataInput!
    $condition: ModelAudioMetaDataConditionInput
  ) {
    deleteAudioMetaData(input: $input, condition: $condition) {
      id
      dataType
      dataValue
      owner
      createdAt
      updatedAt
    }
  }
`;
