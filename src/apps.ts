export type AppLink = {
  command: 'tasks' | 'stitch';
  label: string;
  description: string;
  url: string;
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

export const apps: AppLink[] = [
  {
    command: 'tasks',
    label: 'Prioritize tasks',
    description: 'Sort tasks one comparison at a time.',
    url: requiredUrl(
      'TASK_PRIORITIZER_URL',
      'https://cdracars.github.io/task-prioritizer/'
    ),
  },
  {
    command: 'stitch',
    label: 'Stitch counter',
    description: 'Open the stitch counter.',
    url: requiredUrl(
      'STITCH_COUNTER_URL',
      'https://cdracars.github.io/stich-shaper/'
    ),
  },
];
