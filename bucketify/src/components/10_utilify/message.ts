/** 
 * Messages tempalte master. 
*/

// validation error
export const msgRequiredValueEmpty = ({ requiredValue }: { requiredValue: string }) => `Enter ${requiredValue}.`;

// s3 error message
export const msgInValidAccessKey = () => `Check your access key is correct.`;
export const msgSignatureDoesNotMatch = () => `The request signature we calculated does not match the signature you provided.  Check your secret access key is correct.`;
export const msgNetworkingError = () => `Check s3 bucket name is exists.
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

export const msgAccessDenied = () => `Need to attach policy to allow ListBucket and GetItem oparation.

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
`
export const msgFileNotFound = () => `No audio file was found.
File extensions that you can use in bucketify are only "mp3","mp4","m4a" .
Please confirm that your object is exists and file extension is allowed.
`


// type TSplitByBreakLine = {
//     children?: ReactNode;
//     text: string;
// }

// export const splitByBreakLine: React.FC<TSplitByBreakLine> = ({text}) => {
//     return(
//         <>
//             {
//                 text.split("").map((line: string, key: number) => {return( <span key={key}>{line}<br /></span>)})
//             }
//         </>
//     )    
// }
