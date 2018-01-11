
/****************************加载购物车******************************/


//定义函数设置购物车到期删除时间
function delcart(){
    var s=60*1000;
    var nowDate=(new Date().getTime());
    var delcart=nowDate+s;
    $.ajax({
        type:'get',
        url:'data/routes/cart/delcart.php',
        dataType:'text',
        data:{delcart}
    });
}

/****************通过商品id加载商品详情信息*****************/
$(()=>{


    function outer(){
        var timer=null;
        return function(){
            clearInterval(timer);
            $.ajax({
                type:"get",
                dataType:"json",
                url:"data/routes/cart/getCart.php"
            }).then(data=>{
                var html="",total=0,count=0;
                for(var p of data){
                    total+=p.price*p.count;
                    count+=parseInt(p.count);
                    html+=`
				<div class="container">
					<div class="product">
						<a href="product_details.html?lid=${p.lid}">
							<img src="${p.sm}" alt="">
						</a>
						<span class="desc">
							<a href="product_details.html?lid=${p.lid}">${p.title}</a>
						</span>
						<p class="col">
							<!--<span></span>-->
							<span class="color-desc">规格：${p.spec}</span>
						</p>
					</div>
					<div class="num">
						<p class="count">
							<span class="reduce">-</span>
							<input data-iid="${p.iid}" type="text" value="${p.count}">
							<span class="add">+</span>
						</p>
					</div>
					<div class="total-price">
						<span>¥</span>
						<span>${p.price}</span>
					</div>
				</div>

				`
                }
                $(".nav>.head_cart_login>.list-pro").html(html);
                $(".nav>.head_cart_login>.re-buy>:first-child>:first-child").html(count);
                $(".nav>.head_cart_login>.re-buy>:first-child>:last-child").html(`¥:${total}`);
                $(".nav>#sidebarcom-nav>.icon_lists").children().first().next().children(".count").html(count);


                //setTimeout(()=>{
                if(data.length>0 && data[0].delcart>0){
                    var countdown=Math.round((data[0].delcart-((new Date()).getTime()))/1000);
                    var a=parseInt(data[0].delcart);
                    if(countdown>0){
                        var time=$(".time");
                        timer=setInterval(()=>{
                                var m=parseInt(countdown/60);
                                if(m<10) m="0"+m;
                                var n=countdown%60;
                                if(n<10) n="0"+n;
                                var msg=m+":"+n;
                                time.html(msg).css("color","red");
                            if(countdown==0){
                                clearInterval(timer);
                                time.html("购物袋").css("color","");

                                $.ajax({
                                    type:"get",
                                    url:'data/routes/cart/clearCart.php',
                                    success:()=>{
                                        //var timer=null;
                                        loadCartTo();
                                    }
                                });

                                //清空购物车以后,将用户表中的delcart列的值更新为0;
                                $.ajax({
                                    type:'get',
                                    url:'data/routes/cart/delcart.php',
                                    dataType:'text',
                                    data:{delcart:0}
                                });
                            }
                            countdown--;
                        },1000);
                    }else if(countdown<0){
                        //清空购物车
                        $.ajax({
                            type:"get",
                            url:'data/routes/cart/clearCart.php',
                            success:()=>{
                                loadCartTo();
                            }
                        });

                        //清空购物车以后,将用户表中的delcart列的值更新为0;
                        $.ajax({
                            type:'get',
                            url:'data/routes/cart/delcart.php',
                            dataType:'text',
                            data:{delcart:0}
                        });
                    }
                }
                //},2000)

                if(count==0){
                    clearInterval(timer);
                    $("#container").find(".time").html("购物车").css("color","");
                }

            })
        }
    }


    //加载右侧购物车
    var loadCartTo=outer();

    loadCartTo();

    /*************************定义检查登录状态***************************/
    //var statusCode=0;
    function checkStatus(){
        //console.log(1);

        $.ajax({
            url:"data/routes/users/isLogin.php",
            dataType:"json",
            type:"get"
        }).then(data=>{//data:{ok:1,uname:xxx}
            statusCode=data.ok;
        });
        return statusCode;
    }

    /*****************************************************************/


    if(location.search!=""){
        var lid=location.search.slice(1);
        $.ajax({
            type:"get",
            url:"data/routes/products/getProductById.php",
            data:lid,
            success:data=>{
                var {product:p,family,imgs}=data;
                var html=`
                <div class="title">
                    <output>
                        ${p.title}
                    </output>
                    <output>
                        ${p.subtitle}
                    </output>
                </div>
                <div class="price">
                    <output>
                        ¥
                    </output>
                    <output>
                        ${p.price}
                    </output>

                </div>
                <div class="pro">
                    <output>
                        承诺
                    </output>
                    <output>
                        ${p.promise}
                    </output>
                </div>
                <div class="spec">
                    <output>
                        规格
                    </output>
                    <ul class="spec-all">

                    </ul>
                </div>
                <div class="num">
                    <output>
                        数量
                    </output>
                    <p class="count">
                        <span class="reduce">-</span>
                        <input type="text" value="1">
                        <span class="add">+</span>
                    </p>

                </div>
                <div class="buy">
                    <ul>
                        <li></li>
                        <li><a href="#" class="buy">立即购买</a></li>
                        <li></li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#fff;" href="#" class="cart">加购物车</a>
                        </li>
                    </ul>
                    <a href="#">收藏</a>
                </div>
                `;
                $("#show-details").html(html);
                var spec="";
                for(var laptop of family){
                    spec+=`
                    <li class="${p.lid==laptop.lid?"active":""}">
                     <a href="product_details.html?lid=${laptop.lid}" >${laptop.spec}</a>
                    </li>
                    `;
                }
                $(".spec-all").html(spec);


                /********放大镜**********/
                var mImg=document.getElementById("mImg");
                mImg.src=p.md;
                var lgDiv=
                    document.getElementById("largeDiv");
                lgDiv.style.backgroundImage=
                    "url("+imgs[0].lg+")";
                var html="";
                for(var pic of imgs){
                    html+=`
					<li class="i1"><img src="${pic.sm}" data-md="${pic.md}" data-lg="${pic.lg}"></li>
				`
                }
                var icon_list=
                    document.getElementById("icon_list");
                icon_list.innerHTML=html;
                var aBackward=document.querySelector(
                    "#preview>h1>a:nth-child(1)"
                );
                var aForward=aBackward.nextElementSibling;
                if(imgs.length<=5)
                    aForward.className="forward disabled";
                var moved=0, LIWIDTH=62;
                aForward.onclick=e=>{
                    if(!e.target.className.endsWith("disabled")){
                        moved++;
                        icon_list.style.left=-moved*LIWIDTH+20+"px";
                        //有左移的li，就可以后退
                        if(moved>0) aBackward.className="backward";
                        //如果已经将右侧多余的li移动完了，就禁止前进
                        if(moved==imgs.length-5)
                            e.target.className="forward disabled";
                    }
                };
                aBackward.onclick=e=>{
                    if(!e.target.className.endsWith("disabled")){
                        moved--;
                        icon_list.style.left=-moved*LIWIDTH+20+"px";
                        //只要右侧多余的li没有被移动完,就可继续前进
                        if(moved<imgs.length-5)
                            aForward.className="forward";
                        //如果没有左移的li，则不能后退
                        if(moved==0)
                            e.target.className="backward disabled";
                    }
                }

                icon_list.onmouseover=e=>{
                    if(e.target.nodeName=="IMG"){
                        var md=e.target.dataset.md,
                            lg=e.target.dataset.lg;
                        mImg.src=md;
                        lgDiv.style.backgroundImage=
                            "url("+lg+")";
                    }
                }

                var superMask=
                    document.getElementById("superMask");
                var mask=document.getElementById("mask");
                superMask.onmouseover=e=>{
                    mask.style.display=
                        lgDiv.style.display="block";
                }
                superMask.onmouseout=e=>{
                    mask.style.display=
                        lgDiv.style.display="none";
                }
                var MSIZE=175;
                superMask.onmousemove=e=>{
                    var x=e.offsetX,y=e.offsetY;
                    var top=y-MSIZE/2,left=x-MSIZE/2;
                    if(top<0) top=0;
                    else if(top>175) top=175;
                    if(left<0) left=0;
                    else if(left>175) left=175;
                    mask.style.cssText=
                        "display:block;top:"+top+"px;left:"+left+"px";
                    lgDiv.style.backgroundPosition=
                        -16/7*left+"px "+(-16/7*top)+"px"
                    //x         y
                }


                //查找#show-detailsclass为account的p为其绑定单击事件
                $("#show-details").click(e=>{
                    if(($(e.target).is(".reduce"))||($(e.target).is(".add"))){
                        //获得目标元素旁边的input
                        var input=$(e.target).parent().children().first().next();
                        //获取input的值转为整数保存到n中
                        var n=parseInt(input.val());
                        //如果目标元素的class是number-add,就n+1
                        if($(e.target).is(".add")){
                            n++;
                        }else if(n>1)//否则如果n>1，就n-1
                            n--;
                        input.val(n);//将n保存回input的值中
                    }else if($(e.target).is(".cart")){
                        e.preventDefault();
                        $.ajax({
                            type:"get",
                            dataType:"json",
                            url:"data/routes/users/isLogin.php",
                            success:data=>{
                                if(data.ok==1){
                                    var input=$(e.target).parent().parent().parent().prev().children(".count").children().first().next();
                                    var count=parseInt(input.val());
                                    var lid=location.search.split("=")[1];
                                    $.ajax({
                                        type:"get",
                                        url:"data/routes/cart/addToCart.php",
                                        data:{lid,count},
                                        dataType:"json",
                                        error:()=>{
                                            alert("网络故障,请检查");
                                        }
                                    }).then((data)=>{
                                        if(data.ok>0){
                                            delcart();
                                            loadCartTo();
                                            $("[data-btn=btn]").click();
                                            //alert("添加成功");
                                        }

                                    });
                                }else{
                                    var url=location.href;
                                    //将back参数值中的: /等保留字转为单字节
                                    url=encodeURIComponent(url);
                                    location="login.html?back="+url;
                                }
                            },
                            error:()=>{

                                alert("网络故障,请检查");
                            }
                        });
                    }else if($(e.target).is(".buy")){
                        e.preventDefault();
                        $.ajax({
                            type:"get",
                            dataType:"json",
                            url:"data/routes/users/isLogin.php",
                            success:data=>{
                                if(data.ok==1){
                                    var input=$(e.target).parent().parent().parent().prev().children(".count").children().first().next();
                                    var count=parseInt(input.val());
                                    var lid=location.search.split("=")[1];
                                    $.ajax({
                                        type:"get",
                                        url:"data/routes/cart/addToCart.php",
                                        data:{lid,count},
                                        dataType:"json",
                                        error:()=>{
                                            alert("网络故障,请检查");
                                        }
                                    }).then((data)=>{
                                        if(data.ok>0){
                                            delcart();
                                            location="vip_cart.html";
                                        }
                                        /*loadCartTo();
                                        $("[data-btn=btn]").click();
                                        alert("添加成功");*/
                                    });
                                }else{
                                    var url=location.href;
                                    //将back参数值中的: /等保留字转为单字节
                                    url=encodeURIComponent(url);
                                    location="login.html?back="+url;
                                }
                            },
                            error:()=>{

                                alert("网络故障,请检查");
                            }
                        });
                    }
                });
            },
            error:()=>{

                alert("网络故障,请检查");
            }
        });

        /*记载规格信息*/
        $.ajax({
            type:"get",
            url:"data/routes/products/getProductSpecById.php",
            dataType:"json",
            data:lid,
            success:data=>{
                var html=`
                <li>商品名称：</li>
                <li>${data[0]}</li>
                <li>系统：</li>
                <li>${data[1]}</li>
                <li>内存容量：</li>
                <li>${data[2]}</li>
                <li >分辨率：</li>
                <li style="border-bottom: 0;border-top: 0">${data[3]}</li>
                <li>显卡型号：</li>
                <li style="border-bottom: 0;border-top: 0">${data[4]}</li>
                <li>处理器：</li>
                <li style="border-bottom: 0;border-top: 0">${data[5]}</li>
                <li>显存容量：</li>
                <li>${data[6]}</li>
                <li>分类：</li>
                <li>${data[7]}</li>
                <li>硬盘容量：</li>
                <li>${data[8]}</li>
                `;
                $("#param>.proShow").next().html(html);
                $("#product-intro>.proShow").next().html(data[9]);

            }
        });

        /****************************给右侧导航添加事件*****************************/
            //鼠标移入移出事件
        $(".icon_lists").on("mouseenter","[data-toggle=icon]",function(e){
            var status=checkStatus();
            if(status==0) {
                $(e.target).children(".name").css("left", -101);
                $(e.target).siblings().children(".name").css("left", 50);
            }
        });
        $(".icon_lists").on("mouseleave","[data-toggle=icon]",function(e){
            $(e.target).children(".name").css("left",50);
            $(e.target).siblings().children(".name").css("left",50);
        });
        //鼠标单击事件

        $("#sidebarcom-nav").on("click",".iconfont",e=>{
            var $codeLogout=$(e.target).siblings(".code-logout");
            var status=checkStatus();
            if(status==0){
                $codeLogout.css("left","-278px");
                $codeLogout.prevAll(".name").css("left",50);
                $codeLogout.parent().siblings().children(".name").css("left",50);
                $codeLogout.parent().siblings().children(".code-logout").css("left",36);
            }else{
                $codeLogout.css("left","36px");
                $codeLogout.parent().siblings().children(".code-logout").css("left",36);
                var $tar=$(e.target).siblings(".name");
                if($tar.html()=="我的购物车"){
                    $(e.target).parent().parent().parent().next().css("left",-402);
                }
            }

            //返回顶部
            if($(e.target).siblings(".name").html()=="回到顶部"){
                $("html,body").stop(true).animate({
                    scrollTop:0
                },500);
            }

        });
        $("#sidebarcom-nav").on("click",".close",e=>{
            $(e.target).parent().css("left",36);
        });
        $(".nav>.head_cart_login").on("click",".close",e=>{
            $(e.target).parent().parent().css("left",36);
        });

        /****************************商品列表列表+-加入购物车添加事件*****************************/
        $("#product-list").click(e=>{
            var $tar=$(e.target);
            if($tar.is(".addCart")){
                e.preventDefault();
                $.ajax({
                    type:"get",
                    url:"data/routes/users/isLogin.php"
                }).then(data=>{
                    if(data.ok==0){
                        var url=location.href;
                        //将back参数值中的: /等保留字转为单字节
                        url=encodeURIComponent(url);
                        location="login.html?back="+url;
                    }else{
                        var lid=$tar.data("lid");
                        $.ajax({
                            type:"get",
                            url:"data/routes/cart/addToCart.php",
                            data:"lid="+lid+"&count="+1,
                            dataType:"json"
                        }).then((data)=>{
                            if(data.ok>0){
                                alert("添加成功");
                                loadCartTo();
                                delcart();
                                $("[data-btn=btn]").click();
                            }else{
                                alert("添加失败");
                            }

                        })

                    }
                });
            }
        });

        $(".head_cart_login").click((e)=>{
            var $tar=$(e.target);
            if($tar.is(".reduce")||$tar.is(".add")){
                var $input=$tar.siblings("input");
                var n=parseInt($input.val());
                if($tar.is(".add"))
                    n++;
                else
                    n--;
                if(n==0){
                    if(confirm("是否继续删除?"))
                        $.get(
                            "data/routes/cart/updateCart.php",
                            "count="+n+"&iid="+$input.data("iid")
                        ).then(()=>{
                                loadCartTo();
                                $("[data-btn=btn]").click();
                            })
                }else{
                    $.get(
                        "data/routes/cart/updateCart.php",
                        "count="+n+"&iid="+$input.data("iid")
                    ).then(()=>{
                            loadCartTo();
                            delcart();
                            $("[data-btn=btn]").click();
                        })
                }
            }
        })

    }
});