
(function () {
  this._server = new IN.SDK.Server({
    events: ['refer'],
  });
  document
    .getElementById('referBtn')
    .addEventListener('click', (event) => {
      event.preventDefault();
      this._server.send('refer', { key: 'Refer event' });
    });
  this._server.ready();
})();


