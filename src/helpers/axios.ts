import axios from 'axios';

const lang = process.env.VUE_APP_LANG?.toLowerCase() || 'RU';

export default axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  params: {
    locale: lang,
  },
});
