package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"newsapi/auth"
	"newsapi/database"
	"newsapi/handler"
	"newsapi/middleware"

	_ "github.com/lib/pq"
)

func main() {
	database.InitDB()
	db := database.GetDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.POST("/register", func(c *gin.Context) { auth.Register(c, db) })
	r.POST("/login", func(c *gin.Context) { auth.Login(c, db) })

	authorized := r.Group("/")
	authorized.Use(middleware.AuthMiddleware())

	authorized.GET("/categories", handler.GetCategories)
	authorized.POST("/categories", handler.CreateCategory)
	authorized.GET("/categories/:id", handler.GetCategoryByID)
	authorized.PUT("/categories/:id", handler.UpdateCategory)
	authorized.DELETE("/categories/:id", handler.DeleteCategory)

	r.GET("/news", handler.GetNews)
	authorized.POST("/news", handler.CreateNews)
	authorized.GET("/news/:id", handler.GetNewsByID)
	authorized.PUT("/news/:id", handler.UpdateNews)
	authorized.DELETE("/news/:id", handler.DeleteNews)

	authorized.GET("/users", handler.GetUsers)
	authorized.GET("/users/:id", handler.GetUserByID)
	authorized.PUT("/users/:id", handler.UpdateUser)
	authorized.DELETE("/users/:id", handler.DeleteUser)

	r.Run(":8080")
}
