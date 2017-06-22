import { default as station, PageData, ControlData, guid } from 'services/Station';
import { ComponentDesigner } from 'modules/Station/Components/ComponentDesigner';
import { default as MenuControl, MenuNode, Props as MenuProps } from 'mobileComponents/menu/control';
import { default as MenuEditor } from 'mobileComponents/menu/editor';
import { default as StyleControl } from 'mobileComponents/style/control';
import { Component } from 'mobileComponents/common';
import { PageComponent, PageView, PageFooter } from 'mobileControls';
export default async function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);

    ReactDOM.render(<ComponentDesigner controlName='menu' target="footer" />, page.element);
}