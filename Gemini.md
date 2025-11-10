# About
CourtTrack – Legal Case & Document Management with AI Summaries

Built a full-stack legal case management system (React, Express, MySQL) with complex DBMS features (triggers, stored procedures, transactions, views).

Integrated AI-powered NLP to automatically generate summaries & keywords for uploaded legal documents, enabling fast search and retrieval.

Designed lawyer and client dashboards with searchable case histories, document management, and upcoming hearing schedules.

# to remember
 CREATE TABLE `cases` (                                                              │
│      `id` int NOT NULL AUTO_INCREMENT,                                                 │
│      `title` varchar(255) NOT NULL,                                                    │
│      `description` text,                                                               │
│      `filed_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,                            │
│      `lawyer_id` int DEFAULT NULL,                                                     │
│      `client_id` int DEFAULT NULL,                                                     │
│      `status` enum('pending','approved','rejected') DEFAULT 'pending',                 │
│      PRIMARY KEY (`id`),                                                               │
│      KEY `lawyer_id` (`lawyer_id`),                                                    │    
│      KEY `client_id` (`client_id`),                                                    │    
│      CONSTRAINT `cases_ibfk_1` FOREIGN KEY (`lawyer_id`) REFERENCES `users` (`user_id` │    
│    ),                                                                                  │    
│      CONSTRAINT `cases_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id` │    
│    )                                                                                   │    
│    ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci │    
│    CREATE TABLE `clients` (                                                            │    
│      `client_id` int NOT NULL AUTO_INCREMENT,                                          │    
│      `user_id` int DEFAULT NULL,                                                       │    
│      `address` varchar(255) DEFAULT NULL,                                              │    
│      PRIMARY KEY (`client_id`),                                                        │    
│      KEY `user_id` (`user_id`),                                                        │    
│      CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id` │    
│    )                                                                                   │    
│    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci │    
│    CREATE TABLE `judges` (                                                             │    
│      `id` int NOT NULL AUTO_INCREMENT,                                                 │    
│      `name` varchar(255) NOT NULL,                                                     │    
│      `court` varchar(255) NOT NULL,                                                    │    
│      `experience` int DEFAULT NULL,                                                    │    
│      `appointed_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,                        │    
│      PRIMARY KEY (`id`)                                                                │    
│    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci                  │    
│    CREATE TABLE `lawyers` (                                                            │    
│      `lawyer_id` int NOT NULL AUTO_INCREMENT,                                          │    
│      `user_id` int DEFAULT NULL,                                                       │    
│      PRIMARY KEY (`lawyer_id`),                                                        │    
│      KEY `user_id` (`user_id`),                                                        │    
│      CONSTRAINT `lawyers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id` │    
│    )                                                                                   │    
│    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci │    
│    CREATE TABLE `notifications` (                                                      │    
│      `id` int NOT NULL AUTO_INCREMENT,                                                 │    
│      `user_id` int NOT NULL,                                                           │    
│      `message` text NOT NULL,                                                          │    
│      `is_read` tinyint(1) DEFAULT '0',                                                 │    
│      `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,                            │    
│      PRIMARY KEY (`id`),                                                               │    
│      KEY `user_id` (`user_id`),                                                        │    
│      CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`us │    
│    er_id`)                                                                             │    
│    ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_c │    
│    i                                                                                   │    
│    CREATE TABLE `users` (                                                              │    
│      `user_id` int NOT NULL AUTO_INCREMENT,                                            │    
│      `name` varchar(100) DEFAULT NULL,                                                 │    
│      `email` varchar(100) DEFAULT NULL,                                                │    
│      `password_hash` varchar(255) DEFAULT NULL,                                        │    
│      `role` enum('lawyer','client') NOT NULL,                                          │    
│      `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,                            │    
│      PRIMARY KEY (`user_id`),                                                          │    
│      UNIQUE KEY `email` (`email`)                                                      │    
│    ) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_c │    
│    i                      