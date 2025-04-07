package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"newsapi/database"
	"newsapi/model"
	"time"
)

// Барлық жаңалықтарды алу
func GetNews(c *gin.Context) {
	var news []model.News
	database.DB.Preload("Category").Find(&news)
	c.JSON(http.StatusOK, news)
}

// Жаңа жаңалық қосу
func CreateNews(c *gin.Context) {
	var news model.News
	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Установка текущего времени для CreatedAt и UpdatedAt
	news.CreatedAt = time.Now()
	news.UpdatedAt = time.Now()

	if err := database.DB.Create(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Сохранение не удалось"})
		return
	}

	c.JSON(http.StatusCreated, news)
}

// Жаңалықты ID бойынша алу
func GetNewsByID(c *gin.Context) {
	id := c.Param("id")
	var news model.News
	if err := database.DB.Preload("Category").First(&news, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Жаңалық табылмады"})
		return
	}
	c.JSON(http.StatusOK, news)
}

// Жаңалықты жаңарту
func UpdateNews(c *gin.Context) {
	id := c.Param("id")
	var news model.News
	if err := database.DB.First(&news, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Жаңалық табылмады"})
		return
	}

	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жаңарту қатесі"})
		return
	}
	// Обновляем данные новости (GORM автоматически обновит `UpdatedAt`)
	if err := database.DB.Save(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update news"})
		return
	}

	c.JSON(http.StatusOK, news)
}

// Жаңалықты жою
func DeleteNews(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&model.News{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жою қатесі"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Жаңалық жойылды"})
}
