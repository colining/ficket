import greenworks from 'greenworks';
import path from 'path';
import fs from 'fs';
import jsonfile from 'jsonfile';

import { remote } from 'electron';

const defaultSourcePath = path.join(
  remote.app.getPath('userData'),
  'favorites.json'
);

const getCloudSourcePath = (steamId: any) => {
  return path.join(
    remote.app.getPath('userData'),
    'save',
    steamId,
    'favorites.json'
  );
};
const sourcePath = greenworks.init()
  ? getCloudSourcePath(greenworks.getSteamId().accountId.toString())
  : defaultSourcePath;

export default function saveFavorite(newData: any, url: string) {
  if (url && url !== newData.videoUrl) {
    newData.videoUrl = url;
  }
  if (!fs.existsSync(sourcePath)) {
    fs.writeFileSync(sourcePath, JSON.stringify([]));
  }
  const oldData = jsonfile.readFileSync(sourcePath).filter((item: any) => {
    if (newData.videoSource !== item.videoSource) {
      return true;
    }
    if (newData.videoDetail) {
      return item.videoDetail !== newData.videoDetail;
    }
    return item.title !== newData.title;
  });
  jsonfile.writeFileSync(sourcePath, oldData.concat(newData), {
    spaces: 2,
  });
}

function getFolder(s: string) {
  return s.substring(0, s.lastIndexOf('\\'));
}

export function readFavorites() {
  let defaultFavourites: any = [];

  if (!fs.existsSync(sourcePath)) {
    fs.mkdirSync(getFolder(sourcePath), { recursive: true });
    if (fs.existsSync(defaultSourcePath)) {
      defaultFavourites = jsonfile.readFileSync(defaultSourcePath);
    }
    fs.writeFileSync(sourcePath, '');
    jsonfile.writeFileSync(sourcePath, defaultFavourites, { spaces: 2 });
  }
  return jsonfile.readFileSync(sourcePath).reverse();
}

export function deleteFavourite(info: any) {
  const data = jsonfile
    .readFileSync(sourcePath)
    .filter((item: any) => item.videoDetail !== info.videoDetail);
  jsonfile.writeFileSync(sourcePath, data, { spaces: 2 });
}
