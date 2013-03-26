<?php
	include_once("includes/common.php");

	// This is really quickly written because we need to launch now and patch later.
	if (array_key_exists('r', $_POST)) {
		$remix = Remix::getObject($_POST['r']);
		if($remix == null)
			exit;

		// Create our image objects
		$img = imagecreatefrompng(get_include_path()."public/".$remix->getImgURL());
		$thumb = $dest = imagecreatetruecolor($_POST['h'],$_POST['w']);


		// Crop the image
		imagecopy($thumb, $img, 0, 0, $_POST['x'], $_POST['y'], $_POST['h'], $_POST['w']);

		// Save the image
		$filename = "remix".$remix->getItemId().".png";
		$path = 'remixes/thumbs/'.$filename;
		imagepng($thumb, get_include_path().'public/'.$path);
		
		$remix->setThumbURL($path);
		$remix->save();
	}
?>