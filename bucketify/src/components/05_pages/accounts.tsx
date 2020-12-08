import React, { useContext } from 'react';
import {
    UserDataContext,
    IUserDataStateHooks,
} from '../../App'

// import { Typography, Container } from '@material-ui/core';

// Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

// import Paper from '@material-ui/core/Paper';


// Template
import PageContainer from '../03_organisms/pageContainer'


const Accounts: React.FC = () => {

    const UserDataHooks: IUserDataStateHooks = useContext(UserDataContext);

    return (
                <PageContainer
                    h2Text='Account overview'
                    h3Text='Profile'
                >
                    {UserDataHooks.user !== undefined &&

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
                    }
                </PageContainer>
    )
}
export default Accounts