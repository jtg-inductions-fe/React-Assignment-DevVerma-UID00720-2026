import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Typography,
} from '@mui/material';

import { type GitHubUser } from '@api/githubApi';

interface UserInfoProps {
    user: GitHubUser;
}

const UserInfo = ({ user }: UserInfoProps) => (
        <Card
            variant="outlined"
            sx={{
                flexShrink: 0,
                borderRadius: 3,
                borderColor: 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 2,
                },
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    '&:last-child': {
                        pb: 2,
                    },
                }}
            >
                <Avatar
                    src={user.avatar_url}
                    alt={user.login}
                    sx={{
                        width: 64,
                        height: 64,
                        border: '2px solid',
                        borderColor: 'divider',
                    }}
                />

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        noWrap
                        sx={{
                            color: 'text.primary',
                        }}
                    >
                        {user.login}
                    </Typography>

                    <Chip
                        label={user.type}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{
                            mt: 0.75,
                            fontWeight: 500,
                            borderRadius: 1.5,
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                        whiteSpace: 'nowrap',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 1,
                        },
                    }}
                >
                    View Profile
                </Button>
            </CardContent>
        </Card>
    );

export default UserInfo;
