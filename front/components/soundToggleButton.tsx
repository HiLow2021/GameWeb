import { IconButton } from '@mui/material';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import SoundStateContext from '../contexts/soundStateContext';
import { getSvgSize } from '../shared/utility/componentUtility';

const SoundToggleButton = (): JSX.Element => {
    const { width, height } = getSvgSize();

    const { currentSoundState, changeSoundState } = useContext(SoundStateContext);
    const imageSource = currentSoundState ? '/volume-on.svg' : '/volume-off.svg';

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return mounted ? (
        <>
            <IconButton aria-label="sound-toggle-button" onClick={changeSoundState}>
                <Image width={width} height={height} src={imageSource} />
            </IconButton>
        </>
    ) : (
        <></>
    );
};

export default SoundToggleButton;
