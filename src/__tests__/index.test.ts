import { InMemoryDB } from "../database/inMemoryDatabase";
import { runServer } from "../server/app";
import request from "supertest";
import { IUser } from "../models/models";
import { v4 as uuidv4 } from "uuid";
import { handleErrors, HTTPError } from "../helpers/errors";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";
const db = new InMemoryDB();

const server = runServer(db);
const testUser: Omit<IUser, "id"> = {
  username: "Joanna",
  age: 30,
  hobbies: ["piano", "music"],
};
let newUser: IUser;

const app = request(server);

// Test CRUD API methods
test("Get all records - Empty array is expected", async () => {
  db["_users"] = {};

  const response = await app.get("/api/users");

  expect(response.status).toBe(200);
  expect(response.body).toEqual([]);
});

test("A new object is created by a POST api/users request (a response containing the newly created record is expected)", async () => {
  const response = await app.post("/api/users").send(testUser);

  expect(response.status).toBe(201);
  expect(response.body).toEqual({ ...testUser, id: response.body.id });
  newUser = response.body;
});

test("Retrieving a created record by ID with a GET api/user/{userId} request (the created record is expected)", async () => {
  const response = await app.get(`/api/users/${newUser.id}`);

  expect(response.status).toBe(200);
  expect(response.body).toEqual(newUser);
});

test("Updating a created record with a PUT api/users/{userId} request (a response containing an updated object with the same id is expected)", async () => {
  const updatedUser = {
    ...newUser,
    age: 35,
    hobbies: ["piano", "music", "reading"],
  };
  const response = await app.put(`/api/users/${newUser.id}`).send(updatedUser);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedUser);
});

test("Deleting the created object by ID with a DELETE api/users/{userId} request (confirmation of successful deletion is expected)", async () => {
  const response = await app.delete(`/api/users/${newUser.id}`);

  expect(response.statusCode).toBe(204);
});

test("Retrieving a deleted object by ID with a GET api/users/{userId} request (expecting that there is no such object)", async () => {
  const response = await app.get(`/api/users/${newUser.id}`);

  expect(response.status).toBe(404);
  expect(response.body).toEqual(
    `User with id === ${newUser.id} doesn't exist.`
  );
});
// Test errors
const validId = uuidv4();
const invalidId = validId.split("-").join("");

test("Responding with status 404 on non-existing endpoint PATCH request ", async () => {
  const response = await app.patch("/api/users/");
  expect(response.statusCode).toBe(404);
});

test("Responding with 404 error on GET /api/users/:id request with valid id", async () => {
  const response = await app.get(`/api/users/${validId}`);
  expect(response.statusCode).toBe(404);
});

test("Responding with 400 error on GET /api/users/:id request with invalid id", async () => {
  const response = await app.get(`/api/users/${invalidId}`);
  expect(response.statusCode).toBe(400);
});

test("Responding with 404 error on PUT /api/users/:id request with valid id", async () => {
  const response = await app
    .put(`/api/users/${validId}`)
    .send({ username: "Mike" });
  expect(response.statusCode).toBe(404);
});

test("Responding with 400 error on PUT /api/users/:id request with invalid id", async () => {
  const response = await app
    .put(`/api/users/${invalidId}`)
    .send({ username: "Mike" });
  expect(response.statusCode).toBe(400);
});

test("Responding with 404 error on DELETE /api/users/:id request with valid id", async () => {
  const response = await app.delete(`/api/users/${validId}`);
  expect(response.statusCode).toBe(404);
});

test("Responding with 400 error on DELETE /api/users/:id request with invalid id", async () => {
  const response = await app.delete(`/api/users/${invalidId}`);
  expect(response.statusCode).toBe(400);
});

test("Responding with status 500 on internal server error", () => {
  const error = new HTTPError("Something went wrong", 500);
  const response: Partial<ServerResponse<IncomingMessage>> = {
    writeHead: jest.fn(),
    end: jest.fn(),
  };

  handleErrors(error, response as ServerResponse<IncomingMessage>);

  expect(response.writeHead).toHaveBeenCalledWith(500, {
    "Content-Type": "application/json",
  });
  expect(response.end).toHaveBeenCalledWith(
    JSON.stringify("Something went wrong")
  );
});

// Test user data validation
const testUserIncorrect: Omit<IUser, "id"> = {
  username: "",
  age: 2,
  hobbies: ["football", "opera"],
};

test('Responding with 400 error on POST /api/users/ request with the lack of the "username" field', async () => {
  const partialUser: Partial<IUser> = { ...testUser };
  const { username, ...rest } = partialUser;
  const updatedPartialUser: Partial<IUser> = { ...rest };
  const response = await app.post("/api/users/").send(updatedPartialUser);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual(
    "User object does not contain required fields."
  );
});

test('Responding with 400 error on POST /api/users/ request with the empty string in the "username" field', async () => {
  const response = await app.post("/api/users/").send(testUserIncorrect);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual(
    "User object does not contain required fields."
  );
});

test('Responding with 400 error on POST /api/users/ request with the lack of the "hobbies" field', async () => {
  const partialUser: Partial<IUser> = { ...testUser };
  const { hobbies, ...rest } = partialUser;
  const updatedPartialUser: Partial<IUser> = { ...rest };

  const response = await app.post("/api/users/").send(updatedPartialUser);

  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual(
    "User object does not contain required fields."
  );
});

afterAll((done) => {
  server.close(done);
});
