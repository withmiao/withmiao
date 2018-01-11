<?php
header("Content-Type:application/json;charset=utf-8");
//获取初始数据
require("init.php");

//获取用户输入的数据 用户名／密码／验证码
@$uname = $_REQUEST["uname"];
@$upwd = $_REQUEST["upwd"];
@$phone = $_REQUEST["phone"];
@$email = $_REQUEST["email"];


//验证用户名密码验证码
$uPattern='/^[a-zA-Z0-9]{6,12}$/';
$pPattern='/^[a-zA-Z0-9]{6,12}$/';
$tPattern='/^1[34578]\d{9}$/';
$ePattern='/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+[\.][a-zA-Z0-9_-]+$/';

if(!preg_match($uPattern,$uname)){
    echo '{"code":-2,"msg":"用户名格式不正确"}';
    exit;
}

if(!preg_match($pPattern,$upwd)){
    echo '{"code":-2,"msg":"密码格式不正确"}';
    exit;
}
if(!preg_match($tPattern,$phone)){
    echo '{"code":-2,"msg":"手机号码格式不正确"}';
    exit;
}
if(!preg_match($ePattern,$email)){
    echo '{"code":-2,"msg":"邮箱格式不正确"}';
    exit;
}

//验证用户和密码是否正确
$sql = "INSERT INTO xz_user(uid,uname,upwd,phone,email) VALUES (null,'$uname','$upwd','$phone','$email')";
@$result = mysqli_query($conn,$sql);
@$row = mysqli_affected_rows($conn);
if($row>0){
    echo '{"code":1,"msg":"注册成功"}';
}else{
    echo '{"code":-2,"msg":"注册失败"}';
}
?>