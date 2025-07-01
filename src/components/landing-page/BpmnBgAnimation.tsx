'use client';

import React from 'react';
import { motion } from 'framer-motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay,
          type: 'spring',
          duration: 1.5,
          bounce: 0,
          repeat: Infinity,
          repeatDelay: 3,
        },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

const image: React.CSSProperties = {
  maxWidth: '100%',
};

const shape: React.CSSProperties = {
  strokeWidth: 6,
  strokeLinecap: 'round',
  fill: 'transparent',
};

const BpmnBgAnimation: React.FC = () => {
  return (
    <motion.svg
      width="600"
      height="600"
      viewBox="0 0 2100 1200"
      initial="hidden"
      animate="visible"
      style={image}
    >
      {/* Diagram 1 - Atas */}
      <motion.circle cx="150" cy="200" r="60" stroke="white" custom={0} variants={draw} style={shape} />
      <motion.line x1="210" y1="200" x2="450" y2="200" stroke="white" custom={1} variants={draw} style={shape} />
      <motion.rect x="450" y="110" width="300" height="180" rx="30" stroke="white" custom={2} variants={draw} style={shape} />
      <motion.line x1="750" y1="200" x2="900" y2="200" stroke="white" custom={3} variants={draw} style={shape} />
      <motion.polygon points="900,200 990,110 1080,200 990,290" stroke="white" custom={4} variants={draw} style={shape} />
      <motion.line x1="1080" y1="200" x2="1260" y2="200" stroke="white" custom={5} variants={draw} style={shape} />
      <motion.rect x="1260" y="110" width="300" height="180" rx="30" stroke="white" custom={6} variants={draw} style={shape} />
      <motion.line x1="1560" y1="200" x2="1740" y2="200" stroke="white" custom={7} variants={draw} style={shape} />
      <motion.circle cx="1800" cy="200" r="60" stroke="white" custom={8} variants={draw} style={shape} />

      {/* Diagram 2 - Tengah */}
      <motion.circle cx="150" cy="500" r="60" stroke="white" custom={9} variants={draw} style={shape} />
      <motion.line x1="210" y1="500" x2="460" y2="500" stroke="white" custom={10} variants={draw} style={shape} />
      <motion.polygon points="460,500 560,400 660,500 560,600" stroke="white" custom={13} variants={draw} style={shape} />
      <motion.line x1="655" y1="500" x2="900" y2="500" stroke="white" custom={12} variants={draw} style={shape} />

      <motion.line x1="560" y1="600" x2="560" y2="800" stroke="white" custom={12} variants={draw} style={shape} />
      <motion.rect x="418" y="805" width="300" height="180" rx="30" stroke="white" custom={15} variants={draw} style={shape} />
      <motion.line x1="720" y1="900" x2="1000" y2="900" stroke="white" custom={12} variants={draw} style={shape} />
      <motion.polygon points="1000,900 1110,800 1215,900 1110,1005" stroke="white" custom={4} variants={draw} style={shape} />
      <motion.line x1="1210" y1="900" x2="1640" y2="900" stroke="white" custom={14} variants={draw} style={shape} />
      <motion.line x1="1800" y1="560" x2="1800" y2="810" stroke="white" custom={12} variants={draw} style={shape} />

      <motion.rect x="1645" y="810" width="300" height="180" rx="30" stroke="white" custom={15} variants={draw} style={shape} />

      <motion.line x1="1210" y1="500" x2="1740" y2="500" stroke="white" custom={14} variants={draw} style={shape} />
      <motion.rect x="905" y="410" width="300" height="180" rx="30" stroke="white" custom={15} variants={draw} style={shape} />      
      <motion.circle cx="1800" cy="500" r="60" stroke="white" custom={17} variants={draw} style={shape} />

    </motion.svg>
  );
};

export default BpmnBgAnimation;
