import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

const TARGET_URL = 'http://localhost:3002';
const ARTIFACTS_DIR = './mcp_artifacts';
