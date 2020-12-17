FROM golang:alpine
COPY . .
EXPOSE 6969
CMD ["go", "run", "main.go", "-port", "6969"]
