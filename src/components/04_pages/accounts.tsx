import React, { useContext, useEffect } from 'react';
import { UserDataContext, IUserDataStateHooks } from '../../App';

// import { Typography, Container } from '@material-ui/core';

// Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Context
import { LanguageContext } from '../../App';

// Translation
import { useTranslation } from 'react-i18next';

const Accounts: React.FC = () => {
  const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

  // translation
  const LanguageContextHooks = useContext(LanguageContext);
  const [t, i18n] = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(LanguageContextHooks.languageState);
  }, [LanguageContextHooks.languageState, i18n]);

  return (
    <PageContainer h2Text={t('Account overview')} h3Text={t('Profile')}>
      {UserDataHooks.user !== undefined && (
        <React.Fragment>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <b>Username</b>
                  </TableCell>
                  <TableCell align="right">{UserDataHooks.user.attributes.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <b>Email</b>
                  </TableCell>
                  <TableCell align="right">{UserDataHooks.user.attributes.email}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      )}
    </PageContainer>
  );
};
export default Accounts;
