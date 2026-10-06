export type AppLink = {
  command: 'home' | 'tasks' | 'stitch';
  label: string;
  description: string;
  url: string;
};

export const defaultApps: AppLink[] = [
  {
    command: 'home',
    label: 'Dracars',
    description: 'Browse projects and tools from Dracars.',
    url: 'https://dracars.com/',
  },
  {
    command: 'tasks',
    label: 'Prioritize tasks',
    description: 'Sort tasks one comparison at a time.',
    url: 'https://task-prioritizer.dracars.com/',
  },
  {
    command: 'stitch',
    label: 'Stitch counter',
    description: 'Open the stitch counter.',
    url: 'https://stitch-shaper.dracars.com/',
  },
];
