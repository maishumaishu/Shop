import { default as CarouselEditoir } from 'components/carousel/editor';
import { default as NoticeHeaderEditor } from 'components/noticeHeader/editor'
import { default as SummaryHeaderEditor } from 'components/summaryHeader/editor'
import { default as station } from 'services/Station';

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

station.getPageId('首页').then(pageId => {
    // let controlElement: HTMLElement = document.getElementById('control');
    // let editorElement: HTMLElement = document.getElementById('editor');
    // let controlId: string = guid();
    // let component = <CarouselEditoir controlElement={controlElement} controlId={controlId} pageId={pageId} />;
    // ReactDOM.render(component, editorElement);


    let controlElement: HTMLElement = document.getElementById('control');
    let editorElement: HTMLElement = document.getElementById('editor');
    let controlId: string = guid();
    let component = <SummaryHeaderEditor controlElement={controlElement} controlId={controlId} pageId={pageId} />
    ReactDOM.render(component, editorElement);

})

// debugger;
