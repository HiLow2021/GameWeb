export type ResultCode = typeof ResultCode[keyof typeof ResultCode];

export const ResultCode = {
    Succeeded: 'succeeded',

    Failed: 'failed'
} as const;
