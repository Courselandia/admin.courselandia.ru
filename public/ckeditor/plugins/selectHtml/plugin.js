( function() {
  CKEDITOR.plugins.add('selectHtml');

  CKEDITOR.editor.prototype.getSelectedHtml = function()
  {
    const selection = this.getSelection();

    if(selection)
    {
      const bookmarks = selection.createBookmarks(),
        range = selection.getRanges()[0],
        fragment = range.clone().cloneContents();

      selection.selectBookmarks(bookmarks);
      let part = '',
        childList = fragment.getChildren(),
        childCount = childList.count();

      for(var i = 0; i < childCount; i++)
      {
        var child = childList.getItem(i);
        part += (child.getOuterHtml ? child.getOuterHtml() : child.getText());
      }

      return part;
    }
  };
} )();
