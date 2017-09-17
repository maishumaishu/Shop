<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>用户登录</title>
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta name="description" content="User login page" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/assets/css/font-awesome.min.css" />
    <link href="../assets/css/uncompressed/bootstrap.css" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/css/jquery-ui-1.10.3.full.min.css" />
    <link rel="stylesheet" href="/assets/css/ace.min.css" />
    <link href="../Content/Site.css" rel="stylesheet" />
    <script src="../Scripts/jquery-1.9.1.js"></script>
    <script src="../Scripts/jquery.cookie.js"></script>
    <script src="../Scripts/knockout-3.2.0.js"></script>
    <script src="../Scripts/knockout.validation.js"></script>
    <script type="text/javascript">
        $(function () {
            var model = {
                username: ko.observable().extend({ required: true }),
                password: ko.observable().extend({ required: true }),
                login: function () {
                    var val = ko.validation.group(model);
                    if (!model.isValid()) {
                        val.showAllMessages();
                        return;
                    }
                    return $.ajax({
                        url: '/Auth/Login',
                        data: { username: model.username(), password: model.password() }
                    })
                   .success(function (data) {
                        if (data&&data.Type != "ErrorObject") {
                            $.cookie('$token', data);
                            window.location.href = 'Index.html#Home/Index';
                        }
                    });
                }
            }

            ko.applyBindings(model);
            //$.ajax()
        });
    </script>
</head>

<body class="login-layout" style="background-color: #EEE;">

    <div class="main-container">
        <div class="main-content">
            <div class="row">
                <div class="col-sm-10 col-sm-offset-1">
                    <div class="login-container" style="padding-top: 30px;">
                        <div class="center">
                            <h1>
                                <img src="/Content/Images/logo_login.gif" />
                            </h1>
                        </div>

                        <div class="space-6"></div>

                        <div class="position-relative">

                            <div id="login-box" class="login-box visible widget-box no-border" style="background-color: #777;">
                                <div class="widget-body">
                                    <div class="widget-main">
                                        <h4 class="header black lighter bigger">
                                            <i class="icon-coffee red"></i>
                                            请输入您的登录信息
                                        </h4>

                                        <div class="space-6"></div>

                                        <form id="loginForm" method="post">

                                            <label class="block clearfix">
                                                <span class="block input-icon input-icon-right">

                                                    <input data-bind="value:username,textInput:username" class="form-control" id="UserName" name="UserName" placeholder="用户名" type="text" />
                                                    <i class="icon-user"></i>
                                                </span>
                                            </label>

                                            <label class="block clearfix">
                                                <span class="block input-icon input-icon-right">
                                                    <input data-bind="value:password,textInput:password" id="Password" name="Password" type="password" class="form-control" placeholder="密码" />
                                                    <i class="icon-lock"></i>
                                                </span>
                                            </label>

                                            <div class="clearfix">
                                                <!--<label class="inline">
                                                    <input value="true" id="RemberMe" name="RemberMe" type="checkbox" />
                                                    <span class="lbl">记住我</span>
                                                </label>-->
                                                <button data-bind="click:login" type="button" class="pull-right btn btn-sm btn-danger btn-block">
                                                    <i class="icon-key"></i>
                                                    登录
                                                </button>
                                            </div>

                                            <div class="space-4"></div>

                                        </form>
                                    </div>
                                    <!-- /widget-main -->

                                </div>
                                <!-- /widget-body -->
                            </div>

                        </div>
                        <!-- /position-relative -->
                    </div>
                </div>
                <!-- /.col -->
            </div>
            <!-- /.row -->
        </div>
    </div>


</body>
</html>
