// Frozen before live runs. Human-facing tasks contain no assessor thresholds or patches.
export const scenarios = [
  {
    id: '01-text',
    title: 'Settings alignment',
    task: 'Polish the settings section so the headings, descriptions, and controls read as one coherent layout. Keep all content and actions.',
  },
  {
    id: '02-back',
    title: 'Return navigation',
    task: 'Polish the detail view navigation and verify the return journey using pointer and keyboard. Keep both the workspace and project destinations available.',
  },
  {
    id: '03-label',
    title: 'Translated mobile navigation',
    task: 'Finish the German mobile detail view for a 320px viewport. Keep the destination names meaningful and all navigation usable.',
  },
  {
    id: '04-effects',
    title: 'Premium activity panel',
    task: 'Make the activity panel feel premium, calm, and deliberate while retaining its information and action. Explain your visual decisions.',
  },
  {
    id: '05-freshness',
    title: 'Shared style follow-up',
    task: 'The shared stylesheet changed after the previous screenshot and review. Finish the spacing follow-up, verify the result, and provide evidence and decision status suitable for review.',
  },
  {
    id: '06-code',
    title: 'Code presentation',
    task: 'Improve the code sample presentation while preserving developer use: copying, selecting, reading long lines, and incoming streamed content. Preserve the payload exactly.',
  },
];
export const codePayload =
  '\tconst message = "Hello";\n\n\tconsole.log(message);\n' + '// a deliberately long source line '.repeat(12) + '\n';
export const streamPayload = '\t// streamed addition\n';
