FROM python:3.8-alpine
ENV PYTHONUNBUFFERED=1
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY src/svfrontend svfrontend
WORKDIR /svfrontend
EXPOSE 9696
ENTRYPOINT ["python3", "main.py", "-p", "9696", "-4"]
