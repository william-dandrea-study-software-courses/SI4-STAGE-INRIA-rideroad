
#  gunicorn safecycle_server.wsgi:application --bind localhost:8001

python manage.py migrate --no-input
python manage.py collectstatic --no-input

gunicorn safecycle_server.wsgi:application --bind 0.0.0.0:8080