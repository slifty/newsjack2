<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;
	User::logout();
	header("Location: ".$BASE_DIRECTORY);
?>