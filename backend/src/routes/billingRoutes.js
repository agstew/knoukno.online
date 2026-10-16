import { Router } from "express";
import {
  cancelMySubscription,
  captureBonusOrder,
  confirmSubscription,
  createBonusOrder,
  getPaymentSchedule,
  paypalWebhook,
} from "../controllers/billingController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: PayPal calls this directly, no user session attached.
router.post("/paypal/webhook", paypalWebhook);
router.all("/paypal/webhook", (_req, res) => res.status(405).json({ error: "Method not allowed" }));

router.use(requireAuth);
router.post("/paypal/bonus-order", createBonusOrder);
router.post("/paypal/bonus-order/:orderId/capture", captureBonusOrder);
router.post("/paypal/subscriptions/confirm", confirmSubscription);
router.post("/paypal/subscriptions/cancel", cancelMySubscription);
router.get("/paypal/schedule", getPaymentSchedule);

export default router;
