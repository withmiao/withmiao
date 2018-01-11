//检查登录状态
var statusCode=0;
function checkStatus(){
	$.get("data/routes/users/isLogin.php")
		.then(data=>{//data:{ok:1,uname:xxx}
			statusCode=data.ok;
		});
	return statusCode;
}

//定义函数设置购物车到期删除时间
function delcart(){
	var s=60*1000;
	var nowDate=(new Date().getTime());
	var delcart=nowDate+s;
	console.log(new Date(delcart));
	$.ajax({
		type:'get',
		url:'data/routes/cart/delcart.php',
		dataType:'text',
		data:{delcart}
	});
}

(()=>{
	//加载购物车

	function outer(){
		var timer=null;
		return function(){
			clearInterval(timer);
			$.ajax({
				type:"get",
				dataType:"json",
				url:"data/routes/cart/getCart.php"
			}).then(data=>{
				if(data){
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
					$("#shopping_cart>.head_cart_login>.list-pro").html(html);
					$("#shopping_cart>.head_cart_login>.re-buy>:first-child>:first-child").html(count);
					$("#shopping_cart").children().first().children().last().html(count);
					$("#shopping_cart>.head_cart_login>.re-buy>:first-child>:last-child").html(`¥:${total}`);

					//setTimeout(()=>{
					if(data.length>0 && data[0].delcart>0){
						var countdown=Math.round((data[0].delcart-((new Date()).getTime()))/1000);
						if(countdown>0){
							var time=$("#shopping_cart").find(".time");
							//span.innerHTML="";
							timer=setInterval(()=>{
									var m=parseInt(countdown/60);
									if(m<10) m="0"+m;
									var n=countdown%60;
									if(n<10) n="0"+n;
									var msg=m+":"+n;
									time.html(msg).css("color","red");
									$("#shopping_cart").find(".head_cart_login").children()
										.first().children().first().html(msg);
								if(countdown<=0){
									clearInterval(timer);
									time.html("购物袋").css("color","");
									$("#shopping_cart").find(".head_cart_login").children()
										.first().children().first().html("购物袋");
									$.ajax({
										type:"get",
										url:'data/routes/cart/clearCart.php',
										success:()=>{
											loadCart();
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
									loadCart();
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
					//},1000)
					if(count==0){
						clearInterval(timer);
						$("#shopping_cart").find(".time").html("购物袋").css("color","");
						$("#shopping_cart").find(".head_cart_login").children()
							.first().children().first().html("购物袋");
					}
				}
			})
		}
	}

	var loadCart=outer();



	//检查登录状态
	function loadStatus(){
		//判断登录:
		var $loginList=$("#loginList");
		var $welcomeList=$("#welcomeList");
		$.get("data/routes/users/isLogin.php")
			.then(data=>{//data:{ok:1,uname:xxx}
				if(data.ok==1){
					$loginList.hide();
					$welcomeList.show();
					$("#uname").html(data.uname);
				}else{
					$loginList.show();
					$welcomeList.hide();
				}
			});
	}

	//加载购物车
	loadCart();
	/*setInterval(()=>{
		console.log(1);
		loadCart();
	},500)*/

	//定义带参数函数给查询按钮
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
                                    <a style="color:#fff;" class="addCart" data-lid="${p.lid}">加购物车</a>
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

	//加载header
		//方法一
	/*ajax("get","01_header.html","","text")
		.then(html=> {
			document.getElementById("header")
				.innerHTML = html;
			loadStatus();
		});*/
	//$("#header").load("header.html",()=>{
		//方法二
	$.ajax({
		type:"get",
		url:"01_header.html",
		success:html=>{
			$("#header").html(html);
			if(location.search){
				$("#textSearch").val(
					decodeURI(location.search.split("=")[1])
				);
			}
	//为搜索框添添加单击事件
			//方法一
			$("[data-trigger=search]").click(()=>{
				console.log(1);

				var kw=$("#txtSearch").val().trim();
				if(kw!=""){
					location="products.html?kw="+kw;
				}
			});
			//方法二
			/*$("[data-trigger=search]").click((e)=>{
				e.preventDefault();
				var kw=$("#txtSearch").val().trim();
				if(kw!=""){
					loadProduct(kw,pno=0);
				}
			});*/

			loadStatus();

	//注销
			$("#logout").click(()=>{
				$.get("data/routes/users/logout.php")
					.then(()=>location.reload());
			});

	//搜索帮助
			var $txtSearch=$("#txtSearch"),
				$shelper=$("#shelper");
			$txtSearch.keyup(e=>{
				if(e.keyCode!=13){
					if(e.keyCode==40){
						if(!$shelper.is(":has(.focus)")){
							$shelper.children()
								.first().addClass("focus");
						}else{
							if($shelper.children().last()
									.is(".focus")){
								$shelper.children(".focus")
									.removeClass("focus");
								$shelper.children()
									.first().addClass("focus");
							}else{
								$shelper.children(".focus")
									.removeClass("focus")
									.next().addClass("focus");
							}
						}
						$txtSearch.val(
							$shelper.children(".focus")
								.attr("title")
						);
					}else if(e.keyCode==38){
						if(!$shelper.is(":has(.focus)")){
							$shelper.children()
								.last().addClass("focus");
						}else{
							if($shelper.children()
									.first().is(".focus")){
								$shelper.children(".focus")
									.removeClass("focus");
								$shelper.children()
									.last().addClass("focus");
							}else{
								$shelper.children(".focus")
									.removeClass("focus")
									.prev().addClass("focus");
							}
						}
						$txtSearch.val(
							$shelper.children(".focus").attr("title")
						);
					}else{
						var $tar=$(e.target);
						$.get(
							"data/routes/products/searchHelper.php",
							"term="+$tar.val()
						).then(data=>{
							var html="";
							for(var p of data){
							html+=`<li title="${p.title}">
										<div class="search-item" title="${p.title}" data-url="product_details?lid=${p.lid}">
										<a href="product_details.html?lid=${p.lid}">${p.title}</a>

										</div>
									</li>`
								}
								$shelper.show().html(html);
							});
					}
				}else
					$("[data-trigger=search]").click();
			}).blur(()=>$shelper.hide().html(""));


			//为购物袋绑定鼠标移入事件
			var status=checkStatus();
			$("#header").on("mouseenter","#shopping_cart",e=>{
				var $head_cart_logout=$(e.target).children(".head_cart_logout"),
					$head_cart_login=$(e.target).children(".head_cart_login");
				status=checkStatus();
				if(status==1){
					$head_cart_logout.hide();
					$head_cart_login.show();
				}else{
					$head_cart_logout.show();
					$head_cart_login.hide();
				};
			});

			$("#header").on("click",".close",e=>{
				$(e.target).parent().parent().hide();
			});


			//顶部购物车事件
			$("[data-btn=btn]").click(()=>{
				loadCart()
			})

			$(".list-pro").on("click",".reduce,.add",e=>{
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
									loadCart();
								})
					}else{
						$.get(
							"data/routes/cart/updateCart.php",
							"count="+n+"&iid="+$input.data("iid")
						).then(()=>{
								delcart();
								loadCart();
							})
					}
				}
			});

		},
		error:()=>{
			alert("网络故障请检查");
		}
	});





	//添加事件实现搜索框定位
	$(window).scroll(()=>{
		var scrollTop=$(window).scrollTop();
		//如果scrollTop>=380,就为id为header-top的div添加class fixed_nav
		if(scrollTop>=380)
			$("#header-top").addClass("fixed_nav");
		//否则，就移除id为header-top的div的fixed_nav class
		else
			$("#header-top").removeClass("fixed_nav");
	});


})();



