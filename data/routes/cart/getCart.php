<?php
//header('Access-Control-Allow-Origin:http://localhost:3000');
//header('Access-Control-Allow-Credentials:true');
header("Content-Type:application/json");
require_once("../../controllers/cart.controller.php");
getCart();
?>