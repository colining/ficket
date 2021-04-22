// eslint-disable-next-line import/prefer-default-export
export const removeAllUnusedNode = `function clear_html(videoRegex) {
const keep = document.querySelector(videoRegex);

const keep_parent = keep.parentNode;

const body = document.querySelector('body');

function remove_unused_child_unless(keep_parent, a) {
[...keep_parent.children].forEach((child) => {
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
  keep_parent.removeChild(child);
});
}

function remove_all_unused_node(keep_parent, keep) {
if (body.isSameNode(keep)) {
  return;
}
remove_unused_child_unless(keep_parent, keep);
remove_all_unused_node(keep_parent.parentNode, keep_parent);
}

remove_all_unused_node(keep_parent, keep);
}`;

export const withHttp = (url: string) => {
  return url.startsWith('http') ? url : `http://${url}`;
};

export const getFormData = (object: any) =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());
