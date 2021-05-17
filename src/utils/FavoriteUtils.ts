import path from 'path';
import fs from 'fs';
import jsonfile from 'jsonfile';

const sourcePath = path.join(path.dirname(__dirname), 'favorites.json');

export default function saveFavorite(newData: any) {
  if (!fs.existsSync(sourcePath)) {
    fs.writeFileSync(sourcePath, JSON.stringify([]));
  }
  const oldData = jsonfile
    .readFileSync(sourcePath)
    .filter((item: any) => item.videoDetail !== newData.videoDetail);
  jsonfile.writeFileSync(sourcePath, oldData.concat(newData), { spaces: 2 });
}

export function readFavorites() {
  return jsonfile.readFileSync(sourcePath).reverse();
}

export function deleteFavourite(info: any) {
  const data = jsonfile
    .readFileSync(sourcePath)
    .filter((item: any) => item.videoDetail !== info.videoDetail);
  jsonfile.writeFileSync(sourcePath, data, { spaces: 2 });
}
