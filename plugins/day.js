import Vue from 'vue';
import dayjs from 'dayjs';

Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => dayjs(value).format(format));
