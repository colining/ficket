import fs from 'fs';
import jsonfile from 'jsonfile';

const path = 'source.json';

export default function save(newData: any) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([]));
  }
  const oldData = jsonfile
    .readFileSync(path)
    .filter((item: any) => item.homepageUrl !== newData.homepageUrl);
  jsonfile.writeFileSync(path, oldData.concat(newData), { spaces: 2 });
}

export function read() {
  return jsonfile.readFileSync(path);
}

export function update(data: any) {
  jsonfile.writeFileSync(path, data, { spaces: 2 });
  console.log('write');
}
