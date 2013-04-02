<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;
	if(!User::isAdministrator()) {
		header("Location: ".$BASE_DIRECTORY."account/login");
		exit();
	}
	
	
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Campaigns</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/campaign_list.css" type="text/css" media="screen" title="no title" charset="utf-8">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<div class="content">
			<h1>Campaigns</h1>
			<ul>
				<?php
					$campaigns = Campaign::getObjects(0,10);
					foreach($campaigns as $campaign) {
						?>
						<li class="campaign">
							<h2><?php echo($campaign->getTitle());?></h2>
							<div class="gallery"><a href="<?php echo($BASE_DIRECTORY);?>campaign/gallery/<?php echo($campaign->getItemId());?>">Gallery</a></div>
							<div class="edit"><a href="<?php echo($BASE_DIRECTORY);?>campaign/view/<?php echo($campaign->getItemId());?>">Edit</a></div>
						</li>
						<?php
					}
				?>
			</ul>
			<div>
				<div class="create"><a href="view.php">Create a new Campaign</a></div>
			</div>
		</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>