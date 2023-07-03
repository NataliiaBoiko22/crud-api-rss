export interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

export type UserId = string | undefined;
