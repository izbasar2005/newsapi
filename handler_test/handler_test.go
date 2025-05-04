package handler_test

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"newsapi/auth"
	"newsapi/database"
	"newsapi/handler"
	"testing"
)

func init() {
	database.InitDB()
}

func TestGetUsers(t *testing.T) {

	r := gin.Default()
	r.GET("/users", handler.GetUsers)

	w := performRequest(r, "GET", "/users")
	assert.Equal(t, 200, w.Code)
}

func TestGetUserByID(t *testing.T) {

	r := gin.Default()
	r.GET("/users/:id", handler.GetUserByID)

	w := performRequest(r, "GET", "/users/2")
	assert.Equal(t, 200, w.Code)
}

func TestUpdateUser(t *testing.T) {

	r := gin.Default()
	r.PUT("/users/:id", handler.UpdateUser)

	w := performRequestWithJSON(r, "PUT", "/users/4", `{"username": "Nursaya", "password": "newpassword123"}`)
	assert.Equal(t, 200, w.Code)
}

func TestDeleteUser(t *testing.T) {

	r := gin.Default()
	r.DELETE("/users/:id", handler.DeleteUser)

	w := performRequest(r, "DELETE", "/users/1")
	assert.Equal(t, 200, w.Code)
}

func TestCreateCategory(t *testing.T) {

	r := gin.Default()
	r.POST("/categories", handler.CreateCategory)

	w := performRequestWithJSON(r, "POST", "/categories", `{"name": "Technology"}`)
	assert.Equal(t, 201, w.Code)
}

func TestGetCategories(t *testing.T) {

	r := gin.Default()
	r.GET("/categories", handler.GetCategories)

	w := performRequest(r, "GET", "/categories")
	assert.Equal(t, 200, w.Code)
}

func TestUpdateCategory(t *testing.T) {

	r := gin.Default()
	r.PUT("/categories/:id", handler.UpdateCategory)

	w := performRequestWithJSON(r, "PUT", "/categories/6", `{"name": "Technologia"}`)
	assert.Equal(t, 200, w.Code)
}

func TestDeleteCategory(t *testing.T) {

	r := gin.Default()
	r.DELETE("/categories/:id", handler.DeleteCategory)

	w := performRequest(r, "DELETE", "/categories/5")
	assert.Equal(t, 200, w.Code)
}

func TestLogin(t *testing.T) {

	r := gin.Default()
	r.POST("/login", func(c *gin.Context) { auth.Login(c, database.GetDB()) })

	w := performRequestWithJSON(r, "POST", "/login", `{"username": "Izba", "password": "123456"}`)
	assert.Equal(t, 200, w.Code)
}
func TestGetNews(t *testing.T) {

	r := gin.Default()
	r.GET("/news", handler.GetNews)

	w := performRequest(r, "GET", "/news")

	assert.Equal(t, 200, w.Code)

	assert.Contains(t, w.Body.String(), "title")
}

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func performRequestWithJSON(r http.Handler, method, path, jsonStr string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, bytes.NewBuffer([]byte(jsonStr)))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}
