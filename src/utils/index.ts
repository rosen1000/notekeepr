import { Dispatch, SetStateAction } from 'react';

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.-]).{6,}$/;
export const passwordLength = 6;

export function set<T extends Record<string, any>, K extends keyof T, V extends T[K]>(
	setter: Dispatch<SetStateAction<T>>,
	key: K,
	value: V
) {
	setter((curr) => ({ ...curr, [key]: value }));
}
