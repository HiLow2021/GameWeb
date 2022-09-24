import { useEffect, useState } from 'react';
import SoundStateContext from '../contexts/soundStateContext';

const soundStateKey = 'soundState';

const SoundStateProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [soundState, setSoundState] = useState(true);
    const soundStateValue = {
        currentSoundState: soundState,
        changeSoundState: () => {
            setSoundState((prevSoundState) => {
                localStorage.setItem(soundStateKey, String(!prevSoundState));

                return !prevSoundState;
            });
        }
    };

    useEffect(() => {
        if (localStorage.getItem(soundStateKey) === 'true') {
            setSoundState(() => true);
        } else {
            localStorage.setItem(soundStateKey, 'false');
            setSoundState(() => false);
        }

        if (typeof window !== 'undefined') {
            const onStorageUpdate = (e: StorageEvent) => {
                const { key, newValue } = e;
                if (key === soundStateKey && (newValue === 'true' || newValue === 'false')) {
                    setSoundState(() => newValue === 'true');
                }
            };

            window.addEventListener('storage', onStorageUpdate);
            return () => {
                window.removeEventListener('storage', onStorageUpdate);
            };
        }
    }, []);

    return <SoundStateContext.Provider value={soundStateValue}>{children}</SoundStateContext.Provider>;
};

export default SoundStateProvider;
