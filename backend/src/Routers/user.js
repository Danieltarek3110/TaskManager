const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/authentication");
const router = new express.Router();
const multer = require("multer");

const {
  getCurrentUser,
  deleteCurrentUser,
  logoutUser,
  logoutAll,
  getUserById,
  createUser,
  login,
  updateUserById,
  updateCurrentUser,
  deleteUserById,
} = require("../controller/userController");

//Get current user
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user's profile
 *     description: Endpoint to retrieve the profile information of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               username: user123
 *               email: userexample.com
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *         content:
 *           text/plain:
 *             example: Unauthorized
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving user profile.
 */
router.get("/users/me", auth, getCurrentUser);

// DELETE CURRENT USER
/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete the authenticated user
 *     description: Endpoint to delete the profile of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 *       404:
 *         description: Not Found. User with the given ID not found.
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in user deletion.
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.delete("/users/me", auth, deleteCurrentUser);

//LOGOUT
/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout the authenticated user
 *     description: Endpoint to remove the current authentication token and log out the user.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out user.
 *         content:
 *           text/plain:
 *             example: Logout Successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in logging out the user.
 */
router.post("/users/logout", auth, logoutUser);

//LOGOUT of all sessions
/**
 * @swagger
 * /users/logoutAll:
 *   post:
 *     summary: Logout from all sessions
 *     description: Endpoint to remove all authentication tokens and log out the user from all sessions.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out user from all sessions.
 *         content:
 *           text/plain:
 *             example: Logout Successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in logging out the user from all sessions.
 */
router.post("/users/logoutAll", auth, logoutAll);

//Get user by ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Endpoint to retrieve user information by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be retrieved.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               username: user123
 *               email: user@example.com
 *       404:
 *         description: Not Found. User with the given ID not found.
 *         content:
 *           text/plain:
 *             example: Id not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving user information.
 */
router.get("/users/:id", getUserById);

//Create User
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to create a new user.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User object to be created.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Daniel
 *             email: Daniel@example.com
 *             password: userpassword
 *     responses:
 *       201:
 *         description: Successfully created user.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: userId
 *                 username: newUser123
 *                 email: newuser@example.com
 *               token: generatedAuthToken
 *       500:
 *         description: Internal Server Error. Indicates a failure in user creation.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
router.post("/users", createUser);

//LOGIN USER
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     description: Endpoint to authenticate and login a user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials for login.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: Daniel@example.com
 *             password: Daniel@24Tarek
 *     responses:
 *       200:
 *         description: Successfully authenticated and logged in user.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 _id: userId
 *                 username: user123
 *                 email: user@example.com
 *               token: generatedAuthToken
 *       400:
 *         description: Bad Request. Invalid credentials.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid credentials
 *       500:
 *         description: Internal Server Error. Indicates a failure in user login.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
router.post("/users/login", login);

//UPDATE USER
/**
 * @swagger
 * /users/Admin/{id}:
 *   patch:
 *     summary: Update user information (Admin)
 *     description: Endpoint to update user information by an admin.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be updated.
 *         required: true
 *         type: string
 *     requestBody:
 *       description: User properties to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: UpdatedName
 *             email: updatedemail@example.com
 *             password: updatedpassword
 *             Age: 30
 *     responses:
 *       200:
 *         description: Successfully updated user information.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               name: UpdatedName
 *               email: updatedemail@example.com
 *       300:
 *         description: Multiple Choices. Indicates a successful update with multiple options.
 *       400:
 *         description: Bad Request. Invalid update keys provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid updates keys
 *       404:
 *         description: Not Found. User with the given ID not found.
 *       500:
 *         description: Internal Server Error. Indicates a failure in updating user information.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
router.patch("/users/Admin/:id", updateUserById);

//UPDATE CUURENT USER
/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user's information
 *     description: Endpoint to update the profile information of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User properties to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: UpdatedName
 *             email: updatedemail@example.com
 *             password: updatedpassword
 *             Age: 30
 *     responses:
 *       200:
 *         description: Successfully updated user information.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *               name: UpdatedName
 *               email: updatedemail@example.com
 *       300:
 *         description: Multiple Choices. Indicates a successful update with multiple options.
 *       400:
 *         description: Bad Request. Invalid update keys provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid updates keys
 *       500:
 *         description: Internal Server Error. Indicates a failure in updating user information.
 *         content:
 *           application/json:
 *             example:
 *               error: Error message details
 */
router.patch("/users/me", auth, updateCurrentUser);

//DELETE USER
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Endpoint to delete a user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be deleted.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *         content:
 *           application/json:
 *             example:
 *               _id: userId
 *       404:
 *         description: Not Found. User with the given ID not found.
 *       500:
 *         description: Internal Server Error. Indicates a failure in user deletion.
 */
router.delete("/users/:id", deleteUserById);

//MULTER
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    const fileName = file.originalname;

    if (!fileName.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error(" Error: File must be of type .jpg, .jpeg or .png "));
    }
    return cb(undefined, true);

    //cb(undefined , false)
  },
});

//Upload Avatar for current User
/**
 * @swagger
 * /users/me/avatar:
 *   post:
 *     summary: Upload profile picture for current user
 *     description: Endpoint to upload an avatar image for the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully.
 *       400:
 *         description: Bad Request. Indicates an error occurred during file upload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error. Indicates a failure in uploading the avatar.
 */
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      req.user.avatar = req.file.buffer;
      await req.user.save();
      res.status(200).send();
    } catch (err) {
      res.status(500).send();
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//Delete Avatar for current User
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  } catch (err) {
    res.status(500).send();
  }
});

//Get Avatar By UserID
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      res.status(404).send("User id not found");
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (err) {
    res.status(404).send();
  }
});

module.exports = router;
