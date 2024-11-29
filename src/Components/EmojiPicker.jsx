import React from 'react';
import { Picker } from 'emoji-mart';
import data from '@emoji-mart/data'

const EmojiPicker = ({ onSelect }) => {

  // Emoji selection handler
  const handleEmojiSelect = (emoji) => {
    if (!emoji?.native) {
      console.error('Emoji data is missing the native property');
      return;
    }
    // Pass the selected emoji's native form to the onSelect callback
    onSelect(emoji.native);
  };

  return (
    <Picker
      autoFocus
      data={data}
      theme="light" /// Use theme from styled-components
      showPreview={false} // Disable the emoji preview
      showSkinTones={false} // Disable skin tone variations
      onEmojiSelect={handleEmojiSelect} // Pass the handler to the picker
    />
  );
};

export default EmojiPicker;
