CREATE DATABASE  IF NOT EXISTS `peso_pig` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `peso_pig`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: peso_pig
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `corrals`
--

DROP TABLE IF EXISTS `corrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `corrals` (
  `id_Corral` int NOT NULL AUTO_INCREMENT,
  `Des_Corral` varchar(200) NOT NULL,
  `Tot_Animal` int NOT NULL,
  `Tot_Pesaje` float NOT NULL,
  `Est_Corral` varchar(100) NOT NULL,
  PRIMARY KEY (`id_Corral`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corrals`
--

LOCK TABLES `corrals` WRITE;
/*!40000 ALTER TABLE `corrals` DISABLE KEYS */;
/*!40000 ALTER TABLE `corrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entries` (
  `id_Entries` int NOT NULL AUTO_INCREMENT,
  `vlr_Unitary` int NOT NULL,
  `Fec_Entries` datetime NOT NULL,
  `Fec_Expiration` datetime NOT NULL,
  `Can_Food` int NOT NULL,
  `id_Food` int NOT NULL,
  `vlr_Total` int NOT NULL,
  `Vlr_Promedio` int NOT NULL,
  PRIMARY KEY (`id_Entries`),
  KEY `fk_entries_foods_idx` (`id_Food`),
  CONSTRAINT `fk_entries_foods` FOREIGN KEY (`id_Food`) REFERENCES `foods` (`id_Food`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entries`
--

LOCK TABLES `entries` WRITE;
/*!40000 ALTER TABLE `entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedings`
--

DROP TABLE IF EXISTS `feedings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedings` (
  `id_Feeding` int NOT NULL AUTO_INCREMENT,
  `Obc_Feeding` varchar(200) NOT NULL,
  `Can_Food` float NOT NULL,
  `Sum_Food` float NOT NULL,
  `id_Users` int NOT NULL,
  `id_Corral` int NOT NULL,
  `id_Food` int NOT NULL,
  `Dat_Feeding` datetime NOT NULL,
  PRIMARY KEY (`id_Feeding`),
  KEY `fk_feedingd_users_idx` (`id_Users`),
  KEY `fk_feedings_piglet_idx` (`id_Corral`),
  KEY `fk_feedings_foods_idx` (`id_Food`),
  CONSTRAINT `fk_feedings_corral` FOREIGN KEY (`id_Corral`) REFERENCES `corrals` (`id_Corral`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_feedings_foods` FOREIGN KEY (`id_Food`) REFERENCES `foods` (`id_Food`),
  CONSTRAINT `fk_feedings_users` FOREIGN KEY (`id_Users`) REFERENCES `users` (`id_Users`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedings`
--

LOCK TABLES `feedings` WRITE;
/*!40000 ALTER TABLE `feedings` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `id_Food` int NOT NULL AUTO_INCREMENT,
  `Nam_Food` varchar(255) NOT NULL,
  `Existence` float NOT NULL,
  `Vlr_Unit` int NOT NULL,
  `Und_Extent` varchar(5) NOT NULL,
  `id_Stage` int NOT NULL,
  `Rat_Food` int NOT NULL,
  PRIMARY KEY (`id_Food`),
  KEY `fk_food_stages_idx` (`id_Stage`),
  CONSTRAINT `fk_foods_stages` FOREIGN KEY (`id_Stage`) REFERENCES `stages` (`id_Stage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `piglets`
--

DROP TABLE IF EXISTS `piglets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `piglets` (
  `id_Piglet` int NOT NULL AUTO_INCREMENT,
  `Name_Piglet` varchar(45) NOT NULL,
  `Fec_Birth` date DEFAULT NULL,
  `Weight_Initial` float NOT NULL,
  `Acum_Weight` float NOT NULL,
  `Sex_Piglet` varchar(45) NOT NULL,
  `id_Stage` int NOT NULL,
  `id_Race` int NOT NULL,
  `id_Corral` int NOT NULL,
  `Placa_Sena` int NOT NULL,
  `Sta_Date` date NOT NULL,
  PRIMARY KEY (`id_Piglet`),
  KEY `fk_piglets_stages_idx` (`id_Stage`),
  KEY `fk_piglets_races_idx` (`id_Race`),
  KEY `fk_piglets_corrals_idx` (`id_Corral`),
  CONSTRAINT `fk_piglets_corrals` FOREIGN KEY (`id_Corral`) REFERENCES `corrals` (`id_Corral`),
  CONSTRAINT `fk_piglets_races` FOREIGN KEY (`id_Race`) REFERENCES `races` (`id_Race`),
  CONSTRAINT `fk_piglets_stages` FOREIGN KEY (`id_Stage`) REFERENCES `stages` (`id_Stage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piglets`
--

LOCK TABLES `piglets` WRITE;
/*!40000 ALTER TABLE `piglets` DISABLE KEYS */;
/*!40000 ALTER TABLE `piglets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `races`
--

DROP TABLE IF EXISTS `races`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `races` (
  `id_Race` int NOT NULL AUTO_INCREMENT,
  `Nam_Race` varchar(40) NOT NULL,
  PRIMARY KEY (`id_Race`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `races`
--

LOCK TABLES `races` WRITE;
/*!40000 ALTER TABLE `races` DISABLE KEYS */;
/*!40000 ALTER TABLE `races` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stages`
--

DROP TABLE IF EXISTS `stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stages` (
  `id_Stage` int NOT NULL AUTO_INCREMENT,
  `Name_Stage` varchar(45) NOT NULL,
  `Weight_From` int NOT NULL,
  `Weight_Upto` int NOT NULL,
  `Dur_Stage` int NOT NULL,
  PRIMARY KEY (`id_Stage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stages`
--

LOCK TABLES `stages` WRITE;
/*!40000 ALTER TABLE `stages` DISABLE KEYS */;
/*!40000 ALTER TABLE `stages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_Users` int NOT NULL AUTO_INCREMENT,
  `Nom_Users` varchar(45) NOT NULL,
  `Tip_Users` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Blockade` tinyint DEFAULT '0',
  `Attempts` int DEFAULT '0',
  `Token` varchar(500) DEFAULT NULL,
  `Hashed_Password` varchar(60) DEFAULT NULL,
  `Salt` varchar(250) DEFAULT NULL,
  `ResetToken` varchar(250) DEFAULT NULL,
  `ResetTokenExpiration` datetime DEFAULT NULL,
  `Status` enum('Activo','Inactivo') DEFAULT NULL,
  `LastActive` datetime DEFAULT NULL,
  PRIMARY KEY (`id_Users`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'SantiagoP','Administrador','puentessantiago2003@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1ZW50ZXNzYW50aWFnbzIwMDNAZ21haWwuY29tIiwiVXNlcklkIjoiMSIsInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwibmJmIjoxNzUwMzQzNjQ2LCJleHAiOjE3NTAzNDcyNDYsImlhdCI6MTc1MDM0MzY0NiwiaXNzIjoiUGVzb1BpZ0FQSSIsImF1ZCI6IlBlc29QaWdGcm9udGVuZCJ9.xGB5K_i3HcUlaL4-Amj0NaGnVG7ZN5YOU5S7VWmDSGk','$2a$11$a7/TqHrMt1FaephZaaJxM.HB.BoNpDGlS1P6E2fWKAblJr9r4axbu','$2a$11$eO9WmeFwyrOlkfHGMycsm.',NULL,NULL,'Activo','2025-06-19 14:34:06'),(2,'Administrador','Administrador','jumoraless@sena.edu.co',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1bW9yYWxlc3NAc2VuYS5lZHUuY28iLCJVc2VySWQiOiIyIiwicm9sZSI6IkFkbWluaXN0cmFkb3IiLCJuYmYiOjE3NTAzNDM3MzQsImV4cCI6MTc1MDM0NzMzNCwiaWF0IjoxNzUwMzQzNzM0LCJpc3MiOiJQZXNvUGlnQVBJIiwiYXVkIjoiUGVzb1BpZ0Zyb250ZW5kIn0.0mpI2OByaEZQW9eMLLQYyiCNyX9U9xEy8TRFhWq_Ntg','$2a$11$t0dsydc5kPYtjVYgSUNrkOqLyrGXs92/hDU5ZESrThjZDKd4xIHxi','$2a$11$rcBq5.q1PaLoTE72kIpV4.',NULL,NULL,'Activo','2025-06-19 14:35:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weighings`
--

DROP TABLE IF EXISTS `weighings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weighings` (
  `id_Weighings` int NOT NULL AUTO_INCREMENT,
  `Weight_Current` float NOT NULL,
  `Weight_Gain` float NOT NULL,
  `Fec_Weight` date DEFAULT NULL,
  `id_Users` int NOT NULL,
  `id_Piglet` int NOT NULL,
  PRIMARY KEY (`id_Weighings`),
  KEY `fk_weighings_users_idx` (`id_Users`),
  KEY `fk_weighings_piglet_idx` (`id_Piglet`),
  CONSTRAINT `fk_weighings_piglet` FOREIGN KEY (`id_Piglet`) REFERENCES `piglets` (`id_Piglet`),
  CONSTRAINT `fk_weighings_users` FOREIGN KEY (`id_Users`) REFERENCES `users` (`id_Users`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weighings`
--

LOCK TABLES `weighings` WRITE;
/*!40000 ALTER TABLE `weighings` DISABLE KEYS */;
/*!40000 ALTER TABLE `weighings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19  9:37:05
