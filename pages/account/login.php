<?php
	include_once("includes/common.php");
	global $BASE_DIRECTORY;

	if(User::isLoggedIn()) {
		header("Location: ".$BASE_DIRECTORY);
		exit();
	}
	
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Log In</title>
		<?php include("includes/partials/head.php"); ?>
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<div class="content">
			<h1>Log In</h1>
			<form method="post">
				<ul>
					<li><label for="username">Username</label><input type="text" id="username" name="username"/></li>
					<li><label for="password">Password</label><input type="password" id="password" name="password"/></li>
					<li><input type="submit" value="Log In" /></li>
				</ul>
			</form>
		</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>