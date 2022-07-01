pid=$(systemctl show --property MainPID --value yfinServer.service)
# https://docs.gunicorn.org/en/stable/signals.html
# Reload the configuration
# The HUP signal can be used to reload the Gunicorn configuration on the fly.
kill -SIGHUP ${pid}