-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Vært: 127.0.0.1
-- Genereringstid: 15. 04 2024 kl. 15:36:59
-- Serverversion: 10.4.32-MariaDB
-- PHP-version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mathias`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `picture` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `assignments`
--

INSERT INTO `assignments` (`id`, `title`, `picture`, `content`) VALUES
(1, 'b', '', 'asneoiaef'),
(2, 'c', '', 'oisebfsubf\r\n'),
(3, 'd', '', 'blah\r\n'),
(4, 'e', '', 'loibgukvbuiboibn'),
(5, 'aaa', 'maple_2_0.jpg', 'bbb');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `taskID` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `tasks`
--

INSERT INTO `tasks` (`id`, `userID`, `taskID`, `status`) VALUES
(1, 1, 3, 0);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `picture` varchar(255) NOT NULL DEFAULT 'https://www.w3schools.com/w3css/img_avatar2.png',
  `first` varchar(255) NOT NULL DEFAULT 'John',
  `last` varchar(255) NOT NULL DEFAULT 'Doe',
  `name` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `admin` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `users`
--

INSERT INTO `users` (`id`, `picture`, `first`, `last`, `name`, `pass`, `admin`) VALUES
(1, 'tmp.png', 'admin', 'admin', 'admin', '$2b$10$kgMpchq0MSLLaoEOksWJseS3Sg2pCMDRAZ95CRRpCnm1E49/qN2Ha', 1),
(2, 'maple_2_0.jpg', 'john', 'larsen', 'jlarsen', '$2b$10$MdF/UIxbEMp3.Xm347rkmeI00fogLKZHdFx7q4qtpZgWw4iHDkAFu', 0);

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indeks for tabel `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indeks for tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Brug ikke AUTO_INCREMENT for slettede tabeller
--

--
-- Tilføj AUTO_INCREMENT i tabel `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tilføj AUTO_INCREMENT i tabel `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tilføj AUTO_INCREMENT i tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
