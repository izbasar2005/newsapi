package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"newsapi/database"
	"newsapi/model"
)

func GetUsers(c *gin.Context) {
	var users []model.User

	// По умолчанию устанавливаем значения для лимита и страницы
	limit := 10
	page := 1

	// Чтение параметров из запроса
	if l := c.DefaultQuery("limit", "10"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}
	if p := c.DefaultQuery("page", "1"); p != "" {
		fmt.Sscanf(p, "%d", &page)
	}

	// Вычисление смещения
	offset := (page - 1) * limit

	// Выполняем запрос с ограничением и смещением
	if err := database.DB.Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Қате шықты"})
		return
	}

	c.JSON(http.StatusOK, users)
}

func GetUserByID(c *gin.Context) {
	id := c.Param("id")
	var user model.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user model.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Привязываем обновленные данные
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Сохраняем обновленного пользователя
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&model.User{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
