<?php
	#  Models classes
	include_once ("conf.php");
	include_once (__DIR__."/helpers.php");
	include_once (__DIR__."/engine/classes/DBConn.php");
	include_once (__DIR__."/engine/classes/Util.php");
	include_once (__DIR__."/models/User.php");
	include_once (__DIR__."/models/Campaign.php");
	include_once (__DIR__."/models/Remix.php");
	include_once (__DIR__."/models/Cache.php");

	// Log in as appropriate
	if (isset($_POST["username"]) && isset($_POST["password"])) {
		if(!User::logIn($_POST["username"], $_POST["password"])) {
			header("Location: login?e=1");
			exit();
		}
	} elseif (isset($_SESSION["username"]) && isset($_SESSION["password"])) {
		User::logIn($_SESSION["username"], $_SESSION["password"]);
	}
?>