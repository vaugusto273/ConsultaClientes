<?php

$config = require __DIR__.'/../../config/env.php';
require __DIR__. '/../../config/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ($config['cors'] ?? '*'));
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $q     = isset($_GET['q']) ? trim($_GET['q']) : '';
    $page  = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 10)));
    $offset = ($page - 1) * $limit;
    if ($q === '') {
        $sql = "SELECT id,name,email,phone,birthdate
                FROM clients
                ORDER BY id DESC
                LIMIT :limit OFFSET :offset";
        $stmt = $pdo->prepare($sql);
    } else {
        $sql = "SELECT id,name,email,phone,birthdate
                FROM clients
                WHERE name LIKE :q OR email LIKE :q OR phone LIKE :q
                ORDER BY id DESC
                LIMIT :limit OFFSET :offset";
        $stmt = $pdo->prepare($sql);
        $like = "%{$q}%";
        $stmt->bindParam(':q', $like, PDO::PARAM_STR);
    }
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();



    echo json_encode([
        'data' => $rows,
        'page' => $page,
        'limit' => $limit,
        ], JSON_UNESCAPED_UNICODE);
} 
elseif ($method === 'POST') {
    
} 
elseif ($method === 'PUT') {
    echo json_encode(['todo' => 'criar cliente (PUT)']);
}
elseif ($method === 'PATCH') {
    echo json_encode(['todo' => 'criar cliente (PATCH)']);
}
elseif ($method === 'DELETE') {
    echo json_encode(['todo' => 'criar cliente (DELETE)']);
}else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}