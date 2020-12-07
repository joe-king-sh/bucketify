/* Messages tempalte master. */

// validation error
export const msgRequiredValueEmpty = ({requiredValue}:{requiredValue: string}) => `Enter ${requiredValue}.`;

// s3 error message
export const msgInValidAccessKey = () => `Check your access key is correct.`;
export const msgSignatureDoesNotMatch = () => `The request signature we calculated does not match the signature you provided. \n Check your secret access key is correct.`;
export const msgNetworkingError = () => `Check s3 bucket name is exists.`;
