import fs from 'fs';
import jsonfile from 'jsonfile';
import _ from 'lodash';
import path from 'path';

const sourcePath = path.join(path.dirname(__dirname), 'source.json');

export default function save(newData: any) {
  if (!fs.existsSync(sourcePath)) {
    fs.writeFileSync(sourcePath, JSON.stringify([]));
  }
  const oldData = jsonfile
    .readFileSync(sourcePath)
    .filter((item: any) => item.homepageUrl !== newData.homepageUrl);
  jsonfile.writeFileSync(sourcePath, oldData.concat(newData), { spaces: 2 });
}

export function read() {
  return jsonfile.readFileSync(sourcePath);
}

export function update(data: any) {
  jsonfile.writeFileSync(sourcePath, data, { spaces: 2 });
  console.log('write');
}

export function importData(newData: any) {
  if (!fs.existsSync(sourcePath)) {
    fs.writeFileSync(sourcePath, JSON.stringify([]));
  }
  const oldData = jsonfile.readFileSync(sourcePath).filter((item: any) => {
    return _.isEmpty(
      newData.filter((i: any) => i.homepageUrl === item.homepageUrl)
    );
  });
  console.log(oldData);
  jsonfile.writeFileSync(sourcePath, oldData.concat(newData), { spaces: 2 });
}
