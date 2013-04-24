<html>
	<head>
		<script src="js/jquery.min.js" type="text/javascript"></script>
		<script>
			$(function() {
				var $test = $("#remix").find("*").addBack();
				var $textNodes = $test.contents().filter(function() {
					return this.nodeType == 3;
				});
				function renderInlineTextarea(el) {
					$original = $(this);
					$replacement = $("<textarea/>")
						.addClass("newsjack-inline-text")
						.text($original.text().trim());
			 		$original.replaceWith($replacement);

			 		$replacement.focus();
			 		$replacement.blur(function() {
			 			$original.text(" " + $replacement.val() + " ");
			 			$replacement.replaceWith($original);
			 			$original.click(renderInlineTextarea);
			 		});
				}

				$textNodes.wrap('<span />')
					.parent()
					.addClass("newsjack-inline-text")
					.click(renderInlineTextarea);
			})
		</script>
	</head>
	<body>
		<div id="remix">
			<div id="test"><a href="test">CLICK</a> AND THIS WILL <i>BECOME</i> EDITABLE BECAUSE I AM A WIZARD</div>
		</div>
		<br />
		<div id="done">DONE</div>
	</body>
</html>