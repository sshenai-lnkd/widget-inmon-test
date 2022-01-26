/**
 * ApplicantHighlights Widget Extension.
 * This javascript will be be loaded on third party websites.
 *
 * - Initializes and loads xdoor iframe on third party website
 * - Handle cross domain communication
 *
 * See  {@link http://go/xdoor/docs} for more details
 *
 */
/* global IN */
IN.tags.add('CompanyConnections', function CompanyConnections(node, core) {
    let tag = new IN.SDK.Tag(node, core);

    // Validate client parameters
    const integrationContext = tag.attributes["integration-context"];

    if (!integrationContext) {
        throw new Error(
            "Applicant Highlights widget requires an integration-context"
        );
    }

    let iframe = new IN.SDK.EmbeddedWindow('https://sshenai-lnkd.github.io/widget-inmon-test/company-referrals/server.html', {
        attributes: {
            width: 420,
            height: 650,
        },
        method: 'GET'
    });
    const client = new IN.SDK.Client(iframe);

    // Refer event
    client.on('refer', function(data) {
        console.log("Refer event recieved", data);
        let modalWindow = new IN.SDK.EmbeddedWindow('https://sshenai-lnkd.github.io/widget-inmon-test/company-referrals/referModal.html', {
            attributes: {
                width: 420,
                height: 650,
            },
            method: 'GET'
        });
        tag.insert(modalWindow.self);
    });
    tag.insert(iframe.self);
    return tag;
});
