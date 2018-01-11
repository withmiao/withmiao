
/**********************通过查询字符串加载商品*************************/
function loadProducts(pno=0){
	$.ajax({
		type:"get",
		url:"data/routes/products/getProductsByKw.php",
		data:location.search.slice(1)+"&pno="+pno
	}).then(output=>{
		var data=output.data;
		var html="";
		for(var p of data){
			html+=`
					<div class="jdb">
                        <a href="product_details.html?lid=${p.lid}">
                            <img src="${p.md}"/>
                        </a>
                        <span>
                                ${p.lname}
                        </span>
                        <div>
                            <span>
                                ${p.os}|${p.memory}|${p.disk}|${p.resolution}
                            </span>
                            <ul>
                                <li></li>
                                <li><a href="product_details.html?lid=${p.lid}">查看详情</a></li>
                                <li></li>
                            </ul>
                            <ul>
                                 <li>
                                    <a style="color:#fff;" href="#"  class="addCart" data-lid="${p.lid}">加购物车</a>
                                 </li>
                            </ul>
                            <output>
                                ¥${p.price}
                            </output>
                        </div>
                    </div>
				`;
		}
		document.getElementById("product-list")
						.innerHTML=html;
		//错误:.... json ....
		//开network->xhr请求->response

		var pageCount=output.pageCount,
			  pageNo=output.pageNo;
		var html=`<a href="javascript:;" class="previous">上一页</a>`;
		for(var i=1;i<=pageCount;i++){
			html+=`<a href="javascript:;">${i}</a>`;
		}
		html+=`<a href="javascript:;" class="next">下一页</a>`;
		var divPages=document.getElementById("pages");
		divPages.innerHTML=html;
		divPages.children[pageNo+1]
						.className="current";

		//checkAStatus(divPages,pageCount,pageNo);

		divPages.onclick=e=>{//为divPages绑定单击事件
			if(e.target.nodeName=="A"){//如果目标元素是a
				var a=e.target;
				//如果a不是divPages的第一个子元素和最后一个子元素
				if(a!=divPages.children[0]&&
						a!=divPages.lastElementChild){
					//如果当前a的class不是current
					if(a.className!="current"){
						//获得当前a的内容-1，保存在pno中
						var pno=a.innerHTML-1;
						//调用loadProducts(pno)重新加载第pno页
						loadProducts(pno);
					}
				}else{
					//如果class不以disabled结尾
					if(!a.className.endsWith("disabled")){
						//在divPages下查找class为current的a
						var curr=
							divPages.querySelector(".current");
						//如果class以next开头
						if(a.className.startsWith("next")){
							//重新加载商品列表传入current的内容作为pno
							loadProducts(curr.innerHTML);
						}else{
							loadProducts(curr.innerHTML-2);
						}
					}
				}
			}
		}
					
	})
}

/*****************************************************************/

/**********************定义查询按钮单击事件函数***********************/
function loadProduct(kw,pno=0){
	$.ajax({
		type:"get",
		url:"data/routes/products/getProductsByKw.php",
		data:{kw:kw}
	}).then(output=>{
		var data=output.data;
		var html="";
		for(var p of data){
			html+=`
					<div class="jdb">
                        <a href="product_details.html?lid=${p.lid}">
                            <img src="${p.md}"/>
                        </a>
                        <span>
                                ${p.lname}
                        </span>
                        <div>
                            <span>
                                ${p.os}|${p.memory}|${p.disk}|${p.resolution}
                            </span>
                            <ul>
                                <li></li>
                                <li><a href="product_details.html?lid=${p.lid}">查看详情</a></li>
                                <li></li>
                            </ul>
                            <ul>
                                 <li>
                                    <a style="color:#fff;" href="#"  class="addCart" data-lid="${p.lid}">加购物车</a>
                                 </li>
                            </ul>
                            <output>
                                ¥${p.price}
                            </output>
                        </div>
                    </div>
				`;
		}
		document.getElementById("product-list")
			.innerHTML=html;
		//错误:.... json ....
		//开network->xhr请求->response

		var pageCount=output.pageCount,
			pageNo=output.pageNo;
		var html=`<a href="javascript:;" class="previous">上一页</a>`;
		for(var i=1;i<=pageCount;i++){
			html+=`<a href="javascript:;">${i}</a>`;
		}
		html+=`<a href="javascript:;" class="next">下一页</a>`;
		var divPages=document.getElementById("pages");
		divPages.innerHTML=html;
		divPages.children[pageNo+1]
			.className="current";

		//checkAStatus(divPages,pageCount,pageNo);

		divPages.onclick=e=>{//为divPages绑定单击事件
			if(e.target.nodeName=="A"){//如果目标元素是a
				var a=e.target;
				//如果a不是divPages的第一个子元素和最后一个子元素
				if(a!=divPages.children[0]&&
					a!=divPages.lastElementChild){
					//如果当前a的class不是current
					if(a.className!="current"){
						//获得当前a的内容-1，保存在pno中
						var pno=a.innerHTML-1;
						//调用loadProducts(pno)重新加载第pno页
						loadProducts(pno);
					}
				}else{
					//如果class不以disabled结尾
					if(!a.className.endsWith("disabled")){
						//在divPages下查找class为current的a
						var curr=
							divPages.querySelector(".current");
						//如果class以next开头
						if(a.className.startsWith("next")){
							//重新加载商品列表传入current的内容作为pno
							loadProducts(curr.innerHTML);
						}else{
							loadProducts(curr.innerHTML-2);
						}
					}
				}
			}
		}

	})
}



