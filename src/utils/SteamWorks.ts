import greenworks from 'greenworks';
import * as jsonfile from 'jsonfile';
import React from 'react';
import _ from 'lodash';

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
      let workshopSource = items.map((item: any) => {
        if (_.isEmpty(greenworks.ugcGetItemInstallInfo(item.publishedFileId))) {
          return null;
        }
        return jsonfile.readFileSync(
          greenworks.ugcGetItemInstallInfo(item.publishedFileId).folder
        );
      });

      if (!_.isNull(workshopSource)) {
        workshopSource = workshopSource.filter(
          (source: any) => !_.isNull(source)
        );

        workshopSource.map((source: any) => {
          source.workshopTag = true;
          return source;
        });
        setState({ workshopSource, loadSuccess: true });
      }
    },
    (e: any) => {
      console.log(e);
      console.log('error');
    }
  );
}
