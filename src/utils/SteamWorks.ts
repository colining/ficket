import greenworks from 'greenworks';
import * as jsonfile from 'jsonfile';

export const WorkshopContext = { workshopSource: [] };

export default function getWorkShopItemsPath(context: any) {
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
      context.workshopSource = workshopSource;
    },
    (e: any) => {
      console.log(e);
      console.log('error');
    }
  );
}
