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
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/article/list.css">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<h1>Articles</h1>
		<table class="articles">
			<tr>
				<th class="title">Title</th>
				<th class="url">URL</th>
				<th class="tools">Tools</th>
			</tr>
			<?php
				$articles = Article::getObjects(0,10);
				foreach($articles as $article) {
					?>
					<tr>
						<td class="title"><a href="<?php echo($BASE_DIRECTORY);?>article/portal/<?php echo($article->getItemID());?>"><?php echo($article->getTitle());?></td>
						<td class="url"><?php echo($article->getURL());?></td>
						<td class="tools"><a href="<?php echo($BASE_DIRECTORY);?>article/item/<?php echo($article->getItemID());?>">Edit</a></td>
					</tr>
					<?php
				}
			?>
		</table>
		<div>
			<div class="create"><a href="<?php echo($BASE_DIRECTORY);?>article/item/">Add a new Article</a></div>
		</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>