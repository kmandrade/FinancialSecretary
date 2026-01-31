import { Router } from "express";
import { healthCheck, readinessCheck, livenessCheck } from "../controllers/health.controller.js";

const router = Router();

router.get("/", healthCheck);
router.get("/ready", readinessCheck);
router.get("/live", livenessCheck);

export default router;
