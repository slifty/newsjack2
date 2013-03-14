<?php
	include_once("includes/common.php");
	
	if(!User::isAdministrator()) {
		header("Location: login.php");
		exit();
	}
	
	$remix = Remix::getObject($_GET['r']);
	
	if($remix == null || $remix->getItemId() == 0) {
		header("Location: index.php");
		exit();
	}
	
	
	if($_SERVER['REQUEST_METHOD'] === 'POST') {
		$campaign_id = $remix->getCampaignId();
		
		if(isset($_POST['save']))
			$remix->setIsFeatured(isset($_POST['featured']));
		if(isset($_POST['feature']))
			$remix->setIsFeatured(true);
		if(isset($_POST['unfeature']))
			$remix->setIsFeatured(false);
		$remix->save();
		
		if(isset($_POST['delete'])) {
			$remix->delete();
		}
		
		header("Location: gallery.php?c=".$campaign_id);
		exit();
	}
?>


<html>
	<head>
		<title>Campaign</title>
		<link rel="stylesheet" href="css/main.css" type="text/css" media="screen" title="no title" charset="utf-8">
		<link rel="stylesheet" href="css/springMessage.css" type="text/css" media="screen" title="no title" charset="utf-8">
		<script src="js/jquery.min.js" type="text/javascript" charset="utf-8"></script>
		<link rel="stylesheet" href="css/index.css" type="text/css" media="screen" title="no title" charset="utf-8">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<h1>Remix</h1>
		<form method="POST">
			<h2>Basic Information</h2>
			<ul>
				<li><label for="title">Url</label><div class="value"><?= $remix->getRemixURL(); ?></div></li>
			</ul>
			<h2>Settings</h2>
			<ul>
				<li><input type="checkbox" name="featured" id="featured" <?php if($remix->getIsFeatured()) { echo('checked'); }?>/><label for="featured">Featured</label></li>
			</ul>
			<input type="submit" name="save" value="save"/>
			<input type="submit" name="delete" value="delete"/>
		</form>
		<?php include("includes/footer.php"); ?>
	</body>
</html>