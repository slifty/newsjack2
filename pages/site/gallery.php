<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Gallery</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/site/gallery.css">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
			<div id="navigation">
				<ul>
					<li class="nav-home"><a href="<?php echo($BASE_DIRECTORY); ?>">Home</a></li>
				</ul>
			</div>
			<ul class="articles">
				<?php
					$articles = Article::getObjects();
					foreach($articles as $article) {
						?>
						<li>
							<div class="article-head"><?php echo($article->getTitle()); ?></div>
							<div class="example-container">
								<div class="example"><iframe src="<?php echo($article->getURL()); ?>"></iframe></div>
								<div class="example-overlay">
									<div class="example-overlay-content">
										<a href="<?php echo($BASE_DIRECTORY); ?>article/portal/<?php echo($article->getItemID()); ?>" class="edit">Remix Me!</a>
									</div>
								</div>
							</div>
							<ul class="remixes">
								<?php
									$remixes = array_slice($article->getFeaturedRemixes(), 0, 4);
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
										</li>
										<?php
									}
								?>
							</ul>
						</li>
						<?php
					}
				?>
			</ul>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>