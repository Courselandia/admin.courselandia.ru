import trim from 'lodash/trim';

import { stripTags } from '@/helpers/format';

const countLength = (vl: string): number => {
  let result = vl.replaceAll('&nbsp;', ' ');
  result = result.replaceAll('&laquo;', '«');
  result = result.replaceAll('&raquo;', '»');
  result = result.replaceAll('  ', ' ');
  result = stripTags(result);

  return trim(result).length;
};

export default countLength;
