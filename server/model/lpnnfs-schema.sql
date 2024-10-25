CREATE DATABASE  IF NOT EXISTS lpnnfs;
USE lpnnfs;

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `admin_id` VARCHAR(10) PRIMARY KEY, -- Change to INT and add AUTO_INCREMENT
  `user_fname` VARCHAR(255) NOT NULL,
  `user_lname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `arrangement`;

CREATE TABLE `arrangement` (
  `arrangement_id` varchar(10) PRIMARY KEY,
  `arrangement_name` varchar(255) NOT NULL,
  `arrangement_type_id` varchar(10) NOT NULL,
  `price` bigint NOT NULL,
  `description` varchar(255) NOT NULL,
  `num_reviews` bigint DEFAULT '0',
  `img_link` varchar(255) NOT NULL,
  `num_sold` bigint DEFAULT '0',
  UNIQUE KEY `arrangement_name` (`arrangement_name`),
  KEY `arrangement_type_id` (`arrangement_type_id`),
  CONSTRAINT `arrangement_ibfk_1` FOREIGN KEY (`arrangement_type_id`) REFERENCES `arrangement_type` (`arrangement_type_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `arrangement_type`;

CREATE TABLE `arrangement_type` (
  `arrangement_type_id` varchar(10) PRIMARY KEY,
  `type_name` varchar(255) NOT NULL,
  `description` text, 
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `batch`;

CREATE TABLE `batch` (
  `batch_id` varchar(10) PRIMARY KEY,
  `batch_date` datetime NOT NULL,
  `stock_qty` bigint NOT NULL,
  `shelf_life` datetime NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `registered_customer`;
CREATE TABLE `registered_customer` (
  `registered_customer_id` VARCHAR(10) PRIMARY KEY,
  `user_fname` varchar(255) NOT NULL,
  `user_lname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `cart_id` varchar(10) PRIMARY KEY,
  `prod_id` varchar(10) NOT NULL,
  `arrangement_name` varchar(255) NOT NULL,
  `qty` bigint DEFAULT NULL,
  `carting_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `registered_customer_id` varchar(10) DEFAULT NULL,
  KEY `registered_customer_id` (`registered_customer_id`),
  KEY `arrangement_name` (`arrangement_name`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`registered_customer_id`) REFERENCES `registered_customer` (`registered_customer_id`) ON DELETE SET NULL,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`arrangement_name`) REFERENCES `arrangement` (`arrangement_name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `material`;
CREATE TABLE `material` (
  `mat_id` varchar(10) PRIMARY KEY,
  `mat_name` varchar(255) NOT NULL,
  `material_type_id` varchar(10) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `stock_qty` BIGINT NOT NULL CHECK (stock_qty >= 0),
  KEY `material_type_id` (`material_type_id`),
  CONSTRAINT `material_ibfk_1` FOREIGN KEY (`material_type_id`) REFERENCES `material_type` (`material_type_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `material_type`;
CREATE TABLE `material_type` (
  `material_type_id` varchar(10) PRIMARY KEY,
  `type_name` varchar(255) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `mats_arr_linking`;
CREATE TABLE `mats_arr_linking` (
  `link_id` varchar(10) PRIMARY KEY,
  `arrangement_id` varchar(10) NOT NULL,
  `material_id` varchar(10) NOT NULL,
  `qty_used` int NOT NULL,
  KEY `arrangement_id` (`arrangement_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `mats_arr_linking_ibfk_1` FOREIGN KEY (`arrangement_id`) REFERENCES `arrangement` (`arrangement_id`) ON DELETE CASCADE,
  CONSTRAINT `mats_arr_linking_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `material` (`mat_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` varchar(10) PRIMARY KEY,
  `arrangement_id` varchar(10) NOT NULL,
  `ord_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','cancelled','completed','for delivery') NOT NULL DEFAULT 'pending',
  `completion_date` datetime DEFAULT NULL,
  `ord_qty` int NOT NULL,
  KEY `arrangement_id` (`arrangement_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`arrangement_id`) REFERENCES `arrangement` (`arrangement_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `prods_arr_linking`;
CREATE TABLE `prods_arr_linking` (
  `link_id` varchar(10) PRIMARY KEY,
  `arrangement_id` varchar(10) NOT NULL,
  `prod_id` varchar(10) NOT NULL,
  `qty_used` int NOT NULL,
  KEY `arrangement_id` (`arrangement_id`),
  KEY `prod_id` (`prod_id`),
  CONSTRAINT `prods_arr_linking_ibfk_1` FOREIGN KEY (`arrangement_id`) REFERENCES `arrangement` (`arrangement_id`) ON DELETE CASCADE,
  CONSTRAINT `prods_arr_linking_ibfk_2` FOREIGN KEY (`prod_id`) REFERENCES `product` (`prod_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `prod_id` varchar(10) PRIMARY KEY,
  `prod_name` varchar(255) NOT NULL,
  `prod_type` enum('flower','filler','leaves') NOT NULL,
  `batch_id` varchar(10) NOT NULL,
  `variant_name` varchar(255) NOT NULL,
  `var_color` varchar(255) NOT NULL,
  `price_per_qty` bigint NOT NULL,
  `timestamp_crt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `batch_id` (`batch_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batch` (`batch_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `registered_customer`;
CREATE TABLE `registered_customer` (
  `registered_customer_id` VARCHAR(10) PRIMARY KEY,
  `user_fname` varchar(255) NOT NULL,
  `user_lname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `request`;
CREATE TABLE `request` (
  `request_id` varchar(10) PRIMARY KEY,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `req_msg` varchar(255) NOT NULL,
  `sent_at` datetime NOT NULL,
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction` (
  `transaction_id` varchar(10) PRIMARY KEY,
  `date` datetime NOT NULL,
  `reference_id` varchar(255) NOT NULL,
  `registered_customer_id` varchar(10) DEFAULT NULL,
  `rec_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  KEY `registered_customer_id` (`registered_customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `transaction_order_linking`;
CREATE TABLE `transaction_order_linking` (
    `link_id` VARCHAR(10) PRIMARY KEY,
    `transaction_id` VARCHAR(10) NOT NULL,
    `order_id` VARCHAR(10) NOT NULL,
    KEY `transaction_id` (`transaction_id`),
    KEY `order_id` (`order_id`),
    CONSTRAINT `transaction_order_linking_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transaction` (`transaction_id`) ON DELETE CASCADE,
    CONSTRAINT `transaction_order_linking_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;