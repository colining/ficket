import path from 'path';
import * as fs from 'fs';
import jsonfile from 'jsonfile';

const dailyReadingFolder = path.join(
  path.dirname(__dirname),
  'assets',
  'dailyReading'
);
const defaultArticle = {
  title: '开卷有益',
  author: '异时空来者',
  article: '读读书，总是好的嘛',
};

function notFuture(date: string) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return parseInt(date, 10) <= parseInt(today, 10);
}

export default function getDailyReading() {
  const files = fs
    .readdirSync(dailyReadingFolder)
    .filter((date) => notFuture(date))
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
  try {
    const filename = path.join(dailyReadingFolder, files[0], 'article.json');
    return jsonfile.readFileSync(filename);
  } catch (e) {
    console.log(e);
    return defaultArticle;
  }
}
