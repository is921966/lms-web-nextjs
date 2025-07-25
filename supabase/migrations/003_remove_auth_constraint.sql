-- Удаляем ограничение foreign key для тестовой среды
-- Это позволит создавать профили без реальных пользователей Auth

-- 1. Удаляем существующее ограничение
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Добавляем каскадное удаление для будущего
-- (когда будет реальная аутентификация)
-- ALTER TABLE profiles 
-- ADD CONSTRAINT profiles_id_fkey 
-- FOREIGN KEY (id) 
-- REFERENCES auth.users(id) 
-- ON DELETE CASCADE;

-- Комментарий: В production эту миграцию НЕ применять!
-- Она только для тестовой среды без аутентификации 