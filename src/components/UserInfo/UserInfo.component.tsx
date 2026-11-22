import { Box, Button } from '@mui/material';

import { type GitHubUser } from '@api';

import {
    StyledAvatar,
    StyledCard,
    StyledCardContent,
    StyledChip,
    StyledLogin,
} from './UserInfo.style';

interface UserInfoProps {
    user: GitHubUser;
}

export const UserInfo = (props: UserInfoProps) => {
    const { user } = props;

    return (
        <StyledCard variant="outlined">
            <StyledCardContent>
                <StyledAvatar src={user.avatar_url} alt={user.login} />

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <StyledLogin variant="subtitle1" fontWeight={700} noWrap>
                        {user.login}
                    </StyledLogin>

                    <StyledChip
                        label={user.type}
                        size="small"
                        variant="outlined"
                        color="primary"
                    />
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${user.login}'s GitHub profile`}
                    sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                    }}
                >
                    View Profile
                </Button>
            </StyledCardContent>
        </StyledCard>
    );
};
