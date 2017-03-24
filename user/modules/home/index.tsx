import * as services from 'services';
export default function (page: chitu.Page) {
    var pageService = new services.PageService();
    pageService.pageData().then(pageData => {
        for (let i = 0; i < pageData.controls.length; i++) {
            let controlElement = document.createElement('div');
            page.element.appendChild(controlElement);

            let controlPath = `components/${pageData.controls[i].controlName}/control`;
            console.log(controlPath);
            requirejs([controlPath], o => {
                var control = o.default;
                console.assert(control != null);
                let reactElement = React.createElement(control, pageData.controls[i].data);
                ReactDOM.render(reactElement, controlElement, function () {
                })
            });
        }

    });
}