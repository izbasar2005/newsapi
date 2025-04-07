package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"newsapi/database"
	"newsapi/model"
)

// Барлық категорияларды алу
func GetCategories(c *gin.Context) {
	var categories []model.Category
	if err := database.DB.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Қате шықты"})
		return
	}
	c.JSON(http.StatusOK, categories)
}

// Жаңа категория қосу
func CreateCategory(c *gin.Context) {
	var category model.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Сақтау қатесі"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// Категорияны ID бойынша алу
func GetCategoryByID(c *gin.Context) {
	id := c.Param("id")
	var category model.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Категория табылмады"})
		return
	}
	c.JSON(http.StatusOK, category)
}

// Категорияны жаңарту
func UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var category model.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Категория табылмады"})
		return
	}

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жаңарту қатесі"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// Категорияны жою
func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&model.Category{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жою қатесі"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Категория жойылды"})
}
