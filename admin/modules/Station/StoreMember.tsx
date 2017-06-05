import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { default as station, PageData, ControlData } from 'services/Station';
import { default as MemberControl } from 'mobileComponents/member/control';
import { default as StyleControl } from 'mobileComponents/style/control';
export default function (page: chitu.Page) {
    let pageData = {} as PageData;
    ReactDOM.render(
        <MobilePageDesigner >
            <MemberControl />
            <StyleControl />
        </MobilePageDesigner>, page.element);
}
