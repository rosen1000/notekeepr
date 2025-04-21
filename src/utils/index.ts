import { Dispatch, SetStateAction } from 'react';

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.-]).{6,}$/;
export const passwordLength = 6;

export function set<T, K extends keyof T>(setter: Dispatch<SetStateAction<T>>, key: K, value: T[K]) {
	setter((curr) => ({ ...curr, [key]: value }));
}
