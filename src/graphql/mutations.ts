/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
