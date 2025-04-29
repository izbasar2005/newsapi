package database

import (
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func InitDB() {

	dsn := "host=localhost user=postgres password=Ii250405 dbname=postgres port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ DB қосылмады:", err)
	}

	log.Println("✅ DB дайын")
}
func GetDB() *gorm.DB {
	return DB
}
