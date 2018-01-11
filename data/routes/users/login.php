<?php
header("Content-Type:text/plain");
require("../../controllers/user.controller.php");
if(login()) echo "true";
else echo "false";