namespace ui {
    export class Panel {
        private modalDialog: HTMLElement;
        private _body: HTMLElement;
        private _footer: HTMLElement;
        private _header: HTMLElement;
        private backdrop: HTMLElement;
        private panel: HTMLElement;
        private modal: HTMLElement;

        constructor(element: HTMLElement) {
            if (!element) throw errors.argumentNull('element');


            this.build(element);

            let isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0
            //=====================================================================
            // 点击非窗口区域，关窗口。并禁用上级元素的 touch 操作。
            // let panel = this.panel; //this.refs['panel'] as HTMLElement;
            // let modalDialog = this.modalDialog; //this.refs['modalDialog'] as HTMLElement;
            this.panel.addEventListener('touchstart', (event) => {
                let dialogRect = this.modalDialog.getBoundingClientRect();
                for (let i = 0; i < event.touches.length; i++) {
                    let { clientX } = event.touches[i];
                    if (clientX < dialogRect.left) {
                        this.hide();
                        return;
                    }
                }
            });

            //=========================================================
            // 防止滚动面板时，事件穿透到面板底下的页面
            if (isIOS) {
                this.panel.addEventListener('touchstart', (event) => {
                    let tagName = (event.target as HTMLElement).tagName;
                    if (tagName == 'BUTTON' || tagName == 'INPUT' || tagName == 'A') {
                        return;
                    }
                    event.stopPropagation();
                    event.preventDefault();
                });
            }
            //=========================================================
        }
        get header() {
            return this._header;
        }
        get body() {
            return this._body;
        }
        get footer() {
            return this._footer;
        }
        build(element: HTMLElement) {
            this.panel = element;
            this.panel.className = 'panel';
            this.panel.style.display = 'none';

            // document.body.appendChild(panel);
            this.panel.innerHTML = `
                <div class="modal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
        
                            </div>
                            <div class="modal-body">
        
                            </div>
                            <div class="modal-footer">
        
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop in">
                </div>
            `;

            this.modal = this.panel.querySelector('.modal') as HTMLElement;
            this.backdrop = this.panel.querySelector('.modal-backdrop') as HTMLElement;
            this._header = this.panel.querySelector('.modal-header') as HTMLElement;
            this._footer = this.panel.querySelector('.modal-footer') as HTMLElement;

            this._body = this.panel.querySelector(".modal-body") as HTMLElement;
            this.modalDialog = this.panel.querySelector(".modal-dialog") as HTMLElement;
        }
        show() {
            // args = args || {};
            this.panel.style.display = 'block';
            this.modal.style.display = 'block';

            setTimeout(() => {
                this.modal.style.transform = 'translateX(0)';
                this.backdrop.style.opacity = '0.5';
            }, 50);

            let setBodyHeight = () => {
                let headerHeight = this._header.getBoundingClientRect().height;
                let footerHeight = this._footer.getBoundingClientRect().height;
                let bodyHeight = window.innerHeight - headerHeight - footerHeight;
                this._body.style.height = `${bodyHeight}px`;
            };

            window.addEventListener('resize', () => setBodyHeight());
            setBodyHeight();

            // if (args.header)
            //     args.header(header);

            // if (args.body)
            //     args.body(body);

            // if (args.footer)
            //     args.footer(footer);

            // return {
            //     hide: () => hide()
            // }
        }
        hide() {
            this.modal.style.removeProperty('transform');
            this.backdrop.style.opacity = '0';
            window.setTimeout(() => {
                this.panel.style.display = 'none';
            }, 500);
        }
    }
} 