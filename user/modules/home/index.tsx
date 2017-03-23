import * as services from 'services';
export default function (page: chitu.Page) {
    var pageService = new services.PageService();
    pageService.pageData().then(pageData => {
        for (let i = 0; i < pageData.controls.length; i++) {
            let controlElement = document.createElement('div');
            page.element.appendChild(controlElement);

            let controlPath = `controls/${pageData.controls[i].controlName}/control`;
            console.log(controlPath);
            requirejs([controlPath], o => {
                debugger;
                let reactElement = React.createElement(o.Control, pageData.controls[i].data);
                ReactDOM.render(reactElement, controlElement, function () {
                    debugger;
                })
            });
        }

    });
}