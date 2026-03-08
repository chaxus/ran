export const vod = {
  FD: {
    label: '流畅',
  },
  LD: {
    bandWidth: {
      h264: 1500000, // 1.5 mbps
      h265: 750000, // 0.75 mbps
    },
    label: '标清',
  },
  SD: {
    bandWidth: {
      h264: 3000000,
      h265: 1500000,
    },
    label: '高清',
  },
  HD: {
    bandWidth: {
      h264: 6000000,
      h265: 3000000,
    },
    label: '超清',
  },
  '2K': {
    bandWidth: {
      h264: 15000000,
      h265: 7500000,
    },
    label: '2K',
  },
  '4K': {
    bandWidth: {
      h264: 32000000,
      h265: 15000000,
    },
    label: '4K',
  },
};
