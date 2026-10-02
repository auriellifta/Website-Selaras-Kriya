<?php
session_start();
session_destroy();
header("Location: /kaharu-app/auth/login.php");
exit;
