<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // por enquanto, simples

echo json_encode([
    'name' => 'API Clientes',
    'version' => '0.1.0',
    'endpoints' => ['GET /api/clients']
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
