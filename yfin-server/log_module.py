import datetime
import functools
import os
import time
import logging
import os


class Logger:
    def __init__(self) -> None:
        self.dir_path = "/home/ubuntu/logs/pythonLogs"
        self.dt_lambda = (lambda self, record, datefmt=None: datetime.datetime.fromtimestamp(record.created, datetime.timezone.utc).astimezone().isoformat(sep="T",timespec="seconds"))
        self.log_format = '{"level": "%(levelname)s", "message": "%(message)s", "timestamp": "%(asctime)s", "ms": ""}'
        self.port = int(os.getenv("FLASK_PORT"))
        self.host = int(os.getenv("FLASK_HOST"))

    def _path(func):
        @functools.wraps(func)
        def wrapper(self, message: str = ""):
            if(not os.path.exists(self.dir_path)):
                os.makedirs(self.dir_path)
            f_name = self.dir_path + "/" + datetime.datetime.fromtimestamp(time.time(), datetime.timezone.utc).astimezone().strftime("python-%Y-%m-%d.log")
            return func(self, message, f_name)
        return wrapper

    @_path
    def info_log(self, message:str, f_name: str) -> None:
        logging.basicConfig(filename=f_name, format=self.log_format, level=logging.INFO)
        logging.Formatter.formatTime = self.dt_lambda
        logging.info(message)
    
    @_path
    def warn_log(self, message:str, f_name: str) -> None:
        logging.basicConfig(filename=f_name, format=self.log_format, level=logging.WARNING)
        logging.Formatter.formatTime = self.dt_lambda
        logging.warning(message)
    
    @_path
    def error_log(self, message:str, f_name: str) -> None:
        logging.basicConfig(filename=f_name, format=self.log_format, level=logging.ERROR)
        logging.Formatter.formatTime = self.dt_lambda
        logging.error(message)

    @_path
    def boot_log(self, _: str, f_name: str) -> None:
        logging.basicConfig(filename=f_name, format=self.log_format, level=logging.INFO)
        logging.Formatter.formatTime = self.dt_lambda
        logging.info(f"pid: {os.getpid()} host: {self.host} port: {self.port} start")
    
    @_path
    def term_log(self, _: str, f_name: str) -> None:
        logging.basicConfig(filename=f_name, format=self.log_format, level=logging.INFO)
        logging.Formatter.formatTime = self.dt_lambda
        logging.info(f"pid: {os.getpid()} host: {self.host} port: {self.port} down")

if __name__ == '__main__':
    logger = Logger()
    logger.info_log('hello?')
