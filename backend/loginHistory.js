import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendSecurityAlertEmail } from './emailClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let logFilePath = path.join(__dirname, 'login_history.json');
try {
  const testPath = path.join(__dirname, '.write_test');
  fs.writeFileSync(testPath, '1');
  fs.unlinkSync(testPath);
} catch (e) {
  logFilePath = path.join(process.env.TEMP || process.env.TMP || '/tmp', 'login_history.json');
}

const memoryHistory = {};

// Helper to read log file
function readLogFile() {
  try {
    if (fs.existsSync(logFilePath)) {
      const data = fs.readFileSync(logFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    // Return memory fallback
  }
  return memoryHistory;
}

// Helper to write log file
function writeLogFile(data) {
  Object.assign(memoryHistory, data);
  try {
    fs.writeFileSync(logFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // Memory fallback holds state
  }
}

/**
 * Tracks a login event for a user.
 * Checks if 3+ logins from different devices, or 3+ consecutive logins from the same device, are met.
 * Triggers security email alert if conditions are met.
 */
export const recordLogin = async (email, ip, userAgent) => {
  try {
    const history = readLogFile();
    const now = new Date().toISOString();
    
    if (!history[email]) {
      history[email] = [];
    }
    
    // Clean IP representation (e.g. ::ffff:127.0.0.1 -> 127.0.0.1)
    const cleanIp = String(ip || '127.0.0.1').replace(/^.*:/, '');
    const currentDevice = `${cleanIp}-${userAgent || ''}`;
    
    const logEntry = {
      timestamp: now,
      ip: cleanIp,
      userAgent: userAgent || 'Unknown',
      device: currentDevice
    };
    
    history[email].push(logEntry);
    
    // Keep only last 50 entries to keep it token/size-efficient
    if (history[email].length > 50) {
      history[email].shift();
    }
    
    writeLogFile(history);
    
    // Evaluate alert criteria:
    const userLogs = history[email];
    if (userLogs.length < 3) return; // Need at least 3 logins to trigger
    
    const prevLogs = userLogs.slice(0, -1);
    const prevUniqueDevices = new Set(prevLogs.map(l => l.device));
    
    const isNewDevice = !prevUniqueDevices.has(currentDevice);
    const totalUniqueDevices = new Set(userLogs.map(l => l.device)).size;
    
    const shouldAlertDiffDevices = isNewDevice && totalUniqueDevices >= 3;
    
    let shouldAlertConsecutive = false;
    const last = userLogs[userLogs.length - 1].device;
    const mid = userLogs[userLogs.length - 2].device;
    const first = userLogs[userLogs.length - 3].device;
    
    if (last === mid && mid === first) {
      const fourth = userLogs.length >= 4 ? userLogs[userLogs.length - 4].device : null;
      if (fourth !== last) {
        shouldAlertConsecutive = true;
      }
    }
    
    if (shouldAlertDiffDevices || shouldAlertConsecutive) {
      console.log(`[SECURITY ALERT] Triggered for user ${email}. Different devices: ${shouldAlertDiffDevices}, Consecutive same: ${shouldAlertConsecutive}`);
      await sendSecurityAlertEmail(email, now, cleanIp, userAgent);
    }
  } catch (err) {
    console.error('Error recording device login history:', err);
  }
};
