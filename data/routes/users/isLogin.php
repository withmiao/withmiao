<?php
header("Content-Type:application/json;charset=utf8");

require("../../controllers/user.controller.php");
echo json_encode(isLogin());