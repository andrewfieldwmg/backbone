-- MySQL dump 10.13  Distrib 5.5.48, for Linux (i686)
--
-- Host: localhost    Database: backbone
-- ------------------------------------------------------
-- Server version	5.5.48

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `task_lists`
--

DROP TABLE IF EXISTS `task_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_lists` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_lists`
--

LOCK TABLES `task_lists` WRITE;
/*!40000 ALTER TABLE `task_lists` DISABLE KEYS */;
INSERT INTO `task_lists` VALUES (1,'Work'),(2,'Dinesh Tasks');
/*!40000 ALTER TABLE `task_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `task_list` varchar(50) DEFAULT NULL,
  `priority` varchar(100) DEFAULT NULL,
  `created` varchar(30) DEFAULT NULL,
  `parent_id` int(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'Update Ecom Actions for Ian','1','Work','06','Jul 11 2016',NULL),(2,'DE CRM Opt In Form - with Satvir','1','Work','04','Jul 11 2016',NULL),(3,'Biffy CS','1','Work','03','Jul 11 2016',NULL),(4,'DE Store Migration / Closure Plan','0','Work','10','Jul 11 2016',NULL),(5,'VAT Matrix planning','0','Dinesh Tasks','2','Jul 11 2016',NULL),(6,'VAT Matrix planning - with Dinesh','0','Work','07','Jul 11 2016',NULL),(7,'New Order adjustment batch refunds','1','Dinesh Tasks','1','Jul 11 2016',NULL),(36,'New Order adjustment refunds','1','Work','09','Jul 11 2016',NULL),(37,'DE bulk refunds - inc. investigate backorder reason!','0','Work','01','Jul 11 2016',NULL),(53,'David Bowie CS again','0','Work','12','Jul 11 2016',NULL),(54,'DE cloned orders - with Ali/Mark','1','Work','08','Jul 11 2016',NULL),(55,'Update Postage Matrix with Consumable weights','0','Work','11','Jul 11 2016',NULL),(80,'Confirm Dinesh done/','0','Work','37-0','Jul 12 2016',37),(81,'Provide Jutta with refund report - DE since Jan 1','0','Work','37-0','Jul 12 2016',37),(82,'Work out agenda for Thursday\'s tech meeting with DD','0','Work','02','Jul 12 2016',NULL),(83,'Dream Theatre cancellation - from email','0','Work','05','Jul 12 2016',NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-07-12 17:37:35
