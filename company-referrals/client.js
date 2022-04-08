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

const MODAL_CONTAINER_NAME = "IN-modal-container"
function createModalContainer() {
    let modalContainer = document.getElementById(MODAL_CONTAINER_NAME);
    if (modalContainer) {
        return modalContainer;
    }
    //Hide hovercard once anchor goes out of viewport for e.g. anchors
    //IN.Util.addCSS('.modal{font-family:-apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,ubuntu,roboto,noto,segoe ui,arial,sans-serif}.modal__overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);display:flex;justify-content:center;align-items:center}.modal__container{background-color:#fff;padding:30px;max-width:500px;max-height:100vh;border-radius:4px;overflow-y:auto;box-sizing:border-box}.modal__header{display:flex;justify-content:space-between;align-items:center}.modal__title{margin-top:0;margin-bottom:0;font-weight:600;font-size:1.25rem;line-height:1.25;color:#00449e;box-sizing:border-box}.modal__close{background:0 0;border:0}.modal__header .modal__close:before{content:"\2715"}.modal__content{margin-top:2rem;margin-bottom:2rem;line-height:1.5;color:rgba(0,0,0,.8)}.modal__btn{font-size:.875rem;padding-left:1rem;padding-right:1rem;padding-top:.5rem;padding-bottom:.5rem;background-color:#e6e6e6;color:rgba(0,0,0,.8);border-radius:.25rem;border-style:none;border-width:0;cursor:pointer;-webkit-appearance:button;text-transform:none;overflow:visible;line-height:1.15;margin:0;will-change:transform;-moz-osx-font-smoothing:grayscale;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform:translateZ(0);transform:translateZ(0);transition:-webkit-transform .25s ease-out;transition:transform .25s ease-out;transition:transform .25s ease-out,-webkit-transform .25s ease-out}.modal__btn:focus,.modal__btn:hover{-webkit-transform:scale(1.05);transform:scale(1.05)}.modal__btn-primary{background-color:#00449e;color:#fff}@keyframes mmfadeIn{from{opacity:0}to{opacity:1}}@keyframes mmfadeOut{from{opacity:1}to{opacity:0}}@keyframes mmslideIn{from{transform:translateY(15%)}to{transform:translateY(0)}}@keyframes mmslideOut{from{transform:translateY(0)}to{transform:translateY(-10%)}}.micromodal-slide{display:none}.micromodal-slide.is-open{display:block}.micromodal-slide[aria-hidden=false] .modal__overlay{animation:mmfadeIn .3s cubic-bezier(0,0,.2,1)}.micromodal-slide[aria-hidden=false] .modal__container{animation:mmslideIn .3s cubic-bezier(0,0,.2,1)}.micromodal-slide[aria-hidden=true] .modal__overlay{animation:mmfadeOut .3s cubic-bezier(0,0,.2,1)}.micromodal-slide[aria-hidden=true] .modal__container{animation:mmslideOut .3s cubic-bezier(0,0,.2,1)}.micromodal-slide .modal__container,.micromodal-slide .modal__overlay{will-change:transform}.modal{display:none}.modal.is-open{display:block}');
    modalContainer = document.createElement('div');
    modalContainer.className = `${MODAL_CONTAINER_NAME} modal micromodal-slide`;
    modalContainer.id = MODAL_CONTAINER_NAME;
//     modalContainer.innerHTML = `
//   <div class="modal__overlay" tabindex="-1" data-micromodal-close>
//     <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
//       <header class="modal__header">
//         <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
//       </header>
//       <main class="modal__content" id="IN-modal-container-content">
//       </main>
//     </div>
//   </div>`;
    document.body.appendChild(modalContainer);
    return modalContainer;
}
// MicroModal.init({
//     onShow: modal => console.info(`${modal.id} is shown`), // [1]
//     onClose: modal => {debugger;}, // [2]
//     openClass: 'is-open', // [5]
//     disableScroll: true, // [6]
//     disableFocus: false, // [7]
//     awaitOpenAnimation: false, // [8]
//     awaitCloseAnimation: false, // [9]
//     debugMode: true // [10]
//   });

let modalContainer = createModalContainer();

/* global IN */
IN.tags.add('CompanyConnections', function CompanyConnections(node, core) {
    let tag = new IN.SDK.Tag(node, core);
    const { SmartWindow } = core.Objects;

    // Validate client parameters
    const integrationContext = tag.attributes["integration-context"];

    if (!integrationContext) {
        throw new Error(
            "Applicant Highlights widget requires an integration-context"
        );
    }

    let iframe = new IN.SDK.EmbeddedWindow('http://localhost:3000/company-referrals/server.html', {
        attributes: {
            width: 420,
            height: 650,
        },
        method: 'GET'
    });

    tag.insert(iframe.self);
    let client = new IN.SDK.Client(iframe);
    let popperInstance;
    // Refer event
    client.on('refer', function (referralData) {
        console.log("Refer event recieved", referralData);
        // OPTION 1
        const smartWindow = new SmartWindow({
            width: 420,
            height: 80,
            mode: 'modal',
            // anchor: {
            //   fixed: anchor,
            //   movable: null,
            //   context
            // },
            url: `http://localhost:3000/company-referrals/referModal.html`,
            method: "GET"
          }, this).params(referralData);

        smartWindow.place(modalContainer);

        // // OPTION 2
        // let modalWindow = new IN.SDK.EmbeddedWindow('http://localhost:3000/company-referrals/referModal.html', {
        //     attributes: {
        //         width: 420,
        //         height: 650,
        //     },
        //     method: 'GET'
        // });
        // const referralIframe = modalWindow.self;
        // const referralClient = new IN.SDK.Client(modalWindow);
        // modalContainer.querySelector("#IN-modal-container-content").appendChild(referralIframe);
        // // OPTION 3
        // popperInstance = IN.SDK.PopperJS.createPopper(body, iframe.self, {
        //   placement: 'right-end',
        //   modifiers: [{
        //     name: 'hide' // Popper modifier that tracks when reference element goes out of viewport
        //   }]
        // });
        // referralClient.on('resize', () => {
        //     if(popperInstance) {
        //       popperInstance.update();
        //     }
        //   });
        //MicroModal.show('IN-modal-container');
    });

    return tag;
});
