<?php
	include_once("includes/common.php");
	if(!User::isAdministrator()) {
		header("Location: ".$BASE_DIRECTORY."account/login");
		exit();
	}
	
	// Are we loading an existing article?
	$article = Article::getObject(array_shift($CLEAN_PARAMS));
	if($article == null) $article = new Article();
	
	if($_SERVER['REQUEST_METHOD'] === 'POST') {
		$article->setURL(isset($_POST['url'])?url_prepend_http($_POST['url']):"");
		$article->setTitle(isset($_POST['title'])?$_POST['title']:"");
		$article->save();

		if(isset($_POST['delete']))
			$article->delete();
		
		header("Location: ".$BASE_DIRECTORY."article/list/");
		exit();
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Article</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/article/item.css">
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<h1>Article Entry</h1>
		<p>This form allows you to register a new article in the system.  Once the article is registered your users will be able to create and share remixes of it.</p>
		<form method="POST">
			<div class="section">
				<h2>Basic Information</h2>
				<p>Provide information about the article</p>
				<ul>
					<li><label for="title">Title</label><input type="text" name="title" id="title" value="<?php echo($article->getTitle()); ?>"/></li>
					<li><label for="url">Article URL</label><input type="text" name="url" id="url" value="<?php echo($article->getURL()); ?>" /></li>
				</ul>
			</div>
			
			<input type="submit" name="save" value="save"/>
			<?php if($article->getItemID() != 0) { ?>
				<input type="submit" name="delete" value="delete"/>
			<?php } ?>
		</form>
		</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>