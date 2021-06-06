function ContentEditable({
  className,
  handleInput,
  contentEditableRef,
  html,
  onKeyDown,
}) {
  return (
    <div
      className={className}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      ref={contentEditableRef}
      dangerouslySetInnerHTML={{ __html: html }}
      onKeyDown={onKeyDown}
    ></div>
  );
}

export default ContentEditable;
