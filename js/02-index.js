//封装图片预览函数
/*function clickForward(n,e,moved){
    var LIWIDTH=59;
    var $aForward=$(e.target),
        $aBackward=$aForward.prev(),
        $icon_list=$aForward.next(),
        $mImg=$aForward.parent().prev().children("#mImg");
    if(n<=5)
        $aForward.addClass("disabled");
    if(!$(e.target).hasClass("disabled")){
        moved++;
        console.log(moved);
        $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
        if(moved>0) $aBackward.removeClass("disabled");
        //如果已经将右侧多余的li移动完了，就禁止前进
        if(moved==n-5)
            $(e.target).addClass("disabled");
    }
}

function clickBackward(n,e,moved){
    var LIWIDTH=59;
    var $aBackward=$(e.target),
        $aForward =$aBackward.next(),
        $icon_list=$aForward.next(),
        $mImg=$aForward.parent().prev().children("#mImg");
    if(n<=5)
        $aForward.addClass("disabled");
    if(!$(e.target).hasClass("disabled")){
        moved--;
        $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
        //只要右侧多余的li没有被移动完,就可继续前进
        if(moved<n-5)
            $aForward.removeClass("disabled");
        //如果没有左移的li，则不能后退
        if(moved==0)
            $(e.target).addClass("disabled");
    }
}*/


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

