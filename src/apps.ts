import { defaultApps, type AppLink } from './app-links.js';

export type { AppLink } from './app-links.js';

function requiredUrl(name: string, fallback: string): string {
  const value = process.env[name] || fallback;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') {
      throw new Error('Only HTTPS URLs are allowed.');
    }
    return url.toString();
  } catch {
    throw new Error(`${name} must be a valid HTTPS URL.`);
  }
}

export const apps: AppLink[] = defaultApps.map((app) => ({
  ...app,
  url: requiredUrl(
    app.command === 'tasks' ? 'TASK_PRIORITIZER_URL' : 'STITCH_COUNTER_URL',
    app.url
  ),
}));
