-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Май 30 2024 г., 12:33
-- Версия сервера: 10.4.28-MariaDB
-- Версия PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `integration_v2`
--

-- --------------------------------------------------------

--
-- Структура таблицы `authorization`
--

CREATE TABLE `authorization` (
  `id_authorization` int(11) NOT NULL,
  `name` varchar(115) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `authorization`
--

INSERT INTO `authorization` (`id_authorization`, `name`) VALUES
(1, 'Базовая авторизация'),
(2, 'Авторизация по токену'),
(3, 'Авторизация по api key'),
(4, 'Авторизация по сертификату'),
(5, 'Без авторизации');

-- --------------------------------------------------------

--
-- Структура таблицы `ip_address`
--

CREATE TABLE `ip_address` (
  `id_ip` int(11) NOT NULL,
  `ip` varchar(45) NOT NULL,
  `description` varchar(600) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `ip_address`
--

INSERT INTO `ip_address` (`id_ip`, `ip`, `description`) VALUES
(1, '10.12.10.12', 'VLAN 01'),
(2, '10.13.10.13', 'Vlan 02'),
(3, '10.14.10.14', 'Vlan 04'),
(4, '10.124.12.3', 'VLAN 05'),
(6, '10.15.10.15', 'VLAN 02');

-- --------------------------------------------------------

--
-- Структура таблицы `it_system_dst`
--

CREATE TABLE `it_system_dst` (
  `id_it_system_dst` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `responsible` int(11) NOT NULL,
  `test_host` varchar(115) DEFAULT NULL,
  `test_ip` int(11) DEFAULT NULL,
  `cert_host` varchar(115) DEFAULT NULL,
  `cert_ip` int(11) DEFAULT NULL,
  `prod_host` varchar(115) NOT NULL,
  `prod_ip` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `it_system_dst`
--

INSERT INTO `it_system_dst` (`id_it_system_dst`, `name`, `responsible`, `test_host`, `test_ip`, `cert_host`, `cert_ip`, `prod_host`, `prod_ip`) VALUES
(2, 'Тестовая система-получатель 1', 2, 'simple.test.1', 3, 'simple.test.2', 2, 'simple.test.3', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `it_system_src`
--

CREATE TABLE `it_system_src` (
  `id_it_system_src` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `responsible` int(11) NOT NULL,
  `test_host` varchar(115) DEFAULT NULL,
  `test_ip` int(11) DEFAULT NULL,
  `cert_host` varchar(115) DEFAULT NULL,
  `cert_ip` int(11) DEFAULT NULL,
  `prod_host` varchar(115) NOT NULL,
  `prod_ip` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `it_system_src`
--

INSERT INTO `it_system_src` (`id_it_system_src`, `name`, `responsible`, `test_host`, `test_ip`, `cert_host`, `cert_ip`, `prod_host`, `prod_ip`) VALUES
(6, 'Тестовая система-источник 1', 2, 'simple.test.1', 4, 'simple.test.2', 2, 'simple.test.3', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `order`
--

CREATE TABLE `order` (
  `id_order` int(11) NOT NULL,
  `source_system` int(11) NOT NULL,
  `dest_system` int(11) NOT NULL,
  `request_rate` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `authorization` int(11) NOT NULL,
  `customer` int(11) NOT NULL,
  `description` varchar(10000) NOT NULL,
  `swagger` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `order`
--

INSERT INTO `order` (`id_order`, `source_system`, `dest_system`, `request_rate`, `status`, `authorization`, `customer`, `description`, `swagger`) VALUES
(12, 6, 2, 2, 1, 1, 2, 'Тестовая интеграция для двух тестовых систем', 'null');

-- --------------------------------------------------------

--
-- Структура таблицы `request_rate`
--

CREATE TABLE `request_rate` (
  `id_request_rate` int(11) NOT NULL,
  `rate` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `request_rate`
--

INSERT INTO `request_rate` (`id_request_rate`, `rate`) VALUES
(1, '1 Запрос в день'),
(2, '10 Запросов в день'),
(3, '100 Запросов в день'),
(4, '1000 Запросов в день'),
(5, '5000 Запросов в день'),
(6, '10000 Запросов в день'),
(7, 'Более 10000 запросов в день'),
(8, 'Указано в описание API');

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id_roles` int(11) NOT NULL,
  `name` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id_roles`, `name`) VALUES
(1, 'Заказчик'),
(2, 'Отвественный'),
(3, 'Корпоративный Архитектор'),
(4, 'Архитектор'),
(5, 'Администратор'),
(6, 'Разработчик'),
(7, 'Специалист информационной безопасности');

-- --------------------------------------------------------

--
-- Структура таблицы `status`
--

CREATE TABLE `status` (
  `id_status` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `status`
--

INSERT INTO `status` (`id_status`, `name`) VALUES
(1, 'Ожидает информации от заказчика'),
(2, 'На согласование у специалиста информационной безопасности'),
(3, 'На согласование у корпоративного архитектора'),
(4, 'На согласование у архитектора'),
(5, 'Предподготовка задачи Архитектором'),
(6, 'Передана на разработку'),
(7, 'Разрабатывается'),
(8, 'Передана на настройку администратором'),
(9, 'Выполняется настройка администратором'),
(10, 'На тестирование у заказчика'),
(11, 'Завершено'),
(12, 'Отклонено'),
(13, 'Выполнено'),
(14, 'На тестовом контуре'),
(15, 'На сертификационном контуре'),
(16, 'На продуктивном контуре');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `FIO` varchar(115) NOT NULL,
  `email` varchar(115) NOT NULL,
  `post` varchar(250) NOT NULL,
  `contacts` varchar(450) DEFAULT NULL,
  `role` int(11) NOT NULL,
  `login` varchar(45) NOT NULL,
  `password` varchar(21) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id_users`, `FIO`, `email`, `post`, `contacts`, `role`, `login`, `password`) VALUES
(1, 'Testov Test Testovich', 'admin@bk.ru', 'Главный администратор', '+79302873599', 5, 'admin', 'admin'),
(2, 'Zakazov Zakaz Zakovich', 'zak@bk.ru', 'Директор проекта', '+473892156737564 Telegram: Какой-то', 1, 'zak', 'zak123');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `authorization`
--
ALTER TABLE `authorization`
  ADD PRIMARY KEY (`id_authorization`);

--
-- Индексы таблицы `ip_address`
--
ALTER TABLE `ip_address`
  ADD PRIMARY KEY (`id_ip`);

--
-- Индексы таблицы `it_system_dst`
--
ALTER TABLE `it_system_dst`
  ADD PRIMARY KEY (`id_it_system_dst`),
  ADD KEY `responsible` (`responsible`),
  ADD KEY `test_ip` (`test_ip`,`cert_ip`,`prod_ip`),
  ADD KEY `cert_ip` (`cert_ip`),
  ADD KEY `prod_ip` (`prod_ip`);

--
-- Индексы таблицы `it_system_src`
--
ALTER TABLE `it_system_src`
  ADD PRIMARY KEY (`id_it_system_src`),
  ADD KEY `responsible` (`responsible`),
  ADD KEY `test_ip` (`test_ip`,`cert_ip`,`prod_ip`),
  ADD KEY `cert_ip` (`cert_ip`),
  ADD KEY `prod_ip` (`prod_ip`);

--
-- Индексы таблицы `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `source_system` (`source_system`,`dest_system`,`request_rate`,`status`,`authorization`,`customer`),
  ADD KEY `authorization` (`authorization`),
  ADD KEY `customer` (`customer`),
  ADD KEY `dest_system` (`dest_system`),
  ADD KEY `request_rate` (`request_rate`),
  ADD KEY `status` (`status`);

--
-- Индексы таблицы `request_rate`
--
ALTER TABLE `request_rate`
  ADD PRIMARY KEY (`id_request_rate`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_roles`);

--
-- Индексы таблицы `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id_status`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD KEY `role` (`role`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `authorization`
--
ALTER TABLE `authorization`
  MODIFY `id_authorization` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `ip_address`
--
ALTER TABLE `ip_address`
  MODIFY `id_ip` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `it_system_dst`
--
ALTER TABLE `it_system_dst`
  MODIFY `id_it_system_dst` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `it_system_src`
--
ALTER TABLE `it_system_src`
  MODIFY `id_it_system_src` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `order`
--
ALTER TABLE `order`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `request_rate`
--
ALTER TABLE `request_rate`
  MODIFY `id_request_rate` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `roles`
--
ALTER TABLE `roles`
  MODIFY `id_roles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `status`
--
ALTER TABLE `status`
  MODIFY `id_status` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `it_system_dst`
--
ALTER TABLE `it_system_dst`
  ADD CONSTRAINT `it_system_dst_ibfk_1` FOREIGN KEY (`responsible`) REFERENCES `users` (`id_users`),
  ADD CONSTRAINT `it_system_dst_ibfk_2` FOREIGN KEY (`test_ip`) REFERENCES `ip_address` (`id_ip`),
  ADD CONSTRAINT `it_system_dst_ibfk_3` FOREIGN KEY (`cert_ip`) REFERENCES `ip_address` (`id_ip`),
  ADD CONSTRAINT `it_system_dst_ibfk_4` FOREIGN KEY (`prod_ip`) REFERENCES `ip_address` (`id_ip`);

--
-- Ограничения внешнего ключа таблицы `it_system_src`
--
ALTER TABLE `it_system_src`
  ADD CONSTRAINT `it_system_src_ibfk_1` FOREIGN KEY (`responsible`) REFERENCES `users` (`id_users`),
  ADD CONSTRAINT `it_system_src_ibfk_2` FOREIGN KEY (`test_ip`) REFERENCES `ip_address` (`id_ip`),
  ADD CONSTRAINT `it_system_src_ibfk_3` FOREIGN KEY (`cert_ip`) REFERENCES `ip_address` (`id_ip`),
  ADD CONSTRAINT `it_system_src_ibfk_4` FOREIGN KEY (`prod_ip`) REFERENCES `ip_address` (`id_ip`);

--
-- Ограничения внешнего ключа таблицы `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`authorization`) REFERENCES `authorization` (`id_authorization`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`customer`) REFERENCES `users` (`id_users`),
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`dest_system`) REFERENCES `it_system_dst` (`id_it_system_dst`),
  ADD CONSTRAINT `order_ibfk_4` FOREIGN KEY (`source_system`) REFERENCES `it_system_src` (`id_it_system_src`),
  ADD CONSTRAINT `order_ibfk_5` FOREIGN KEY (`request_rate`) REFERENCES `request_rate` (`id_request_rate`),
  ADD CONSTRAINT `order_ibfk_6` FOREIGN KEY (`status`) REFERENCES `status` (`id_status`);

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`id_roles`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;