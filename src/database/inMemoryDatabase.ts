import { IUser } from "models/models";
import { v4 as uuidv4 } from "uuid";
export interface IMemoryDB {
  getAll: () => IUser[];
  get: (userId: string) => IUser | null;
  add: (user: IUser) => IUser;
  update: (userId: string, user: IUser) => IUser | null;
  delete: (userId: string) => IUser | null;
}

export class InMemoryDB implements IMemoryDB {
  private _usersStore: { [key: string]: IUser };

  constructor() {
    this._usersStore = {};
  }

  public getAll = () => {
    return Object.values(this._usersStore);
  };

  public get = (userId: string) => {
    const user = this._usersStore[userId];
    if (user) return user;
    return null;
  };

  public add = (user: IUser) => {
    const userId = uuidv4();
    this._usersStore[userId] = { ...user, id: userId };
    return this._usersStore[userId];
  };

  public update = (userId: string, user: IUser) => {
    const updatingUser = this._usersStore[userId];
    if (!updatingUser) return null;
    this._usersStore[userId] = { ...updatingUser, ...user, id: userId };
    return this._usersStore[userId];
  };

  public delete = (userId: string) => {
    const user = this._usersStore[userId];
    if (user) {
      return delete this._usersStore[userId] ? user : null;
    }
    return null;
  };
}
