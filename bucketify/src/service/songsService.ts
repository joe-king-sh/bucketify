// import React, { useState, useContext } from 'react';
// import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// Graphql
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { listAudioByDataValue, listAudioMetaDatas } from '../graphql/queries';
import { GraphQLResult } from '@aws-amplify/api/lib/types';
import {
  ListAudioMetaDatasQuery,
//   ListAudioMetaDatasQueryVariables,
  ListAudioByDataValueQuery,
  ListAudioByDataValueQueryVariables,
  //   ModelStringKeyConditionInput,
} from '../API';

// Service classes
// import { TAudioMetaDataDynamodb } from './scanBucketService';

import awsExports from '../aws-exports';

// Amplify Init
Amplify.configure(awsExports);

// Typing
export interface FetchAudiosInput {
  username: string;
  limit: number;
  nextToken?: string;
}
export type FetchAudioMetaDataByAudioIdOutput = {
    id: string;
    title: string;
    album: string;
    artist: string;
    track: number;
    genre: string;
    owner: string;
    accessKey: string;
    secretAccessKey: string;
    s3BucketName: string;
    s3ObjectKey: string;
  } | undefined
export type FetchAudioOutput = FetchAudioMetaDataByAudioIdOutput[];

export const fetchAudiosAsync: (props: FetchAudiosInput) => Promise<FetchAudioOutput> = async ({
  username,
  limit,
  nextToken,
}) => {
  // Fetch audio id by username
  const audioIds: string[] = await fetchAudioIdByUserIdAsync({
    username: username,
    limit: limit,
    nextToken: nextToken,
  });

  // Fetch audio metadata by audio id
  const audioMetaDatas: FetchAudioOutput = [];
  for (const audioId of audioIds) {
    const audioMetaData = await fetchAudioMetaDataByAudioId(audioId);
    audioMetaDatas.push(audioMetaData);
  }

  return audioMetaDatas;
};

export const fetchAudioMetaDataByAudioId: (
  audioId: string
) => Promise<FetchAudioMetaDataByAudioIdOutput> = async (audioId) => {
  const searchCondition = { id: audioId };
  const audioMetadataByAudioId = (await API.graphql(
    graphqlOperation(listAudioMetaDatas, searchCondition)
  )) as GraphQLResult;
  const listAudioMetaDataResponse = audioMetadataByAudioId.data as ListAudioMetaDatasQuery;

  // Type guard
  if (
    listAudioMetaDataResponse === null ||
    listAudioMetaDataResponse.listAudioMetaDatas === null ||
    listAudioMetaDataResponse.listAudioMetaDatas.items === null ||
    listAudioMetaDataResponse.listAudioMetaDatas.items.length > 0
  ) {
    console.info('No audio metadata was fetched. ');
    return;
  }

  const listAudioMetaData: FetchAudioMetaDataByAudioIdOutput = {
    id: audioId,
    title: '',
    album: '',
    artist: '',
    track: 0,
    genre: '',
    owner: '',
    accessKey: '',
    secretAccessKey: '',
    s3BucketName: '',
    s3ObjectKey: '',
  };

  listAudioMetaDataResponse.listAudioMetaDatas.items.forEach((item) => {
    if (item !== null) {
      const dataType = item.dataType as
        | 'title'
        | 'album'
        | 'artist'
        | 'track'
        | 'genre'
        | 'owner'
        | 'accessKey'
        | 'secretAccessKey'
        | 's3BucketName'
        | 's3ObjectKey';
      let dataValue = item.dataValue as never;
      if (dataType === 'track' && dataValue) {
        listAudioMetaData[dataType] = Number(item.dataValue);
        //   }else if (dataType === 'genre' && dataValue)){
        //     listAudioMetaData[dataType]
      } else {
        listAudioMetaData[dataType] = dataValue;
      }
    }
  });

  return listAudioMetaData;

};

export const fetchAudioIdByUserIdAsync: (props: FetchAudiosInput) => Promise<string[]> = async ({
  username,
  limit,
  nextToken,
}) => {
  const audioIds: string[] = [];

  // Get audioId by userName
  const searchCondition: ListAudioByDataValueQueryVariables = {
    dataValue: username,
    dataType: { eq: 'owner' },
    limit: limit,
    nextToken: nextToken ? nextToken : null,
  };
  const audioIdByUserId = (await API.graphql(
    graphqlOperation(listAudioByDataValue, searchCondition)
  )) as GraphQLResult;
  const audioIdByUserIdData = audioIdByUserId.data as ListAudioByDataValueQuery;

  // Type guard
  if (
    audioIdByUserIdData === null ||
    audioIdByUserIdData.listAudioByDataValue === null ||
    audioIdByUserIdData.listAudioByDataValue.items === null
  ) {
    console.info('Fetch audio id by userid result is nothing.');
    return audioIds;
  }

  audioIdByUserIdData.listAudioByDataValue.items.forEach((item) => {
    if (item !== null) {
      console.log(item.id);
      audioIds.push(item.id);
    }
  });

  return audioIds;
};
