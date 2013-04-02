<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;
	global $CLEAN_PARAMS;

	if(array_key_exists('c', $_GET)) $campaign = Campaign::getObject($_GET['c']);
	else $campaign = Campaign::getObject(array_shift($CLEAN_PARAMS));
	
	if($campaign == null || $campaign->getItemId() == 0) {
		header("Location: ".$BASE_DIRECTORY);
		exit();
	}

?>
<html>
	<head>
		<title>Campaign Gallery</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/gallery.css" type="text/css" media="screen" title="no title" charset="utf-8">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
			<div id="breadcrumb"><a href="<?php echo($BASE_DIRECTORY); ?>">Back Home</a></div>
			<h1><?php echo($campaign->getTitle()); ?></h1>
			<div class="campaign" id="campaign">
				<p><?php echo($campaign->getDescription()); ?></p>
			</div>
			<h2>Participate</h2>
			<div class="section" id="suggestions">
				<ul>
					<?php
						$suggestions = $campaign->getSuggestions();
						foreach($suggestions as $suggestion) {
							?>
								<li><a href="<?php echo($BASE_DIRECTORY); ?>remix/create?c=<?php echo($campaign->getItemID()); ?>&url=<?php echo(urlencode("http://".$suggestion->getUrl())); ?>"><?php echo($suggestion->getTitle()); ?></a></li>
							<?php
						}
					?>
				</ul>
			</div>
			<?php
				if(User::isAdministrator()) $remixes = Remix::getObjectsByCampaignId($campaign->getItemId());
				else $remixes = Remix::getFeaturedObjectsByCampaignId($campaign->getItemId());
				
				if(sizeof($remixes) != 0) {
					?>
					<div class="section" id="remixes">
						<h2>Gallery</h2>
						<ul>
							<?php
								foreach($remixes as $remix) {
									?>
									<li>
										<div class="image">
											<?php if($remix->getThumbURL() != "") { ?>
												<a href="<?php echo($remix->getRemixURL()); ?>"><img src="<?php echo($BASE_DIRECTORY.$remix->getThumbURL()); ?>"/></a>
											<?php } elseif($remix->getImgURL() != "") { ?>
												<a href="<?php echo($remix->getRemixURL()); ?>"><img src="<?php echo($BASE_DIRECTORY.$remix->getImgURL()); ?>"/></a>
											<?php } ?>
										</div>
										<div class="link"><a href="<?php echo($remix->getRemixURL()); ?>"><?php echo($remix->getRemixURL()); ?></a></div>
										<div class="tools">
											<?php
												if(User::isAdministrator()) {
													?>
													<div class="delete"><form action="<?php echo($BASE_DIRECTORY);?>remix/view?r=<?php echo($remix->getItemId()); ?>" method="post"><input type="submit" name="delete" value="delete" /></form></div>
													<?php if($remix->getIsFeatured()) { ?>
														<div class="unfeature"><form action="<?php echo($BASE_DIRECTORY);?>remix/view?r=<?php echo($remix->getItemId()); ?>" method="post"><input type="submit" name="unfeature" value="unfeature" /></form></div>
													<?php } else { ?>
														<div class="unfeature"><form action="<?php echo($BASE_DIRECTORY);?>remix/view?r=<?php echo($remix->getItemId()); ?>" method="post"><input type="submit" name="feature" value="feature" /></form></div>
													<?php } ?>
													<?php
												}
											?>
										</div>
									</li>
									<?php
								}
							?>
						</ul>
						<div style="clear: left;"></div>
					</div>
					<?php
				}
			?>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>