# 🚨 Решение проблемы "profiles_role_check"

## Причина ошибки

В таблице `profiles` есть ограничение на допустимые значения поля `role`. Роль `user` не разрешена.

## 🔍 Шаг 1: Узнайте допустимые роли

1. Откройте **Supabase SQL Editor**
2. Выполните SQL из файла `supabase/check_constraints.sql`
3. В результатах найдите строку с `profiles_role_check`
4. Там будут перечислены допустимые роли

Обычно это могут быть:
- `admin`
- `employee` или `staff`
- `student` 
- `instructor` или `teacher`
- `moderator`

## ✅ Шаг 2: Используйте правильный SQL

После того как узнаете допустимые роли, выполните обновленный SQL:

```sql
-- Сначала удалите ограничение foreign key
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Создайте профили с ПРАВИЛЬНЫМИ ролями
-- Замените 'employee' на роль из вашего списка!
INSERT INTO profiles (id, full_name, email, role, department, position) VALUES 
('d0d5e7a0-1111-1111-1111-111111111111', 'Администратор', 'admin@test.com', 'admin', 'IT', 'Админ'),
('d0d5e7a0-2222-2222-2222-222222222222', 'Мария И.', 'maria@test.com', 'employee', 'HR', 'Менеджер'),
('d0d5e7a0-3333-3333-3333-333333333333', 'Петр С.', 'petr@test.com', 'employee', 'Продажи', 'Менеджер')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
```

## 🎯 Шаг 3: Полное заполнение

После создания профилей, выполните остальную часть SQL из:
```
supabase/seed_no_auth.sql
```

Начиная с раздела "-- 2. Создаем каналы ленты"

## 🚀 Альтернативное решение

Если не можете определить роли, попробуйте эти комбинации:

### Вариант A (для LMS систем):
```sql
-- Роли: admin, student, instructor
('...', 'Админ', 'admin@test.com', 'admin', 'IT', 'Админ'),
('...', 'Мария', 'maria@test.com', 'instructor', 'HR', 'Преподаватель'),
('...', 'Петр', 'petr@test.com', 'student', 'Продажи', 'Студент')
```

### Вариант B (для корпоративных систем):
```sql
-- Роли: admin, staff, manager
('...', 'Админ', 'admin@test.com', 'admin', 'IT', 'Админ'),
('...', 'Мария', 'maria@test.com', 'staff', 'HR', 'Сотрудник'),
('...', 'Петр', 'petr@test.com', 'staff', 'Продажи', 'Сотрудник')
```

## ❓ Если ничего не работает

1. **Временно удалите check constraint**:
```sql
ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
```

2. **Создайте данные как в seed_no_auth.sql**

3. **В production верните constraint обратно**

## 📌 Запомните!

После того как лента заработает, запишите какие роли подошли для будущего использования! 