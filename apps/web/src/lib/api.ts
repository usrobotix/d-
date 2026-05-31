const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const data = await res.json();
    return Object.fromEntries(data.map((s: { id: string; value: string }) => [s.id, s.value]));
  } catch { return {}; }
}

export async function fetchServices() {
  try {
    const res = await fetch(`${API_URL}/api/services`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchService(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/services/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchCases(direction?: string) {
  try {
    const url = direction ? `${API_URL}/api/cases?direction=${direction}` : `${API_URL}/api/cases`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchCase(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/cases/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchFaq() {
  try {
    const res = await fetch(`${API_URL}/api/faq`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchTestimonials() {
  try {
    const res = await fetch(`${API_URL}/api/testimonials`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
