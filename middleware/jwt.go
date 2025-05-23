package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"strconv"
	"strings"
)

var jwtKey = []byte("secret_key")

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			username, _ := claims["username"].(string)
			role, _ := claims["role"].(string)

			userIDStr, ok := claims["userID"].(string)
			if !ok {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID missing or invalid in token"})
				c.Abort()
				return
			}

			userIDUint64, err := strconv.ParseUint(userIDStr, 10, 64)
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID invalid format"})
				c.Abort()
				return
			}

			userID := uint(userIDUint64)

			c.Set("username", username)
			c.Set("role", role)
			c.Set("userID", userID)
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func AdminOnlyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: admin only"})
			c.Abort()
			return
		}
		c.Next()
	}
}
