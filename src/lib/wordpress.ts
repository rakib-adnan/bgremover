const WP_API = process.env.WORDPRESS_API_URL ?? "https://darkscreen.online/wp-json";

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{ name: string }>;
  };
}

export async function getPosts(page = 1, perPage = 9): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  try {
    const res = await fetch(
      `${WP_API}/wp/v2/posts?per_page=${perPage}&page=${page}&_embed=1&status=publish`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { posts: [], total: 0, totalPages: 0 };
    const posts: WPPost[] = await res.json();
    return {
      posts,
      total: parseInt(res.headers.get("X-WP-Total") ?? "0"),
      totalPages: parseInt(res.headers.get("X-WP-TotalPages") ?? "0"),
    };
  } catch { return { posts: [], total: 0, totalPages: 0 }; }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${WP_API}/wp/v2/posts?slug=${slug}&_embed=1`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const posts: WPPost[] = await res.json();
    return posts[0] ?? null;
  } catch { return null; }
}

export function getFeaturedImage(post: WPPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim().slice(0, 160);
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${WP_API}/wp/v2/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`bgremove:BgRemove@2026!`).toString("base64")}`,
    },
    body: JSON.stringify({ username: email, email, password, name, roles: ["subscriber"] }),
  });
  return res.json();
}

export async function getUserCredits(wpToken: string): Promise<number> {
  const res = await fetch(`${WP_API}/wp/v2/users/me?context=edit`, {
    headers: { Authorization: `Bearer ${wpToken}` },
  });
  const user = await res.json();
  return parseInt(user.meta?.bg_credits ?? "0");
}

export async function updateUserCredits(userId: string, credits: number, wpToken: string) {
  await fetch(`${WP_API}/wp/v2/users/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${wpToken}`,
    },
    body: JSON.stringify({ meta: { bg_credits: String(credits) } }),
  });
}

export async function getSettings() {
  try {
    const res = await fetch(`${WP_API}/bgremover/v1/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return defaultSettings;
    return res.json();
  } catch {
    return defaultSettings;
  }
}

const defaultSettings = {
  price_per_image: 0.10,
  free_hd_per_day: 3,
  plans: [
    { id: "starter", name: "Starter", credits: 10, price: 1.00 },
    { id: "basic", name: "Basic", credits: 50, price: 4.50 },
    { id: "pro", name: "Pro", credits: 100, price: 8.00 },
    { id: "unlimited", name: "Unlimited", credits: 500, price: 35.00 },
  ],
};
