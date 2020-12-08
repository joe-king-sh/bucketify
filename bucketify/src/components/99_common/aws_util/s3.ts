// React
import React from 'react';
// AWS SDK
import { 
    ListObjectsV2Request, 
    ListObjectsV2Output, 
    GetObjectRequest,
    // GetObjectOutput, 
    // GetObjectOutput 
} from 'aws-sdk/clients/s3';

// Message
import { 
    msgInValidAccessKey, 
    msgSignatureDoesNotMatch, 
    msgNetworkingError, 
    msgAccessDenied, 
    // msgFileNotFound
} from '../../99_common/message'

import {TAlert} from '../../03_organisms/alert'


/**
 * Call list object s3 api, and filter result to remain audio files.
 * 
 * @param {AWS.S3} s3
 * @param {string} bucketName
 * @param {React.Dispatch<React.SetStateAction<TAlert[]>>} setAlerts
 * @return Promise()
 */
export const listObjectKeys = async (s3: AWS.S3, bucketName: string, setAlerts: React.Dispatch<React.SetStateAction<TAlert[]>>) => {
    console.group('CALL_LIST_OBJECTS_API')

    // List objects 
    console.info('Start list objects oparation.')
    let keyList: string[] = [];
    try {
        console.group('CALL_API_TRY_STATEMENT')
        for (let continuationToken = null; ;) {
            console.info('ContinuationToken -> ' + continuationToken)

            const params: ListObjectsV2Request = {
                Bucket: bucketName
            };
            if (continuationToken) {
                params.ContinuationToken = continuationToken
            };

            // Call S3 API
            let objects: ListObjectsV2Output = {}
            console.info('Call api start')
            objects = await s3.listObjectsV2(params).promise()
                .then(data => {
                    return data
                })
                .catch(err => {
                    console.error('An error occured when call list objects v2 API.')
                    throw err
                });
            console.info('Call api end')

            // Filter objects to remain only audio metadata
            if (objects.Contents === undefined) {
                break;
            }
            objects.Contents.map(v => v.Key).forEach(key => {
                if (key === undefined) {
                    return;
                }

                // Only allowed in below extensions
                const allowExtentions: Array<string> = ['mp3', 'mp4', 'm4a']
                const periodPosition: number = key.lastIndexOf('.')
                if (periodPosition !== -1) {
                    const extension = key.slice(periodPosition + 1).toLowerCase();
                    if (allowExtentions.indexOf(extension) !== -1) {
                        keyList.push(key);
                    }
                }
            });

            // If the object counts over 1000, isTruncated will be true.
            if (!objects.IsTruncated) {
                console.info('All objects were listed, so the list buckets operation will be finished.')
                break;
            }

            // Save the next read position.
            continuationToken = objects.NextContinuationToken;

        }
        console.table(keyList)
        console.groupEnd()

    } catch (err) {
        console.group('CALL_API_CATCH_STATEMENT')
        let alert: TAlert = { severity: 'error', title: '', description: '' }
        if (err.code === 'InvalidAccessKeyId') {
            alert.title = 'Error - InvalidAccessKeyId'
            alert.description = msgInValidAccessKey()
        } else if (err.code === 'SignatureDoesNotMatch') {
            alert.title = 'Error - SignatureDoesNotMatch'
            alert.description = msgSignatureDoesNotMatch()
        } else if (err.code === 'NetworkingError') {
            alert.title = 'Error - NetworkingError'
            alert.description = msgNetworkingError()
        } else if (err.code === 'AccessDenied') {
            alert.title = 'Error - AccessDenied'
            alert.description = msgAccessDenied()
        } else {
            // An unexpected error
            alert.title = 'Error - ' + err.code
            alert.description = err.message
        }

        setAlerts(prevAlerts => {
            const alerts = [...prevAlerts, alert]
            return alerts
        })
        console.error(err.code)
        console.error(err.message)
        console.error(err)
        console.groupEnd()

        throw err
    }

    console.groupEnd()
    return keyList

}

   // GetItem from dynamodb and expand metadata
   type TAudioMetaData = {
    AudioName: string,
    Artist?: string,
    Album?: string,
}


export const getMetadata = async (s3: AWS.S3, bucketName:string, key: string) => {
    console.group('CALL_GET_OBJECT_API')
    const audioMetaDatas: TAudioMetaData[] = []
    try{

        const params: GetObjectRequest = {
            Bucket: bucketName,
            Key: key
        };

        // let object:GetObjectOutput = {}
        console.info('Call api start')
        const object = s3.getObject(params).promise()
        console.log(object)
        //     .then(data => {
        //         return data
        //     })
        //     .catch(err => {
        //         console.error('An error occured when call get object API.')
        //         throw err
        //     });
        console.info('Call api end')
    }catch(err){

    }

    console.groupEnd()
    return audioMetaDatas
} 
