( function() {
  const pluginName = 'component';

  const replacedClass = {
    'background-position': 'center center',
    'background-size': 'auto 130px',
    'background-repeat': 'no-repeat',
    'background-color': '#ffffff',
    'margin-bottom': '20px',
    'border': '1px dotted #a9a9a9',
    'width': '100%',
    'height': '200px',
  };

  let replacedClassString = '';

  CKEDITOR.plugins.add(pluginName, {
    onLoad() {
      if (CKEDITOR.addCss) {
        for (k in replacedClass) {
          replacedClassString += k + ': ' + replacedClass[k] + '; ';
        }
      }
    },
    afterInit(editor) {
      const dataProcessor = editor.dataProcessor;
      const dataFilter = dataProcessor && dataProcessor.dataFilter;

      if (dataFilter) {
        dataFilter.addRules({
          elements: {
            'div': function (element) {
              const result = /<component( [a-z-_0-9]+="[a-z-_0-9]+")*><\/component>/g.exec(element.getHtml());

              if (result !== null) {
                const fake = editor.createFakeParserElement(element, null, pluginName, false);
                const label = 'Компонент';

                fake.attributes['alt'] = label;
                fake.attributes['title'] = label;
                fake.attributes['style'] = replacedClassString;
                fake.attributes['style'] += ' background-image: url("/ckeditor/plugins/component/icon.png")';

                return fake;
              }
            }
          }
        }, 5);
      }
    }
  });
} )();
