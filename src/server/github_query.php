<?php
	$GITHUB_QUERY = '{
		"query" : "query {
			user( login: \"giffyglyph\" ) {
				projects(last:20, states:[OPEN]) {
					nodes {
						name,
						body,
						progress {
							donePercentage,
							inProgressPercentage,
							todoPercentage
						},
						resourcePath
					}
				},
				repositories(last:20, privacy:PUBLIC) {
					nodes {
						name,
						projects(last:20, states:OPEN) {
							nodes {
								name,
								body,
								progress {
									donePercentage,
									inProgressPercentage,
									todoPercentage
								},
								resourcePath
							}
						}
					}
				}
			}
		}"
	}';
?>