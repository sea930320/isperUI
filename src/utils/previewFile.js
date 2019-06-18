
export function openFile(fileUrl, userId) {
  let url = '';
  let localhostUrl = location.origin;
  let previewUrl = 'http://47.92.94.220:8013/onlinePreview?userKey=' + userId + '&url=';
  url = previewUrl + encodeURIComponent(localhostUrl + fileUrl);
  var winHeight = window.document.documentElement.clientHeight - 10;
  window.open(url, '_blank', 'height=' + winHeight + ',top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
}
