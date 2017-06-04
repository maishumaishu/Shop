import { MobilePage } from 'modules/Station/Components/MobilePage';
import { default as station, PageData, ControlData } from 'services/Station';

export default function (page: chitu.Page) {
    let pageData = {} as PageData;
    ReactDOM.render(<MobilePage pageData={pageData} />, page.element);
}