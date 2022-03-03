function renderWidget(params, env) {
    let widgetContainerElem = document.querySelector('#widget-container');
    widgetContainerElem.innerHTML = '';
    let xdoorElem = document.createElement('script');
    const xdoorUrl = `https://platform.linkedin${env === 'EI' ? '-ei' : ''}.com/in.js`;
    const widgetUrl = `https://www.linkedin${env === 'EI' ? '-ei' : ''}.com/talentwidgets/extensions/apply-with-linkedin-widget`;
    xdoorElem.src = xdoorUrl;
    xdoorElem.innerHTML = `api_key:${params['api_key']}
      extensions:AwliWidget@${widgetUrl}`;

    let widgetElem = document.createElement('script');
    widgetElem.type = 'IN/AwliWidget';
    widgetElem.setAttribute('data-integration-context', params['data-integration-context']);
    widgetElem.setAttribute('data-callback-method', 'handleProfileData');
    widgetElem.setAttribute('data-mode', params['data-mode']);
    widgetElem.setAttribute('data-color', params['data-color']);
    widgetElem.setAttribute('data-size', params['data-size']);
    // process optional params
    // OPTIONAL_PARAMS.forEach((param) => {
    //     if (params[param]) {
    //         widgetElem.setAttribute(param, params[param]);
    //     }
    // });

    widgetContainerElem.append(xdoorElem);
    widgetContainerElem.append(widgetElem);
}

function renderWidgetWithCustomValues(e) {
    e.preventDefault();

    let params = {};
    params['api_key'] = document.querySelector('#data-api-key').value;
    params['data-integration-context'] = document.querySelector('#data-integration-context').value;
    params['data-mode'] = document.querySelector('#data-mode').value;
    params['data-color'] = document.querySelector('#data-color').value;
    params['data-size'] = document.querySelector('#data-size').value;
    params['data-size'] = document.querySelector('#data-size').value;
    const env = document.querySelector('#env').value || 'prod';
    renderWidget(params, env);
}
function init() {
    document.querySelector('#renderBtn').addEventListener('click', (e) => renderWidgetWithCustomValues(e));


}
window.addEventListener('load', init);
