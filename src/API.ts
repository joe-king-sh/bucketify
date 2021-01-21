/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAudioMetaDataInput = {
  id?: string | null,
  dataType: string,
  dataValue: string,
  owner: string,
};

export type ModelAudioMetaDataConditionInput = {
  dataValue?: ModelStringInput | null,
  and?: Array< ModelAudioMetaDataConditionInput | null > | null,
  or?: Array< ModelAudioMetaDataConditionInput | null > | null,
  not?: ModelAudioMetaDataConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateAudioMetaDataInput = {
  id: string,
  dataType: string,
  dataValue?: string | null,
  owner?: string | null,
};

export type DeleteAudioMetaDataInput = {
  id: string,
  dataType: string,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelAudioMetaDataFilterInput = {
  id?: ModelIDInput | null,
  dataType?: ModelStringInput | null,
  dataValue?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelAudioMetaDataFilterInput | null > | null,
  or?: Array< ModelAudioMetaDataFilterInput | null > | null,
  not?: ModelAudioMetaDataFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type CreateAudioMetaDataMutationVariables = {
  input: CreateAudioMetaDataInput,
  condition?: ModelAudioMetaDataConditionInput | null,
};

export type CreateAudioMetaDataMutation = {
  createAudioMetaData:  {
    __typename: "AudioMetaData",
    id: string,
    dataType: string,
    dataValue: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAudioMetaDataMutationVariables = {
  input: UpdateAudioMetaDataInput,
  condition?: ModelAudioMetaDataConditionInput | null,
};

export type UpdateAudioMetaDataMutation = {
  updateAudioMetaData:  {
    __typename: "AudioMetaData",
    id: string,
    dataType: string,
    dataValue: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAudioMetaDataMutationVariables = {
  input: DeleteAudioMetaDataInput,
  condition?: ModelAudioMetaDataConditionInput | null,
};

export type DeleteAudioMetaDataMutation = {
  deleteAudioMetaData:  {
    __typename: "AudioMetaData",
    id: string,
    dataType: string,
    dataValue: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetAudioMetaDataQueryVariables = {
  id: string,
  dataType: string,
};

export type GetAudioMetaDataQuery = {
  getAudioMetaData:  {
    __typename: "AudioMetaData",
    id: string,
    dataType: string,
    dataValue: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAudioMetaDatasQueryVariables = {
  id?: string | null,
  dataType?: ModelStringKeyConditionInput | null,
  filter?: ModelAudioMetaDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAudioMetaDatasQuery = {
  listAudioMetaDatas:  {
    __typename: "ModelAudioMetaDataConnection",
    items:  Array< {
      __typename: "AudioMetaData",
      id: string,
      dataType: string,
      dataValue: string,
      owner: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type ListAudioByDataValueQueryVariables = {
  dataValue?: string | null,
  dataType?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAudioMetaDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAudioByDataValueQuery = {
  listAudioByDataValue:  {
    __typename: "ModelAudioMetaDataConnection",
    items:  Array< {
      __typename: "AudioMetaData",
      id: string,
      dataType: string,
      dataValue: string,
      owner: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type ListAudioByOwnerQueryVariables = {
  owner?: string | null,
  dataType?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAudioMetaDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAudioByOwnerQuery = {
  listAudioByOwner:  {
    __typename: "ModelAudioMetaDataConnection",
    items:  Array< {
      __typename: "AudioMetaData",
      id: string,
      dataType: string,
      dataValue: string,
      owner: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateAudioMetaDataSubscriptionVariables = {
  owner: string,
};

export type OnCreateAudioMetaDataSubscription = {
  onCreateAudioMetaData:  {
    __typename: "AudioMetaData",
    id: string,
    dataType: string,
    dataValue: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAudioMetaDataSubscriptionVariables = {
  owner: string,
};

export type OnUpdateAudioMetaDataSubscription = {
  onUpdateAudioMetaData:  {
    __typename: "AudioMetaData",
    id: string,
    dataType: string,
    dataValue: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAudioMetaDataSubscriptionVariables = {
  owner: string,
};

export type OnDeleteAudioMetaDataSubscription = {
  onDeleteAudioMetaData:  {
    __typename: "AudioMetaData",
    id: string,
    dataType: string,
    dataValue: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
