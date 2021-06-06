function ContentEditable({ initialValue, onChange }) {
  const value = useRef(initialValue);

  const handleInput = (event) => {
    if (onChange) {
      onChange(event.target.innerHTML);
    }
  };

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: value.current }}
    />
  );
}

export default ContentEditable;
