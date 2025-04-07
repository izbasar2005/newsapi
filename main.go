package main

import (
	"github.com/gin-gonic/gin"
	"newsapi/database"
	"newsapi/handler"
)

func main() {
	database.InitDB()

	r := gin.Default()

	// Категория маршруттары
	r.GET("/categories", handler.GetCategories)
	r.POST("/categories", handler.CreateCategory)
	r.GET("/categories/:id", handler.GetCategoryByID)   // ID бойынша категория алу
	r.PUT("/categories/:id", handler.UpdateCategory)    // Категорияны жаңарту
	r.DELETE("/categories/:id", handler.DeleteCategory) // Категорияны жою

	// Жаңалық маршруттары
	r.GET("/news", handler.GetNews)
	r.POST("/news", handler.CreateNews)
	r.GET("/news/:id", handler.GetNewsByID)   // ID бойынша жаңалық алу
	r.PUT("/news/:id", handler.UpdateNews)    // Жаңалықты жаңарту
	r.DELETE("/news/:id", handler.DeleteNews) // Жаңалықты жою

	r.Run(":8080")
}
