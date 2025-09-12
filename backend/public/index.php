<?php
header('Content-Type: application/json');
echo json_encode([
        "name" => "API Clientes",
        "version" => "1.0",
        "routes" => [
        "GET /api/clients",
        "POST /api/clients",
        "PUT /api/clients?id={id}",
        "DELETE /api/clients?id={id}"
    ]
]);
