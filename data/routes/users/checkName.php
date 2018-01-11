<?php
header("Content-Type:text/plain");
require("../../controllers/user.controller.php");
if(checkName()) echo "true";
else echo "false";