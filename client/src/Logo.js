import React from 'react';
import { Box, useTheme } from '@mui/material';

function Logo({ height, onClick, sx = {} }) {
  const theme = useTheme();

  return (
    <Box
      component="svg"
      viewBox="0 0 600 200"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      sx={{
        height: height || { xs: 40, sm: 48, md: 56 },
        width: 'auto',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: onClick ? 'scale(1.05)' : 'none',
        },
        ...sx,
      }}
    >
      {/* Chat bubble icon */}
      <g transform="translate(30, 50)">
        {/* Main chat bubble */}
        <path 
          d="M 0 35 Q 0 0 35 0 L 85 0 Q 120 0 120 35 L 120 65 Q 120 100 85 100 L 45 100 L 25 120 L 25 100 Q 0 100 0 65 Z" 
          fill="#4F46E5" 
          stroke="none"
        />
        {/* Dots inside bubble */}
        <circle cx="35" cy="50" r="6" fill="white"/>
        <circle cx="60" cy="50" r="6" fill="white"/>
        <circle cx="85" cy="50" r="6" fill="white"/>
        {/* Small accent bubble */}
        <path 
          d="M 95 25 Q 95 15 105 15 L 125 15 Q 135 15 135 25 L 135 40 Q 135 50 125 50 L 110 50 L 105 55 L 105 50 Q 95 50 95 40 Z" 
          fill="#818CF8" 
          stroke="none"
        />
      </g>
      {/* Text: ChatterBox */}
      <text 
        x="190" 
        y="125" 
        fontFamily="'Arial', 'Helvetica', sans-serif" 
        fontSize="64" 
        fontWeight="700" 
        fill={theme.palette.mode === 'dark' ? '#F9FAFB' : '#1F2937'} 
        letterSpacing="-1"
      >
        Chatter<tspan fill="#4F46E5">Box</tspan>
      </text>
      {/* Subtle underline accent */}
      <rect 
        x="190" 
        y="135" 
        width="120" 
        height="4" 
        fill="#4F46E5" 
        opacity="0.3" 
        rx="2"
      />
    </Box>
  );
}

export default Logo;

