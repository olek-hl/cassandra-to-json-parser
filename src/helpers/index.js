const isTextSerializedJSON = (text) => {
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };
  
  module.exports = {
    isTextSerializedJSON,
  };
  