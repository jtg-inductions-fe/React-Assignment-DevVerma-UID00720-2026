import type { Components } from '@mui/material/styles';

import InterRegularTTF from '@assets/fonts/inter/inter-regular.ttf';
import InterRegularWOFF2 from '@assets/fonts/inter/inter-regular.woff2';

const fontFaceDeclarations = `
    @font-face {
        font-display: swap;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url(${InterRegularWOFF2}) format('woff2'),
             url(${InterRegularTTF}) format('truetype');
    }
`;

export const components: Components = {
    MuiCssBaseline: {
        styleOverrides: `
            ${fontFaceDeclarations}

            html {
                font-size: 62.5%;
            }
        `,
    },
};
