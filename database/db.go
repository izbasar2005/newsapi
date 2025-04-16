package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"newsapi/model"
)

var DB *gorm.DB

func InitDB() {

	dsn := "host=localhost user=postgres password=Ii250405 dbname=postgres port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ DB қосылмады:", err)
	}

	DB.AutoMigrate(&model.News{}, &model.Category{}, &model.User{})
	log.Println("✅ DB дайын")
}
func GetDB() *gorm.DB {
	return DB
}
