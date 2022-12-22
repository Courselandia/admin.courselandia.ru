<?php

$url = 'https://api.courselandia.ru';
$dir = '/ckfinder/browser/gfe89rtlFQ54QoiHsAQpG';
$path = $url . $dir;

$curl = curl_init($path);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($curl);

if (!curl_errno($curl)) {
    echo $response;
} else {
    die(curl_error($curl));
}
