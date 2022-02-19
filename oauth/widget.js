
function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

IN.tags.add('OAuth', class OAuth extends IN.SDK.Tag {
    constructor(node, core) {
        super(node, core);
        const profileDataCallback = this.attributes["callback-method"];
        const div = document.createElement('div');
        div.style['background-color'] = "light-gray";
        div.style['height'] = "100px";
        div.style['width'] = "600px";
        const anchor = document.createElement('button');
        anchor.textContent = "Apply With LinkedIn";
        anchor.style = "color: #0073b1;"
        div.appendChild(anchor);
        anchor.addEventListener('click', (data) => {
            IN.user.authorizeV2('r_fullprofile').then((credentials) => {
                // the user is now authenticated
                const request = IN.api.request('/v2/me?projection=(certifications,certificationsOrder,honors,honorsOrder,localizedFirstName,localizedLastName,localizedHeadline,vanityName,location,positions,positionsOrder,skills,skillsOrder,educations,educationsOrder,skills,skillsOrder)', {}, IN);
                request.then((data) => {
                  executeFunctionByName(profileDataCallback,window,data);
                });
            });
        });
        this.insert(div);
    }
});
//certifications,certificationsOrder,honors,honorsOrder,localizedFirstName,localizedLastName,localizedHeadline,localizedSummary,localizedSpecialties,vanityName,profilePicture,pictureInfo,location,positions,positionsOrder,skills,skillsOrder,educations,educationsOrder,patents,patentsOrder,languages,languagesOrder,publications,publicationsOrder,phoneNumbers,geoLocation