import React, { useContext, useEffect } from 'react';
import { Container, Typography } from '@material-ui/core';

// Context
import { LanguageContext } from '../../App';

// Translation
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  // translation
  const LanguageContextHooks = useContext(LanguageContext);
  const [t, i18n] = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(LanguageContextHooks.languageState);
  }, [LanguageContextHooks.languageState, i18n]);

  return (
    <React.Fragment>
      {/* <GenericTemplate> */}
      {/* <LoginRequiredWrapper isLoginRequired={false}> */}

      <Container>
        <Typography variant="h2" component="h2">
          {t('Not Found')}
        </Typography>
        <br />
        <Typography>
          {t('Not Found Message')
            .split('\n')
            .map((str, index) => (
              <React.Fragment key={index}>
                {str}
                <br />
              </React.Fragment>
            ))}
        </Typography>
      </Container>

      {/* </LoginRequiredWrapper> */}
      {/* </GenericTemplate> */}
    </React.Fragment>
  );
};

export default NotFound;
