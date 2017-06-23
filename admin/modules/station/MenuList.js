chitu.action(function (page) {
    /// <param name="page" type="chitu.Page"/>

    var dataSource = new JData.WebDataSource();
    dataSource.set_selectUrl(site.config.siteUrl + 'MicroStationData/Select?source=Menus');
    dataSource.set_updateUrl(site.config.siteUrl + 'MicroStationData/Update?source=Menus');
    dataSource.set_deleteUrl(site.config.siteUrl + 'MicroStationData/Delete?source=Menus');
    dataSource.set_insertUrl(site.config.siteUrl + 'MicroStationData/Insert?source=Menus');
    dataSource.set_method('post');

    var treeDataSource = new JData.TreeDataSource(dataSource, 'Id', 'ParentId');

    var menuVisibilities = [
        { Name: '所有', Value: "0" },
        { Name: '会员', Value: "1" },
        { Name: '匿名', Value: "2" },
        { Name: '隐藏', Value: "3" }
    ];

    var displayTypes = [
        { Name: '单页', Value: 'SinglePage' },
        { Name: '图片', Value: 'Picture' },
        { Name: '文字列表', Value: 'ContentList' },
        { Name: '图片列表', Value: 'PictureList' }
    ];

    var detailsView = new JData.DetailsView(document.getElementById('tabMenuEditor'));
    var $gridView = $('#tabMenus').gridView({
        dataSource: treeDataSource //new JData.TreeDataSource(dataSource, 'Id', 'ParentId')
        , columns: [
            {
                type: JData.TreeColumn, dataField: 'Title', childDataField: 'Children', headerText: '名称'
                , setButtonIcon: function (expandButton) {
                    if (expandButton.get_expanded() == false) {
                        $(expandButton._element).find('span').attr('class', 'icon-plus');
                    }
                    else {
                        $(expandButton._element).find('span').attr('class', 'icon-minus');
                    }
                }
            }
            //{ dataField: 'Title', headerText: '标题', width: '100px' }
            //, { dataField: 'Code', headerText: '代码' }
            , { dataField: 'LinkUrl', headerText: '链接地址' }
            , { dataField: 'Icon', headerText: '图标' }
            , { dataField: 'Sort', headerText: '次序' }
            , { type: JData.DropDownListField, dataField: 'Visibility', headerText: '可见性', dataSource: new JData.ArrayDataSource(menuVisibilities), displayMember: 'Name', valueMember: 'Value' }
            //, { type: JData.DropDownListField, dataField: 'DisplayType', headerText: '显示方式', dataSource: new JData.ArrayDataSource(displayTypes), displayMember: 'Name', valueMember: 'Value' }
            //, { type: JData.CheckBoxField, dataField: 'IsHide', headerText: '隐藏', trueValue: '是', falseValue: '否' }
            //, { type: JData.DateTimeField, dataField: 'CreateDateTime', headerText: '创建时间' }
            , { type: JData.CommandField, showDeleteButton: true, showEditButton: true }
        ]
        , editor: {
            type: JData.DetailsView,
            init: [$('<table>').appendTo(page.node()).hide()[0]],
            dataSource: dataSource,
            fields: [
              {
                  dataField: 'ParentId',
                  set_controlValue: function (container, value) {
                      $(container).html('');

                      //==================================================================
                      // 找出正在编辑的 DataItem
                      var detailsView = $(container).parents('table').first()[0].control;
                      var dataItem = detailsView.get_dataItem();
                      var current_id = dataItem.Id;
                      //==================================================================

                      var gridView = $gridView.data('JData.GridView');
                      var rows = gridView.get_rows();
                      var tr = $(container).parents('tr').first()[0];

                      $select = $('<select style="width:96%;">')
                                          .append('<option>')
                                          .appendTo($(container));

                      var rows = gridView.get_rows();
                      var stack = [];
                      for (var i = 0; i < rows.length; i++) {
                          var dataItem = rows[i].get_dataItem();
                          if (dataItem.ParentId == null)
                              stack[stack.length] = dataItem;

                          dataItem._depth = 0;
                      }

                      stack.reverse();
                      while (stack.length > 0) {

                          var dataItem = stack.pop();
                          if (current_id == dataItem.Id)
                              continue;

                          var name = '';
                          for (var i = 0; i < dataItem._depth; i++) {
                              name = name + '&nbsp;&nbsp;'
                          }
                          name = name + dataItem.Title;

                          $('<option>').attr('value', dataItem.Id)
                                       .html(name)
                                       .appendTo($select);

                          var children = dataItem.Children || [];
                          for (var i = 0; i < children.length; i++) {
                              stack.push(children[i]);
                              children[i]._depth = dataItem._depth + 1;
                          }
                      }

                      $select.find('option').each(function () {
                          if (this.value == value) {
                              $(this).attr('selected', 'selected');
                              return;
                          }
                      })

                  },
                  get_controlValue: function (container) {
                      var value = $(container).find('select').val();
                      if (value == '')
                          return null;

                      return value;
                  },
                  headerText: '所属菜单'
              }
            , { dataField: 'Title', headerText: '名称' }
            //, { dataField: 'Code', headerText: '代码' }
            , { dataField: 'LinkUrl', headerText: '链接地址' }
            , { dataField: 'Icon', headerText: '图标' }
            , { dataField: 'Sort', headerText: '次序' }
            //, { type: JData.DropDownListField, dataField: 'DisplayType', headerText: '显示方式', dataSource: new JData.ArrayDataSource(displayTypes), displayMember: 'Name', valueMember: 'Value' }
            , { type: JData.DropDownListField, dataField: 'Visibility', headerText: '可见性', dataSource: new JData.ArrayDataSource(menuVisibilities), displayMember: 'Name', valueMember: 'Value' }
            //, { type: JData.DateTimeField, dataField: 'CreateDateTime', headerText: '创建时间', readOnly: true }
            ]
        }
    });

    $('#btnAdd').click(function () {
        $('#tabMenus').data('JData.GridView')._HandleNew();
    })

    var args = new JData.DataSourceSelectArguments();
    //args.set_maximumRows(10);
    treeDataSource.select(args);
});