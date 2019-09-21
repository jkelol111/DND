window.addEventListener('DOMContentLoaded', () => {
  var activityHandler = null;
  navigator.mozSetMessageHandler('activity', (activityRequest) => {
    if(activityRequest.source.name == "volumes") {
      activityHandler = activityRequest;
    }
  });
  naviBoard.setNavigation("settings_container");
  window.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'Backspace':
      case 'SoftRight':
        e.preventDefault();
        activityHandler.postResult({});
        break;
    }
  })
});