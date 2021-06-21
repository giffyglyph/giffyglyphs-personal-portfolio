<?php
    require 'github_token.php';
    require 'github_username.php';
    require 'github_query.php';

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, "https://api.github.com/graphql");
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, str_replace(array("\n", "\r", "\t"), '', $GITHUB_QUERY));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_USERPWD, "$GITHUB_USERNAME:$GITHUB_TOKEN");
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Accept: application/vnd.github.v3+json, application/vnd.github.inertia-preview+json',
        'Content-Type: application/json',
        'User-Agent: request'
    ));

    $content = curl_exec($curl);
    curl_close($curl);

    echo $content;
?>