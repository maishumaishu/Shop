
import ko = require('knockout');
import ko_ext = require('common/ko_ext/core');

ko_ext.image.imageServer = 'http://a.alinq.cn';
ko_ext.image.storeName = '零食有约';

class Application extends chitu.Application {

    nav_bar = {
        title: ko.observable(),
        paths: ko.observableArray()
    };

    constructor() {
        super({
            pathBase: 'mod/',
            container: (routeData: chitu.RouteData, previous: chitu.PageContainer) => {
                let contentElement = document.getElementById('mainContent');
                let containerElement = document.createElement('div');
                contentElement.appendChild(containerElement);
                console.assert(contentElement != null);
                var c: chitu.PageContainer = chitu.PageContainerFactory.createInstance({
                    app: this, routeData, previous,
                    element: containerElement
                });

                return c;
            },
        })



        ko.applyBindings(this.nav_bar, document.getElementById('breadcrumbs'));
    }
}

var app = new Application();
var expanded = false;
app.pageCreated.add(function (sender, page) {
    /// <param name="page" type="chitu.Page"/>
    page.load.add(function (sender, args) {


        var url = '#' + args['controller'] + '/' + args['action'];
        var $url = $('#sidebar').find('[href="' + url + '"]').parent().children('a').first();
        //=====================================================
        // 设置导航栏的标题
        //$url.parents('ul').find('li').removeClass('active');
        //$url.parents('li').first().addClass('active');
        //nav_bar.title($url.text());
        //=====================================================

        if (!expanded) {
            // 说明：必须设置延迟才有效
            window.setTimeout(function () {
                if ($url.length == 0) {
                    $('#sidebar > ul > li > a').first().trigger('click');
                }

                //window.setTimeout(function () {
                while ($url.length > 0) {
                    $url.trigger('click');
                    //===================================================================
                    // 触发菜单的点击事件，使得菜单展开
                    $url = $url.closest('ul').parent().children('a').first();
                }
                //}, 200);

                expanded = true;
            }, 200);
        }
    });
})

app.backFail.add((sender) => {
    switch (sender.currentPage.name) {
        case 'Shopping.ProductEdit':
            app.redirect('Shopping/ProductList');
            break;
    }
});

window['app'] = app;
export = app;
