import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { SitePage } from '../shared/sitePage';
import { getIconSize } from '../shared/utility/componentUtility';

const BackButton = (): JSX.Element => {
    const { width, height } = getIconSize();

    const handleClick = async () => {
        await Router.push(SitePage.home.url);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return mounted ? (
        <>
            <IconButton aria-label="home-button" onClick={handleClick}>
                <ArrowBackIcon style={{ color: 'white', width, height }} />
            </IconButton>
        </>
    ) : (
        <></>
    );
};

export default BackButton;
