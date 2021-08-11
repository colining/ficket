import greenworks from 'greenworks';
import * as jsonfile from 'jsonfile';
import React from 'react';
import _ from 'lodash';
import path from 'path';

export const WorkshopContext = React.createContext({
  workshopSource: new Array(0),
  loadSuccess: false,
  setState: '',
});
export const unActiveSourcePath = path.join(
  path.dirname(__dirname),
  'unActiveSource.json'
);
export const workshopSourceLocalPath = path.join(
  path.dirname(__dirname),
  'workshopSourceLocal.json'
);
export default function getWorkShopItemsPathAndSetToState(setState: any) {
  const unActiveSource = jsonfile.readFileSync(unActiveSourcePath);
  const workshopSourceLocal = jsonfile.readFileSync(workshopSourceLocalPath);
  const steamID = greenworks.getSteamId().steamId;
  console.log(steamID);
  greenworks.ugcGetUserItems(
    greenworks.UGCMatchingType.Items,
    greenworks.UserUGCListSortOrder.CreationOrderDesc,
    greenworks.UserUGCList.Subscribed,
    (items: any) => {
      let workshopSource = items.map((item: any) => {
        if (_.isEmpty(greenworks.ugcGetItemInstallInfo(item.publishedFileId))) {
          return null;
        }
        console.log(greenworks.ugcGetItemInstallInfo(item.publishedFileId));
        const source = jsonfile.readFileSync(
          greenworks.ugcGetItemInstallInfo(item.publishedFileId).folder
        );
        console.log(source);
        source.publishedFileId = item.publishedFileId;
        source.steamIDOwner = item.steamIDOwner;
        if (steamID === item.steamIDOwner) {
          source.publishByMyself = true;
        }
        return source;
      });
      if (!_.isNull(workshopSource)) {
        workshopSource = workshopSource.filter(
          (source: any) => !_.isNull(source)
        );
        workshopSource.map((source: any) => {
          source.workshopTag = true;
          source.activeTag = true;
          return source;
        });
        unActiveSource.forEach((unActiveId: any) => {
          workshopSource.forEach((source: any) => {
            if (unActiveId === source.publishedFileId) {
              source.activeTag = false;
            }
          });
        });
        workshopSourceLocal.forEach((local: any) => {
          workshopSource.forEach((source: any) => {
            if (source.publishedFileId === local.publishedFileId) {
              source.changedSource = workshopSourceLocal;
            }
          });
        });
        setState({
          workshopSource,
          loadSuccess: true,
          setState,
        });
      }
    },
    (e: any) => {
      console.log(e);
      console.log('error');
    }
  );
}
export function unsubscribeByPublishedFileId(id: string) {
  greenworks.ugcUnsubscribe(
    id,
    (success: any) => {
      console.log(success);
    },
    (error: any) => {
      console.log(error);
    }
  );
}
