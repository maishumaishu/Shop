
import ko = require('knockout');
import ko_ext = require('common/ko_ext/core');
import Service = require('services/Service');

ko_ext.image.imageServer = 'http://a.alinq.cn';
ko_ext.image.storeName = '零食有约';



class Application extends chitu.Application {

    nav_bar = {
        title: ko.observable(),
        paths: ko.observableArray()
    };

    constructor() {
        super()
        ko.applyBindings(this.nav_bar, document.getElementById('breadcrumbs'));
    }

    protected createPageElement(routeData: chitu.RouteData): HTMLElement {
        let element = document.createElement('div');
        if (['User.Login', 'User.Register'].indexOf(routeData.pageName) >= 0) {
            document.body.appendChild(element);
        }
        else {
            document.getElementById('mainContent').appendChild(element);
        }
        return element;
    }
}

var app = new Application();
var expanded = false;
app.pageCreated.add(function (sender, page) {
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

if (Service.token == null) {
    app.redirect('User/Login');
}

window['app'] = app;
export = app;

//=================================================================================
var model = {
    menus: ko.observableArray()

};

requirejs(['text!data/Menu.json'], function (text) {
    let data = JSON.parse(text);
    var stack = [];
    for (var i = 0; i < data.length; i++)
        stack.push(data[i]);

    while (stack.length > 0) {
        var item = stack.pop();
        item.Url = item.Url || '';
        item.Children = item.Children || [];
        item.Icon = item.Icon || '';
        item.Visible = (item.Visible === undefined) ? true : item.Visible;
        item.VisibleChildren = [];

        for (var i = 0; i < item.Children.length; i++) {
            if (item.Children[i].Visible === undefined || item.Children[i].Visible !== false)
                item.VisibleChildren.push(item.Children[i]);

            stack.push(item.Children[i]);
        }
    }
    model.menus(data);
});


ko.applyBindings(model, document.getElementById('sidebar'));
ko.applyBindings(model, document.getElementById('navbar'));
//=================================================================================

