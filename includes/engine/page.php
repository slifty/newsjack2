<?php
	include_once('conf.php');
	include_once(__DIR__.'/engine.php');

	// Routing is going to be pretty basic / rigid here
	// B           :)
	//   B         :)
	//     B       :)
	//       B     :)
	//         B   :)
	//           B :)
	//             B)  -  DEAL WITH IT
	global $BASE_DIRECTORY;
	global $CLEAN_PARAMS;
	$parsed_url = parse_url($_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);

	$path_items = array_splice(explode("/", $parsed_url['path']), substr_count($BASE_DIRECTORY, "/"));

	if($path_items[0] == "" || sizeof($path_items) < 2) $file_path = "pages/index.php";
	else $file_path = "pages/".$path_items[0]."/".$path_items[1].".php";

	$CLEAN_PARAMS = array_splice($path_items, 2);

	include_once($file_path);
?>