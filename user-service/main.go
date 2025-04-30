package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()

	r.GET("/users/:userID", func(c *gin.Context) {
		userID := c.Param("userID")
		c.JSON(200, gin.H{
			"userID":   userID,
			"userName": "John Doe", // Мысал ретінде
		})
	})

	r.Run(":8080") // User Service портын ашу
}
