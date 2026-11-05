import { Box, Card, CardContent, Typography } from '@mui/material';

import { type GitHubUser } from '@api/githubApi';
import UserInfo from '@components/UserInfo/UserInfo';

interface UserResultsCardProps {
    users: GitHubUser[];
    hasSearched: boolean;
}

const UserResultsCard = ({ users, hasSearched }: UserResultsCardProps) => (
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
                    textAlign="center"
                    sx={{ py: 3 }}
                >
                    Search for GitHub users by their username to see results.
                </Typography>
            ) : users.length === 0 ? (
                <Typography
                    color="text.secondary"
                    textAlign="center"
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
                        height: 264,
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

export default UserResultsCard;
