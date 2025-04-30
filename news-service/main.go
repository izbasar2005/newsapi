package main

import (
	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"log"
)

func getUserData(userID string) {
	client := resty.New()

	resp, err := client.R().
		SetPathParams(map[string]string{
			"userID": userID,
		}).
		Get("http://user-service:8080/users/{userID}")

	if err != nil {
		log.Fatalf("Error while fetching user data: %v", err)
	}

	log.Printf("Response: %s", resp.String())
}

func main() {
	r := gin.Default()

	// Logging Middleware
	r.Use(LoggingMiddleware())

	r.GET("/news", func(c *gin.Context) {
		getUserData("123") // Example user ID
		c.JSON(200, gin.H{
			"news": "Latest news here!",
		})
	})

	r.Run(":8081") // News Service портын ашу
}
