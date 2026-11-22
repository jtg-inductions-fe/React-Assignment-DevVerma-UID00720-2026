import { Alert, Snackbar } from '@mui/material';

interface AlertSnackbarProps {
    open: boolean;
    message: string | null;
    onClose: () => void;
    severity?: 'error' | 'warning' | 'info' | 'success';
    autoHideDuration?: number;
}

export const AlertSnackbar = ({
    open,
    message,
    onClose,
    severity = 'error',
    autoHideDuration = 6000,
}: AlertSnackbarProps) => (
    <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <Alert
            onClose={onClose}
            severity={severity}
            variant="filled"
            sx={{ width: '100%' }}
        >
            {message ?? 'unexpected error'}
        </Alert>
    </Snackbar>
);
