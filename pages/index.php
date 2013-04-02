<?php
	include_once("includes/common.php");
?>
<!DOCTYPE html>
<html>
	<head>
		<title>NewsJack</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/index.css" type="text/css" media="screen" title="no title" charset="utf-8">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
			<div class="section" id="introduction">
				<p>This site makes it easy to change the messages you and your friends see online.  To try it out, choose an issue you care about from the list below.</p>
			</div>
			<h2>Active Campaigns</h2>
			<ul id="campaigns">
				<?php
					$campaigns = Campaign::getObjects(0,10);
					foreach($campaigns as $campaign) {
						?>
						<li class="campaign">
							<h3><a href="http://<?php echo($ROOT_URL.'campaign/gallery/'.$campaign->getItemID());?>"><?php echo($campaign->getTitle());?></a></h3>
						</li>
						<?php
					}
				?>
			</ul>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>