// Lightweight client-side analytics for broker link clicks.
// Stores counts in localStorage and emits a console event for debugging.

const STORAGE_KEY = "tradexa:broker_clicks";

export type BrokerClickStats = Record<
  string,
  { count: number; lastClickedAt: string; url: string }
>;

export const getBrokerClickStats = (): BrokerClickStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BrokerClickStats) : {};
  } catch {
    return {};
  }
};

export const trackBrokerClick = (broker: string, url: string) => {
  try {
    const stats = getBrokerClickStats();
    const prev = stats[broker]?.count ?? 0;
    stats[broker] = {
      count: prev + 1,
      lastClickedAt: new Date().toISOString(),
      url,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    // Useful debug signal — also makes it easy to wire into a real provider later.
    console.info("[analytics] broker_click", { broker, url, count: prev + 1 });
  } catch (err) {
    console.warn("[analytics] failed to record broker click", err);
  }
};

export const getTopBrokers = (limit = 5) =>
  Object.entries(getBrokerClickStats())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
