```bash
docker run -d --network app-network -p 80:80 -e API_BACKEND=backend:8080 r-book-front-end
```