import { API_KEY_FAVQ } from "@env";
const API_TOKEN = API_KEY_FAVQ;
const categoryCache = {};
const CACHE_SIZE = 10;
const REFILL_THRESHOLD = 4;

const TAG_MAP = {
  inspirational: "inspiration",
  success: "success",
  happiness: "happiness",
  love: "love",
  life: "life",
  positive: "positive",
  health: "health",
  friendship: "friendship",
  leadership: "leadership",
  business: "business",
  attitude: "attitude",
  work: "work",
  family: "family",
  courage: "courage",
  dreams: "dreams",
  education: "education",
  wisdom: "wisdom",
  sports: "sports",
  money: "wealth",
  faith: "faith",
};
const normalize = (item, tag) => ({
  id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  quote: item.body?.trim() || "Stay inspired.",
  author: item.author || "Unknown",
  tag,
  tags: item.tags || [],
});
async function fetchQuotesPage(tag) {
  const favqsTag = TAG_MAP[tag] || "inspiration";
  const store = categoryCache[tag] || { page: 1, quotes: [] };

  const url = `https://favqs.com/api/quotes/?filter=${encodeURIComponent(
    favqsTag
  )}&type=tag&page=${store.page}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Token token="${API_TOKEN}"`,
    },
  });

  if (!res.ok) throw new Error("FavQs API error");

  const data = await res.json();
  store.page += 1;

  const newQuotes = data.quotes?.map((q) => normalize(q, tag)) || [];

  if (!categoryCache[tag]) categoryCache[tag] = { page: store.page, quotes: [] };
  categoryCache[tag].page = store.page;

  for (const q of newQuotes) {
    if (!categoryCache[tag].quotes.some((x) => x.quote === q.quote)) {
      categoryCache[tag].quotes.push(q);
    }
  }
}

export async function getQuotes(tag, n = 3) {
  if (!categoryCache[tag]) {
    categoryCache[tag] = { page: 1, quotes: [] };
  }

  if (categoryCache[tag].quotes.length < n) {
    await fetchQuotesPage(tag);
  }

  const out = categoryCache[tag].quotes.splice(0, n);

  if (categoryCache[tag].quotes.length < REFILL_THRESHOLD) {
    fetchQuotesPage(tag).catch(() => {});
  }

  return out;
}
