interface StoreInfo {
    Name: string,
    ImagePath: string
}

interface ControlDescrtion {
    controlId: string, controlName: string, data?: any,
    selected?: boolean | 'disabled'
}

interface TemplatePageData {
    id: string;
    name: string;
    image: string;
}