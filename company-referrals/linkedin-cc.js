/**
 * Company Connections Widget Extension.
 * This javascript will be loaded on third party websites.
 *
 * - Initializes and loads xdoor iframe on third party website
 * - Handle cross domain communication
 *
 * See  {@link http://go/xdoor/docs} for more details
 *
 */
 const X_DOOR_USER_AUTHENTICATED_EVENT = 'userAuthenticated';
 const X_DOOR_OPEN_REFERRAL_MODAL_EVENT = 'openReferralModal';
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
       `data-mode=${mode} is not supported for Company connections widget. Use one of ${MODE_REFERRAL} or ${MODE_CONNECTIONS}`);
   }
   let referralJobTitle, referralCompanyName, referralJobUrl, referralUrl;
   if (mode === MODE_REFERRAL) {
     referralJobTitle = tag.attributes['job-title'];
     if (!referralJobTitle) {
       throw new Error('Company connections widget REFERRAL mode requires data-job-title ');
     }
     referralCompanyName = tag.attributes['company-name'];
     if (!referralCompanyName) {
       throw new Error('Company connections widget REFERRAL mode requires data-company-name');
     }
     referralJobUrl = tag.attributes['job-url'];
     if (!referralJobUrl) {
       throw new Error('Company connections widget REFERRAL mode requires data-job-url');
     }
     referralUrl = tag.attributes['referral-url'];
     if (!referralUrl) {
       throw new Error('Company connections widget REFERRAL mode requires data-referral-url');
     }
   }
 
   let iframe = new IN.SDK.EmbeddedWindow('http://localhost:9000/careersite/extensions/companyConnections', {
     params: {
       apiKey: core.options.get('apiKey'),
       integrationContext: tag.attributes['integration-context'],
       iframeWidth: width,
       iframeHeight: height,
       mode,
       referralJobTitle,
       referralCompanyName,
       referralJobUrl,
       referralUrl,
     }, attributes: {
       width: width, height: height
     }, method: 'GET'
   });
 
   const client = new IN.SDK.Client(iframe);
   // fire the xdoor 'refresh' event to reload the page on successful authentication
   client.on(X_DOOR_USER_AUTHENTICATED_EVENT, IN.events.refresh);
 
   client.on(X_DOOR_OPEN_REFERRAL_MODAL_EVENT, function (referralRequestData) {
     // TODO: Open Referral modal by calling referrals endpoint
     console.log(referralRequestData);
   });
   tag.insert(iframe.self);
 
   return tag;
 });
 