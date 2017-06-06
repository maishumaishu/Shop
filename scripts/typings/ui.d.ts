export declare let buttonOnClick: (callback: (event: MouseEvent) => Promise<any>, args?: {
    confirm?: string;
    toast?: string | JSX.Element;
}) => (event: any) => void;
export declare let alert: (msg: string) => void;
