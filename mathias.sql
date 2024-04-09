-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Vært: 127.0.0.1
-- Genereringstid: 09. 04 2024 kl. 09:49:31
-- Serverversion: 10.4.28-MariaDB
-- PHP-version: 8.2.4

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
  `userID` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `assignments`
--

INSERT INTO `assignments` (`id`, `userID`, `status`, `content`) VALUES
(1, 6, 1, 'Test assignment 1'),
(2, 6, 1, 'Test assignment 2'),
(3, 1, 0, 'esfjsn\r\n'),
(4, 2, 0, 'dsrgvsrv');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Data dump for tabellen `users`
--

INSERT INTO `users` (`id`, `name`, `pass`) VALUES
(1, 'a', 'a'),
(2, 'a', 'b'),
(3, 'c', 'd'),
(4, '1', '2'),
(5, 'test', '$2b$10$wAmXZcLfyT3xl7r2YU6pD.5Vd...dN7toDX9m1eY4jNAjBy3vhqZy'),
(6, 't1', '$2b$10$7FF9aow8kuTdtEOGVvQVeOIyD6K3XNTgwJBmLMuKC8YbflAvlKva.'),
(7, 'admin', '$2b$10$xWc73JM6K7bKcV403k2XkOJedvZvyq7ZprBWRXZmqLuVTASUk2Jcu'),
(8, 'a', 'a'),
(9, 'lebbe', '$2b$10$8AL0NcEZpSJ9AghI1fOmbuKMhDVcgLwPHbCgPQFYuKLGENPeXHRqi'),
(10, 'rolle', '$2b$10$wXx2JcqFujFd2pBd8ijug.hW4hYfq3gz3BY77X6gSWShD/rzlW8iW');

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `assignments`
--
ALTER TABLE `assignments`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tilføj AUTO_INCREMENT i tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
