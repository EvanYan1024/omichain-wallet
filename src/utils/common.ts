import { customAlphabet } from 'nanoid';


export const getCustomNaNoId = (): string => {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
    return nanoid();
  };