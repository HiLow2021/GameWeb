import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Site } from '../shared/site';
import { getIconSize } from '../shared/utility/componentUtility';
import { invokeEventTrackingTag } from '../shared/utility/googleUtility';

const HomeButton = (): JSX.Element => {
    const { width, height } = getIconSize();

    const handleClick = async () => {
        invokeEventTrackingTag({
            action: 'menu_developer_click',
            category: 'web',
            label: 'HiLow Web にアクセス'
        });

        await Router.push(Site.developerUrl);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return mounted ? (
        <>
            <IconButton aria-label="home-button" onClick={handleClick}>
                <HomeIcon style={{ color: 'white', width, height }} />
            </IconButton>
        </>
    ) : (
        <></>
    );
};

export default HomeButton;
