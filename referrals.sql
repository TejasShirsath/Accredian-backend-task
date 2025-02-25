-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 19, 2025 at 04:35 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `accredian`
--

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` int(11) NOT NULL,
  `userID` varchar(191) NOT NULL,
  `refereeName` varchar(191) NOT NULL,
  `refereeEmail` varchar(191) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `referrals`
--

INSERT INTO `referrals` (`id`, `userID`, `refereeName`, `refereeEmail`, `status`, `createdAt`) VALUES
(1, 'USR001', 'Alice Johnson', 'alice@example.com', 'ACCEPTED', '2025-02-18 18:50:46.000'),
(5, 'TejasShirsath', 'Tejas Shirsath', 'contact.tejasshirsath@gmail.com', 'ACCEPTED', '2025-02-18 17:34:54.163');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
