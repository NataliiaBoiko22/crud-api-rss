import { IUser } from 'models/models';
import { v4 as uuidv4 } from 'uuid';
export interface IMemoryDB {
  getAll: () => IUser[];
  get: (userId: string) => IUser | null;
  add: (user: IUser) => IUser;
  update: (userId: string, user: IUser) => IUser | null;
  delete: (userId: string) => IUser | null;
}

export class InMemoryDB implements IMemoryDB {
  private _users: { [key: string]: IUser };

  constructor() {
    this._users = {};
  }

  public getAll = () => {
    return Object.values(this._users);
  };

  public get = (userId: string) => {
    const user = this._users[userId];
    if (user) return user;
    return null;
  };

  public add = (user: IUser) => {
    const userId = uuidv4();
    this._users[userId] = { ...user, id: userId };
    return this._users[userId];
  };

  public update = (userId: string, user: IUser) => {
    const updatingUser = this._users[userId];
    if (!updatingUser) return null;
    this._users[userId] = { ...updatingUser, ...user, id: userId };
    return this._users[userId];
  };

  public delete = (userId: string) => {
    const user = this._users[userId];
    if (user) {
      return delete this._users[userId] ? user : null;
    }
    return null;
  };
}
