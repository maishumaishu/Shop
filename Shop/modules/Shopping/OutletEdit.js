chitu.action(['com/ue.ext'], function () {

    var ue = UE.getEditor('editorContainer');
    ue.ready(function () {
        ue.setHeight(150);
    });

    function GetLocation(address, success, error) {
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var loc = results[0].geometry.location
                    if (success)
                        success([loc.d, loc.e]);
                }
                else {
                    if (error)
                        error();
                }
            });
        }
    }

    //$('#outletForm')
    //    .submit(function () {
    //        $('#Introduce').val(ue.getContent());
    //        if ($(this).data('validator').errorList.length > 0)
    //            return false;

    //        var addr = String.format('{0} {1} {2} {3}', $('#Province option:selected').text(),
    //                                 $('#City option:selected').text(), $('#County option:selected').text(), $('#Address').val());

    //        //$.ajax({
    //        //    url: 'http://maps.googleapis.com/maps/api/geocode/json',
    //        //    data: { sensor: false, address: addr },
    //        //    async: false
    //        //})
    //        //.done(function (data) {
    //        //    if (data.status != 'OK')
    //        //        return;

    //        //    var loc = data.results[0].geometry.location
    //        //    $('#Longitude').val(loc.lng);
    //        //    $('#Latitude').val(loc.lat);
    //        //})

    //        var url = '/Common/GetLocation' //'http://api.map.baidu.com/geocoder?output=json&address=' + encodeURI(addr);
    //        $.ajax({
    //            url: url,
    //            data: { address: addr },
    //            async: false
    //        }).done(function (data) {
    //            if (data.status != 'OK')
    //                return;

    //            var loc = data.result.location
    //            $('#Longitude').val(loc.lng);
    //            $('#Latitude').val(loc.lat);
    //        });
    //    })
    //    .validate({
    //        rules: {
    //            Title: { required: true },
    //            Contact: { required: true },
    //            Phone: { required: true },
    //            Province: { required: true },
    //            City: { required: true },
    //            County: { required: true },
    //            Limit: { required: true }
    //        },
    //        messages: {
    //            Title: { required: "请填写标题" },
    //            Contact: { required: "请填写负责人" },
    //            Phone: { required: "请填写联系方式" },
    //            Province: { required: "请选择省份" },
    //            City: { required: "请选择市区" },
    //            County: { required: "请选择县" }
    //        }
    //    });

    //$('#Picture').ace_file_input({
    //    style: 'well',
    //    btn_choose: '上传图片',
    //    btn_change: null,
    //    no_icon: 'icon-cloud-upload',
    //    droppable: true,
    //    thumbnail: 'fit'
    //});

    //var d = $('#Picture').data('ace_file_input')
    //_show_file_list = d.show_file_list;
    //d.show_file_list = function ($files) {
    //    if (typeof $files == 'string') {
    //        var img = String.format('<img src="{0}" />', $files);
    //        this.$label.removeAttr('data-title').attr('class', 'file-label hide-placeholder selected');
    //        this.$label.find('.file-name').removeAttr('data-title').html(img);
    //        return;
    //    }
    //    return _show_file_list.call(d, $files);
    //}

    //var url = $('#Picture').attr('data-url');
    //if (url != '' && url != null) {
    //    d.show_file_list(url);
    //}


    //$.ajax({
    //    url: site.config.shopUrl + 'ShoppingData/Select?source=Regions&selection=Id,Name&filter=Parent is Null',
    //    success: function (data) {
    //        $(data.DataItems).each(function () {
    //            $('#Province').append(String.format('<option value="{0}">{1}</option>', this.Id, this.Name));
    //        });
    //    }
    //});

    //$('#Province').change(function () {
    //    var provinceId = $("#Province option:selected").val();
    //    clearSelectOptions('City');
    //    clearSelectOptions('County');
    //    if (provinceId == '') {
    //        return;
    //    }

    //    $.ajax({
    //        url: site.config.shopUrl + 'ShoppingData/Select?source=Regions&selection=Id,Name',
    //        data: { filter: String.format('ParentId=Guid"{0}"', provinceId) },
    //        success: function (data) {
    //            $(data.DataItems).each(function () {
    //                $('#City').append(String.format('<option value="{0}">{1}</option>', this.Id, this.Name));
    //            });
    //        }
    //    });
    //});

    //$('#City').change(function () {
    //    var cityId = $("#City option:selected").val();
    //    clearSelectOptions('County');
    //    if (cityId == '') {
    //        return;
    //    }

    //    $.ajax({
    //        url: site.config.shopUrl + 'ShoppingData/Select?source=Regions&selection=Id,Name',
    //        data: { filter: String.format('ParentId=Guid"{0}"', cityId) },
    //        success: function (data) {
    //            $(data.DataItems).each(function () {
    //                $('#County').append(String.format('<option value="{0}">{1}</option>', this.Id, this.Name));
    //            });
    //        }
    //    });
    //});

    //function clearSelectOptions(elementId) {
    //    var e = document.getElementById(elementId);
    //    if (e.options == null)
    //        return;

    //    while (e.options.length > 1) {
    //        var length = document.getElementById(elementId).options.length;
    //        document.getElementById(elementId).options.remove(length - 1);
    //    }
    //};



});
