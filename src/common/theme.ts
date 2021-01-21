// materilai-ui
import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';

const makeCustomTheme: (isDarkMode: boolean) => Theme = (isDarkMode: boolean) => {
  const fontFamily = [
    'Noto Sans JP',
    'Lato',
    '游ゴシック Medium',
    '游ゴシック体',
    'Yu Gothic Medium',
    'YuGothic',
    'ヒラギノ角ゴ ProN',
    'Hiragino Kaku Gothic ProN',
    'メイリオ',
    'Meiryo',
    'ＭＳ Ｐゴシック',
    'MS PGothic',
    'sans-serif',
  ].join(',');

  let theme = createMuiTheme({
    typography: {
      fontFamily: fontFamily,
    },
    palette: {
      primary: {
        light: '#4c5869',
        main: '#232f3e',
        dark: '#000518',
        contrastText: '#ffffff',
      },
      secondary: {
        light: '#ff9b41',
        main: '#ff6904',
        dark: '#c43700',
        contrastText: '#000000',
      },
      type: isDarkMode ? 'dark' : 'light',
    },
  });
  theme = responsiveFontSizes(theme);

  return theme;
};

export default makeCustomTheme;
