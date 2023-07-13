-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июл 12 2023 г., 22:50
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
-- База данных: `integration`
--

-- --------------------------------------------------------

--
-- Структура таблицы `autorization`
--

CREATE TABLE `autorization` (
  `id_autorization` int(11) NOT NULL,
  `name` varchar(115) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `autorization`
--

INSERT INTO `autorization` (`id_autorization`, `name`) VALUES
(1, 'Базовая авторизация'),
(2, 'Авторизация по токену'),
(3, 'Авторизация по сертификату'),
(4, 'Без авторизации');

-- --------------------------------------------------------

--
-- Структура таблицы `it_system`
--

CREATE TABLE `it_system` (
  `id_it_system` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `responsible` int(11) NOT NULL,
  `ip_address` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `it_system`
--

INSERT INTO `it_system` (`id_it_system`, `name`, `responsible`, `ip_address`) VALUES
(1, 'Система заказ банковских карт', 2, '88.216.19.235'),
(2, 'Система отправки уведомлений пользователям', 2, '90.232.255.232'),
(3, 'Система кредитования', 2, '81.247.250.229');

-- --------------------------------------------------------

--
-- Структура таблицы `order`
--

CREATE TABLE `order` (
  `id_order` int(11) NOT NULL,
  `source_system` int(11) NOT NULL,
  `destination_system` int(11) NOT NULL,
  `customer` int(11) NOT NULL,
  `autorization` int(11) NOT NULL,
  `requests_rate` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `description` varchar(10000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `order`
--

INSERT INTO `order` (`id_order`, `source_system`, `destination_system`, `customer`, `autorization`, `requests_rate`, `status`, `description`) VALUES
(1, 1, 2, 1, 1, 5, 2, 'Нужно реализовать интеграционное взаимодействие между системой заказа банковских карт и системой отправки уведомлений клиентам. \r\nНеобходимо реализовать метод POST /send/clientReady'),
(2, 3, 2, 1, 1, 5, 3, 'Нужно реализовать интеграционное взаимодействие между системой банковского кредитования и системой отправки уведомлений клиентам. \r\nНеобходимо реализовать метод POST /send/clientCredits\r\nСо следующей полезной нагрузкой:\r\n{\r\n \"user\":<id user>,\r\n \"Credit_status\":<статус принятия решения по кредиту>\r\n}');

-- --------------------------------------------------------

--
-- Структура таблицы `requests`
--

CREATE TABLE `requests` (
  `id_requests` int(11) NOT NULL,
  `rate` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `requests`
--

INSERT INTO `requests` (`id_requests`, `rate`) VALUES
(1, '1 Запрос в день'),
(2, '10 Запросов в день'),
(3, '100 Запросов в день'),
(4, '1000 Запросов в день'),
(5, 'Более 1000 запросов в день'),
(6, 'Указано в описание');

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id_roles` int(11) NOT NULL,
  `name` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id_roles`, `name`) VALUES
(1, 'Заказчик'),
(2, 'Отвественный'),
(3, 'Архитектор'),
(4, 'Администратор'),
(5, 'Разработчик'),
(6, 'Специалист информационной безопасности');

-- --------------------------------------------------------

--
-- Структура таблицы `status`
--

CREATE TABLE `status` (
  `id_status` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `status`
--

INSERT INTO `status` (`id_status`, `name`) VALUES
(1, 'Ожидает изменения от заказчика'),
(2, 'На согласование у специалиста информационной безопасности'),
(3, 'На согласование у архитектора'),
(4, 'Ожидает выполнение настроек архитектором'),
(5, 'Ожидает разработки разработчиком'),
(6, 'На тестирование у заказчика'),
(7, 'Завершено'),
(8, 'Отклонено'),
(9, 'Выполнено');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `FIO` varchar(115) NOT NULL,
  `email` varchar(115) NOT NULL,
  `post` varchar(250) NOT NULL,
  `role` int(11) NOT NULL,
  `login` varchar(45) NOT NULL,
  `password` varchar(21) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id_users`, `FIO`, `email`, `post`, `role`, `login`, `password`) VALUES
(1, 'Андреев Андрей Андреевич', 'Andreev.Andrey@testbank.ru', 'Директор отдела обработки данных', 1, 'zak', 'zak'),
(2, 'Борисов Борис Борисович', 'Borisov.Boris.B@testbank.ru', 'Директор по системному взаимодействию', 2, 'otv', 'otv'),
(3, 'Владимиров Владимир Владимирович', 'Vladimirov.Vladimir.V@testbank.ru', 'Архитектор интеграционных взаимодействий', 3, 'arx', 'arx'),
(4, 'Гордиенко Гордей Гордеевич', 'Gordienko.Gordey@testbank.ru', 'Старший администратор', 4, 'admin', 'admin'),
(5, 'Дмитриев Дмитрий Дмитриевич', 'Dmitryev.Dmitryi.D@testbank.ru', 'Младший специалист', 5, 'raz', 'raz'),
(6, 'Елененко Елена Евсеевна', 'Elenko.Elena@testbank.ru', 'Старший специалист по безопасности', 6, 'bez', 'bez');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `autorization`
--
ALTER TABLE `autorization`
  ADD PRIMARY KEY (`id_autorization`);

--
-- Индексы таблицы `it_system`
--
ALTER TABLE `it_system`
  ADD PRIMARY KEY (`id_it_system`),
  ADD KEY `ip_address` (`ip_address`),
  ADD KEY `responsible` (`responsible`);

--
-- Индексы таблицы `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `destination_system` (`destination_system`,`customer`,`autorization`,`requests_rate`,`status`),
  ADD KEY `autorization` (`autorization`),
  ADD KEY `customer` (`customer`),
  ADD KEY `source_system` (`source_system`),
  ADD KEY `status` (`status`),
  ADD KEY `requests_rate` (`requests_rate`);

--
-- Индексы таблицы `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id_requests`);

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
-- AUTO_INCREMENT для таблицы `autorization`
--
ALTER TABLE `autorization`
  MODIFY `id_autorization` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `it_system`
--
ALTER TABLE `it_system`
  MODIFY `id_it_system` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `order`
--
ALTER TABLE `order`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `requests`
--
ALTER TABLE `requests`
  MODIFY `id_requests` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `roles`
--
ALTER TABLE `roles`
  MODIFY `id_roles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `status`
--
ALTER TABLE `status`
  MODIFY `id_status` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `it_system`
--
ALTER TABLE `it_system`
  ADD CONSTRAINT `it_system_ibfk_1` FOREIGN KEY (`responsible`) REFERENCES `users` (`id_users`);

--
-- Ограничения внешнего ключа таблицы `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`autorization`) REFERENCES `autorization` (`id_autorization`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`customer`) REFERENCES `users` (`id_users`),
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`destination_system`) REFERENCES `it_system` (`id_it_system`),
  ADD CONSTRAINT `order_ibfk_4` FOREIGN KEY (`source_system`) REFERENCES `it_system` (`id_it_system`),
  ADD CONSTRAINT `order_ibfk_6` FOREIGN KEY (`status`) REFERENCES `status` (`id_status`),
  ADD CONSTRAINT `order_ibfk_7` FOREIGN KEY (`requests_rate`) REFERENCES `requests` (`id_requests`);

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`id_roles`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
