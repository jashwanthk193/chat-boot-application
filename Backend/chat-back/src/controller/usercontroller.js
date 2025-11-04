

import { DatabaseHandler } from "../config/db.js"; // correct path

const db = new DatabaseHandler();

export const getAllUsers = async (req, res) => {
  try {
    // Use executeQueryWithoutParams because no parameters are needed
    const result = await db.executeQueryWithoutParams("SELECT * FROM LOGIN_TEST");
    
    res.status(200).json({ items: result.rows }); // result.rows contains the data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch castes" });
  }
};
