const request = require("supertest");
const app = require("../server/app");
const User = require("../src/models/user");

const userOne = {
  name: "Daniel",
  email: "DanielTarek3110@gmail.com",
  password: "Daniel@24Tarek",
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should sign up a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Andrew",
      email: "Test02@gmail.com",
      password: "Daniel@24Tarek",
    })
    .expect(201);
});

test("Should login user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not login nonexistent user", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "daniel@hotmail.com",
        password: userOne.password,
      })
      .expect(400);
  });
  
