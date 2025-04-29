package handler

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"newsapi/database"
	"newsapi/model"
	"strconv"
)

func GetCategories(c *gin.Context) {
	var categories []model.Category

	// Устанавливаем значения по умолчанию для limit и page
	limit := 10
	page := 1

	// Получаем параметры из запроса и парсим их
	if l := c.DefaultQuery("limit", "10"); l != "" {
		if parsedLimit, err := strconv.Atoi(l); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	if p := c.DefaultQuery("page", "1"); p != "" {
		if parsedPage, err := strconv.Atoi(p); err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}

	// Вычисляем offset для пагинации
	offset := (page - 1) * limit

	// Выполняем запрос с пагинацией
	if err := database.DB.Limit(limit).Offset(offset).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Қате шықты"})
		return
	}

	// Возвращаем результат
	c.JSON(http.StatusOK, categories)
}

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

func GetCategoryByID(c *gin.Context) {
	id := c.Param("id")
	var category model.Category
	if err := database.DB.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Категория табылмады"})
		return
	}
	c.JSON(http.StatusOK, category)
}

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

func DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&model.Category{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жою қатесі"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Категория жойылды"})
}
