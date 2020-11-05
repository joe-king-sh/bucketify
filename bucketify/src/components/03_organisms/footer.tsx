import React from 'react';
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import { Author } from '../99_common/const'

export const Footer: React.FC = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" to="/">
          {Author}
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  };
