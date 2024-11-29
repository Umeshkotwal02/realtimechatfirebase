const handleEmojiSelect = (emoji) => {
  setMessage((prevMessage) => prevMessage + emoji); // Add emoji to message
};

<EmojiPicker onSelect={handleEmojiSelect} />
