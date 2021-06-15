import greenworks from 'greenworks';
import * as jsonfile from 'jsonfile';
import React from 'react';

export const WorkshopContext = React.createContext({
  workshopSource: [],
  loadSuccess: false,
});

export default function getWorkShopItemsPathAndSetToState(setState: any) {
  greenworks.ugcGetUserItems(
    greenworks.UGCMatchingType.Items,
    greenworks.UserUGCListSortOrder.CreationOrderDesc,
    greenworks.UserUGCList.Subscribed,
    (items: any) => {
      const workshopSource = items.map((item: any) =>
        jsonfile.readFileSync(
          greenworks.ugcGetItemInstallInfo(item.publishedFileId).folder
        )
      );
      workshopSource.map((source: any) => {
        source.workshopTag = true;
        return source;
      });
      setState({ workshopSource, loadSuccess: true });
    },
    (e: any) => {
      console.log(e);
      console.log('error');
    }
  );
}