//加载广告轮播
(()=>{




    var $ulImgs=$("#banner>.banner-img"),
        $ulInds=$("#banner>.indicators"),
        LIWIDTH=1024,INTERVAL=500,WAIT=3000,
        moved=0,timer=null,canMove=true;
    $.get("data/routes/products/getCarousel.php")
        .then(data=>{
            var html="";
            for(var c of data){
                html+=`
			<li>
				<a href="${c.href}" title="${c.title}">
					<img src="${c.img}">
				</a>
			</li>
		`;
            }
            html+=`
		<li>
			<a href="${data[0].href}" title="${data[0].title}">
				<img src="${data[0].img}">
			</a>
		</li> `;
            $ulImgs.html(html)
                .css("width",(data.length+1)*LIWIDTH);
            $ulInds.html("<li></li>".repeat(data.length))
                .children().first().addClass("hover");
            function autoMove(){
                if(canMove){
                    if(moved==data.length){//先判断是否最后一张
                        moved=0;//将moved归0
                        $ulImgs.css("left",0);//将ul的left瞬间归0
                    }
                    timer=setTimeout(()=>{//先等待WATI秒
                        move(1,autoMove);
                    },WAIT);
                }
            }
            autoMove();
            $("#banner").hover(
                ()=>{//关闭轮播的开关变量
                    canMove=false;
                    clearTimeout(timer);//停止等待
                    timer=null;
                },
                ()=>{//打开轮播开关，启动自动轮播
                    canMove=true;
                    autoMove();
                }
            );
            $ulInds.on("click","li",e=>{
                moved=$(e.target).index();
                $ulImgs.stop(true).animate({
                    left:-LIWIDTH*moved
                },INTERVAL);
                $ulInds.children(":eq("+moved+")")
                    .addClass("hover")
                    .siblings().removeClass("hover");
            });
            function move(dir,callback){
                moved+=dir;//按照方向增减moved
                //如果moved没有到头
                if(moved<data.length){
                    //让ulInds中moved位置的li设置hover
                    $ulInds.children(":eq("+moved+")")
                        .addClass("hover")
                        .siblings().removeClass("hover");
                }else{//否则，如果到头了
                    //让ulInds中第一个li设置为hover
                    $ulInds.children(":eq(0)")
                        .addClass("hover")
                        .siblings().removeClass("hover");
                }
                //先清除ulImgs上动画，让ulImgs移动到新的left位置
                $ulImgs.stop(true).animate({
                    //新的left位置永远等于-LIWIDTH*moved
                    left:-LIWIDTH*moved
                },INTERVAL,callback);
            }
            $("#banner>[data-move=right]").click(()=>{
                if(moved==data.length){
                    moved=0;
                    $ulImgs.css("left",0);
                }
                move(1);
            });
            $("#banner>[data-move=left]").click(()=>{
                //如果是第一张
                if(moved==0){//就跳到最后一张
                    moved=data.length;
                    $ulImgs.css("left",-LIWIDTH*moved);
                }
                move(-1);
            })
        })


//加载首页商品
    $.ajax({
    type:"get",
    url:"data/routes/products/index_product.php",
    success:function(products){
        var html = "";
      for(var i=0;i<products.recommended.length;i++){
        var p=products.recommended[i];
          html+=`
      <div class="laptop">
                <div class="show-right"></div>
                <div class="show-top">
                    <p>
                        ${p.title}
                    </p>
                    <p>
                        ${p.details}
                    </p>
                </div>
                <div class="show-bottom">
                    <p>
                        ¥${p.price}
                    </p>
                    <ul>
                        <li></li>
                        <li><a href="${p.href}">查看详情</a></li>
                        <li></li>
                    </ul>
                </div>
                <span>${p.title}</span>
                <a href="#">
                    <img src="${p.pic}"/>
                </a>
            </div>
      `;
      }
      $(".on_sale").html(html);
    },
    error:()=>{
      alert("网络故障,请检查");
    }
  });

    //加载楼层商品
    //加载首页商品
    //加载一层商品
    $.ajax({
        type:"get",
        url:"data/routes/products/index_product.php",
        success:function(products){
            var p=products.recommended[0];
            var lid=p.pid;
            var html = `
               <a data-id="${p.pid}" href="${p.href}">
                    <img src="${p.pic}"/>
                </a>
                <span>
                        ${p.title}
                </span>
                <div>
                    <span>
                        ${p.details}
                    </span>
                    <ul>
                        <li></li>
                        <li><a href="${p.href}">查看详情</a></li>
                        <li></li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#fff;" href="#" class="cart" data-lid="${p.pid}">加购物车</a>
                        </li>
                    </ul>
                    <output>
                        ¥${p.price}
                    </output>
                </div>
                <div id="preview">
                    <div id="mediumDiv">
                        <img id="mImg" src="${products.Rimgs[0].md}">
                    </div>
                    <h1>
                        <a class="backward disabled"></a>
                        <a class="forward"></a>
                        <ul id="icon_list">
            `;
            var Rimgs=products.Rimgs;
            for(var pic of Rimgs){
                html+=`
					<li class="i1"><img src="${pic.sm}" data-md="${pic.md}" data-toggle="img"></li>
				`
            };

            html+=`

                        </ul>
                    </h1>
                </div>
            `;
            $("#f1 .jdb").html(html);

            var n=Rimgs.length;



            var html="";
            for(var i=1;i<products.recommended.length-1;i++){
                var p=products.recommended[i];
                html+=`
                  <div class="june">
                    <a href="${p.href}">
                        <img src="${p.pic}" alt=""/>
                    </a>
                    <div>
                        <output>
                            ${p.title}
                        </output>
                        <output>
                            ${p.price}
                        </output>
                        <a href="#" class="buy" data-lid="${p.pid}">
                            立即购买
                            <!--<img src="img/index/red.png" alt=""/>-->
                        </a>
                    </div>
                    <hr/>
                    <hr/>
                  </div>
                `;
            }
            $("#f1 .container3").html(html);

            var moved=0, LIWIDTH=59;
            $("#f1 .jdb").on("click",".forward",e=>{
                var $aForward=$(e.target),
                    $aBackward=$aForward.prev(),
                    $icon_list=$aForward.next(),
                    $mImg=$aForward.parent().prev().children("#mImg");
                if(n<=5)
                    $aForward.addClass("disabled");
                if(!$(e.target).hasClass("disabled")){
                    moved++;
                    $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
                    if(moved>0) $aBackward.removeClass("disabled");
                    //如果已经将右侧多余的li移动完了，就禁止前进
                    if(moved==n-5)
                        $(e.target).addClass("disabled");
                }
            });

            $("#f1 .jdb").on("click",".backward",e=>{
                var $aBackward=$(e.target),
                    $aForward =$aBackward.next(),
                    $icon_list=$aForward.next(),
                    $mImg=$aForward.parent().prev().children("#mImg");
                if(n<=5)
                    $aForward.addClass("disabled");
                if(!$(e.target).hasClass("disabled")){
                    moved--;
                    $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
                    //只要右侧多余的li没有被移动完,就可继续前进
                    if(moved<n-5)
                        $aForward.removeClass("disabled");
                    //如果没有左移的li，则不能后退
                    if(moved==0)
                        $(e.target).addClass("disabled");
                }

            });


        },
        error:()=>{
            alert("网络故障,请检查");
        }
    });


    //加载二层商品
    $.ajax({
        type:"get",
        url:"data/routes/products/index_product.php",
        success:function(products){
            var p=products.top_sale[0];
            var lid=p.pid;
            var html = `
               <a data-id="${p.pid}" href="${p.href}">
                    <img src="${p.pic}"/>
                </a>
                <span>
                        ${p.title}
                </span>
                <div>
                    <span>
                        ${p.details}
                    </span>
                    <ul>
                        <li></li>
                        <li><a href="${p.href}">查看详情</a></li>
                        <li></li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#fff;" href="#" class="cart" data-lid="${p.pid}">加购物车</a>
                        </li>
                    </ul>
                    <output>
                        ¥${p.price}
                    </output>
                </div>
                <div id="preview">
                    <div id="mediumDiv">
                        <img id="mImg" src="${products.Nimgs[0].md}">
                    </div>
                    <h1>
                        <a class="backward disabled"></a>
                        <a class="forward"></a>
                        <ul id="icon_list">
            `;
            var Simgs=products.Simgs;
            for(var pic of Simgs){
                html+=`
					<li class="i1"><img src="${pic.sm}" data-md="${pic.md}" data-toggle="img"></li>
				`
            };

            html+=`

                        </ul>
                    </h1>
                </div>
            `;
            $("#f2 .jdb").html(html);

            var n=Simgs.length;



            var html="";
            for(var i=1;i<products.top_sale.length-1;i++){
                var p=products.top_sale[i];
                html+=`
                  <div class="june">
                    <a href="${p.href}">
                        <img src="${p.pic}" alt=""/>
                    </a>
                    <div>
                        <output>
                            ${p.title}
                        </output>
                        <output>
                            ${p.price}
                        </output>
                        <a href="#" class="buy" data-lid="${p.pid}">
                            立即购买
                            <!--<img src="img/index/red.png" alt=""/>-->
                        </a>
                        <output>${p.details}</output>
                    </div>
                    <hr/>
                    <hr/>
                  </div>
                `;
            }
            $("#f2 .container3").html(html);

            var moved=0, LIWIDTH=59;
            $("#f2 .jdb").on("click",".forward",e=>{
                var $aForward=$(e.target),
                    $aBackward=$aForward.prev(),
                    $icon_list=$aForward.next(),
                    $mImg=$aForward.parent().prev().children("#mImg");
                if(n<=5)
                    $aForward.addClass("disabled");
                if(!$(e.target).hasClass("disabled")){
                    moved++;
                    $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
                    if(moved>0) $aBackward.removeClass("disabled");
                    //如果已经将右侧多余的li移动完了，就禁止前进
                    if(moved==n-5)
                        $(e.target).addClass("disabled");
                }
            });

            $("#f2 .jdb").on("click",".backward",e=>{
                var $aBackward=$(e.target),
                    $aForward =$aBackward.next(),
                    $icon_list=$aForward.next(),
                    $mImg=$aForward.parent().prev().children("#mImg");
                if(n<=5)
                    $aForward.addClass("disabled");
                if(!$(e.target).hasClass("disabled")){
                    moved--;
                    $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
                    //只要右侧多余的li没有被移动完,就可继续前进
                    if(moved<n-5)
                        $aForward.removeClass("disabled");
                    //如果没有左移的li，则不能后退
                    if(moved==0)
                        $(e.target).addClass("disabled");
                }

            });


        },
        error:()=>{
            alert("网络故障,请检查");
        }
    });


    //加载三层商品
    $.ajax({
        type:"get",
        url:"data/routes/products/index_product.php",
        success:function(products){
            var p=products.new_arrival[0];
            var lid=p.pid;
            var html = `
               <a data-id="${p.pid}" href="${p.href}">
                    <img src="${p.pic}"/>
                </a>
                <span>
                        ${p.title}
                </span>
                <div>
                    <span>
                        ${p.details}
                    </span>
                    <ul>
                        <li></li>
                        <li><a href="${p.href}">查看详情</a></li>
                        <li></li>
                    </ul>
                    <ul>
                        <li>
                            <a style="color:#fff;" href="#" class="cart" data-lid="${p.pid}">加购物车</a>
                        </li>
                    </ul>
                    <output>
                        ¥${p.price}
                    </output>
                </div>
                <div id="preview">
                    <div id="mediumDiv">
                        <img id="mImg" src="${products.Nimgs[0].md}">
                    </div>
                    <h1>
                        <a class="backward disabled"></a>
                        <a class="forward"></a>
                        <ul id="icon_list">
            `;
            var Nimgs=products.Nimgs;
            for(var pic of Nimgs){
                html+=`
					<li class="i1"><img src="${pic.sm}" data-md="${pic.md}" data-toggle="img"></li>
				`
            };

            html+=`

                        </ul>
                    </h1>
                </div>
            `;
            $("#f3 .jdb").html(html);

            var n=Nimgs.length;


            var html="";
            for(var i=1;i<products.new_arrival.length-1;i++){
                var p=products.new_arrival[i];
                html+=`
                  <div class="june">
                    <a href="${p.href}">
                        <img src="${p.pic}" alt=""/>
                    </a>
                    <div>
                        <output>
                            ${p.title}
                        </output>
                        <output>
                            ${p.price}
                        </output>
                        <a href="#" class="buy" data-lid="${p.pid}">
                            立即购买
                            <!--<img src="img/index/red.png" alt=""/>-->
                        </a>
                        <output>${p.details}</output>
                    </div>
                    <div>
                    </div>
                  </div>
                `;
            }
            $("#f3 .container3").html(html);


            var moved=0, LIWIDTH=59;
            $("#f3 .jdb").on("click",".forward",e=>{
                var $aForward=$(e.target),
                    $aBackward=$aForward.prev(),
                    $icon_list=$aForward.next(),
                    $mImg=$aForward.parent().prev().children("#mImg");
                if(n<=5)
                    $aForward.addClass("disabled");
                if(!$(e.target).hasClass("disabled")){
                    moved++;
                    $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
                    if(moved>0) $aBackward.removeClass("disabled");
                    //如果已经将右侧多余的li移动完了，就禁止前进
                    if(moved==n-5)
                        $(e.target).addClass("disabled");
                }
            });

            $("#f3 .jdb").on("click",".backward",e=>{
                var $aBackward=$(e.target),
                    $aForward =$aBackward.next(),
                    $icon_list=$aForward.next(),
                    $mImg=$aForward.parent().prev().children("#mImg");
                if(n<=5)
                    $aForward.addClass("disabled");
                if(!$(e.target).hasClass("disabled")){
                    moved--;
                    $icon_list.css("left",`${-moved*LIWIDTH+20}px`);
                    //只要右侧多余的li没有被移动完,就可继续前进
                    if(moved<n-5)
                        $aForward.removeClass("disabled");
                    //如果没有左移的li，则不能后退
                    if(moved==0)
                        $(e.target).addClass("disabled");
                }

            });


        },
        error:()=>{
            alert("网络故障,请检查");
        }
    });



    $(".jdb").off("mouseover").on("mouseover","[data-toggle=img]",e=>{
        var $mImg=$(e.target).parent().parent().parent().prev().children("#mImg"),
            md=$(e.target).data("md"),
            lg=$(e.target).data("lg")
        $mImg.attr("src",md);
        //console.log($mImg);
    });


    $(".floor").click(e=>{
        if($(e.target).is(".cart")){   //加入购物车
            e.preventDefault();
            $.ajax({
                type:"get",
                dataType:"json",
                url:"data/routes/users/isLogin.php",
                success:data=>{
                    if(data.ok==1){
                        var count=1;
                        var lid=$(e.target).data("lid");
                        $.ajax({
                            type:"get",
                            url:"data/routes/cart/addToCart.php",
                            data:{lid,count},
                            dataType:"json",
                            error:()=>{
                                alert("网络故障,请检查");
                            }
                        }).then((data)=>{
                            if(data.ok>0) {
                                delcart();
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
        }else if($(e.target).is(".buy")){   //立即购买
            e.preventDefault();
            $.ajax({
                type:"get",
                dataType:"json",
                url:"data/routes/users/isLogin.php",
                success:data=>{
                    if(data.ok==1){
                        var count=1;
                        var lid=$(e.target).data("lid");
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



})();

