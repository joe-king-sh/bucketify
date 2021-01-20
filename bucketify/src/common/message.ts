/**
 * Messages tempalte master.
 */

// validation error
export const msgRequiredValueEmpty: ({ requiredValue }: { requiredValue: string }) => string = ({
  requiredValue,
}) => `Enter ${requiredValue}.`;

// s3 error message
export const msgInValidAccessKey: () => string = () => `Check your access key is correct.`;
export const msgSignatureDoesNotMatch: () => string = () =>
  `The request signature we calculated does not match the signature you provided.  Check your secret access key is correct.`;
export const msgNetworkingError: () => string = () => `Check s3 bucket name is exists.
Need to allow Cross-Origin Resource Sharing (CORS) setting in your buckets.

Like below:
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET"
        ],
        "AllowedOrigins": [
            "https://bucketify.net"
        ],
        "ExposeHeaders": []
    }
]
CORS setting may take a few minutes to be enabled.
`;

export const msgAccessDenied: () => string = () => `Need to attach policy to allow ListBucket and GetItem oparation.

Like below: 
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:ListBucketVersions",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*",
            ]
        }
    ]
}
`;
export const msgFileNotFound: () => string = () => `No audio file was found.
File extensions that you can use in bucketify are only "mp3","m4a" .
Please confirm that your object is exists and file extension is allowed.
`;

// Progress message
export const msgProgressSearch: ({ bucketName }: { bucketName: string }) => string = ({
  bucketName,
}) => `Searching audio files in ${bucketName}...`;
export const msgProgressDelete: ({ bucketName }: { bucketName: string }) => string = ({
  bucketName,
}) => `Deleting metadata in Bucketify about ${bucketName}...`;
export const msgProgressLoading: ({ audioName }: { audioName: string }) => string = ({
  audioName,
}) =>
  `Now loading... 
${audioName}
`;
export const msgProgressFailed: () => string = () =>
  `An unexpected error has occurred. Please try again. 
If it wouldn't be resolved, please open the issue on GitHub.`;

export const msgScaningSucceeded: () => string = () => `Successfully scanned your bucket.`;

// Tracks
export const msgNoTracksSelected: () => string = () => `Please select tracks at least one.`;

// Common
export const msgUnderConstruction: () => string = () =>
  `This feature is under construction. Coming soon!`;
