$(()=>{


//功能模块一：用户登录
//1.1 当用户点击登录按钮，获取参数
//1.2 验证用户输入值
//1.3 发送ajax请求，完成登录业务
//1.4 处理成功或失败的结果
    var $uname = $("#uname"); //用户名
    var $upwd = $("#upwd");  //密码


    //验证用户输入的数据
    var ureg = /^[a-zA-Z0-9]{6,12}$/i;
    var preg = /^[a-zA-Z0-9]{6,12}$/;

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

    function leave(tar){
        var span = tar.next();
        span.removeClass("vali_success");
        span.html("");
    }

    $uname.blur(e=>{
        vali($(e.target),ureg,"格式不正确");
    }).focus(e=>{
        leave($(e.target));
    });
    $upwd.blur(e=>{
        vali($(e.target),preg,"格式不正确");
    }).focus(e=>{
        leave($(e.target));
    });

    $("#submit").click(function (e) {
        e.preventDefault();
        //获取用户输入数据
        var uname = $("#uname").val(); //用户名
        var upwd = $("#upwd").val();  //密码

        if(vali($uname,ureg)&&vali($upwd,preg)) {
            //发送ajax请求完成业务处理
            $.ajax({
                type: "post",
                url: "data/routes/users/login.php",
                data: {uname, upwd},
                success: data=> {
                    /*console.log(data);
                    if (data.code > 0) {
                        sessionStorage.setItem("uid", data.uid);
                        sessionStorage.setItem("uname", uname);
                        alert("登录成功，自动跳转到首页");
                        location.href = "02_index.html";
                    } else {
                        alert(data.msg);
                        //console.log(data);
                    }*/
                    if(data=="false")
                        alert("用户名或密码错误!");
                    else{
                        alert("登录成功");
                        $("#reset").click();
                        location="02_index.html";
                    }


                },
                error: function () {
                    alert("网络故障请检查");
                }
            });
        }
    });

    //为登录表单添加keyup事件,回车登录
    $("#register").keyup(e=>{
        if(e.keyCode==13){
            $("#submit").click();
        }
    })

    //重置按钮绑定事件
    $("#reset").click(e=>{
        e.preventDefault();
        $("form")[0].reset();
        $("[name=uname]").next().html("");
        $("[name=upwd]").next().html("");
    })
});