<?php
// Set Time Zone
	
// Site Settings	global $BASE_DIRECTORY, $ROOT_URL;
	$BASE_DIRECTORY = "/";
	$ROOT_URL = $_SERVER['HTTP_HOST'].$BASE_DIRECTORY;

	
// DB Connection Settings
	global $MYSQL_HOST, $MYSQL_USER, $MYSQL_PASS, $MYSQL_DB;
	$MYSQL_HOST = "";
	$MYSQL_USER = "";
	$MYSQL_PASS = "";
	$MYSQL_DB = "";

// Tracking API Settings
	global $BITLY_API_ID, $BITLY_API_SECRET, $BITLY_API_USER, $BITLY_API_KEY;
	
	// App Key
	$BITLY_API_ID = "";
	$BITLY_API_SECRET = "";

	// Personal Key
	$BITLY_API_USER = "";
	$BITLY_API_KEY = "";

// Cache Settings
	global $CACHE_TIMEOUT;
	$CACHE_TIMEOUT = 300; // in seconds

// Recaptcha Settings
	global $RECAPTCHA_PUBLIC_KEY, $RECAPTCHA_PRIVATE_KEY;
	$RECAPTCHA_PUBLIC_KEY = "";
	$RECAPTCHA_PRIVATE_KEY = "";
?>