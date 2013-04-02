<?php
	include_once("includes/common.php");
	
	if(isset($_POST["user"])) {
		$user = new User();
		$user->setUsername(isset($_POST["user"])?$_POST["user"]:"");
		$user->setPassword(isset($_POST["pass"])?$_POST["pass"]:"");
		$user->save();
	}
	
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Register</title>
		<?php include("includes/partials/head.php"); ?>
	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<div class="content">
			<h1>Register an Account</h1>
			<form method="post">
				<ul>
					<li><label for="user">Username</label><input type="text" id="user" name="user"/></li>
					<li><label for="pass">Password</label><input type="password" id="pass" name="pass"/></li>
					<li><input type="submit" value="Register" /></li>
				</ul>
			</form>
		</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>