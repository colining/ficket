import fs from 'fs';
import jsonfile from 'jsonfile';

const path = 'source.json';

export default function save(newData: any) {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([]));
  }
  const oldData = jsonfile.readFileSync(path);
  jsonfile.writeFile(path, oldData.concat(newData), { spaces: 2 });
}

export function read() {
  return jsonfile.readFileSync(path);
}
