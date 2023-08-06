export type Turn = typeof Turn[keyof typeof Turn];

export const Turn = {
    Black: 'black',
    White: 'white'
} as const;
