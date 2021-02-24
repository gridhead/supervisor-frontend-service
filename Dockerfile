FROM python:3.8-alpine
ENV PYTHONUNBUFFERED=1
WORKDIR /supervisor-frontend-service
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
EXPOSE 9696
