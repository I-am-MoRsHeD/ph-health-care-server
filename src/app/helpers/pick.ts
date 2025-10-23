

export const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
    const finalObject: Partial<T> = {};

    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObject[key] = obj[key];
        }
    };

    return finalObject;
}

// export const pick = (obj: Record<string, unknown>, keys: string[]): Record<string, unknown> => {
//     const finalObject: Record<string, unknown> = {};

//     for (const key of keys) {
//         if (obj && Object.hasOwnProperty.call(obj, key)) {
//             finalObject[key] = obj[key];
//         }
//     };

//     return finalObject;
// }