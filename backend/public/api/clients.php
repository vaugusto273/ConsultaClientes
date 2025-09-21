<?php

$config = require __DIR__.'/../../config/env.php';
require __DIR__. '/../../config/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ($config['cors'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$method = $_SERVER['REQUEST_METHOD'];

$error = [];

switch($method){
    case 'GET':
        $q     = isset($_GET['q']) ? trim($_GET['q']) : '';
        $page  = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(50, max(1, (int)($_GET['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;
        if ($q === '') {
            $sql = "SELECT id,name,email,phone,birthdate
                    FROM clients
                    ORDER BY id ASC
                    LIMIT :limit OFFSET :offset";
            $stmt = $pdo->prepare($sql);
        } else {
            $sql = "SELECT id,name,email,phone,birthdate
                    FROM clients
                    WHERE name LIKE :q OR email LIKE :q OR phone LIKE :q
                    ORDER BY id ASC
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
        break;
    case 'POST':
        $name = isset($_POST['name']) ? trim($_POST['name']): '';
        $email = isset($_POST['email']) ? trim($_POST['email']): '';
        $phone = isset($_POST['phone']) ? trim($_POST['phone']): '';
        $birthdate = isset($_POST['birthdate']) ? trim($_POST['birthdate']): '';
        
        if (!preg_match('/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,150}$/', $name)) $error[] = ['code' => 201, 'field' => 'name',    'message' => 'Invalid Name'];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $error[] = ['code' => 202, 'field' => 'email',   'message' => 'Invalid Email'];
        if (!preg_match('/^\d{10,11}$/', $phone)) $error[] = ['code' => 203, 'field' => 'phone',   'message' => 'Invalid Phone'];
        if (!preg_match('/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/', $birthdate)) $error[] = ['code' => 204, 'field' => 'birthdate',  'message' => 'Invalid Birth Date'];
        if ($error) {
            echo json_encode(['error' => $error], JSON_UNESCAPED_UNICODE);
            exit;
        }

        try{
            $stmt = $pdo->prepare("INSERT INTO clients (name,email,phone,birthdate) VALUES (:name,:email,:phone,:birthdate)");
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':birthdate', $birthdate);
            $stmt->execute();

            http_response_code(201);
            echo json_encode(['id' => $pdo->lastInsertId()], JSON_UNESCAPED_UNICODE);
            } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['error' => 'DB error'], JSON_UNESCAPED_UNICODE);
        }
        break;
    case 'PUT':
        break;
    case 'PATCH':
        break;
    case 'DELETE':
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
}