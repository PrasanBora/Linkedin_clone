
import User from "../models/user.model.js"; // Import the User model


// Search users by username
export const searchRes = async (req, res) => {
    

    const { query } = req.query; // Get the search query from the request
  
    try {
      // Search for users with the given name or username (case-insensitive)

      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { username: { $regex: query, $options: "i" } },
        ],
      });
        console.log("found some user ",users);
        res.status(200).json(users);
        
      } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error" });
      }

}

