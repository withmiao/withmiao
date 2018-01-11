<?php
header("Content-Type:application/json");
require_once("../init.php");
$output=[//包含三层楼所有首页商品的二维关联数组
  //"f1"=>[],
  //"f2"=>[],
  //"f3"=>[]
];
//查询一楼首推商品的sql语句
$sql="SELECT * FROM xz_index_product where seq_recommended>0 order by seq_recommended limit 6";
//查询出一楼的6个首推商品，保存在结果数组的f1子数组中
$output["f1"]=sql_execute($sql);
//f2
$sql="SELECT * FROM xz_index_product where seq_new_arrival>0 order by seq_new_arrival limit 6";
$output["f2"]=sql_execute($sql);
//f3
$sql="SELECT * FROM xz_index_product where seq_top_sale>0 order by seq_top_sale limit 6";
$output["f3"]=sql_execute($sql);

echo json_encode($output);