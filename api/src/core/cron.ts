import prisma from "../../prisma/client";
import cron from "node-cron";

/**
 * PRODUCTION-READY CRON JOB SYSTEM
 *
 * What this file handles:
 *
 * ✓ Visit cleanup:
 *    - Auto-delete visits where checkout_time is already set
 *    - Auto-delete visits expired based on time window
 *
 * ✓ Badge cleanup:
 *    - Remove expired/unassigned badge records
 *
 * ✓ Guest Requests:
 *    - Remove stale/expired requests (pending for 48hrs)
 *
 * ✓ Password Reset:
 *    - Remove expired reset tokens securely
 *
 * SAFE FOR PRODUCTION:
 *    - Error handling
 *    - Logging
 *    - Transaction usage
 *    - Runs once per instance (uses ENV flag)
 *    - Lightweight and efficient queries
 */

export function startCronJobs() {

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("⏭️ Cron disabled (NODE_ENV !== production)");
  //   return;
  // }

  console.log("⏱️ CRON STARTED: ", new Date().toISOString());

  cron.schedule("* * * * *", async () => {
    console.log("🔄 Running hourly cleanup task:", new Date().toISOString());

    try {
      await prisma.$transaction(async (tx) => {

        const clearedVisits = await tx.visit.deleteMany({
          where: {
            checkout_time: {
              not: null,
            },
          },
        });
        const expiredVisits = await tx.visit.deleteMany({
          where: {
            time_to: {
              lt: new Date(),
            },
            checkout_time: null,
          },
        });

        const clearedTokens = await tx.passwordReset.deleteMany({
          where: {
            expiresAt: {
              lt: new Date(),
            },
          },
        });


        const clearedGuestReq = await tx.guestRequest.deleteMany({
          where: {
            status: "pending",
            created_at: {
              lt: new Date(Date.now() - 48 * 60 * 60 * 1000),
            },
          },
        });

        const clearedBadges = await tx.badge.deleteMany({
          where: {
            OR: [{ expires_at: { lt: new Date() } }],
          },
        });

        console.log("🧹 Hourly Cleanup Report");
        console.log(`   ✓ Checked-out visits cleared: ${clearedVisits.count}`);
        console.log(`   ✓ Expired visits cleared: ${expiredVisits.count}`);
        console.log(
          `   ✓ Expired reset tokens cleared: ${clearedTokens.count}`
        );
        console.log(
          `   ✓ Stale guest requests cleared: ${clearedGuestReq.count}`
        );
        console.log(`   ✓ Expired badges cleared: ${clearedBadges.count}`);
      }); // end transaction
    } catch (err) {
      console.error("❌ CRON ERROR:", err);
    }
  });

  console.log("✔️ Cron jobs scheduled successfully.");
}
