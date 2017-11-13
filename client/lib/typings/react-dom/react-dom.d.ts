/// <reference path="../react/react.d.ts"/>

declare namespace ReactDOM {
    function render<P>(
        element: React.ReactElement<P>,
        container?: Element,
        callback?: Function
    )
    function createPortal(
        children: React.ReactElement<any>[],
        container: Element,
    )
    function render<P>(
        element: React.ReactElement<any>[],
        container?: Element,
        callback?: Function
    )
}

declare module 'react-dom' {
    export = ReactDOM;
}
