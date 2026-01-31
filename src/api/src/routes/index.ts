import { Router } from "express";
import healthRoutes from "./health.routes.js";

const router = Router();

// Health check routes
router.use("/health", healthRoutes);

// TODO: Adicionar rotas conforme implementacao
// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/assets", assetRoutes);
// router.use("/watchlist", watchlistRoutes);
// router.use("/alerts", alertRoutes);
// router.use("/notifications", notificationRoutes);
// router.use("/summary", summaryRoutes);

export default router;
