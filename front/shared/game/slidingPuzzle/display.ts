export type Display = typeof Display[keyof typeof Display];

export const Display = {
    image: 'image',
    number: 'number'
} as const;
