<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;
	global $CLEAN_PARAMS;

	// Load the relevant article
	$article = Article::getObject(array_shift($CLEAN_PARAMS));
	if($article == null || $article->getItemId() == 0) {
		header("Location: ".$BASE_DIRECTORY);
		exit();
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Article Portal</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/article/portal.css">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
			<ul id="breadcrumb">
				<li><a href="<?php echo($BASE_DIRECTORY); ?>">Back Home</a></li>
			</ul>
			<h1>Article</h1>
			<h2><a href="<?php echo($article->getURL()); ?>"><?php echo($article->getTitle()); ?></a></h2>
			<div id="example-container">
				<iframe id="example" src="<?php echo($article->getURL()); ?>"></iframe>
				<div id="example-overlay">
					<div id="example-overlay-content">
						<a href="<?php echo($BASE_DIRECTORY); ?>remix/create/<?php echo($article->getItemID()); ?>" class="edit">Click to Remix</a>
					</div>
				</div>
			</div>

			<div id="links">
				<ul>
					<li><a href="<?php echo($BASE_DIRECTORY); ?>site/help">How does it work?</a></li>
					<li><a href="<?php echo($BASE_DIRECTORY); ?>site/gallery">Other Articles</a></li>
				</ul>
			</div>
			
			<h1>Remix Gallery</h1>
			<?php
				if(User::isAdministrator()) $remixes = $article->getRemixes();
				else $remixes = $article->getFeaturedRemixes();
				
				if(sizeof($remixes) != 0) {
					?>
					<ul class="remixes">
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
					<?php
				}
			?>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>