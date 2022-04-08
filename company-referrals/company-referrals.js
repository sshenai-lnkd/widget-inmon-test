/**
 * Company Connections Widget Extension.
 * This javascript will be be loaded on third party websites.
 *
 * - Initializes and loads xdoor iframe on third party website
 * - Handle cross domain communication
 *
 * See  {@link http://go/xdoor/docs} for more details
 *
 */
const MODAL_CONTAINER_NAME = "IN-modal-container"
/**
 * Create a new modal container element and append it to the body of the third party website
 * Widget iframes will be appended to this element when mounted.
 * @returns HTMLElement
 */
 function createModalContainer() {
    let modalContainer = document.getElementById(MODAL_CONTAINER_NAME);
    if (modalContainer) {
      return modalContainer;
    }
    //Hide hovercard once anchor goes out of viewport for e.g. anchors
    IN.Util.addCSS('.IN-hovercard > iframe[data-popper-reference-hidden] { visibility: hidden; pointer-events: none;}}');
    modalContainer = document.createElement('div');
    modalContainer.className = MODAL_CONTAINER_NAME;
    modalContainer.id = MODAL_CONTAINER_NAME;
    document.body.appendChild(modalContainer);
    return modalContainer;
  }
  
  let modalContainer = createModalContainer();
  
  const MODE_CONNECTIONS = 'CONNECTIONS';
  const MODE_REFERRAL = 'REFERRAL';
  /* global IN */
  IN.tags.add('CompanyConnections', function companyConnections(node, core) {
    let tag = new IN.SDK.Tag(node, core);
  
    // Validate client parameters
    if (!tag.attributes['integration-context']) {
      throw new Error('Company connections widget requires an integration-context');
    }
  
    let width = tag.attributes.width ? parseInt(tag.attributes.width, 10) : 360;
    if (width < 265) {
      throw new Error('Company connections widget requires a minimum width of 265px');
    } else if (width > 360) {
      throw new Error('Company connections widget supports a maximum width of 360px');
    }
    let height = tag.attributes.height ? parseInt(tag.attributes.height, 10) : 246;
    if (height < 234) {
      throw new Error('Company connections widget requires a minimum height of 234px');
    } else if (height > 246) {
      throw new Error('Company connections widget supports a maximum height of 246px');
    }
    const mode = tag.attributes.mode || MODE_CONNECTIONS;
    if (mode !== MODE_REFERRAL && mode !== MODE_CONNECTIONS) {
      throw new Error(
          `data-mode ${mode} is not supported for Company connections widget. Use one of ${MODE_REFERRAL} or ${MODE_CONNECTIONS}`);
    }
    let jobTitle, companyName, jobUrl, referralUrl;
    if (mode === MODE_REFERRAL) {
      jobTitle = tag.attributes['job-title'];
      if (!jobTitle) {
        throw new Error('Company connections widget REFERRAL mode requires data-job-title ');
      }
      companyName = tag.attributes['company-name'];
      if (!companyName) {
        throw new Error('Company connections widget REFERRAL mode requires data-company-name');
      }
      jobUrl = tag.attributes['job-url'];
      if (!jobUrl) {
        throw new Error('Company connections widget REFERRAL mode requires data-job-url');
      }
      referralUrl = tag.attributes['referral-url'];
      if (!referralUrl) {
        throw new Error('Company connections widget REFERRAL mode requires data-referral-url');
      }
    }
    let iframe = new IN.SDK.EmbeddedWindow('https://www.linkedin.com/careersite/extensions/companyConnections', {
      params: {
        apiKey: core.options.get('apiKey'),
        integrationContext: tag.attributes['integration-context'],
        iframeWidth: width,
        iframeHeight: height,
        mode,
        jobTitle,
        companyName,
        jobUrl,
        referralUrl
      },
      attributes: {
        width: width,
        height: height
      },
      method: 'GET'
    });
  
    const client = new IN.SDK.Client(iframe);
    // fire the xdoor 'refresh' event to reload the page on successful authentication
    client.on('userAuthenticated', IN.events.refresh);
    client.on('openReferralModal', function(referralRequestData) {
      let referralWindow = new IN.SDK.EmbeddedWindow(`${core.options.get('urls.www.linkedin.com')}/careersite/extensions/companyConnections`, {
        params: {
          apiKey: core.options.get('apiKey'),
          integrationContext: tag.attributes['integration-context'],
          iframeWidth: width,
          iframeHeight: height,
          mode,
          jobTitle,
          companyName,
          jobUrl,
          referralUrl
        },
        attributes: {
          width: 420,
          height: 0, // Height is purposely set to zero to avoid displaying the iframe being resized
        },
        method: 'GET'
      });
  
      let iframe = referralWindow.self;
      const client = new IN.SDK.Client(referralWindow);
      modalContainer.appendChild(iframe);
      let popperInstance = IN.SDK.PopperJS.createPopper(body, iframe, {
        placement: 'right-end',
        modifiers: [{
          name: 'hide' // Popper modifier that tracks when reference element goes out of viewport
        }]
      });
      iframe.style['z-index'] = '9999';
      client.on('resize', () => {
        if(popperInstance) {
          popperInstance.update();
        }
      });
    });
    tag.insert(iframe.self);
  
    return tag;
  });
  