const fs = require("fs/promises");
const path = require("path");

const landingContentPath = path.join(__dirname, "..", "data", "landing-content.json");
const waitlistPath = path.join(__dirname, "..", "data", "waitlist.json");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let waitlistQueue = Promise.resolve();

async function readJsonFile(filePath, fallbackValue) {
  try {
    const rawData = await fs.readFile(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    if (error.code === "ENOENT") {
      return fallbackValue;
    }

    throw error;
  }
}

async function writeJsonFile(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

function enqueueWaitlistOperation(operation) {
  waitlistQueue = waitlistQueue.then(operation, operation);
  return waitlistQueue;
}

function normalizeLead(body) {
  return {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim().toLowerCase(),
    company: String(body.company || "").trim(),
    role: String(body.role || "").trim()
  };
}

function validateLead(lead) {
  if (lead.name.length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!emailPattern.test(lead.email)) {
    return "A valid email is required.";
  }

  return "";
}

async function getLandingContent(req, res, next) {
  try {
    const landingContent = await readJsonFile(landingContentPath, {});
    res.json(landingContent);
  } catch (error) {
    next(error);
  }
}

async function createWaitlistLead(req, res, next) {
  const incomingLead = normalizeLead(req.body || {});
  const validationError = validateLead(incomingLead);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const createdLead = await enqueueWaitlistOperation(async () => {
      const stored = await readJsonFile(waitlistPath, { leads: [] });
      const leads = Array.isArray(stored.leads) ? stored.leads : [];

      const isDuplicate = leads.some((lead) => lead.email === incomingLead.email);
      if (isDuplicate) {
        const conflictError = new Error("Email already registered.");
        conflictError.statusCode = 409;
        throw conflictError;
      }

      const newLead = {
        id: `lead_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        ...incomingLead,
        createdAt: new Date().toISOString()
      };

      leads.push(newLead);
      await writeJsonFile(waitlistPath, { leads });
      return newLead;
    });

    return res.status(201).json({
      message: "Waitlist signup saved.",
      lead: createdLead
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createWaitlistLead,
  getLandingContent
};
