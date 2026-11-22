import { Box, Card, CardContent, Typography } from '@mui/material';

import { type GitHubUser } from '@api';
import { UserInfo } from '@components';

interface UserResultsCardProps {
    users: GitHubUser[];
    hasSearched: boolean;
}

export const UserResultsCard = (props: UserResultsCardProps) => {
    const { users, hasSearched } = props;

    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                maxWidth: 750,
                mx: 'auto',
                mt: 5,
            }}
        >
            <CardContent
                sx={{
                    p: 2,
                    '&:last-child': {
                        pb: 2,
                    },
                }}
            >
                {!hasSearched ? (
                    <Typography
                        color="text.secondary"
                        align="center"
                        sx={{ py: 3 }}
                    >
                        Search for GitHub users by their username to see
                        results.
                    </Typography>
                ) : users.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        align="center"
                        sx={{ py: 3 }}
                    >
                        No users found. Try searching with another username.
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            maxHeight: 264,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            pr: 1,
                        }}
                    >
                        {users.map((user) => (
                            <UserInfo key={user.id} user={user} />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};
