import { useContext } from 'react';
import useSound from 'use-sound';
import SoundStateContext from '../../contexts/soundStateContext';

export const useContextSound = (source: string): (() => void) => {
    const { currentSoundState } = useContext(SoundStateContext);
    const [sound] = useSound(source);
    const contextSound = () => {
        if (currentSoundState) {
            sound();
        }
    };

    return contextSound;
};
