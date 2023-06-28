import { HTTPError } from "../helpers/errors";
import { IncomingMessage, ServerResponse } from "http";
import { getUsers } from "./getUsers";
import { postUsers } from "./postUsers";
import { putUsers } from "./putUsers";
import { IMemoryDB } from "../database/inMemoryDatabase";
const enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
interface IEndpoints {
  [HTTP_METHOD: string]: (
    req: IncomingMessage,
    res: ServerResponse,
    userId: string,
    userDB: IMemoryDB
  ) => void | Promise<unknown>;
}
const endpoints: IEndpoints = {
  [HTTP_METHOD.GET]: getUsers,
  [HTTP_METHOD.POST]: postUsers,
  [HTTP_METHOD.PUT]: putUsers,
  // [HTTP_METHOD.DELETE]: deleteUsers,
};
export const getHandle = (
  method: string | undefined,
  urlArray: string[],
  url: string | undefined
): Function => {
  if (
    method &&
    urlArray[0] === "api" &&
    urlArray[1] === "users" &&
    endpoints[method]
  ) {
    return endpoints[method];
  }
  throw new HTTPError(`Non-existing endpoint ${method} ${url}`, 404);
};
