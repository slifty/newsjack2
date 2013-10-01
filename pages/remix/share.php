<?php
	include_once("includes/common.php");
	include_once("includes/lib/recaptchalib.php");
	global $BASE_DIRECTORY;
	global $CLEAN_PARAMS;
	global $RECAPTCHA_PUBLIC_KEY;
	global $RECAPTCHA_PRIVATE_KEY;
	$remix = Remix::getObject($_GET['r']);

	if($remix == null || $remix->getItemId() == 0) {
		header("Location: ".$BASE_DIRECTORY);
		exit();
	}

	$messages = array();
	$your_email = array_key_exists('your_email', $_POST)?$_POST['your_email']:"";
	$their_email = array_key_exists('their_email', $_POST)?$_POST['their_email']:"";
	$email_content = array_key_exists('email_content', $_POST)?$_POST['email_content']:"You should go check out this remix and make one yourself:".$remix->getRemixUrl();

	if ($_POST["recaptcha_response_field"]) {
		$error = false;

		$resp = recaptcha_check_answer ($RECAPTCHA_PRIVATE_KEY,
			$_SERVER["REMOTE_ADDR"],
			$_POST["recaptcha_challenge_field"],
			$_POST["recaptcha_response_field"]);

		if (!$resp->is_valid) {
			$error = true;
			print_r($resp->error);
			$messages[] = $resp->error;
		}
		if(!filter_var($your_email, FILTER_VALIDATE_EMAIL)) {
			$error = true;
			$messages[] = "Your email address does not appear to be valid.";
		}
		if(!filter_var($their_email, FILTER_VALIDATE_EMAIL)) {
			$error = true;
			$messages[] = "Their email address does not appear to be valid.";
		}

		if(!$error) {
			$messages[] = "Message sent!";

			$to = $their_email;
			$subject = 'A Koppenkappers Remix';
			$message = $message;
			$headers = 'From: '.$your_email."\r\n" .
			    'Reply-To: '.$your_email."\r\n" .
			    'X-Mailer: PHP/' . phpversion();

			mail($to, $subject, $message, $headers);
		}
	}

?>
<!DOCTYPE html>
<html>
	<head>
		<title>Email a Remix</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/remix/share.css">
	</head>
	<body>

		<?php include("includes/partials/header.php"); ?>

			<div id="navigation">
				<ul>
					<li class="nav-home"><a href="<?php echo($BASE_DIRECTORY); ?>">Home</a></li>
				</ul>
			</div>
			<?php 
				foreach($messages as $message) {
					?>
						<div class="message"><?php echo($message);?></div>
					<?php
				}
			?>
			<?php 
				if(array_key_exists('keep_informed', $_POST)) {
					?>
					<img src='https://www.mygreenpeace.nl/registreren/petitie.aspx?scr=1800&pet=1&frm=Register&optin=0&source=05765&email=<?php echo(urlencode($your_email));?>&fn=voornaam' width=1 height=1 />
					<?php
				}
			?>

			<h1 id="how-it-works">Email a Remix</h1>
			<form method="POST">
				<li>
					<label for="your_email">Your Email:</label>
					<input name="your_email" id="your_email" type="text" value="<?PHP echo(addslashes($your_email)); ?>"/>
				</li>
				<li>
					<label for="their_email">Their Email:</label>
					<input name="their_email" id="their_email" type="text" value="<?PHP echo(addslashes($their_email)); ?>"/>
				</li>
				<li>
					<label for="email_content">Your Message:</label>
					<textarea name="email_content" id="email_content"><?PHP echo(htmlentities($email_content)); ?></textarea>
				</li>
				<li>
					<input name="keep_informed" id="keep_informed" type="checkbox"/>
					<label for="keep_informed" class="checkbox">Keep me informed of Greenpeace activities.</label>
				</li>
				<li>
					 <?php
						$publickey = $RECAPTCHA_PUBLIC_KEY; // you got this from the signup page
						echo recaptcha_get_html($publickey);
					?>
				</li>
				<li>
					<input name="send" type="submit" id="send" value="Send Your Message"/>
				</li>
			</form>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>