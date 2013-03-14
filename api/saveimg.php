<?php
	include_once("includes/common.php");

	// This is really quickly written because we need to launch now and patch later.
	if (array_key_exists('source', $_POST) && array_key_exists('r', $_POST)) {
		$remix = Remix::getObject($_POST['r']);
		
		if($remix == null)
			exit;
		
		$img = $_POST['source'];
		$data = substr(strstr($img, "base64,"), 7);
		$filename = "remix".$remix->getItemId().".png";
		$path = 'remixes/screenshots/'.$filename;
		file_put_contents(get_include_path().'public/'.$path, base64_decode($data));
		
		$remix->setImgURL($path);
		$remix->save();
		
		echo($path);
	}
?>