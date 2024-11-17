import express from "express";

import { searchRes  } from "../controllers/search.controller.js";

const router = express.Router();

// Search users by username
router.get("/search", searchRes);


export default router;


