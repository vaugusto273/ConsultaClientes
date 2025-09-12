<?php
// Centraliza configs do .env
return [
    'app_url' => getenv('APP_URL'),
    'cors' => getenv('CORS_ALLOW_ORIGIN'),
    'db' => [
        'host' => getenv('DB_HOST'),
        'port' => getenv('DB_PORT'),
        'name' => getenv('DB_DATABASE'),
        'user' => getenv('DB_USERNAME'),
        'pass' => getenv('DB_PASSWORD'),
    ],
];
