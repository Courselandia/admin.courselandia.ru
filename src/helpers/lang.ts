const lang = (index: string): string | null => {
  if (process.env.VUE_APP_LANG) {
    const indexes = index.split('.');
    const indexFirst = indexes[0];
    const currentLang = process.env.VUE_APP_LANG.toLowerCase();

    try {
      let tree = require(`@/langs/${indexFirst}/${currentLang}.ts`);
      tree = tree.default;

      if (tree) {
        let value;

        if (indexes.length > 1) {
          for (let i = 1; i < indexes.length; i++) {
            value = tree[indexes[i]];
            tree = value;
          }
        }

        if (!value) {
          console.warn(`Translation is missing: ${index}`);
        }

        return value;
      }
    } catch (error: any) {
      console.warn(`Lang file is missing: ${error.message}`);
    }

    return null;
  }

  return null;
};

export default lang;
