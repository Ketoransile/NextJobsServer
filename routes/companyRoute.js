import express from "express";
import { getAllCompanies, createCompany } from "../controllers/companyController.js";

const router = express.Router();

router.get("/getAllCompanies", getAllCompanies);
router.post("/create", createCompany);
export default router;