//定义函数设置购物车到期删除时间
function delcart(){
	var s=60*1000;
	var nowDate=(new Date().getTime());
	var delcart=nowDate+s;
	//console.log(new Date(delcart));
	$.ajax({
		type:'get',
		url:'data/routes/cart/delcart.php',
		dataType:'text',
		data:{delcart}
	});
}
//
/*function checkAStatus($divPages,pageCount,pageNo){
	//获得divPages下两个a
	var $prev=$divPages.children().first();
	var $next=$divPages.children().last();
	//如果pageNo不是0，也不是pageCount
	if(pageNo!=0&&pageNo!=pageCount-1){
		//两个按钮都启用
		$prev.removeClass("disabled");
		$next.removeClass("disabled");
	}else{//否则
		if(pageNo==0)//如果pageNo==0,就prev禁用
			$prev.addClass("disabled");
		//如果pageNo==pageCount-1,就next禁用
		if(pageNo==pageCount-1)
			$next.addClass("disabled");
	}
}*/

$(()=>{

	/*****************************加载购物车******************************/

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
						//console.log(countdown);
						if(countdown>0){
							var time=$("#container").find(".time");
							//span.innerHTML="";
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


	//加载商品
	loadProducts();

	//加载购物车
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

	/******************************筛选框****************************/
	var dlNum  =$("#selectList").find("dl");
	for (var i = 0; i < dlNum.length; i++) {
		$(".hasBeenSelected .clearList").append("<div class=\"selectedInfor selectedShow\" style=\"display:none\"><span></span><label></label><em></em></div>");
	}

	var refresh = "true";
	var $txtSearch=$("#txtSearch");

	function findHtml(){
		var $hasBeenSelected=$(".hasBeenSelected");
		var $clearList=$hasBeenSelected.find(".clearList");
		var $div=$clearList.children("div");
		//console.log($div);
		var html=""
		$div.each(function(){
			if($(this).children("label").html()) {
				html += ` ${$(this).children("label").html()}`;
			}
		})
		return html;

	}
	var html="";
	$(".listIndex a ").off().on("click",function(){
		var text =$(this).text();
		var selectedShow = $(".selectedShow");
		var textTypeIndex =$(this).parents("dl").index();
		var textType =$(this).parent("dd").siblings("dt").text();
		var index = textTypeIndex /*-(2)*/;
		$(".clearDd").show();
		$(".selectedShow").eq(index).show();
		$(this).addClass("selected").siblings().removeClass("selected");
		selectedShow.eq(index).find("span").text(textType);
		selectedShow.eq(index).find("label").text(text);

		var show = $(".selectedShow").length - $(".selectedShow:hidden").length;
		if (show > 1) {
			$(".eliminateCriteria").show();

		}
		html=findHtml().trim();
		$txtSearch.val(html);
		loadProduct(html,pno=0);
		//$("[data-trigger=search]").click();

	});
	$(".selectedShow em").on("click",function(){
		$(this).parents(".selectedShow").hide();
		$(this).parents(".selectedShow").children().first().next().html("");
		var textTypeIndex =$(this).parents(".selectedShow").index();
		index = textTypeIndex;
		$(".listIndex").eq(index).find("a").removeClass("selected");

		if($(".listIndex .selected").length < 2){
			$(".eliminateCriteria").hide();
		}
		html=findHtml().trim();
		$txtSearch.val(html);
		loadProduct(html,pno=0);
	});

	$(".eliminateCriteria").on("click",function(){
		$(".selectedShow").hide();
		$(this).hide();
		$(".listIndex a ").removeClass("selected");

		html=findHtml().trim();
		$txtSearch.val(html);
		loadProduct(html,pno=0);
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
						dataType:"text"
					}).then(()=>{
						//alert("添加成功");
						loadCartTo();
						delcart();
						$("[data-btn=btn]").click();
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











});

