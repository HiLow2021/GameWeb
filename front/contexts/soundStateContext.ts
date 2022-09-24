import { createContext } from 'react';

const SoundStateContext = createContext({
    currentSoundState: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    changeSoundState: () => {}
});

export default SoundStateContext;
