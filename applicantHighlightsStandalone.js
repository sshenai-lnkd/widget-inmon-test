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
IN.tags.add('ApplicantHighlights', function ApplicantHighlights(node, core) {
  let tag = new IN.SDK.Tag(node, core);

  // Validate client parameters
  const integrationContext = tag.attributes["integration-context"];
  const jobApplicationUrn = tag.attributes["li-job-application-id"];
  const profileUrl = tag.attributes["li-applicant-profile-url"];
  const applicantEmail = tag.attributes["applicant-email"];
  const externalJobPostingId = tag.attributes["ats-job-posting-id"];

  if (!integrationContext) {
    throw new Error(
        "Applicant Highlights widget requires an integration-context"
    );
  }
  if (!jobApplicationUrn && !externalJobPostingId) {
    throw new Error(
        "Job Application id or Job posting id parameters are required and missing"
    );
  }

  if (!jobApplicationUrn && externalJobPostingId && !(profileUrl || applicantEmail)) {
    throw new Error(
        "Either LinkedIn profile url or applicant email parameters are required."
    );
  }
  const widgetParams = Object.assign(
      {},
      { apiKey: core.options.get("apiKey") },
      integrationContext && { integrationContext },
      jobApplicationUrn && { jobApplicationUrn },
      externalJobPostingId && { externalJobPostingId },
      applicantEmail && { applicantEmail },
      profileUrl && { profileUrl }
  );
  let iframe = new IN.SDK.EmbeddedWindow(`${core.options.get('urls.www.linkedin.com')}/talentwidgets/applicant-highlights`, {
    params: widgetParams,
    attributes: {
      width: 420,
      height: 650,
    },
    form: true,
    method: 'POST'
  });

  const client = new IN.SDK.Client(iframe);
  // fire the xdoor 'refresh' event to reload the page on successful authentication
  client.on('userAuthenticated', IN.events.refresh);
  tag.insert(iframe.self);

  return tag;
});
