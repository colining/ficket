const clearHtml = (videoRegex) => {
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
        console.log('脚本');
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

const pipVideo = () => {
  const iframe = document.querySelector('iframe');
  const iframeDocument = iframe.contentDocument;
  const video = iframeDocument.querySelector('video');
  video.requestPictureInPicture();
};
const { ipcRenderer } = require('electron');

ipcRenderer.on('videoRegex', (event, videoRegex) => {
  clearHtml(videoRegex);
});

ipcRenderer.on('pipVideo', (event, videoRegex) => {
  pipVideo();
});
