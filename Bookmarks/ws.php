#!/usr/bin/env php

<?php

// websocketd --port=8484 ./ws.php

include 'common.php';

while (true) {
    $content = @file_get_contents(WSDATAFILENAME);
    if (empty($content) === false) {
        echo $content;
        shell_exec(sprintf("echo -n > %s", WSDATAFILENAME));
    }
    sleep(1);
}

