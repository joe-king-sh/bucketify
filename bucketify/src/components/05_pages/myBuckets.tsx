import React from 'react';
import LoginRequiredWrapper from '../04_templates/loginRequiredWrapper';

const MyBuckets: React.FC = () => {
    const conponents = <h1>My Buckets</h1>
    return (
        <LoginRequiredWrapper children={conponents} />
           
    );
}

export default MyBuckets