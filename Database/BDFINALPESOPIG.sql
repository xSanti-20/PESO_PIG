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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corrals`
--

LOCK TABLES `corrals` WRITE;
/*!40000 ALTER TABLE `corrals` DISABLE KEYS */;
INSERT INTO `corrals` VALUES (13,'Corral 1',11,17.24,'ocupado');
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
) ENGINE=InnoDB AUTO_INCREMENT=4012 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piglets`
--

LOCK TABLES `piglets` WRITE;
/*!40000 ALTER TABLE `piglets` DISABLE KEYS */;
INSERT INTO `piglets` VALUES (54,'Maria','2025-06-17',12,15,'Hembra',8,2,13,1,'2025-06-18'),(55,'Pepe','2025-06-17',15.7,15.7,'Macho',8,2,13,2,'2025-06-17'),(56,'Jose','2025-06-17',18,18,'Macho',8,2,13,3,'2025-06-17'),(57,'Jose','2025-06-18',20.7,20.7,'Macho',8,2,13,4,'2025-06-18'),(58,'Pepa','2025-06-18',23.2,23.2,'Hembra',8,2,13,5,'2025-06-18'),(59,'Josefina','2025-06-18',14.5,14.5,'Hembra',8,2,13,6,'2025-06-18'),(60,'Carlos','2025-06-18',14.5,14.5,'Macho',8,2,13,7,'2025-06-18'),(61,'Luis','2025-06-18',18.9,18.9,'Macho',8,2,13,8,'2025-06-18'),(62,'Sofia','2025-06-18',13.6,13.6,'Hembra',8,2,13,9,'2025-06-18'),(63,'Clara','2025-06-18',20.2,20.2,'Hembra',8,2,13,10,'2025-06-18'),(64,'Marcus','2025-06-18',15.3,15.3,'Macho',8,2,13,11,'2025-06-18');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `races`
--

LOCK TABLES `races` WRITE;
/*!40000 ALTER TABLE `races` DISABLE KEYS */;
INSERT INTO `races` VALUES (2,'Pietran Belga Triple Jamon'),(4,'Landrance x Largewhite'),(5,'Trple Jamon');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stages`
--

LOCK TABLES `stages` WRITE;
/*!40000 ALTER TABLE `stages` DISABLE KEYS */;
INSERT INTO `stages` VALUES (8,'PRECEBO',6,30,49),(9,'LEVANTE',30,60,42),(10,'ENGORDE',60,120,47);
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (16,'danna','Aprendiz','dannamarcela89@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbm5hbWFyY2VsYTg5QGdtYWlsLmNvbSIsIlVzZXJJZCI6IjE2IiwibmJmIjoxNzQ0MTQxNTM0LCJleHAiOjE3NDQxNDUxMzQsImlhdCI6MTc0NDE0MTUzNH0.mNPojiCfen6VxZd7AEv_KU00iXuMH9BqjNMSvyxDS2I','$2a$11$9WN29.yMndLRBuddsrn1u.txjQSYBni6XO8r6KrvkpjH1xk1kqfQ6','$2a$11$lIzf.zs7h5CONpgzE7E1gu',NULL,NULL,'Inactivo',NULL),(19,'SantiagoP','Administrador','puentessantiago2003@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1ZW50ZXNzYW50aWFnbzIwMDNAZ21haWwuY29tIiwiVXNlcklkIjoiMTkiLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsIm5iZiI6MTc1MDI1MjM3MSwiZXhwIjoxNzUwMjU1OTcxLCJpYXQiOjE3NTAyNTIzNzEsImlzcyI6IlBlc29QaWdBUEkiLCJhdWQiOiJQZXNvUGlnRnJvbnRlbmQifQ.VSQQ6lwu4YuqWs8_xXB8ByH6uu-DPZ1wOSLmT2iPQT8','$2a$11$l4qoVRjV58lkRZ26klp9MOUhd6qVjv7yYmcPMrXNhty/FUufkGNDO','$2a$11$woFhmyYbTaax0kpv5xVQHe',NULL,NULL,'Activo','2025-06-18 13:12:51'),(21,'Argeol','Aprendiz','guiopinedaargeol79@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aW9waW5lZGFhcmdlb2w3OUBnbWFpbC5jb20iLCJVc2VySWQiOiIyMSIsInJvbGUiOiJBcHJlbmRpeiIsIm5iZiI6MTc0OTIxMzIzNiwiZXhwIjoxNzQ5MjE2ODM2LCJpYXQiOjE3NDkyMTMyMzYsImlzcyI6IlBlc29QaWdBUEkiLCJhdWQiOiJQZXNvUGlnRnJvbnRlbmQifQ.Hq5J3VbIFcuIaPcHCyBp3lPD_m5CwM9mpHkeNHxCTpE','$2a$11$hpK/UKlszdS0tprk21il8OrqD7/MY9ds3jwUkolNSnqGZvD8ZbHrm','$2a$11$.Q/AN3xceet/kmoNFDrGFe',NULL,NULL,'Inactivo','2025-06-06 12:33:56'),(22,'pepe','Aprendiz','pepe@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlcGVAZ21haWwuY29tIiwiVXNlcklkIjoiMjIiLCJyb2xlIjoiQXByZW5kaXoiLCJuYmYiOjE3NTAxNzI5MTUsImV4cCI6MTc1MDE3NjUxNSwiaWF0IjoxNzUwMTcyOTE1LCJpc3MiOiJQZXNvUGlnQVBJIiwiYXVkIjoiUGVzb1BpZ0Zyb250ZW5kIn0.hMCfnoJcsJHvmb-j4GqTHE1HetplW8v4FREnAMnEYSw','$2a$11$KoiAp8/eEe08pwvS.E/PgehBshyI1HHMHh.t6s5Invdx8IHFwlavC','$2a$11$MhCBTsTRtqJvK68v9exW8.',NULL,NULL,'Inactivo','2025-06-17 15:08:36');
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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weighings`
--

LOCK TABLES `weighings` WRITE;
/*!40000 ALTER TABLE `weighings` DISABLE KEYS */;
INSERT INTO `weighings` VALUES (66,15,3,'2025-06-17',19,54);
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

-- Dump completed on 2025-06-18 11:13:05
