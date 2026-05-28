import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep node-ical (and its rrule dep) out of the Turbopack bundle —
  // it uses Node-only globals (BigInt) that crash when bundled.
  serverExternalPackages: ["node-ical", "rrule"],
};

export default nextConfig;
