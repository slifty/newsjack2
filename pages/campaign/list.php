<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;
	if(!User::isAdministrator()) {
		header("Location: ".$BASE_DIRECTORY."account/login.php");
		exit();
	}
	
	$campaigns = Campaign::getObjects(0,10);
	
?>

<html>
	<head>
		<title>Campaigns</title>
		<?php include("includes/head.php"); ?>
		
		<link rel="stylesheet" href="styles/campaigns.css" type="text/css" media="screen" title="no title" charset="utf-8">
	</head>
	<body>
		<?php include("includes/header.php"); ?>
		<h1>Campaigns</h1>
		<ul>
			<?php foreach($campaigns as $campaign) { ?>
				<li class="campaign">
					<h2><?=$campaign->getTitle();?></h2>
					<div class="index"><a href="http://<?=$ROOT_URL."/index.php?c=".$campaign->getItemID();?>">http://<?=$ROOT_URL."/index.php?c=".$campaign->getItemID();?></a></div>
					<div class="gallery"><a href="gallery.php?c=<?=$campaign->getItemId();?>">Gallery</a></div>
					<div class="edit"><a href="campaign.php?c=<?=$campaign->getItemId();?>">Edit</a></div>
				</li>
			<?php } ?>
		</ul>
		<div>
			<div class="create"><a href="campaign.php">Create a new Campaign</a></div>
		</div>
		<?php include("includes/footer.php"); ?>
	</body>
</html>