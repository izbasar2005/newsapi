package model

import (
	"time"
)

type News struct {
	ID          uint      `gorm:"primaryKey"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CategoryID  uint      `json:"category_id"`
	Category    Category  `gorm:"foreignKey:CategoryID"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"  gorm:"autoUpdateTime"`
}
