const WP_API = process.env.WORDPRESS_API_URL!;

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
