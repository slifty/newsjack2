<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;

	$campaign = Campaign::getObject($_GET['c']);
	
	if($campaign == null || $campaign->getItemId() == 0) {
		header("Location: index.php");
		exit();
	}
	
	$remixes = Remix::getObjectsByCampaignId($campaign->getItemId());

?>
<html>
	<head>
		<title>Campaign Gallery</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/gallery.css" type="text/css" media="screen" title="no title" charset="utf-8">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<div class="content">
			<h2>Remixes</h2>
			<ul>
				<?php
					foreach($remixes as $remix) {
						?>
						<li class="remix">
							<div class="image">
								<?php if($remix->getImgURL() != "") { ?>
									<a href="<?php echo($remix->getRemixURL()); ?>"><img src="<?php echo($BASE_DIRECTORY.$remix->getImgURL()); ?>"/></a>
								<?php } ?>
							</div>
							<div class="link"><a href="<?php echo($remix->getRemixURL()); ?>"><?php echo($remix->getRemixURL()); ?></a></div>
							<div class="tools">
								<?php
									if(User::isAdministrator()) {
										?>
										<div class="delete"><form action="remix_entry.php?r=<?php echo($remix->getItemId()); ?>" method="post"><input type="submit" name="delete" value="delete" /></form></div>
										<?php if($remix->getIsFeatured()) { ?>
											<div class="unfeature"><form action="remix_entry.php?r=<?php echo($remix->getItemId()); ?>" method="post"><input type="submit" name="unfeature" value="unfeature" /></form></div>
										<?php } else { ?>
											<div class="unfeature"><form action="remix_entry.php?r=<?php echo($remix->getItemId()); ?>" method="post"><input type="submit" name="feature" value="feature" /></form></div>
										<?php } ?>
										<?php
									}
								?>
							</div>
						</li>
						<?php
					}
				?>
			</ul><div style="clear: left"></div>
		</div>
	</body>
</html>