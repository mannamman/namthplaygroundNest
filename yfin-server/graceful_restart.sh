pid=$(systemctl show --property MainPID --value yfinServer.service)
kill -SIGHUP ${pid}