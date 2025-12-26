# Why Not — Coffee Demo (Full-stack)

## Требования
- Node.js + npm
- Docker Desktop
- Git

Порты:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- PostgreSQL: localhost:5432

---

## Структура
- apps/api — backend (Express + Prisma)
- apps/web2 — frontend (Next.js)
- docker-compose.yml — PostgreSQL

---

## Переменные окружения

### Backend: apps/api/.env
Создай файл `apps/api/.env`:

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=change_me_please
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/why_not?schema=public
Frontend: apps/web2/.env.local (если нужно)
Создай файл apps/web2/.env.local:

env
Копировать код
NEXT_PUBLIC_API_URL=http://localhost:4000
Запуск проекта (dev)
1) Запустить базу (PostgreSQL)
В корне проекта:

powershell
Копировать код
cd D:\why-not
docker compose up -d
2) Запустить backend
powershell
Копировать код
cd D:\why-not\apps\api
npm i
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
Проверка:

http://localhost:4000/health → { "ok": true }

3) Запустить frontend
Открой второй терминал:

powershell
Копировать код
cd D:\why-not\apps\web2
npm i
npm run dev
Открыть:

http://localhost:3000

Тестовые пользователи
admin@test.com / admin123 (ADMIN)

manager@test.com / manager123 (MANAGER)

user@test.com / user123 (USER)

Остановка / сброс базы
Остановить:

powershell
Копировать код
cd D:\why-not
docker compose down
Сбросить данные (удалить volume):

powershell
Копировать код
cd D:\why-not
docker compose down -v
docker compose up -d
После сброса:

powershell
Копировать код
cd D:\why-not\apps\api
npx prisma generate
npx prisma migrate dev
npm run seed
Быстрая проверка логина (PowerShell)
powershell
Копировать код
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Invoke-RestMethod `
  -Uri "http://localhost:4000/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{ email="admin@test.com"; password="admin123" } | ConvertTo-Json) `
  -WebSession $session

Invoke-RestMethod `
  -Uri "http://localhost:4000/admin/stats" `
  -WebSession $session