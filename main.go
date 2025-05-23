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

	r.Static("/uploads", "./uploads")

	// Тіркелу және кіру
	r.POST("/register", func(c *gin.Context) { auth.Register(c, db) })
	r.POST("/login", func(c *gin.Context) { auth.Login(c, db) })

	// Авторизация қажет болатын маршруттар
	authorized := r.Group("/")
	authorized.Use(middleware.AuthMiddleware())

	// Барлық қолданушыларға (авторизациямен) рұқсат
	authorized.GET("/categories", handler.GetCategories)
	authorized.GET("/categories/:id", handler.GetCategoryByID)
	authorized.GET("/news", handler.GetNews)
	authorized.GET("/news/:id", handler.GetNewsByID)
	authorized.GET("/users", handler.GetUsers)
	authorized.GET("/users/:id", handler.GetUserByID)

	authorized.GET("/profile", handler.GetProfile)
	authorized.PUT("/profile", handler.UpdateProfile)

	// Тек admin рөлі барларға арналған маршруттар
	admin := authorized.Group("/")
	admin.Use(middleware.AdminOnlyMiddleware())

	admin.POST("/categories", handler.CreateCategory)
	admin.PUT("/categories/:id", handler.UpdateCategory)
	admin.DELETE("/categories/:id", handler.DeleteCategory)

	admin.POST("/news", handler.CreateNews)
	admin.PUT("/news/:id", handler.UpdateNews)
	admin.DELETE("/news/:id", handler.DeleteNews)

	admin.PUT("/users/:id", handler.UpdateUser)
	admin.DELETE("/users/:id", handler.DeleteUser)

	r.Run(":8080")
}
