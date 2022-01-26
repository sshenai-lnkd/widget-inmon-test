
(function () {
    this._server = new IN.SDK.Server({
        events: [X_DOOR_USER_AUTHENTICATED_EVENT],
      });
      document
      .getElementById('referBtn')
      .addEventListener('click', (event) => {
        event.preventDefault();
        IN.Support.signinWindow().then(() => {
          this.refreshXDoorIframe();
        });
      });
})();


