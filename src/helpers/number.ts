const format = (number: number, decimals: number = 0, thousandsSep: string = ' ', decPoint: string = '.'): string => {
  const i = `${parseInt((+number || 0).toFixed(decimals), 10)}`;
  let j = i.length;

  if (j > 3) {
    j %= 3;
  } else {
    j = 0;
  }

  const km = (j ? i.substring(0, j) + thousandsSep : '');
  const kw = i.substring(j)
    .replace(/(\d{3})(?=\d)/g, `$1${thousandsSep}`);

  const kd = (decimals
    ? decPoint
      + Math.abs(number - Number(i))
        .toFixed(decimals)
        .replace(/-/, '0')
        .slice(2)
    : '');

  return km + kw + kd;
};

export const number = (value: number, decimals: number = 0): string => format(value, decimals);

export const money = (value: number, digits: number = 0, label: string = 'руб.', separate: string = ' '): string => {
  if (value === 0) {
    if (label) {
      return `${0} ${label}`;
    }
    return '0';
  }

  let result = format(value, digits, separate);

  if (label) {
    result = `${result} ${label}`;
  }

  return result;
};

export const fixed = (num: number, p: number): number => {
  if (!p) {
    return Math.round(num);
  }

  return Math.round(num * (10 ** p)) / 10 ** p;
};
