import { DatabaseHandler } from "../config/db.js";
import { ApiError } from "../response/error.js";
import { ApiResponse } from "../response/response.js";
import { signToken } from "../response/token.util.js";
import { asyncHandeler } from "../response/asyncHandler.js";

const db = new DatabaseHandler();

// ------------------- REGISTER USER -------------------
export const register = asyncHandeler(async (req, res) => {
  const { user_name, email, password } = req.body;

  if (!email || !password || !user_name)
    throw new ApiError(400, "Name, email and password required");

  // Check if user already exists
  const checkUser = await db.executeQueryWithParams(
    "SELECT USER_ID FROM LOGIN_TEST WHERE EMAIL = :email",
    { email }
  );

  if (checkUser.rows.length > 0)
    throw new ApiError(400, "User already exists");

  // Insert user (plain password)
  await db.executeQueryWithParams(
    `INSERT INTO LOGIN_TEST (NAME, EMAIL, PASSWORD)
     VALUES (:name, :email, :password)`,
    {
      name: user_name, // match column NAME
      email,
      password,        // stored as plain text
    }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, null, "User registered successfully"));
});

// ------------------- LOGIN USER -------------------
export const login = asyncHandeler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password required");

  // Fetch user by email
  const userResult = await db.executeQueryWithParams(
    `SELECT USER_ID, NAME, EMAIL, PASSWORD 
     FROM LOGIN_TEST 
     WHERE EMAIL = :email`,
    { email }
  );

  if (userResult.rows.length === 0)
    throw new ApiError(404, "User not found");

  const user = userResult.rows[0];

  // Compare plain passwords
  if (password !== user.PASSWORD)
    throw new ApiError(401, "Invalid password");

  // Generate JWT
  const token = signToken({ id: user.USER_ID, email: user.EMAIL });
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          user_id: user.USER_ID,
          name: user.NAME,
          email: user.EMAIL
        }
      },
      "Login successful"
    )
  );


 });
