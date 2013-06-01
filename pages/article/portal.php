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
		<script type="text/javascript" src="<?php echo($BASE_DIRECTORY); ?>js/jquery.jcarousel.min.js"></script>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/carousel.css">
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/article/portal.css">
	</head>
	<body>

		<?php include("includes/partials/header.php"); ?>

			<div id="navigation">
				<ul>
					<li><a href="<?php echo($BASE_DIRECTORY); ?>remix/create/<?php echo($article->getItemID()); ?>">Edit</a></li>
					<li><a href="<?php echo($BASE_DIRECTORY); ?>">Home</a></li>
					<li>Deel</li>
				</ul>
			</div>
			<div id="example-container">
				<iframe id="example" src="<?php echo($article->getURL()); ?>"></iframe>
				<div id="example-overlay">
					<div id="example-overlay-content">
						<a href="<?php echo($BASE_DIRECTORY); ?>remix/create/<?php echo($article->getItemID()); ?>" class="edit">Voor</a>
					</div>
				</div>
			</div>
			<div id="example-container">
				<iframe id="example" src="<?php echo($article->getURL()); ?>"></iframe>
				<div id="example-overlay">
					<div id="example-overlay-content">
						<a href="<?php echo($BASE_DIRECTORY); ?>remix/create/<?php echo($article->getItemID()); ?>" class="edit">Na</a>
					</div>
				</div>
			</div>

			<h1 id="how-it-works">How does it work?</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed turpis mauris, quis posuere purus. In lectus nibh, venenatis eget varius nec, blandit et eros. Vestibulum porta, nisi in sodales imperdiet, mauris est aliquam neque, sed aliquam quam tortor sit amet lorem. Cras nibh quam, ornare quis imperdiet eu, varius a lectus. Integer ultricies justo sed urna bibendum pulvinar. Curabitur sed accumsan ligula. Donec auctor, nisi ut fermentum porta, nibh nisi ornare felis, eu pretium libero orci ultrices ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam fringilla urna sit amet odio tempus aliquet. Nunc ac ultricies libero. Curabitur sit amet metus augue. Phasellus rhoncus, massa id pretium ullamcorper, eros dolor vestibulum justo, at pharetra arcu ligula non mauris. Curabitur sit amet est lorem. Suspendisse purus sem, iaculis ac bibendum consequat, tempor nec nisi.</p>
			
			<h1 id="more">More</h1>
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

										<a href="<?php echo($remix->getRemixURL()); ?>" data-remix-img='<?php echo($BASE_DIRECTORY.$remix->getImgURL()); ?>'>
										<?php if($remix->getThumbURL() != "") { ?>
											<img src="<?php echo($BASE_DIRECTORY.$remix->getThumbURL()); ?>"/>
										<?php } elseif($remix->getImgURL() != "") { ?>
											<img src="<?php echo($BASE_DIRECTORY.$remix->getImgURL()); ?>"/>
										<?php } ?>
										</a>
									</div>
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

					<script type="text/javascript">
						$(function(){
							$(".remixes").jcarousel({
								buttonNextHTML: "<div>&gt;&gt;</div>",
								buttonPrevHTML: "<div>&lt;&lt;</div>"
							});
						})
					</script>

					<script type="text/javascript">
						$(function(){
							$(".remixes li a").click(function(e) {
								var $this = $(this);
								var modal_html  = "<div>";
									modal_html += "<div class='custom-dialog-close'>CLOSE</div>";
									modal_html += "<div class='remix-paper-wrapper'>";
									if($this.attr('data-remix-img') != '')
										modal_html += "<img src='" + $this.attr('data-remix-img') + "' />";
									else
										modal_html += "<iframe src='" + $this.attr('href') + "'></iframe>";
									modal_html += "<ul class='share-buttons'>";
									modal_html += "<li class='facebook'><a href='http://www.facebook.com/sharer.php?u=" + encodeURIComponent($this.attr('href')) + "' target='_blank'></a></li>";
									modal_html += "<li class='twitter'><a href='https://twitter.com/intent/tweet?url=" + encodeURIComponent($this.attr('href')) + "' target='_blank'></a></li>";
									modal_html += "<li class='bitly'><a href='" + $this.attr('href') + "+' target='_blank'></a></li>";
									modal_html += "<li class='email'><a></a></li>";
									modal_html += "</ul>";
									modal_html += "</div>";
									modal_html += "</div>";

								var $modal = $(modal_html)
								.dialog({
									modal: true,
									width: '70%',
									resizable: false,
									draggable: false,

								});

								$(".custom-dialog-close").click(function(){
									$modal.dialog("close");
								})
								return false;
							});
						})
					</script>
					<?php
				}
			?>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>