# Используем официальный образ Golang
FROM golang:1.23-alpine


# Создаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем go.mod и go.sum и скачиваем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем весь проект внутрь контейнера
COPY . .

# Собираем Go-приложение
RUN go build -o newsapi

# Открываем порт 8080
EXPOSE 8080

# Запускаем приложение
CMD ["./newsapi"]
