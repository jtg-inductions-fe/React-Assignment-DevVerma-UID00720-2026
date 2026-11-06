import type { Components } from '@mui/material/styles';

import InterBold from '@assets/fonts/inter/inter-bold.woff2';
import InterLight from '@assets/fonts/inter/inter-light.woff2';
import InterMedium from '@assets/fonts/inter/inter-medium.woff2';
import InterRegular from '@assets/fonts/inter/inter-regular.woff2';

const fontFaceDeclarations = `
    @font-face {
        font-display: swap;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 300;
        src: url(${InterLight}) format('woff2');
    }

    @font-face {
        font-display: swap;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url(${InterRegular}) format('woff2');
    }

    @font-face {
        font-display: swap;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        src: url(${InterMedium}) format('woff2');
    }

    @font-face {
        font-display: swap;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        src: url(${InterBold}) format('woff2');
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
