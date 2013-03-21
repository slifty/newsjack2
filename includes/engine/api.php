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
	$parsed_url = parse_url($_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);

	$path_items = array_splice(explode("/", $parsed_url['path']), substr_count($BASE_DIRECTORY, "/") + 1);

	$file_path = "api/".$path_items[0];

	include_once($file_path);
?>