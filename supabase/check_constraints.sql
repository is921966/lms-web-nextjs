-- Скрипт для проверки ограничений таблицы profiles
-- Выполните в Supabase SQL Editor чтобы увидеть допустимые роли

-- 1. Показать структуру таблицы profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'profiles'
ORDER BY 
    ordinal_position;

-- 2. Показать все ограничения таблицы profiles
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM 
    pg_constraint
WHERE 
    conrelid = 'profiles'::regclass;

-- 3. Попробуем найти определение check constraint для role
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM 
    pg_constraint
WHERE 
    conrelid = 'profiles'::regclass
    AND contype = 'c'
    AND conname LIKE '%role%';

-- 4. Альтернативный способ увидеть определение таблицы
SELECT 
    table_name,
    column_name,
    column_default,
    is_nullable,
    data_type,
    character_maximum_length
FROM 
    information_schema.columns
WHERE 
    table_name = 'profiles'
    AND column_name = 'role';

-- 5. Проверим существующие роли в таблице (если есть данные)
SELECT DISTINCT role, COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY role; 