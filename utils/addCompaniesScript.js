import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import connectDB from "../connectDB.js";

dotenv.config();
const companies = [
  {
    name: "Apple",
    iconUrl:
      "https://cdn.brandfetch.io/idnrCPuv87/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Innovative technology company",
    website: "https://www.apple.com",
  },
  {
    name: "Intel",
    iconUrl:
      "https://cdn.brandfetch.io/idTGhLyv09/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Leading semiconductor company",
    website: "https://www.intel.com",
  },
  {
    name: "Amazon",
    iconUrl:
      "https://cdn.brandfetch.io/idawOgYOsG/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Global e-commerce and cloud giant",
    website: "https://www.amazon.com",
  },
  {
    name: "Microsoft",
    iconUrl:
      "https://cdn.brandfetch.io/idchmboHEZ/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Software and cloud computing leader",
    website: "https://www.microsoft.com",
  },
  {
    name: "IBM",
    iconUrl:
      "https://cdn.brandfetch.io/idXPdmxrE6/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Technology and consulting company",
    website: "https://www.ibm.com",
  },
  {
    name: "Salesforce",
    iconUrl:
      "https://cdn.brandfetch.io/idVE84WdIN/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "CRM and cloud solutions",
    website: "https://www.salesforce.com",
  },
  {
    name: "Netflix",
    iconUrl:
      "https://cdn.brandfetch.io/id1I-aPSS5/w/227/h/91/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Streaming entertainment service",
    website: "https://www.netflix.com",
  },
  {
    name: "Google",
    iconUrl:
      "https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Search engine and tech giant",
    website: "https://www.google.com",
  },
  {
    name: "Adobe",
    iconUrl:
      "https://cdn.brandfetch.io/id_KsyK7J9/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Creative software company",
    website: "https://www.adobe.com",
  },
  {
    name: "Meta",
    iconUrl:
      "https://cdn.brandfetch.io/idWvz5T3V7/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
    description: "Social media and technology company",
    website: "https://about.meta.com",
  },
];

async function addCompanies() {
  try {
    await connectDB();
    await Company.insertMany(companies);
    console.log("Companies added successfully! 🎯");
    process.exit();
  } catch (error) {
    console.error("Error adding companies:", error);
    process.exit(1);
  }
}

addCompanies();
