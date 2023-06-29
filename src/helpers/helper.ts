import { IncomingMessage } from "http";
import { IUser } from "../models/models";

export const checkUserObject = (userObject: object): boolean => {
  const user = userObject as IUser;
  return !!(
    user.username &&
    typeof user.username === "string" &&
    user.age &&
    typeof user.age === "number" &&
    user.hobbies &&
    Array.isArray(user.hobbies)
  );
};

export const getRequestData = (request: IncomingMessage): Promise<object> => {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      try {
        const userObject = JSON.parse(body);
        resolve(userObject as object);
      } catch (error) {
        reject(error);
      }
    });
  });
};
