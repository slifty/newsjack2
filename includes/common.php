<?php
	#  Models classes
	include_once ("conf.php");
	require_once (dirname(__FILE__)."/helpers.php");
	include_once (dirname(__FILE__)."/engine/classes/DBConn.php");
	include_once (dirname(__FILE__)."/engine/classes/Util.php");
	include_once (dirname(__FILE__)."/models/User.php");
	include_once (dirname(__FILE__)."/models/Campaign.php");
	include_once (dirname(__FILE__)."/models/Remix.php");
	include_once (dirname(__FILE__)."/models/Cache.php");

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