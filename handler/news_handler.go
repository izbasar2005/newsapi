package handler

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
	"newsapi/database"
	"newsapi/model"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

// GetNews функциясы өзгеріссіз
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

// CreateNews файл жүктеу қосылған нұсқасы
func CreateNews(c *gin.Context) {
	// Multipart form, максималды өлшем 10MB
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
		return
	}

	// JSON бөлік үшін
	title := c.PostForm("title")
	content := c.PostForm("content")
	categoryIDStr := c.PostForm("category_id")

	categoryID, err := strconv.ParseUint(categoryIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category_id"})
		return
	}

	// Файл алу
	file, header, err := c.Request.FormFile("image")
	imageURL := ""
	if err == nil {
		defer file.Close()

		// uploads папка бар-жоғын тексеру, болмаса жасау
		err := os.MkdirAll("uploads", os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload dir"})
			return
		}

		// Файл аты — уақытпен уникалды ету
		filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(header.Filename))
		filepath := filepath.Join("uploads", filename)

		out, err := os.Create(filepath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		defer out.Close()

		// Файлды сақтау
		_, err = io.Copy(out, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		imageURL = "/" + filepath // клиентке қайтару үшін жол (негізгі URL-ге байланысты түзету керек)
	}

	news := model.News{
		Title:      title,
		Content:    content,
		CategoryID: uint(categoryID),
		ImageURL:   imageURL,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := database.DB.Create(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Сақтау қатесі"})
		return
	}

	c.JSON(http.StatusCreated, news)
}

// GetNewsByID өзгеріссіз
func GetNewsByID(c *gin.Context) {
	id := c.Param("id")
	var news model.News
	if err := database.DB.Preload("Category").First(&news, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Жаңалық табылмады"})
		return
	}
	c.JSON(http.StatusOK, news)
}

// UpdateNews файлды жаңарту қосылған нұсқасы
func UpdateNews(c *gin.Context) {
	id := c.Param("id")
	var news model.News
	if err := database.DB.First(&news, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Жаңалық табылмады"})
		return
	}

	// Multipart form өңдеу
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
		return
	}

	title := c.PostForm("title")
	content := c.PostForm("content")
	categoryIDStr := c.PostForm("category_id")

	if title != "" {
		news.Title = title
	}
	if content != "" {
		news.Content = content
	}
	if categoryIDStr != "" {
		categoryID, err := strconv.ParseUint(categoryIDStr, 10, 64)
		if err == nil {
			news.CategoryID = uint(categoryID)
		}
	}

	file, header, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()

		err := os.MkdirAll("uploads", os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload dir"})
			return
		}

		filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(header.Filename))
		filepath := filepath.Join("uploads", filename)

		out, err := os.Create(filepath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		defer out.Close()

		_, err = io.Copy(out, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		news.ImageURL = "/" + filepath
	}

	news.UpdatedAt = time.Now()

	if err := database.DB.Save(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жаңарту қатесі"})
		return
	}

	c.JSON(http.StatusOK, news)
}

// DeleteNews өзгеріссіз
func DeleteNews(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&model.News{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Жою қатесі"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Жаңалық жойылды"})
}
