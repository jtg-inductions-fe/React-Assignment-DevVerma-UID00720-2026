import type { PaletteOptions } from '@mui/material/styles';

import { COLORS } from '@constants';

export const palette: PaletteOptions = {
    primary: {
        main: COLORS.PRIMARY,
    },
    secondary: {
        main: COLORS.SECONDARY,
    },
    error: {
        main: COLORS.ERROR,
    },
    background: {
        paper: COLORS.BACKGROUND,
    },
};
