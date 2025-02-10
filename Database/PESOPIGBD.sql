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
  `id_Corral` int NOT NULL,
  `Des_Corral` varchar(200) NOT NULL,
  `Tot_Animal` int NOT NULL,
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
-- Table structure for table `feedings`
--

DROP TABLE IF EXISTS `feedings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedings` (
  `id_Feeding` int NOT NULL AUTO_INCREMENT,
  `Des_Feeding` varchar(200) NOT NULL,
  `Can_Feeding` int NOT NULL,
  `Con_Average` int NOT NULL,
  PRIMARY KEY (`id_Feeding`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `Des_Food` varchar(255) NOT NULL,
  `Existence` int NOT NULL,
  `Vlr_Unit` int NOT NULL,
  `Fec_Expiration` date DEFAULT NULL,
  `Und_Extent` varchar(45) NOT NULL,
  PRIMARY KEY (`id_Food`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,'precebo','',0,0,NULL,''),(2,'levante','',0,0,NULL,'');
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
  `Weight_Initial` int NOT NULL,
  `Acum_Weight` int NOT NULL,
  `Sex_Piglet` varchar(45) NOT NULL,
  PRIMARY KEY (`id_Piglet`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piglets`
--

LOCK TABLES `piglets` WRITE;
/*!40000 ALTER TABLE `piglets` DISABLE KEYS */;
INSERT INTO `piglets` VALUES (10,'pepe','2024-12-11',23,0,'Hembra'),(11,'nutri lechon','2024-12-11',120,0,'Macho'),(12,'maria','2024-12-10',12,0,'Hembra'),(13,'jose','2024-12-03',10,0,'Macho'),(14,'lili','2024-12-11',25,0,'Hembra');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `Tot_Weeks` int NOT NULL,
  PRIMARY KEY (`id_Stage`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `Token` varchar(255) DEFAULT NULL,
  `Hashed_Password` varchar(60) DEFAULT NULL,
  `Salt` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id_Users`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,'Santiago','Aprendiz','puentessantiago2003@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1ZW50ZXNzYW50aWFnbzIwMDNAZ21haWwuY29tIiwiVXNlcklkIjoiMTAiLCJuYmYiOjE3MzM4NzEwNDcsImV4cCI6MTczMzg3NDY0NywiaWF0IjoxNzMzODcxMDQ3fQ.v3fSeqW3Rm_a4JTVvWI-75pitMLC3QaOolp2Lfa9aSI','$2a$11$5ldVGvJL36BqzsyfeZBCPu1gcfhTB1TidPCl/iyvyMtJ5qUxl85LW','$2a$11$6oRlNzMjqSTP8OyJuVkXse'),(11,'danna','Aprendiz','danna30@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbm5hMzBAZ21haWwuY29tIiwiVXNlcklkIjoiMTEiLCJuYmYiOjE3MzIxMzE2MjAsImV4cCI6MTczMjEzNTIyMCwiaWF0IjoxNzMyMTMxNjIwfQ.UDbvZDWCVomnRRAs06rneKsW6-rneqWuv5We0QRduUg','$2a$11$A3vELlskN7121ZNA8mDUPeDGYz00MsGrALCtKSlSEacJ8m41FJfbi','$2a$11$VrFX2X4MB1v7MO6.SMR7be'),(12,'Pepe','Aprendiz','pepe@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlcGVAZ21haWwuY29tIiwiVXNlcklkIjoiMTIiLCJuYmYiOjE3MzM5MjM4MDYsImV4cCI6MTczMzkyNzQwNiwiaWF0IjoxNzMzOTIzODA2fQ.nX1Hm703hncfn0EdEv2VrCZX2gvDnrkBg4-K5rYtklk','$2a$11$q6vhHl8Kyrgh5.82eC0A4.XWOA4AOWYrEQViRD2ws69Yt.x1eaSbe','$2a$11$mOkl9Igycc1f7g0sOwvR0u'),(13,'asdf','Aprendiz','sofi@gmail.com',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvZmlAZ21haWwuY29tIiwiVXNlcklkIjoiMTMiLCJuYmYiOjE3MzM5MjUyMzQsImV4cCI6MTczMzkyODgzNCwiaWF0IjoxNzMzOTI1MjM0fQ.6HjWYJrxPDFrVwdsGTrSzwxNrM-g3ID0n7sKidlj67M','$2a$11$B0dXhdvzN.tsr9iLMHzqM.2w6jxhqhXUhIdilvDcyDFyYFFRgg1bi','$2a$11$zVmqfBCWGeN4hwAHqIcA6e');
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
  `Weight_Current` int NOT NULL,
  `Weight_Gain` int NOT NULL,
  `Fec_Weight` date DEFAULT NULL,
  PRIMARY KEY (`id_Weighings`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weighings`
--

LOCK TABLES `weighings` WRITE;
/*!40000 ALTER TABLE `weighings` DISABLE KEYS */;
INSERT INTO `weighings` VALUES (1,0,15,NULL),(2,0,4,NULL),(3,0,4,NULL);
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

-- Dump completed on 2025-02-10  9:31:04
