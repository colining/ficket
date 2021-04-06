import * as fs from 'fs';

export default function save(newData: any) {
  fs.readFile('results.json', function (err, data) {
    let json;
    try {
      json = JSON.parse(data);
      json.push(newData);
    } catch (error) {
      console.log('error', error);
      json = new Array(newData);
    }
    console.log('json', json);
    fs.writeFile('results.json', JSON.stringify(json), () => {});
  });
}

export function read(fileName: string) {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}
