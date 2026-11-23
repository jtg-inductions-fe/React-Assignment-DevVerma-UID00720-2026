import {
    Article as ArticleIcon,
    BusinessOutlined as BusinessOutlinedIcon,
    CalendarTodayOutlined as CalendarTodayOutlinedIcon,
    GitHub as GitHubIcon,
    LocationOnOutlined as LocationOnOutlinedIcon,
    MailOutline as MailOutlineIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Stack,
    Typography,
} from '@mui/material';

import { type GitHubUser } from '@api';
import { StatCard } from '@components';

interface UserProfileProps {
    user: GitHubUser;
}

export const UserProfile = (props: UserProfileProps) => {
    const { user } = props;

    const profileDetails = [
        {
            label: 'Location',
            value: user.location,
            icon: <LocationOnOutlinedIcon fontSize="small" />,
        },
        {
            label: 'Company',
            value: user.company,
            icon: <BusinessOutlinedIcon fontSize="small" />,
        },
        {
            label: 'Email',
            value: user.email,
            icon: <MailOutlineIcon fontSize="small" />,
        },
        {
            label: 'Blog',
            value: user.blog,
            icon: <ArticleIcon fontSize="small" />,
        },
    ];

    const joinedDate = user.created_at
        ? (() => {
              const date = new Date(user.created_at);
              return isNaN(date.getTime())
                  ? null
                  : date.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                    });
          })()
        : null;

    const stats = [
        { label: 'Followers', value: user.followers },
        { label: 'Following', value: user.following },
        { label: 'Repositories', value: user.public_repos },
        { label: 'Gists', value: user.public_gists },
    ];

    return (
        <Card
            variant="outlined"
            sx={{
                width: '100%',
                maxWidth: 850,
                mx: 'auto',
                borderRadius: 3,
                p: { xs: 3, sm: 4 },
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ xs: 'center', sm: 'flex-start' }}
            >
                <Avatar
                    src={user.avatar_url}
                    alt={user.login}
                    sx={{
                        width: { xs: 120, sm: 150 },
                        height: { xs: 120, sm: 150 },
                        border: 1,
                        borderColor: 'divider',
                    }}
                />

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        width: '100%',
                        textAlign: { xs: 'center', sm: 'left' },
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        alignItems="center"
                        justifyContent={{ xs: 'center', sm: 'flex-start' }}
                    >
                        <Typography variant="h4" fontWeight={700}>
                            {user.name || user.login}
                        </Typography>

                        <Chip
                            label={user.type}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Stack>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        fontWeight={400}
                        sx={{ mt: 0.5 }}
                    >
                        @{user.login}
                    </Typography>

                    {user.bio && (
                        <Typography
                            variant="body1"
                            sx={{ mt: 2, lineHeight: 1.7 }}
                        >
                            {user.bio}
                        </Typography>
                    )}

                    <Button
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        startIcon={<GitHubIcon />}
                        sx={{
                            mt: 2.5,
                            textTransform: 'none',
                            borderRadius: 2,
                        }}
                    >
                        View GitHub Profile
                    </Button>
                </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(4, 1fr)',
                    },
                    gap: 2,
                }}
            >
                {stats.map((stat) => (
                    <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                    />
                ))}
            </Box>

            {(profileDetails.some((detail) => detail.value) || joinedDate) && (
                <>
                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        About
                    </Typography>

                    <Stack spacing={2}>
                        {profileDetails.map(
                            (detail) =>
                                detail.value && (
                                    <Stack
                                        key={detail.label}
                                        direction="row"
                                        spacing={1.5}
                                        alignItems="center"
                                    >
                                        <Box color="text.secondary">
                                            {detail.icon}
                                        </Box>

                                        <Typography variant="body2">
                                            {detail.value}
                                        </Typography>
                                    </Stack>
                                ),
                        )}

                        {joinedDate && (
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                            >
                                <CalendarTodayOutlinedIcon
                                    fontSize="small"
                                    color="action"
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Joined GitHub in {joinedDate}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </>
            )}
        </Card>
    );
};
