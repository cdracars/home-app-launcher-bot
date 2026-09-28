export type AppLink = {
  command: 'tasks' | 'stitch';
  label: string;
  description: string;
  url: string;
};

export const defaultApps: AppLink[] = [
  {
    command: 'tasks',
    label: 'Prioritize tasks',
    description: 'Sort tasks one comparison at a time.',
    url: 'https://task-prioritizer-one.vercel.app/',
  },
  {
    command: 'stitch',
    label: 'Stitch counter',
    description: 'Open the stitch counter.',
    url: 'https://cdracars.github.io/stich-shaper/',
  },
];
