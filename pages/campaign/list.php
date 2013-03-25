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
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="css/campaigns.css" type="text/css" media="screen" title="no title" charset="utf-8">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<div class="content">
			<h1>Campaigns</h1>
			<ul>
				<?php foreach($campaigns as $campaign) { ?>
					<li class="campaign">
						<h2><?php echo($campaign->getTitle());?></h2>
						<div class="index"><a href="http://<?php echo($ROOT_URL."index.php?c=".$campaign->getItemID());?>">http://<?php echo($ROOT_URL."index.php?c=".$campaign->getItemID());?></a></div>
						<div class="gallery"><a href="gallery.php?c=<?php echo($campaign->getItemId());?>">Gallery</a></div>
						<div class="edit"><a href="view.php?c=<?php echo($campaign->getItemId());?>">Edit</a></div>
					</li>
				<?php } ?>
			</ul>
			<div>
				<div class="create"><a href="view.php">Create a new Campaign</a></div>
			</div>
		</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>