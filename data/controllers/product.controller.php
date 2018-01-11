<?php
require_once("../../init.php");
//require_once("../init.php");
function get_index_products(){
	global $conn;
	$output=[
		//recommended=>[推荐商品列表],
		//new_arrival=>[新品上架],
		//top_sale=>[热销]
	];
	
	//一楼商品

	$sql="select * from xz_index_product where seq_recommended>0 order by seq_recommended";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["recommended"]=$products;

	//一楼商品 首件商品
	$sql="select * from xz_index_product where seq_recommended>0 order by seq_recommended limit 1";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$lid = $products[0]["pid"];
	$sql="select sm,md from xz_laptop_pic where laptop_id=$lid";
	$result=mysqli_query($conn,$sql);
	$output["Rimgs"]=mysqli_fetch_all($result,1);

	//二楼商品
	$sql="select * from xz_index_product where seq_new_arrival>0 order by seq_new_arrival";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["new_arrival"]=$products;

	//二楼商品 首件商品
	$sql="select * from xz_index_product where seq_new_arrival>0 order by seq_new_arrival limit 1";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$lid = $products[0]["pid"];
	$sql="select sm,md from xz_laptop_pic where laptop_id=$lid";
	$result=mysqli_query($conn,$sql);
	$output["Nimgs"]=mysqli_fetch_all($result,1);

	//三楼商品
	$sql="select * from xz_index_product where seq_top_sale>0 order by seq_top_sale";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["top_sale"]=$products;

	//三楼商品 首件商品
	$sql="select * from xz_index_product where seq_top_sale>0 order by seq_top_sale limit 1";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$lid = $products[0]["pid"];
	$sql="select sm,md from xz_laptop_pic where laptop_id=$lid";
	$result=mysqli_query($conn,$sql);
	$output["Simgs"]=mysqli_fetch_all($result,1);

	echo json_encode($output);
}
//get_index_products();
function getProductsByKw(){
	global $conn;
	$output=[
		"count"=>0,//总个数
		"pageSize"=>12,//每页9个
		"pageCount"=>0,//总页数
		"pageNo"=>0,//现在第几页
		"data"=>[]//商品列表
	];
	@$pno=(int)$_REQUEST["pno"];
	if($pno) $output["pageNo"]=$pno;
	@$kw=$_REQUEST["kw"];
	$sql="select *,(select md from xz_laptop_pic where laptop_id=lid limit 1) as md from xz_laptop ";
	if($kw){
		//$kw=mac 256g
		//将$kw按空格切割为数组
		$kws=explode(" ",$kw);//js:split
		//$kws:[mac,256g]
		for($i=0;$i<count($kws);$i++){
			$kws[$i]=" title like '%".$kws[$i]."%' ";
		}
		//$kws:[
			//" title like '%mac%' ",
			//" title like '%256g%' "
		//]
		$sql.=" where ".implode(" and ",$kws);
		               //js: $kws.join(" and ")
	}
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["count"]=count($products);
	$output["pageCount"]=
		ceil($output["count"]/$output["pageSize"]);
	//$sql.= limit pageNo*pageSize,pageSize
	$sql.=" limit ".
				($output["pageNo"]*$output["pageSize"]).
		    ",".
				$output["pageSize"];
	$result=mysqli_query($conn,$sql);
	$output["data"]=mysqli_fetch_all($result,1);
	echo json_encode($output);
}
//getProductsByKw();
function getProductById(){
	global $conn;
	@$lid=$_REQUEST["lid"];
	$output=[
			
	];
	if($lid){
		$sql="select lid,family_id, price,title,subtitle,promise,(select md from xz_laptop_pic where laptop_id=lid limit 1) as md from xz_laptop where lid=$lid";
		$result=mysqli_query($conn,$sql);
		$output["product"]=mysqli_fetch_all($result,1)[0];


		$fid=$output["product"]["family_id"];

		$sql="select lid,spec from xz_laptop where family_id=$fid";
		$result=mysqli_query($conn,$sql);
		$output["family"]=mysqli_fetch_all($result,1);

		$sql="select sm,md,lg from xz_laptop_pic where laptop_id=$lid";
		$result=mysqli_query($conn,$sql);
		$output["imgs"]=mysqli_fetch_all($result,1);
		echo json_encode($output);
	}
}
function getProductSpecById(){
		global $conn;
		@$lid=$_REQUEST["lid"];
		$sql="select lname,os,memory,resolution,video_card,cpu,video_memory,category,disk,details from xz_laptop where lid=$lid";
		$result=mysqli_query($conn,$sql);
		$row=mysqli_fetch_row($result);
		echo json_encode($row);
}
//getProductById();
function getCarousel(){
	global $conn;
	$sql="select * from xz_index_carousel";
	$result=mysqli_query($conn,$sql);
	echo json_encode(mysqli_fetch_all($result,1));
}
//getCarousel();
function searchHelper(){
	global $conn;
	@$kw=$_REQUEST["term"];
	$sql="select lid,title,sold_count from xz_laptop ";
	if($kw){
	$kws=explode(" ",$kw);
	for($i=0;$i<count($kws);$i++){
		$kws[$i]=" title like '%".$kws[$i]."%' ";
	}
	$sql.="where ".implode(" and ",$kws);
}
	$sql.=" order by sold_count DESC limit 10";
//var_dump($sql);
	$result=mysqli_query($conn,$sql);
	echo json_encode(mysqli_fetch_all($result,1));

}