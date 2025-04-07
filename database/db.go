package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"newsapi/model"
)

var DB *gorm.DB

func InitDB() {
	// Дұрыс DSN жолы
	dsn := "host=localhost user=postgres password=Ii250405 dbname=postgres port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ DB қосылмады:", err)
	}

	DB.AutoMigrate(&model.Category{}, &model.News{})
	log.Println("✅ DB дайын")
}
