<?php

declare(strict_types=1);

use App\Kernel;

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$app = (new Kernel())->createApp();
$app->run();

