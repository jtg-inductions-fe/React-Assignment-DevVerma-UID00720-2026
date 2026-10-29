import type { Theme } from '@mui/material/styles';
import type {
    TypographyOptions,
    TypographyUtils,
} from '@mui/material/styles/createTypography';

import { HTML_FONT_SIZE } from '@constant';

const typographyUtil: TypographyUtils = {
    pxToRem: (px: number) => `${px / HTML_FONT_SIZE}rem`,
};

const typographyStyle = (theme: Theme): TypographyOptions => ({
    fontFamily: 'Inter',
    htmlFontSize: HTML_FONT_SIZE,

    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
        fontSize: typographyUtil.pxToRem(28),
        fontWeight: 700,
        lineHeight: typographyUtil.pxToRem(36),

        [theme.breakpoints.up('sm')]: {
            fontSize: typographyUtil.pxToRem(36),
            lineHeight: typographyUtil.pxToRem(44),
        },

        [theme.breakpoints.up('md')]: {
            fontSize: typographyUtil.pxToRem(48),
            lineHeight: typographyUtil.pxToRem(62),
        },
    },

    h2: {
        fontSize: typographyUtil.pxToRem(24),
        fontWeight: 700,
        lineHeight: typographyUtil.pxToRem(32),

        [theme.breakpoints.up('sm')]: {
            fontSize: typographyUtil.pxToRem(30),
            lineHeight: typographyUtil.pxToRem(40),
        },
    },

    h3: {
        fontSize: typographyUtil.pxToRem(20),
        fontWeight: 700,
        lineHeight: typographyUtil.pxToRem(28),

        [theme.breakpoints.up('sm')]: {
            fontSize: typographyUtil.pxToRem(24),
            lineHeight: typographyUtil.pxToRem(32),
        },
    },

    h4: {
        fontSize: typographyUtil.pxToRem(18),
        fontWeight: 700,
        lineHeight: typographyUtil.pxToRem(26),

        [theme.breakpoints.up('sm')]: {
            fontSize: typographyUtil.pxToRem(20),
            lineHeight: typographyUtil.pxToRem(28),
        },
    },

    subtitle1: {
        fontSize: typographyUtil.pxToRem(16),
        fontWeight: 400,
        lineHeight: typographyUtil.pxToRem(24),
    },

    subtitle2: {
        fontSize: typographyUtil.pxToRem(14),
        fontWeight: 500,
        lineHeight: typographyUtil.pxToRem(20),
    },

    button: {
        fontSize: typographyUtil.pxToRem(14),
        fontWeight: 500,
        lineHeight: typographyUtil.pxToRem(20),
        textTransform: 'none',
    },

    caption: {
        fontSize: typographyUtil.pxToRem(12),
        fontWeight: 300,
        lineHeight: typographyUtil.pxToRem(16),
    },
});

export const typography = { typographyStyle, typographyUtil };
