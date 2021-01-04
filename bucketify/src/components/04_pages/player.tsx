import React, { useState } from 'react';

// Styles
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
// import { useTheme } from '@material-ui/core/styles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

// Template
import PageContainer from '../02_organisms/pageContainer';

// Icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

// Router
import { useHistory } from 'react-router-dom';

// Components
import { Typography } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

// My components
// import MyTypographyH3 from '../01_atoms_and_molecules/myTypographyh3';

// Make custom styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // Back arrow icon
    backArrowIcon: {
      zIndex: 10,
      position: 'absolute',
      top: '5.5rem',
      left: '2rem',
      color: 'white',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    albumTitle: {
      // fontSize: '1rem',
      // fontWeight: 600,
      textAlign: 'center',
      margin: 'auto',
      // margin: 'auto auto 1rem auto',
      maxWidth: '80%',
    },
  })
);

const Player: React.FC = () => {
  const classes = useStyles();
  // const theme = useTheme();
  // const matches = useMediaQuery(theme.breakpoints.up('md'));
  const history = useHistory();

  /**
   *  States used in this component.
   */
  // Whether is fetching data now.
  const [isFetching, setIsFetching] = useState(false);

  // Whether is fetching album cover.
  const [isFetchingAlbumCover, setIsFetchingAlbumCover] = useState(false);

  // Get play list from localstorage.

  return (
    <>
      <PageContainer>
        <ArrowBackIosIcon
          className={classes.backArrowIcon}
          onClick={() => {
            history.goBack();
          }}
        />
        <Typography variant="h5" component="h3" className={classes.albumTitle}>
          Title
        </Typography>

        {isFetchingAlbumCover ? (
          <Skeleton variant="rect" width={210} height={118} />
        ) : (
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEX////Ly8vIyMjNzc3a2trU1NT7+/vy8vLg4ODr6+vX19fMzMz09PTu7u7e3t7R0dHl5eW0uPxiAAAETElEQVR4nO2Z65qjKhAAAxoVvOD7P+1yFxI1kxm/czazVX82G5FQ0jSNc7sBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPynrO0X6P7vUf6EVopXSPHZhi8FLZ9uaO5nmM83lMNpg0n+dsMew7+dbNgPi9pr8GsMWyml2VN8Npymqficr01qXdfpVtPFtuU99W25yfaLth+1dVvyFaNHoqGSQq67DZ4N71Lmn8oxPhnpMX3VVknpvxirTXWQcnuYZXeWVYSOUpkR/+u5v2vniIZaCL3fYMfQbjDpc5NiXMaRCDmXbZOhqR7gKDbDTlaZYIkdCdl0sa24xPD+MLIXhnm4ydCOaLGtusF+KFtvhmLMX66yMFxdUVVeGt2l6S7jY2yEmfrIT6J0qUPllWHWiIY27IY0RLnsG26PsBGFoasoZA7trWcd72zEt2ZuIxp25cqo2DO0UdbGwQYzs81QU0xWZZhH6nrMvzZJuY75ofT5Sd26dor95SXxPVIutZliv8FepmmXOPBoaNdSm67aS0XzzbARKUq0+5wM7ezbPJ4eyvocSpcZ2mHu73p7hvqWkk0wdBORrq5SFuk0G8rFxHl3jbeIcRlulimCl+dzzIWGB+wbrtEpGPaFoZJlztoMhzVO7iLHbU30vvWYgn7X8Jp1uIOSOoxhz9Clf/dtNsyreK5WdGF4C2usc4k4twkBmsW0GJ8Nm2EJfCuVHhu6GkAfG9pYa3cN+0NDu0JvPoqLvBZSVr7HLlH3T2ccjQmGeT882M++aajcNuVUDgxvIdm8Yzj5Ky5xZsM5Xk6JNhn6PT98toaNZxR1ufRDQxVebtgq4sgwJJtnQ3VoaLe4xjl1m2E0chnV/0Ybw9WWuMokw8vW4dBsUaDS2xs5Hxoql16ec6k6yKWDb9Zrd3My7OzczcoyxA7KTKOT4VW5dChKyix4ZuiTTdoPt0Km3tIqQ3uH8btiMnS/E8vZMFNDcfNdmEsNF7/u5gfBU8NJCh1GfitqcS12d3zfbo4mydBsRXW4q9xqYt10leES191cC54aummPz0fngmUS1bqpDd2hYt4MO7d/dJ4Y553MPqkquMhw2dZdJXhu6E82fuR2cuJhx4iqwH0wVGG40bAMaBOu6LRo5nTiuCbTFK+FpaleEZ8bzvlsZ3uQrVLudFcN6MEwEg1NMT3R1uYe2QxqveesYCv5u4mUp5a3DKtZe3jffWrozudx5G04uQpZH6STYbNjWGbgELGWafQdiaIm+PkJeF2O33bvGQ46j3bSOsVkr91I9EPdMWvtA3HR1eHMf6u0LjpedKxNV/c+pBnSpVZvnFfQJ4bDe4Yfxr9huLy3Dj8Ml2mmk7/N/J43wofMn2/4BT7b8PXfgD/ccBmb13y0IQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAj/kDuk4loESEngUAAAAASUVORK5CYII=" />
        )}
      </PageContainer>
    </>
  );
};
export default Player;
