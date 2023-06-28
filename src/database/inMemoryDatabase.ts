import { IUser } from "models/models";
export interface IMemoryDB {
  getAll: () => IUser[];
  get: (userId: string) => IUser | null;
  add: (user: IUser) => IUser;
  update: (userId: string, user: IUser) => IUser | null;
  delete: (userId: string) => IUser | null;
}

export class InMemoryDB implements IMemoryDB {
  constructor() {}
}
