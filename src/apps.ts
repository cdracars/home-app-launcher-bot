import { defaultApps, type AppLink } from './app-links.js';

export type { AppLink } from './app-links.js';

const urlEnvironmentVariable: Partial<Record<AppLink['command'], string>> = {
  tasks: 'TASK_PRIORITIZER_URL',
  stitch: 'STITCH_COUNTER_URL',
};

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

export const apps: AppLink[] = defaultApps.map((app) => {
  const environmentVariable = urlEnvironmentVariable[app.command];
  return {
    ...app,
    url: environmentVariable ? requiredUrl(environmentVariable, app.url) : app.url,
  };
});
