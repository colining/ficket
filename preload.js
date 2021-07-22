const { ipcRenderer } = require('electron');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const clearHtml = async (videoRegex) => {
  if (document.URL.startsWith('https://v.qq.com')) {
    console.log('sleep');
    await sleep(3000);
  }
  const keep = document.querySelector(videoRegex);

  const keepParent = keep.parentNode;

  const body = document.querySelector('body');

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function removeUnusedChildUnless(keepParent, a) {
    [...keepParent.children].forEach((child) => {
      if (child.isSameNode(a)) {
        console.log('相同');
        return;
      }
      if (child.tagName === 'SCRIPT') {
        console.log('脚本');
        return;
      }
      if (child.tagName === 'STYLE') {
        console.log('样式');
        return;
      }
      if (child.tagName === 'svg') {
        console.log('图标');
        return;
      }
      console.log('不同，删除节点', child);
      keepParent.removeChild(child);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function removeAllUnusedNode(keepParent, keep) {
    if (body.isSameNode(keep)) {
      return;
    }
    removeUnusedChildUnless(keepParent, keep);
    removeAllUnusedNode(keepParent.parentNode, keepParent);
  }

  removeAllUnusedNode(keepParent, keep);
};

ipcRenderer.on('videoRegex', (event, videoRegex) => {
  clearHtml(videoRegex);
});

function findAllVideoTag() {
  const videoResults = [];
  const documentList = [document];
  videoResults.push(Array.from(document.querySelectorAll('video')));
  while (documentList.length > 0) {
    Array.from(documentList.shift().querySelectorAll('iframe')).forEach(
      (iframe) => {
        documentList.push(iframe.contentDocument);
        videoResults.push(
          Array.from(
            iframe.contentWindow.document.body.querySelectorAll('video')
          )
        );
      }
    );
  }
  return videoResults.flat();
}

function findLargestPlayingVideo() {
  const videos = findAllVideoTag();
  // need delete ?
  // document.querySelectorAll('iframe').forEach((iframe) => {
  //   videos = videos.concat(
  //     Array.from(iframe.contentWindow.document.body.querySelectorAll('video'))
  //   );
  // });
  // code from google picture in picture
  const videosResult = videos
    .filter((video) => video.readyState !== 0)
    .filter((video) => video.disablePictureInPicture === false)
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0] || { width: 0, height: 0 };
      const v2Rect = v2.getClientRects()[0] || { width: 0, height: 0 };
      return v2Rect.width * v2Rect.height - v1Rect.width * v1Rect.height;
    });

  if (videosResult.length === 0) {
    return null;
  }

  return videosResult[0];
}
const pipVideo = () => {
  const video = findLargestPlayingVideo();
  if (video) {
    video.requestPictureInPicture();
  }
};

ipcRenderer.on('pipVideo', (event) => {
  console.log('pipVideo', 'renderer');
  pipVideo();
});
