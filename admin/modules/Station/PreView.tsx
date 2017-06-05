import { Editor, EditorProps, EditorState } from 'mobile/components/editor'
import { default as station, PageData } from 'services/Station';
import FormValidator = require('common/formValidator');
import { MobilePage as Page } from 'modules/Station/Components/MobilePage';
let controlsPath = 'mobile/controls'
let modules = [];
modules.push(
    'scripts/hammer', 'scripts/bezier-easing', `${controlsPath}/common`,
    `${controlsPath}/button`, `${controlsPath}/dataList`, `${controlsPath}/dialog`, `${controlsPath}/htmlView`,
    `${controlsPath}/imageBox`, `${controlsPath}/indicators`, `${controlsPath}/page`, `${controlsPath}/panel`,
    `${controlsPath}/tabs`
);
requirejs(modules);
requirejs(['css!content/devices.css'])
export default async function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);

    let { pageId, templateId } = page.routeData.values;
    let pageData = {} as PageData;
    if (pageId)
        pageData = await station.pageData(pageId);
    else if (templateId)
        pageData = await station.pageDataByTemplate(templateId);

    ReactDOM.render(
        <div className="mobile">
            <Page pageData={pageData} mode="preview"/>
        </div>,
        page.element
    );
}