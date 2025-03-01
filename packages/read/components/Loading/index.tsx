import React from 'react';
import 'ranui/loading';

export const Loading: React.FC = () => {
  const styles = {
    '--loading-cube-grid-item-background': 'var(--blue-1)',
  };
  return (
    <div className="w-full h-full flex justify-center items-center pb-8">
      <r-loading name="cube-grid" className="text-3xl" style={styles}></r-loading>
    </div>
  );
};
