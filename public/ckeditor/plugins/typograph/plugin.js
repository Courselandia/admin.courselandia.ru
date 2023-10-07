(
  function () {
    const pluginName = 'typograph';

    CKEDITOR.plugins.add
    (
      pluginName,
      {
        init: function (editor) {
          const cmd = editor.addCommand(pluginName,
            {
              exec: function (wysiwyg) {
                const url = 'https://api.courselandia.ru/api/private/admin/core/typography';
                let html;
                let selected;

                if (editor.getSelectedHtml() !== '') {
                  html = editor.getSelectedHtml();
                  selected = true;
                } else {
                  html = wysiwyg.getData();
                  selected = false;
                }

                try {
                  CKEDITOR.ajax.post(url, JSON.stringify({ text: html }), 'application/json', function (response) {
                    if (response) {
                      response = JSON.parse(response);

                      if (response.success) {
                        if (selected) {
                          wysiwyg.insertHtml(response.text);
                        } else {
                          wysiwyg.setData(response.text);
                        }
                      } else {
                        alert('Произошла ошибка на сервере!');
                      }
                    } else {
                      alert('Произошла ошибка на сервере!');
                    }
                  });
                } catch (error) {
                  alert('Произошла ошибка на сервере!');
                }
              }
            }
          );

          cmd.modes = {
            wysiwyg: 1,
            source: 0
          };

          editor.ui.addButton
          (
            pluginName,
            {
              label: 'Типограф',
              icon: this.path + 'logo.png?1',
              command: pluginName
            }
          );
        }
      }
    );
  }
)();
