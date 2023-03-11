import { atom } from "jotai";

export type FormType = { firstName: string; lastName: string; email: string };

export const formAtom = atom<FormType>({
  firstName: "",
  email: "",
  lastName: "",
});
