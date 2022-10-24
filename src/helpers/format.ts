// @ts-ignore
import trim from 'lodash/trim';

export const latin = (string: string, separator: string = '-'): string => {
  const order: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sh',
    ъ: '',
    ы: 'i',
    ь: '',
    э: 'e',
    ю: 'u',
    я: 'ya',

    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'E',
    Ж: 'ZH',
    З: 'Z',
    И: 'I',
    Й: 'Y',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'H',
    Ц: 'C',
    Ч: 'CH',
    Ш: 'SH',
    Щ: 'SH',
    Ъ: '',
    Ы: 'I',
    Ь: '',
    Э: 'E',
    Ю: 'U',
    Я: 'Ya',

    ' ': separator,
  };
  const value = trim(string);
  let translate: string = '';

  for (let i = 0; i < value.length; i++) {
    if (value.charAt(i) === ' ') {
      translate += separator;
    } else if (/[а-яёА-ЯЁ ]/.test(value.charAt(i))) {
      translate += order[value.charAt(i)];
    } else if (/[a-z0-9A-Z ]/.test(value.charAt(i))) {
      translate += value.charAt(i);
    }
  }

  return translate.toLowerCase();
};

export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const brToRn = (value: string): string => {
  if (!value) {
    return value;
  }

  const searcher: Array<string> = ['<br>', '<br />', '<br/>'];
  let result: string = value;

  for (let i = 0; i < searcher.length; i++) {
    const re = new RegExp(searcher[i], 'g');
    result = result.replace(re, '\n');
  }

  return result;
};

export const rnToBr = (value: string): string => {
  if (!value) {
    return value;
  }

  const searcher: Array<string> = ['\r\n', '\n\r', '\n', '\r'];
  let result: string = value;

  for (let i = 0; i < searcher.length; i++) {
    const re = new RegExp(searcher[i], 'g');
    result = result.replace(re, '<br />');
  }

  return result;
};
