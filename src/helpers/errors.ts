import { ServerResponse, STATUS_CODES } from "http";

export class HTTPError extends Error {
  statusCode: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "HTTPError";
    this.statusCode = code;
  }
}

export const handleErrors = (error: unknown, response: ServerResponse) => {
  if (error instanceof Error) {
    const httpError = error as HTTPError;
    response.writeHead(httpError.statusCode, {
      "Content-Type": "application/json",
    });
    response.end(JSON.stringify({ message: httpError.message }));
    return;
  }

  response.writeHead(500, { "Content-Type": "text/plain" });
  response.end(`Internal Server Error`);
};
