$(()=>{

    var $uname = $("[name=uname]"); //用户名
    var $upwd = $("[name=upwd]");  //密码
    var $rupwd=$("[name=rupwd]");
    var $phone=$("[name=phone]");
    var $email=$("[name=email]");

    //验证用户输入的数据
    var ureg = /^[a-z0-9]{6,12}$/i;
    var preg = /^[a-z0-9]{6,12}$/;
    var phreg = /^1[34578]\d{9}$/;
    var ereg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9_-]+$/;

    //定义验证函数
    function vali(tar,reg,txt="") {
        //获取旁边span
        var span = tar.next();
        //用reg测试当前文本框的内容
        //如果通过,就修改span的class为vali_success
        if (reg.test(tar.val())) {
            span.addClass("vali_success");
            span.html("");
            return true;
        }
        //否则修改span的内容
        else {
            span.html(txt);
            return false;
        }
    }
    //定义input失去焦点函数
    function leave(tar){
        var span = tar.next();
        span.removeClass("vali_success");
        span.html("");
    }

    //input验证
    $uname.blur(e=>{
        vali($(e.target),ureg,"格式不正确");
        var uname=$(e.target).val();
        if(uname!=""){
            $.ajax({
                type:'get',
                url:'data/routes/users/checkName.php',
                data:{uname},
                dataType:'text',
                success:(data)=>{
                    console.log(data);
                    if(data=="false"){
                        $(e.target).next().removeClass("vali_success");
                        $(e.target).next().show().html("用户名已存在");
                    }
                }
            });
        }

    }).focus(e=>{
        leave($(e.target));
    });
    $upwd.blur(e=>{
        vali($(e.target),preg,"格式不正确");
    }).focus(e=>{
        leave($(e.target));
    });
    $rupwd.blur(e=>{
        var $upwd=$("[name=upwd]");
        var html=$upwd.next().html();
        if(vali($("[name=upwd]"),preg,html)) {
            var rp = $(e.target).val().trim();
            var up = $upwd.val().trim();
            if (up != rp) {
                $("[name=rupwd]").next().html("输入不一致");
            } else {
                $(e.target).next().html("");
                $(e.target).next().addClass("vali_success");
            }
        }else{
            $("[name=rupwd]").next().html("请输入密码");
        }
    }).focus(e=>{
        leave($(e.target));
    });
    $phone.blur(e=>{
        vali($(e.target),phreg,"格式不正确");
    }).focus(e=>{
        leave($(e.target));
    });
    $email.blur(e=>{
        vali($(e.target),ereg,"格式不正确");
    }).focus(e=>{
        leave($(e.target));
    });



    $("#submit").click(function (e) {
        e.preventDefault();
        var uname = $("[name=uname]").val(); //用户名
        var upwd = $("[name=upwd]").val();  //密码
        var phone=$("[name=phone]").val();
        var email=$("[name=email]").val();
        if(vali($uname,ureg)&&vali($upwd,preg)&&vali($phone,phreg)&&vali($email,ereg)) {
            $.ajax({
                type: "post",
                url: "data/_register.php",
                data: {uname, upwd, phone, email},
                success: data=> {
                    console.log(data);
                    if (data.code > 0) {
                        alert(data.msg);
                        $("#reset").click();
                        location="login.html";

                    } else {
                        alert(data.msg);
                        //console.log(data);
                    }
                },
                error: function () {
                    alert("网络故障请检查");
                }
            });
        }
    });

    //为注册表单添加keyup事件,回车登录
    $("#register").keyup(e=>{
        if(e.keyCode==13){
            $("#submit").click();
        }
    })

    //重置按钮绑定事件
    $("#reset").click(e=>{
        e.preventDefault();
        $("#register")[0].reset();
        $("[name=uname]").next().html("");
        $("[name=upwd]").next().html("");
        $("[name=rupwd]").next().html("");
        $("[name=phone]").next().html("");
        $("[name=email]").next().html("");
    })
});