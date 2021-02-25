FROM python:3.8-alpine
ENV PYTHONUNBUFFERED=1
WORKDIR /supervisor-frontend-service
COPY . .
RUN pip install -r requirements.txt
EXPOSE 9696
ENTRYPOINT ["python3", "main.py", "-p", "9696", "-4"]