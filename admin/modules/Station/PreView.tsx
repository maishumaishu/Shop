import { Editor, EditorProps, EditorState } from 'mobile/components/editor'
import { default as station, PageData } from 'services/Station';
import FormValidator = require('common/formValidator');
import { Page } from 'mobilePage';
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
    let pageData = {} as PageData;// PageData();// 
    if (pageId)
        pageData = await station.pageData(pageId);
    else if (templateId)
        pageData = await station.pageDataByTemplate(templateId);

    ReactDOM.render(
        <div className="marvel-device iphone6">
            <div className="top-bar"></div>
            <div className="sleep"></div>
            <div className="volume"></div>
            <div className="camera"></div>
            <div className="sensor"></div>
            <div className="speaker"></div>
            <div className="screen">
                 <Page pageData={pageData} />
            </div>
            <div className="home"></div>
            <div className="bottom-bar"></div>
        </div>,
        /*<div className="view">
            <Page pageData={pageData} />
        </div>,*/
        page.element
    );
}