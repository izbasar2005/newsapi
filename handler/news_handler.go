package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"newsapi/database"
	"newsapi/model"
	"time"
)

func GetNews(c *gin.Context) {
	var news []model.News

	limit := 10
	page := 1
	categoryID := c.Query("category_id")

	if l := c.Query("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}
	if p := c.Query("page"); p != "" {
		fmt.Sscanf(p, "%d", &page)
	}

	offset := (page - 1) * limit

	query := database.DB.Preload("Category").Limit(limit).Offset(offset)

	if categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}

	if err := query.Find(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жаңалықтарды жүктеу қатесі"})
		return
	}

	c.JSON(http.StatusOK, news)
}

func CreateNews(c *gin.Context) {
	var news model.News
	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	news.CreatedAt = time.Now()
	news.UpdatedAt = time.Now()

	if err := database.DB.Create(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Сохранение не удалось"})
		return
	}

	c.JSON(http.StatusCreated, news)
}

func GetNewsByID(c *gin.Context) {
	id := c.Param("id")
	var news model.News
	if err := database.DB.Preload("Category").First(&news, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Жаңалық табылмады"})
		return
	}
	c.JSON(http.StatusOK, news)
}

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

	if err := database.DB.Save(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update news"})
		return
	}

	c.JSON(http.StatusOK, news)
}

func DeleteNews(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&model.News{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жою қатесі"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Жаңалық жойылды"})
}
