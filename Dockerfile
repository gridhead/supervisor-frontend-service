FROM golang:alpine
COPY . .
EXPOSE 9696
CMD ["go", "run", "main.go", "-port", "9696"]
