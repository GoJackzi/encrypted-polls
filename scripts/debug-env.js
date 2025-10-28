import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Current directory:", __dirname);
console.log("Looking for .env.local at:", path.resolve(__dirname, '..', '.env.local'));

// Load environment variables with absolute path
const result = dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

console.log("Dotenv result:", result);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("RPC_URL:", process.env.RPC_URL);
console.log("All env vars:", Object.keys(process.env).filter(key => key.includes('PRIVATE') || key.includes('RPC')));
