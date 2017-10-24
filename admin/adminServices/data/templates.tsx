import { TemplatePageData, PageData, guid } from 'adminServices/station';

let templates: (TemplatePageData & { pageData: PageData })[] = [
    {
        _id: '59a25f4e694b85c03d3c4951',
        name: 'HomePage',
        image: 'https://img.yzcdn.cn/public_files/2017/1/10/a6cf8a4b788be075db7456a022154e1a.png',
        pageData: {
            "header": { "controls": [] },
            "footer": { "controls": [] },
            "views": [
                { "controls": [{ "controlId": "", "controlName": "summaryHeader" }] }
            ]
        }
    }
]

export default templates;