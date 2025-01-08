import React from 'react';

interface TextDisplayProps {
  text: string;
  maxLength?: number;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text, maxLength = 12 }) => {
  const truncateText = (str: string) => {
    if (str.length <= maxLength) {
      return str;
    }
    return `${str.slice(0, 5)}...${str.slice(-4)}`;
  };

  return <span>{truncateText(text)}</span>;
};

export default TextDisplay;

