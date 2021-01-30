import React from 'react';

// Template
import PageContainer from '../02_organisms/pageContainer';

import { Typography } from '@material-ui/core';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <PageContainer h2Text="PrivacyPolicy">
        <Typography variant="body1" component="div">
          Last updated: 2020-01-30
          <br />
          <br />
          We operates http://www.bucketify.net (the "Site"). This page informs you of our policies
          regarding the collection, use and disclosure of Personal Information we receive from users
          of the Site.
          <br />
          <br />
          We use your Personal Information only for providing and improving the Site. By using the
          Site, you agree to the collection and use of information in accordance with this policy.
        </Typography>
        <br />
        <Typography variant="h5" component="h5">
          Information Collection And Use
        </Typography>
        <br />
        <Typography variant="body1" component="div">
          While using our Site, we may ask you to provide us with certain personally identifiable
          information that can be used to contact or identify you. Personally identifiable
          information may include, but is not limited to your name ("Personal Information").
        </Typography>

        <br />
        <Typography variant="h5" component="h5">
          Log Data
        </Typography>
        <br />
        <Typography variant="body1" component="div">
          Like many site operators, we collect information that your browser sends whenever you
          visit our Site ("Log Data").
          <br />
          <br />
          This Log Data may include information such as your computer's Internet Protocol ("IP")
          address, browser type, browser version, the pages of our Site that you visit, the time and
          date of your visit, the time spent on those pages and other statistics.
          <br />
          <br />
          In addition, we may use third party services such as Google Analytics that collect,
          monitor and analyze this …
        </Typography>

        <br />
        <Typography variant="h5" component="h5">
          Communications
        </Typography>
        <br />
        <Typography variant="body1" component="div">
          We may use your Personal Information to contact you with newsletters, marketing or
          promotional materials and other information that ...
        </Typography>

        <br />
        <Typography variant="h5" component="h5">
          Cookies
        </Typography>
        <br />
        <Typography variant="body1" component="div">
          Cookies are files with small amount of data, which may include an anonymous unique
          identifier. Cookies are sent to your browser from a web site and stored on your computer's
          hard drive.
          <br />
          <br />
          Like many sites, we use "cookies" to collect information. You can instruct your browser to
          refuse all cookies or to indicate when a cookie is being sent. However, if you do not
          accept cookies, you may not be able to use some portions of our Site.
        </Typography>

        <br />
        <Typography variant="h5" component="h5">
          Security
        </Typography>
        <br />
        <Typography variant="body1" component="div">
          The security of your Personal Information is important to us, but remember that no method
          of transmission over the Internet, or method of electronic storage, is 100% secure. While
          we strive to use commercially acceptable means to protect your Personal Information, we
          cannot guarantee its absolute security.
        </Typography>

        <br />
        <Typography variant="h5" component="h5">
          Changes To This Privacy Policy
        </Typography>
        <br />
        <Typography variant="body1" component="div">
          This Privacy Policy is effective as of (2020-01-30) and will remain in effect except with
          respect to any changes in its provisions in the future, which will be in effect
          immediately after being posted on this page.
          <br />
          <br />
          We reserve the right to update or change our Privacy Policy at any time and you should
          check this Privacy Policy periodically. Your continued use of the Service after we post
          any modifications to the Privacy Policy on this page will constitute your acknowledgment
          of the modifications and your consent to abide and be bound by the modified Privacy
          Policy.
          <br />
          <br />
          If we make any material changes to this Privacy Policy, we will notify you either through
          the email address you have provided us, or by placing a prominent notice on our website.
          <br />
        </Typography>

        <br />
        <Typography variant="h5" component="h5">
          Contact Us
        </Typography>
        <br />
        <Typography variant="body1" component="div">
          If you have any questions about this Privacy Policy, please contact us.
        </Typography>
      </PageContainer>
    </>
  );
};
export default PrivacyPolicy;
