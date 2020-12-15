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
  prevNextToken: string;
}
export type FetchAudioMetaDataByAudioIdOutput =
  | {
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
    }
  | undefined;
export type FetchAudioOutput = FetchAudioMetaDataByAudioIdOutput[];

export const fetchAudiosAsync: (
  props: FetchAudiosInput
) => Promise<FetchAudioOutput | (string | string[] | FetchAudioOutput | null)[]> = async ({
  username,
  limit,
  prevNextToken,
}) => {
  // Fetch audio id by username
  const [audioIds, nextToken] = await fetchAudioIdByUserIdAsync({
    username: username,
    limit: limit,
    prevNextToken: prevNextToken,
  });

  // Fetch audio metadata by audio id
  const audioMetaDatas: FetchAudioOutput = [];
  if (audioIds === null) {
    return audioMetaDatas;
  }
  for (const audioId of audioIds) {
    const audioMetaData = await fetchAudioMetaDataByAudioId(audioId);
    audioMetaDatas.push(audioMetaData);
  }

  // return audioMetaData and nextToken
  return [audioMetaDatas, nextToken];
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
      const dataValue = item.dataValue as never;
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

export const fetchAudioIdByUserIdAsync: (
  props: FetchAudiosInput
) => Promise<(string | string[] | null)[]> = async ({ username, limit, prevNextToken }) => {
  console.group('FETCH_AUDIO_ID_BY_USERID');
  const resultAudioIds: string[] = [];

  // Get audioId by userName
  const searchCondition: ListAudioByDataValueQueryVariables = {
    dataValue: username,
    dataType: { eq: 'owner' },
    limit: limit,
    nextToken: prevNextToken ? prevNextToken : null,
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
    return resultAudioIds;
  }

  let resultNextToken: string | null = null;
  if (audioIdByUserIdData.listAudioByDataValue.nextToken) {
    resultNextToken = audioIdByUserIdData.listAudioByDataValue.nextToken;
  }

  audioIdByUserIdData.listAudioByDataValue.items.forEach((item) => {
    if (item !== null) {
      console.log(item.id);
      resultAudioIds.push(item.id);
    }
  });

  console.groupEnd();
  return [resultAudioIds, resultNextToken];
};
