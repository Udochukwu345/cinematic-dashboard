// Wallet sign-in: SIWE-style challenge + signature verification + Supabase session.
// Endpoints (via single function, action in body):
//   POST { action: "challenge", address }              -> { nonce, message, expiresAt }
//   POST { action: "verify",    address, message, signature } -> { token_hash, email }
//
// Client then calls supabase.auth.verifyOtp({ email, token_hash, type: "magiclink" })
// to materialize a session — no email round-trip required.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { verifyMessage, getAddress } from "https://esm.sh/ethers@6.13.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DOMAIN = "tradexa.app";

const enc = new TextEncoder();

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

function buildSiweMessage(address: string, nonce: string, issuedAt: string) {
  return `${DOMAIN} wants you to sign in with your Ethereum account:
${address}

Sign in to Tradexa to authenticate this wallet.

URI: https://${DOMAIN}
Version: 1
Nonce: ${nonce}
Issued At: ${issuedAt}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!supabaseUrl || !serviceRoleKey) return json({ error: "Server not configured" }, 500);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    // ---- challenge --------------------------------------------------------
    if (action === "challenge") {
      const raw = String(body.address ?? "");
      let address: string;
      try { address = getAddress(raw); } catch { return json({ error: "Invalid address" }, 400); }

      const nonce = crypto.randomUUID().replace(/-/g, "");
      const issuedAt = new Date().toISOString();
      const message = buildSiweMessage(address, nonce, issuedAt);
      const expiresAt = Date.now() + NONCE_TTL_MS;

      // Sign (address|nonce|expiresAt) so verify endpoint can trust it without storage
      const proof = await hmac(serviceRoleKey, `${address}|${nonce}|${expiresAt}`);

      return json({ nonce, message, expiresAt, proof });
    }

    // ---- verify -----------------------------------------------------------
    if (action === "verify") {
      const { address: rawAddr, message, signature, nonce, expiresAt, proof } = body ?? {};
      if (!rawAddr || !message || !signature || !nonce || !expiresAt || !proof) {
        return json({ error: "Missing fields" }, 400);
      }

      let address: string;
      try { address = getAddress(String(rawAddr)); } catch { return json({ error: "Invalid address" }, 400); }

      if (Date.now() > Number(expiresAt)) return json({ error: "Challenge expired" }, 400);

      const expectedProof = await hmac(serviceRoleKey, `${address}|${nonce}|${expiresAt}`);
      if (expectedProof !== proof) return json({ error: "Invalid challenge proof" }, 400);

      if (!String(message).includes(nonce) || !String(message).includes(address)) {
        return json({ error: "Message does not match challenge" }, 400);
      }

      // Verify the signature
      let recovered: string;
      try { recovered = getAddress(verifyMessage(message, signature)); }
      catch { return json({ error: "Signature verification failed" }, 400); }
      if (recovered !== address) return json({ error: "Signature address mismatch" }, 401);

      // Create/find the user, then mint a magiclink token_hash for the client to redeem.
      const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
      const email = `${address.toLowerCase()}@wallet.tradexa.app`;

      // Idempotently ensure user exists & is email-confirmed (wallet proof replaces email verification)
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { wallet_address: address, auth_method: "metamask" },
      });
      if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
        return json({ error: createErr.message }, 500);
      }

      // Generate a magic link token_hash (consumed once by verifyOtp on the client)
      const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
      if (linkErr || !link?.properties?.hashed_token) {
        return json({ error: linkErr?.message ?? "Could not issue session token" }, 500);
      }

      return json({
        token_hash: link.properties.hashed_token,
        email,
        address,
        user_id: created?.user?.id,
      });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
